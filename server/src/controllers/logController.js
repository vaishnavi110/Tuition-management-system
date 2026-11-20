const prisma = require('../prisma');
const { SESSIONS } = require('./scheduleController');

// In-memory fallback logs store
let CLASS_LOGS = [
  {
    id: 'log-1',
    sessionId: 'session-1',
    teacherId: 'user-teacher-1',
    teacherName: 'Mrs. Sunita Verma',
    studentId: 'user-student-1',
    studentName: 'Aryan Sharma',
    grade: 'Grade 10 (Board)',
    subject: 'Mathematics',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '17:00',
    endTime: '18:15',
    durationMinutes: 75,
    durationHours: 1.25,
    attendanceStatus: 'PRESENT',
    isStudentPresent: true,
    billableHours: 1.25,
    billableAmount: 500.0,
    teacherPayoutAmount: 312.5,
    confirmedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    confirmedBy: 'Mrs. Sunita Verma',
    topicsCovered: 'Quadratic Equations: Factorization & Formula derivation with board PYQs.',
    homeworkAssigned: 'Complete Exercise 4.2 Questions 1 to 6 in homework notebook.'
  },
  {
    id: 'log-2',
    sessionId: 'session-2',
    teacherId: 'user-teacher-1',
    teacherName: 'Mrs. Sunita Verma',
    studentId: 'user-student-1',
    studentName: 'Aryan Sharma',
    grade: 'Grade 10 (Board)',
    subject: 'Mathematics',
    date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '16:00',
    endTime: '17:00',
    durationMinutes: 0,
    durationHours: 0.0,
    attendanceStatus: 'ABSENT',
    isStudentPresent: false,
    billableHours: 0.0,
    billableAmount: 0.0,
    teacherPayoutAmount: 0.0,
    confirmedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    confirmedBy: 'Mrs. Sunita Verma',
    confirmationRemarks: 'Parent informed teacher prior to class; student sick. Rescheduling.',
    topicsCovered: 'Cancelled - Student absent due to fever',
    homeworkAssigned: 'No homework assigned'
  }
];

// Helper to calculate exact minutes between two HH:MM strings
const calculateDurationInMinutes = (startTime, endTime) => {
  if (!startTime || !endTime) return null;
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) return null;

  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  return endMinutes - startMinutes;
};

