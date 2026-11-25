const prisma = require('../prisma');
const { CLASS_LOGS } = require('./logController');
const { FALLBACK_STUDENTS, FALLBACK_TEACHERS } = require('./adminController');
const { resolveGradeTier } = require('./scheduleController');

// Memory store for invoice payment overrides (stores payment metadata keyed by invoice/student key)
const INVOICE_PAYMENT_OVERRIDES = new Map();

const getOverrideKey = (studentId, month = 11, year = 2026) => `inv-${studentId}-${year}-${month}`;

/**
 * Helper to compute student monthly fee invoice data
 */
const computeStudentInvoices = async (month = 11, year = 2026) => {
  try {
    // 1. Try querying Prisma database
    const dbStudents = await prisma.studentProfile.findMany({
      include: {
        user: true,
        grade: true,
        invoices: {
          where: { month: Number(month), year: Number(year) }
        }
      }
    });

    if (dbStudents && dbStudents.length > 0) {
      const allClassLogs = await prisma.classLog.findMany({
        where: {
          attendanceStatus: 'PRESENT'
        },
        include: {
          session: true
        }
      });

      const invoices = dbStudents.map((st, index) => {
        const studentUserId = st.userId;
        const studentLogs = allClassLogs.filter(l => l.session?.studentId === st.id);
        const attendedHours = studentLogs.reduce((sum, l) => sum + (l.durationHours || 0), 0);
        const hourlyRate = st.grade?.studentHourlyRate || 400.0;
        const totalAmount = Math.round(attendedHours * hourlyRate);

        const existingInvoice = st.invoices && st.invoices[0];
        const override = INVOICE_PAYMENT_OVERRIDES.get(getOverrideKey(studentUserId, month, year))
          || INVOICE_PAYMENT_OVERRIDES.get(getOverrideKey(st.id, month, year));
        const isPaid = existingInvoice?.status === 'PAID' || override?.status === 'PAID' || totalAmount === 0;

        return {
          id: existingInvoice?.id || `inv-${st.id}-${year}-${month}`,
          invoiceNumber: `INV-${year}${String(month).padStart(2, '0')}-${String(index + 1).padStart(3, '0')}`,
          studentId: studentUserId,
          profileId: st.id,
          studentName: st.user?.name || 'Student',
          studentEmail: st.user?.emailOrPhone || '',
          studentPhone: st.phone || st.user?.phone || '',
          parentName: st.parentName || 'Parent',
          parentPhone: st.parentPhone || '',
          grade: st.grade?.name || 'Standard Grade',
          hourlyRate,
          attendedHours: Number(attendedHours.toFixed(2)),
          completedClassesCount: studentLogs.length,
          totalAmount,
          month: Number(month),
          year: Number(year),
          monthName: new Date(year, month - 1, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
          status: isPaid ? 'PAID' : 'UNPAID',
          razorpayOrderId: existingInvoice?.razorpayOrderId || override?.razorpayOrderId || null,
          razorpayPaymentId: existingInvoice?.razorpayPaymentId || override?.razorpayPaymentId || null,
          paymentMethod: override?.paymentMethod || (existingInvoice?.razorpayPaymentId ? 'Razorpay' : null),
          paidAt: existingInvoice?.paidAt || override?.paidAt || (totalAmount === 0 ? new Date().toISOString() : null),
          createdAt: existingInvoice?.createdAt || new Date().toISOString()
        };
      });

      return invoices;
    }
  } catch (err) {
    console.warn('Prisma computeStudentInvoices notice:', err.message);
  }

  // 2. Fallback to in-memory datasets
  return FALLBACK_STUDENTS.map((st, index) => {
    // Find logs for this student
    const studentLogs = CLASS_LOGS.filter(l => 
      (l.studentId === st.id || l.studentName.toLowerCase() === st.name.toLowerCase()) &&
      (l.attendanceStatus === 'PRESENT' || l.isStudentPresent)
    );

    const attendedHours = studentLogs.length > 0 
      ? studentLogs.reduce((sum, l) => sum + (l.billableHours || 0), 0)
      : (st.attendedHours || 0);

    const hourlyRate = st.hourlyRate || resolveGradeTier(st.grade).studentHourlyRate;
    const totalAmount = Math.round(attendedHours * hourlyRate);
    const override = INVOICE_PAYMENT_OVERRIDES.get(getOverrideKey(st.id, month, year));
    const isPaid = override?.status === 'PAID' || totalAmount === 0;

    return {
      id: `inv-${st.id}-${year}-${month}`,
      invoiceNumber: `INV-${year}${String(month).padStart(2, '0')}-${String(index + 1).padStart(3, '0')}`,
      studentId: st.id,
      profileId: st.profileId || `prof-${st.id}`,
      studentName: st.name,
      studentEmail: st.email,
      studentPhone: st.phone,
      parentName: st.parentName,
      parentPhone: st.parentPhone,
      grade: st.grade,
      hourlyRate,
      attendedHours: Number(attendedHours.toFixed(2)),
      completedClassesCount: studentLogs.length || st.completedSessions || 0,
      totalAmount,
      month: Number(month),
      year: Number(year),
      monthName: new Date(year, month - 1, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
      status: isPaid ? 'PAID' : 'UNPAID',
      razorpayOrderId: override?.razorpayOrderId || null,
      razorpayPaymentId: override?.razorpayPaymentId || null,
      paymentMethod: override?.paymentMethod || null,
      paidAt: override?.paidAt || (isPaid ? new Date().toISOString() : null),
      createdAt: st.joinedAt || new Date().toISOString()
    };
  });
};

/**
 * Helper to compute teacher monthly payroll data
 */
const computeTeacherPayroll = async (month = 11, year = 2026) => {
  try {
    const dbTeachers = await prisma.teacherProfile.findMany({
      include: {
        user: true
      }
    });

    if (dbTeachers && dbTeachers.length > 0) {
      const allClassLogs = await prisma.classLog.findMany({
        where: {
          attendanceStatus: 'PRESENT'
        },
        include: {
          session: true
        }
      });

      return dbTeachers.map((t, index) => {
        const teacherLogs = allClassLogs.filter(l => l.session?.teacherId === t.id);
        const taughtHours = teacherLogs.reduce((sum, l) => sum + (l.durationHours || 0), 0);
        const totalPayoutAmount = teacherLogs.reduce((sum, l) => sum + (l.teacherPayoutAmount || 0), 0) || Math.round(taughtHours * 250);

        return {
          id: `pay-${t.id}-${year}-${month}`,
          payrollNumber: `PAY-${year}${String(month).padStart(2, '0')}-${String(index + 1).padStart(3, '0')}`,
          teacherId: t.userId,
          profileId: t.id,
          teacherName: t.user?.name || 'Faculty Tutor',
          teacherEmail: t.user?.emailOrPhone || '',
          teacherPhone: t.phone || t.user?.phone || '',
          subject: t.subject || 'Faculty Department',
          defaultMeetLink: t.defaultMeetLink,
          taughtHours: Number(taughtHours.toFixed(2)),
          classesCount: teacherLogs.length,
          totalPayoutAmount: Math.round(totalPayoutAmount),
          month: Number(month),
          year: Number(year),
          monthName: new Date(year, month - 1, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
          status: 'CALCULATED',
          createdAt: new Date().toISOString()
        };
      });
    }
  } catch (err) {
    console.warn('Prisma computeTeacherPayroll notice:', err.message);
  }

  // Fallback to in-memory teacher dataset
  return FALLBACK_TEACHERS.map((t, index) => {
    const teacherLogs = CLASS_LOGS.filter(l => 
      (l.teacherId === t.id || l.teacherName.toLowerCase().includes(t.name.toLowerCase())) &&
      (l.attendanceStatus === 'PRESENT' || l.isStudentPresent)
    );

    const taughtHours = teacherLogs.length > 0
      ? teacherLogs.reduce((sum, l) => sum + (l.billableHours || 0), 0)
      : (t.totalHoursTaken || 0);

    const totalPayoutAmount = teacherLogs.length > 0
      ? teacherLogs.reduce((sum, l) => sum + (l.teacherPayoutAmount || 0), 0)
      : (t.accruedPayout || 0);

    return {
      id: `pay-${t.id}-${year}-${month}`,
      payrollNumber: `PAY-${year}${String(month).padStart(2, '0')}-${String(index + 1).padStart(3, '0')}`,
      teacherId: t.id,
      profileId: t.profileId,
      teacherName: t.name,
      teacherEmail: t.email,
      teacherPhone: t.phone,
      subject: t.subject,
      defaultMeetLink: t.defaultMeetLink,
      taughtHours: Number(taughtHours.toFixed(2)),
      classesCount: teacherLogs.length || t.classesTaken || 0,
      totalPayoutAmount: Math.round(totalPayoutAmount),
      month: Number(month),
      year: Number(year),
      monthName: new Date(year, month - 1, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
      status: 'CALCULATED',
      createdAt: t.joinedAt || new Date().toISOString()
    };
  });
};

/**
 * GET /api/billing/invoices
 * Admin retrieves all student fee invoices with optional status/search filters
 */
const getAdminInvoices = async (req, res) => {
  try {
    const { month = 11, year = 2026, status = 'ALL', search = '' } = req.query;
    let invoices = await computeStudentInvoices(Number(month), Number(year));

    if (status && status !== 'ALL') {
      invoices = invoices.filter(inv => inv.status.toUpperCase() === status.toUpperCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      invoices = invoices.filter(inv => 
        inv.studentName?.toLowerCase().includes(q) ||
        inv.parentName?.toLowerCase().includes(q) ||
        inv.grade?.toLowerCase().includes(q) ||
        inv.invoiceNumber?.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      month: Number(month),
      year: Number(year),
      invoices,
      totalCount: invoices.length
    });
  } catch (error) {
    console.error('getAdminInvoices error:', error);
    res.status(500).json({ error: 'Failed to generate monthly student invoices' });
  }
};

/**
 * GET /api/billing/payroll
 * Admin retrieves teacher payroll calculations
 */
const getAdminPayroll = async (req, res) => {
  try {
    const { month = 11, year = 2026, search = '' } = req.query;
    let payroll = await computeTeacherPayroll(Number(month), Number(year));

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      payroll = payroll.filter(p => 
        p.teacherName?.toLowerCase().includes(q) ||
        p.subject?.toLowerCase().includes(q) ||
        p.payrollNumber?.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      month: Number(month),
      year: Number(year),
      payroll,
      totalCount: payroll.length
    });
  } catch (error) {
    console.error('getAdminPayroll error:', error);
    res.status(500).json({ error: 'Failed to generate teacher payroll report' });
  }
};

/**
 * GET /api/billing/summary
 * Executive billing & payroll overview for Admin Dashboard
 */
const getBillingSummary = async (req, res) => {
  try {
    const { month = 11, year = 2026 } = req.query;
    const invoices = await computeStudentInvoices(Number(month), Number(year));
    const payroll = await computeTeacherPayroll(Number(month), Number(year));

    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalCollected = invoices.filter(inv => inv.status === 'PAID').reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalOutstanding = invoices.filter(inv => inv.status === 'UNPAID').reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalPayroll = payroll.reduce((sum, p) => sum + p.totalPayoutAmount, 0);
    const academyNetMargin = totalInvoiced - totalPayroll;
    const marginPercentage = totalInvoiced > 0 ? Math.round((academyNetMargin / totalInvoiced) * 100) : 0;

    res.json({
      success: true,
      month: Number(month),
      year: Number(year),
      monthName: new Date(year, month - 1, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
      metrics: {
        totalInvoiced,
        totalCollected,
        totalOutstanding,
        totalPayroll,
        academyNetMargin,
        marginPercentage,
        invoicesCount: invoices.length,
        paidCount: invoices.filter(i => i.status === 'PAID').length,
        unpaidCount: invoices.filter(i => i.status === 'UNPAID').length,
        teachersCount: payroll.length
      }
    });
  } catch (error) {
    console.error('getBillingSummary error:', error);
    res.status(500).json({ error: 'Failed to generate billing executive summary' });
  }
};

/**
 * GET /api/billing/my-invoice
 * Logged-in student fetches their official fee invoice statement
 */
const getMyStudentInvoice = async (req, res) => {
  try {
    const studentId = req.user.id;
    const studentName = req.user.name;
    const { month = 11, year = 2026 } = req.query;

    const invoices = await computeStudentInvoices(Number(month), Number(year));
    let myInvoice = invoices.find(inv => 
      inv.studentId === studentId || 
      inv.studentName.toLowerCase().includes(studentName.toLowerCase())
    );

    if (!myInvoice) {
      myInvoice = invoices[0] || {
        id: `inv-${studentId}-${year}-${month}`,
        invoiceNumber: `INV-${year}${String(month).padStart(2, '0')}-001`,
        studentName: studentName || 'Student',
        grade: 'Grade 10 (Board)',
        hourlyRate: 400,
        attendedHours: 0.0,
        completedClassesCount: 0,
        totalAmount: 0,
        status: 'PAID',
        month: Number(month),
        year: Number(year)
      };
    }

    res.json({
      success: true,
      invoice: myInvoice
    });
  } catch (error) {
    console.error('getMyStudentInvoice error:', error);
    res.status(500).json({ error: 'Failed to retrieve student fee statement' });
  }
};

/**
 * Mark a student's monthly fee invoice as PAID across Prisma & fallback store
 */
const markInvoicePaid = async ({
  studentId,
  studentName,
  month = 11,
  year = 2026,
  orderId,
  paymentId,
  paymentMethod = 'RAZORPAY',
  amount
}) => {
  const paidAtDate = new Date();
  const paymentRecord = {
    status: 'PAID',
    razorpayOrderId: orderId || null,
    razorpayPaymentId: paymentId || null,
    paymentMethod,
    paidAt: paidAtDate.toISOString()
  };

  if (studentId) {
    INVOICE_PAYMENT_OVERRIDES.set(getOverrideKey(studentId, month, year), paymentRecord);
  }

  // Also match fallback student by name if studentId differs
  if (studentName) {
    const matchedFallback = FALLBACK_STUDENTS.find(s => s.name.toLowerCase() === studentName.toLowerCase());
    if (matchedFallback) {
      INVOICE_PAYMENT_OVERRIDES.set(getOverrideKey(matchedFallback.id, month, year), paymentRecord);
    }
  }

  try {
    let profile = null;
    if (studentId) {
      profile = await prisma.studentProfile.findFirst({
        where: { OR: [{ userId: studentId }, { id: studentId }] },
        include: { grade: true }
      });
    }
    if (!profile && studentName) {
      profile = await prisma.studentProfile.findFirst({
        where: { user: { name: { contains: studentName, mode: 'insensitive' } } },
        include: { grade: true }
      });
    }

    if (profile) {
      INVOICE_PAYMENT_OVERRIDES.set(getOverrideKey(profile.userId, month, year), paymentRecord);
      INVOICE_PAYMENT_OVERRIDES.set(getOverrideKey(profile.id, month, year), paymentRecord);

      const existing = await prisma.invoice.findFirst({
        where: { studentId: profile.id, month: Number(month), year: Number(year) }
      });

      if (existing) {
        await prisma.invoice.update({
          where: { id: existing.id },
          data: {
            status: 'PAID',
            razorpayOrderId: orderId || existing.razorpayOrderId,
            razorpayPaymentId: paymentId || existing.razorpayPaymentId,
            paidAt: paidAtDate
          }
        });
      } else {
        await prisma.invoice.create({
          data: {
            studentId: profile.id,
            month: Number(month),
            year: Number(year),
            totalHours: 0,
            totalAmount: Number(amount) || 0,
            status: 'PAID',
            razorpayOrderId: orderId || null,
            razorpayPaymentId: paymentId || null,
            paidAt: paidAtDate
          }
        });
      }
    }
  } catch (err) {
    console.warn('Prisma markInvoicePaid notice:', err.message);
  }

  const allInvoices = await computeStudentInvoices(Number(month), Number(year));
  return allInvoices.find(inv =>
    (studentId && (inv.studentId === studentId || inv.profileId === studentId)) ||
    (studentName && inv.studentName.toLowerCase() === studentName.toLowerCase())
  ) || null;
};

/**
 * Reset a demo student invoice back to UNPAID for repeatable walkthroughs
 */
const resetDemoInvoicePayment = async ({ studentId, studentName, month = 11, year = 2026 }) => {
  if (studentId) {
    INVOICE_PAYMENT_OVERRIDES.delete(getOverrideKey(studentId, month, year));
  }
  if (studentName) {
    const matchedFallback = FALLBACK_STUDENTS.find(s => s.name.toLowerCase() === studentName.toLowerCase());
    if (matchedFallback) {
      INVOICE_PAYMENT_OVERRIDES.delete(getOverrideKey(matchedFallback.id, month, year));
    }
  }

  try {
    let profile = null;
    if (studentId) {
      profile = await prisma.studentProfile.findFirst({
        where: { OR: [{ userId: studentId }, { id: studentId }] }
      });
    }
    if (profile) {
      INVOICE_PAYMENT_OVERRIDES.delete(getOverrideKey(profile.userId, month, year));
      INVOICE_PAYMENT_OVERRIDES.delete(getOverrideKey(profile.id, month, year));
      await prisma.invoice.updateMany({
        where: { studentId: profile.id, month: Number(month), year: Number(year) },
        data: { status: 'UNPAID', paidAt: null, razorpayOrderId: null, razorpayPaymentId: null }
      });
    }
  } catch (err) {
    console.warn('Prisma resetDemoInvoicePayment notice:', err.message);
  }
};

module.exports = {
  getAdminInvoices,
  getAdminPayroll,
  getBillingSummary,
  getMyStudentInvoice,
  computeStudentInvoices,
  computeTeacherPayroll,
  markInvoicePaid,
  resetDemoInvoicePayment
};