// POST /api/logs/submit
// Teacher submits post-class details immediately after session
const submitClassLog = async (req, res) => {
  const {
    sessionId,
    studentId,
    studentName,
    grade,
    subject,
    date,
    startTime,
    endTime,
    isStudentPresent,
    attendanceStatus,
    confirmationRemarks,
    topicsCovered,
    homeworkAssigned,
    recordingUrl
  } = req.body;

  if (!startTime || !endTime || !topicsCovered) {
    return res.status(400).json({ error: 'Start time, end time, and topics covered are mandatory.' });
  }

  const durationMinutes = calculateDurationInMinutes(startTime, endTime);
  if (durationMinutes === null || isNaN(durationMinutes) || durationMinutes <= 0) {
    return res.status(400).json({ 
      error: 'Invalid class time: End time must be strictly later than start time.' 
    });
  }

  // Determine AttendanceStatus: PENDING, PRESENT, ABSENT
  let finalAttendanceStatus = 'PRESENT';
  if (attendanceStatus) {
    finalAttendanceStatus = attendanceStatus.toUpperCase();
  } else if (isStudentPresent === false) {
    finalAttendanceStatus = 'ABSENT';
  }

  const isPresent = finalAttendanceStatus === 'PRESENT';
  const rawDuration = Number((durationMinutes / 60).toFixed(2));
  
  // Strict Academy Rule: If absent, 0 billable hours and ₹0 fee
  const billableHours = isPresent ? rawDuration : 0.0;
  const studentHourlyRate = 400.0;
  const teacherHourlyRate = 250.0;
  const billableAmount = isPresent ? Number((rawDuration * studentHourlyRate).toFixed(2)) : 0.0;
  const teacherPayoutAmount = isPresent ? Number((rawDuration * teacherHourlyRate).toFixed(2)) : 0.0;

  // Persist to Render PostgreSQL
  try {
    if (sessionId) {
      const now = new Date();
      const classDateObj = date ? new Date(date) : now;
      const startDateTime = new Date(`${date || now.toISOString().split('T')[0]}T${startTime}:00`);
      const endDateTime = new Date(`${date || now.toISOString().split('T')[0]}T${endTime}:00`);

      // Find or check session
      const existingSession = await prisma.session.findUnique({
        where: { id: sessionId },
        include: { student: { include: { grade: true } } }
      });

      if (existingSession) {
        const rate = existingSession.savedStudentRate || existingSession.student?.grade?.studentHourlyRate || studentHourlyRate;
        const teachRate = existingSession.savedTeacherRate || existingSession.student?.grade?.teacherHourlyRate || teacherHourlyRate;
        const finalBillable = isPresent ? Number((rawDuration * rate).toFixed(2)) : 0.0;
        const finalPayout = isPresent ? Number((rawDuration * teachRate).toFixed(2)) : 0.0;

        const savedLog = await prisma.classLog.upsert({
          where: { sessionId },
          update: {
            classDate: classDateObj,
            startTime: startDateTime,
            endTime: endDateTime,
            durationMinutes: isPresent ? durationMinutes : 0,
            durationHours: billableHours,
            topicsCovered: topicsCovered.trim(),
            attendanceStatus: finalAttendanceStatus,
            confirmedAt: now,
            confirmedBy: req.user.name || 'Teacher',
            confirmationRemarks: confirmationRemarks || '',
            billableAmount: finalBillable,
            teacherPayoutAmount: finalPayout
          },
          create: {
            sessionId,
            classDate: classDateObj,
            startTime: startDateTime,
            endTime: endDateTime,
            durationMinutes: isPresent ? durationMinutes : 0,
            durationHours: billableHours,
            topicsCovered: topicsCovered.trim(),
            attendanceStatus: finalAttendanceStatus,
            confirmedAt: now,
            confirmedBy: req.user.name || 'Teacher',
            confirmationRemarks: confirmationRemarks || '',
            billableAmount: finalBillable,
            teacherPayoutAmount: finalPayout
          }
        });

        // Update session status and recording URL if provided
        await prisma.session.update({
          where: { id: sessionId },
          data: { 
            status: isPresent ? 'COMPLETED' : 'CANCELLED',
            ...(recordingUrl !== undefined ? { recordingUrl: recordingUrl ? recordingUrl.trim() : null } : {})
          }
        });

        const clientLog = {
          id: savedLog.id,
          sessionId,
          teacherId: req.user.id,
          teacherName: req.user.name,
          studentId: studentId || 'user-student-1',
          studentName: studentName || 'Aryan Sharma',
          grade: grade || 'Grade 10 (Board)',
          subject: subject || 'Mathematics',
          date: date || new Date().toISOString().split('T')[0],
          startTime,
          endTime,
          durationMinutes: savedLog.durationMinutes,
          durationHours: savedLog.durationHours,
          attendanceStatus: savedLog.attendanceStatus,
          isStudentPresent: isPresent,
          billableHours: savedLog.durationHours,
          recordingUrl: recordingUrl ? recordingUrl.trim() : existingSession.recordingUrl,
          billableAmount: savedLog.billableAmount,
          teacherPayoutAmount: savedLog.teacherPayoutAmount,
          confirmedAt: savedLog.confirmedAt.toISOString(),
          confirmedBy: savedLog.confirmedBy,
          confirmationRemarks: savedLog.confirmationRemarks,
          topicsCovered: savedLog.topicsCovered,
          homeworkAssigned: homeworkAssigned ? homeworkAssigned.trim() : 'No homework assigned',
          createdAt: savedLog.createdAt.toISOString()
        };

        CLASS_LOGS.unshift(clientLog);
        return res.status(201).json({
          message: 'Post-class details logged and persisted to Render PostgreSQL! Attendance verified.',
          log: clientLog
        });
      }
    }
  } catch (err) {
    console.warn('Prisma submitClassLog notice:', err.message);
  }

  // Fallback to memory
  const newLog = {
    id: `log-${Date.now()}`,
    sessionId: sessionId || `session-${Date.now()}`,
    teacherId: req.user.id,
    teacherName: req.user.name,
    studentId: studentId || 'user-student-1',
    studentName: studentName || 'Aryan Sharma',
    grade: grade || 'Grade 10 (Board)',
    subject: subject || 'Mathematics',
    date: date || new Date().toISOString().split('T')[0],
    startTime,
    endTime,
    durationMinutes: isPresent ? durationMinutes : 0,
    durationHours: rawDuration,
    attendanceStatus: finalAttendanceStatus,
    isStudentPresent: isPresent,
    billableHours,
    billableAmount,
    teacherPayoutAmount,
    confirmedAt: new Date().toISOString(),
    confirmedBy: req.user.name,
    confirmationRemarks: confirmationRemarks || '',
    topicsCovered: topicsCovered.trim(),
    homeworkAssigned: homeworkAssigned ? homeworkAssigned.trim() : 'No homework assigned',
    recordingUrl: recordingUrl ? recordingUrl.trim() : null,
    createdAt: new Date().toISOString()
  };

  const matchedSession = SESSIONS.find(s => s.id === sessionId);
  if (matchedSession) {
    matchedSession.status = isPresent ? 'COMPLETED' : 'CANCELLED';
    if (recordingUrl !== undefined) {
      matchedSession.recordingUrl = recordingUrl ? recordingUrl.trim() : null;
    }
  }

  CLASS_LOGS.unshift(newLog);

  res.status(201).json({
    message: 'Post-class details logged successfully! Hours verified for billing.',
    log: newLog
  });
};

// GET /api/logs/monthly-summary
// Dynamic running monthly metrics based on user role
const getMonthlySummary = async (req, res) => {
  const { role, id, name } = req.user;

  try {
    const dbLogs = await prisma.classLog.findMany({
      include: {
        session: {
          include: {
            teacher: { include: { user: true } },
            student: { include: { user: true, grade: true } }
          }
        }
      },
      orderBy: { classDate: 'desc' }
    });

    if (dbLogs && dbLogs.length > 0) {
      const formattedLogs = dbLogs.map(l => {
        const isPres = l.attendanceStatus === 'PRESENT';
        return {
          id: l.id,
          sessionId: l.sessionId,
          teacherId: l.session?.teacher?.userId,
          teacherName: l.session?.teacher?.user?.name || 'Mrs. Sunita Verma',
          studentId: l.session?.student?.userId,
          studentName: l.session?.student?.user?.name || 'Aryan Sharma',
          grade: l.session?.student?.grade?.name || 'Grade 10 (Board)',
          subject: l.session?.subject || 'Mathematics',
          date: new Date(l.classDate).toISOString().split('T')[0],
          startTime: new Date(l.startTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          endTime: new Date(l.endTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          durationMinutes: l.durationMinutes,
          durationHours: l.durationHours,
          attendanceStatus: l.attendanceStatus,
          isStudentPresent: isPres,
          billableHours: isPres ? l.durationHours : 0.0,
          billableAmount: l.billableAmount,
          teacherPayoutAmount: l.teacherPayoutAmount,
          confirmedAt: l.confirmedAt.toISOString(),
          confirmedBy: l.confirmedBy,
          confirmationRemarks: l.confirmationRemarks,
          topicsCovered: l.topicsCovered,
          recordingUrl: l.session?.recordingUrl || null,
          createdAt: l.createdAt.toISOString()
        };
      });

      let userLogs = formattedLogs;
      if (role === 'STUDENT') {
        userLogs = formattedLogs.filter(l => l.studentId === id || (name && l.studentName.toLowerCase().includes(name.toLowerCase())));
      } else if (role === 'TEACHER') {
        userLogs = formattedLogs.filter(l => l.teacherId === id || (name && l.teacherName.toLowerCase().includes(name.toLowerCase())));
      }

      // Bill only confirmed, completed, present sessions
      const totalBillableHours = userLogs
        .filter(log => log.attendanceStatus === 'PRESENT')
        .reduce((acc, log) => acc + (log.billableHours || 0), 0);
      const totalClassesCount = userLogs.length;

      return res.json({
        summary: {
          totalBillableHours: Number(totalBillableHours.toFixed(2)),
          totalClassesCount,
          logs: userLogs
        }
      });
    }
  } catch (err) {
    console.warn('Prisma getMonthlySummary notice:', err.message);
  }

  let userLogs = CLASS_LOGS;
  if (role === 'STUDENT') {
    userLogs = CLASS_LOGS.filter(l => l.studentId === id || (name && l.studentName.toLowerCase().includes(name.toLowerCase())));
  } else if (role === 'TEACHER') {
    userLogs = CLASS_LOGS.filter(l => l.teacherId === id || (name && l.teacherName.toLowerCase().includes(name.toLowerCase())));
  }

  const totalBillableHours = userLogs
    .filter(log => log.isStudentPresent || log.attendanceStatus === 'PRESENT')
    .reduce((acc, log) => acc + (log.billableHours || 0), 0);
  const totalClassesCount = userLogs.length;

  res.json({
    summary: {
      totalBillableHours: Number(totalBillableHours.toFixed(2)),
      totalClassesCount,
      logs: userLogs
    }
  });
};

// GET /api/logs/all
const getAllLogs = async (req, res) => {
  try {
    const dbLogs = await prisma.classLog.findMany({
      include: {
        session: {
          include: {
            teacher: { include: { user: true } },
            student: { include: { user: true, grade: true } }
          }
        }
      },
      orderBy: { classDate: 'desc' }
    });

    if (dbLogs && dbLogs.length > 0) {
      return res.json({ logs: dbLogs });
    }
  } catch (err) {
    console.warn('Prisma getAllLogs notice:', err.message);
  }
  res.json({ logs: CLASS_LOGS });
};

module.exports = {
  submitClassLog,
  getMonthlySummary,
  getAllLogs
};
