import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  CreditCard, 
  ExternalLink, 
  BookOpen, 
  Upload, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit2, 
  AlertCircle, 
  X,
  UserCheck,
  FileText,
  Check,
  Layers,
  Search,
  Filter,
  Calculator,
  Printer,
  Image as ImageIcon,
  User,
  KeyRound,
  Copy,
  Share2,
  Send,
  Save,
  Phone,
  Mail,
  Building,
  Award,
  ShieldCheck,
  Info,
  Users,
  PhoneCall,
  MessageSquare,
  Menu,
  Play,
  Sparkles
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout, quickLogin, updateProfile } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || 'STUDENT';

  // Data states from API
  const [grades, setGrades] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [classLogs, setClassLogs] = useState([]);
  const [monthlyHours, setMonthlyHours] = useState(0);
  const [loading, setLoading] = useState(true);

  // Sidebar Navigation & Mobile Drawer State
  const [activeTab, setActiveTab] = useState(() => {
    if (role === 'STUDENT') return 'CLASSES';
    if (role === 'TEACHER') return 'SCHEDULE';
    return 'OVERVIEW';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync activeTab whenever role changes (e.g. via demo switcher)
  useEffect(() => {
    if (role === 'STUDENT') setActiveTab('CLASSES');
    else if (role === 'TEACHER') setActiveTab('SCHEDULE');
    else setActiveTab('OVERVIEW');
  }, [role]);

  // Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // 💳 Razorpay Test Account Demo State (Student Role)
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [razorpayMethod, setRazorpayMethod] = useState('CARD'); // 'CARD', 'UPI', 'NETBANKING'
  const [testCardNumber, setTestCardNumber] = useState('4111 1111 1111 1111');
  const [testCardExpiry, setTestCardExpiry] = useState('12/28');
  const [testCardCvv, setTestCardCvv] = useState('123');
  const [testUpiId, setTestUpiId] = useState('success@razorpay');
  const [testBank, setTestBank] = useState('HDFC');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paidRecord, setPaidRecord] = useState(null);
  const [myStudentInvoice, setMyStudentInvoice] = useState(null);

  // Form states for new session
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [classDate, setClassDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('18:30');
  const [meetLink, setMeetLink] = useState('https://meet.google.com/new');

  // Form states for grade rate create/edit
  const [editingGradeId, setEditingGradeId] = useState(null);
  const [newGradeName, setNewGradeName] = useState('');
  const [newStudentRate, setNewStudentRate] = useState('');
  const [newTeacherRate, setNewTeacherRate] = useState('');

  // Post-class logging state
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [logStartTime, setLogStartTime] = useState('17:00');
  const [logEndTime, setLogEndTime] = useState('18:30');
  const [isClassPresent, setIsClassPresent] = useState(true);
  const [topicsCoveredText, setTopicsCoveredText] = useState('Completed Chapter 4 Quadratic Equations: Exercise 4.2 problem solving.');
  const [homeworkAssignedText, setHomeworkAssignedText] = useState('Complete Exercise 4.2 Questions 1 to 6 in homework notebook.');
  const [classLogged, setClassLogged] = useState(false);
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);
  const [logRecordingUrl, setLogRecordingUrl] = useState('');

  // 🎥 Class Recordings & Revision Vault state
  const [selectedRecordingSession, setSelectedRecordingSession] = useState(null);
  const [recordingSearch, setRecordingSearch] = useState('');
  const [recordingSubjectFilter, setRecordingSubjectFilter] = useState('ALL');
  const [isEditRecordingModalOpen, setIsEditRecordingModalOpen] = useState(false);
  const [editingSessionForRecording, setEditingSessionForRecording] = useState(null);
  const [editRecordingInput, setEditRecordingInput] = useState('');
  const [isSavingRecording, setIsSavingRecording] = useState(false);

  // Admin Simulator state (Confidential Executive Tool)
  const [adminSimGrade, setAdminSimGrade] = useState('grade10');
  const [adminSimHours, setAdminSimHours] = useState(12);
  const [adminSimStudents, setAdminSimStudents] = useState(30);

  // Search & Filter state for Admin Ledger & Quality Audit
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [auditProofFilter, setAuditProofFilter] = useState('ALL');

  // 💰 Admin Automated Invoicing & Teacher Payroll state (Issue #6 & #61)
  const PAGE_SIZE = 15;
  const nowBilling = new Date();
  const [billingMonth, setBillingMonth] = useState(nowBilling.getMonth() + 1);
  const [billingYear, setBillingYear] = useState(nowBilling.getFullYear());
  const [billingIsFallback, setBillingIsFallback] = useState(false);
  const [directoryPage, setDirectoryPage] = useState(1);
  const [billingPage, setBillingPage] = useState(1);
  const [auditPage, setAuditPage] = useState(1);

  const [adminInvoices, setAdminInvoices] = useState([]);
  const [adminPayroll, setAdminPayroll] = useState([]);
  const [billingSummary, setBillingSummary] = useState(null);
  const [billingSubTab, setBillingSubTab] = useState('INVOICES'); // 'INVOICES' | 'PAYROLL'
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('ALL'); // 'ALL' | 'PAID' | 'UNPAID'
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('');
  const [selectedInvoiceModal, setSelectedInvoiceModal] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Admin Academy Directory state (Students & Teachers Roster)
  const [adminDirectory, setAdminDirectory] = useState({
    isFallback: false,
    students: [],
    teachers: [],
    admins: [],
    totalUsers: 0,
    studentsCount: 0,
    teachersCount: 0
  });
  const [adminDirectoryTab, setAdminDirectoryTab] = useState('STUDENTS'); // 'STUDENTS' | 'TEACHERS'
  const [adminDirectorySearch, setAdminDirectorySearch] = useState('');
  const [adminDirectoryGradeFilter, setAdminDirectoryGradeFilter] = useState('ALL');
  const [adminDirectorySubjectFilter, setAdminDirectorySubjectFilter] = useState('ALL');

  // Admin Tutor & Staff Invitation Manager state
  const [inviteTargetRole, setInviteTargetRole] = useState('TEACHER');
  const [inviteSubject, setInviteSubject] = useState('Mathematics');
  const [customInviteCode, setCustomInviteCode] = useState('');
  const [generatedInviteList, setGeneratedInviteList] = useState([]);
  const [isGeneratingInvite, setIsGeneratingInvite] = useState(false);
  const [latestGeneratedCode, setLatestGeneratedCode] = useState(null);
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  // Profile Editor state
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileParentName, setProfileParentName] = useState('');
  const [profileParentPhone, setProfileParentPhone] = useState('');
  const [profileSchoolName, setProfileSchoolName] = useState('');
  const [profileSubject, setProfileSubject] = useState('');
  const [profileQualification, setProfileQualification] = useState('');
  const [profileBankAccount, setProfileBankAccount] = useState('');
  const [profileDesignation, setProfileDesignation] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Billing error and validation states
  const [billingError, setBillingError] = useState(null);
  const [scheduleTimeError, setScheduleTimeError] = useState('');
  const [logTimeError, setLogTimeError] = useState('');
  const [logSubmitError, setLogSubmitError] = useState(null);

  // Attendance telemetry and error states
  const [attendanceError, setAttendanceError] = useState(null);
  const [failedSessionRetry, setFailedSessionRetry] = useState(null);

  // Homework Photo Upload & Review state (Student & Teacher Portals - Issue #8)
  const [homeworkList, setHomeworkList] = useState([]);
  const [selectedHomeworkId, setSelectedHomeworkId] = useState(null);
  const [stagedHomeworkPhoto, setStagedHomeworkPhoto] = useState(null);
  const [isUploadingHomework, setIsUploadingHomework] = useState(false);
  const [homeworkUploadError, setHomeworkUploadError] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [hwSessionId, setHwSessionId] = useState('');
  const [hwTitle, setHwTitle] = useState('');
  const [hwDescription, setHwDescription] = useState('');
  const [hwTeacherPhoto, setHwTeacherPhoto] = useState(null);
  const [isCreatingHomework, setIsCreatingHomework] = useState(false);
  const [hwFilterStatus, setHwFilterStatus] = useState('ALL');
  const [hwFeedbackInputs, setHwFeedbackInputs] = useState({});

  // Copy state for payment instructions
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('tuitionhub@icici');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('+91 98000 00000');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  // Feedback state
  const [actionSuccess, setActionSuccess] = useState('');

  // ⚡ Razorpay Official & Sandbox Payment Handlers (Student Role)
  const totalPayableFee = Math.round(Number((monthlyHours ?? 0).toFixed(2)) * (user?.hourlyRate || 400));

  const handleOpenRazorpayTest = async () => {
    try {
      setIsProcessingPayment(true);

      // 1. Fetch Razorpay configuration (checks if live production keys exist or sandbox test mode is active)
      const configRes = await axios.get('/api/payment/config').catch(() => ({
        data: { keyId: null, hasValidKeys: false, isTestMode: true }
      }));
      const isLiveProduction = Boolean(configRes.data?.hasValidKeys && configRes.data?.keyId && !configRes.data?.isTestMode);

      // 2. In Sandbox / Test Mode (client awaiting Razorpay KYC), open built-in Razorpay Test Checkout modal directly
      // This avoids external Razorpay SDK popups asking for/failing on unverified KYC API keys.
      if (!isLiveProduction) {
        setIsRazorpayModalOpen(true);
        return;
      }

      const keyId = configRes.data.keyId;

      // 3. Create order on backend (calls official Razorpay API)
      const orderRes = await axios.post('/api/payment/create-order', {
        amount: totalPayableFee,
        studentId: user?.id,
        studentName: user?.name,
        month: billingMonth,
        year: billingYear,
        receiptId: myStudentInvoice?.invoiceNumber || `REC-${Date.now()}`
      }).catch(() => ({
        data: {
          order: {
            id: `order_test_${Date.now()}`,
            amount: totalPayableFee * 100
          }
        }
      }));

      const order = orderRes.data?.order;

      // 4. Ensure official Razorpay SDK script is loaded
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = resolve;
          script.onerror = () => reject(new Error('Razorpay SDK failed to load'));
          document.body.appendChild(script);
        });
      }

      // 5. Launch Official Razorpay Checkout Popup
      const options = {
        key: keyId,
        amount: order?.amount || totalPayableFee * 100,
        currency: 'INR',
        name: 'TuitionHub Coaching Academy',
        description: `Monthly Tuition Fee (${user?.grade || 'Grade 10'} • ${selectedBillingPeriodLabel})`,
        image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        order_id: order?.id && !order.id.startsWith('order_test_') ? order.id : undefined,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post('/api/payment/verify', {
              orderId: response.razorpay_order_id || order?.id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amount: totalPayableFee,
              paymentMethod: 'RAZORPAY_OFFICIAL',
              studentId: user?.id,
              studentName: user?.name,
              month: billingMonth,
              year: billingYear
            });

            if (verifyRes.data?.invoice) {
              setMyStudentInvoice(verifyRes.data.invoice);
            }

            const verifiedRecord = {
              paymentId: response.razorpay_payment_id || verifyRes.data?.payment?.paymentId,
              orderId: response.razorpay_order_id || order?.id,
              amount: totalPayableFee,
              method: 'Razorpay Official Checkout',
              paidAt: new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            };

            setPaidRecord(verifiedRecord);
            setIsRazorpayModalOpen(false);
            setActionSuccess(`Payment of ₹${totalPayableFee.toLocaleString('en-IN')} received via Razorpay! (Payment ID: ${verifiedRecord.paymentId})`);
          } catch (verifyErr) {
            console.error('Verification error:', verifyErr);
            const fallbackRecord = {
              paymentId: response.razorpay_payment_id,
              orderId: order?.id,
              amount: totalPayableFee,
              method: 'Razorpay Checkout',
              paidAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            };
            setPaidRecord(fallbackRecord);
            setActionSuccess(`Payment received! (Payment ID: ${response.razorpay_payment_id})`);
          }
        },
        remember_customer: false,
        send_sms_hash: false,
        prefill: {
          name: user?.name || 'Aryan Sharma',
          email: 'student@tuitionhub.com',
          contact: '9999999999'
        },
        notes: {
          studentId: user?.id || 'demo_student',
          portal: 'TuitionHub Student Portal'
        },
        theme: {
          color: '#0c2340'
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          }
        }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on('payment.failed', function (failResponse) {
        console.error('Razorpay payment failed:', failResponse.error);
        alert(`Payment failed: ${failResponse.error?.description || 'Transaction cancelled'}`);
        setIsProcessingPayment(false);
      });

      rzpInstance.open();
    } catch (err) {
      console.warn('Official Razorpay SDK open error, opening fallback modal:', err);
      setIsRazorpayModalOpen(true);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSimulateRazorpayPayment = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsProcessingPayment(true);
    try {
      // 1. Backend test order creation
      const orderRes = await axios.post('/api/payment/create-order', {
        amount: totalPayableFee,
        studentId: user?.id,
        studentName: user?.name,
        month: billingMonth,
        year: billingYear,
        receiptId: myStudentInvoice?.invoiceNumber || `REC-${Date.now()}`
      }).catch(() => ({
        data: {
          order: {
            id: `order_test_${Date.now()}`,
            amount: totalPayableFee * 100
          }
        }
      }));

      const orderId = orderRes.data?.order?.id || `order_test_${Date.now()}`;
      const mockPayId = `pay_test_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      // 2. Simulated payment gateway round-trip latency
      await new Promise(r => setTimeout(r, 900));

      // 3. Backend verification & Invoice persistence
      const verifyRes = await axios.post('/api/payment/verify', {
        orderId,
        paymentId: mockPayId,
        amount: totalPayableFee,
        paymentMethod: razorpayMethod,
        studentId: user?.id,
        studentName: user?.name,
        month: billingMonth,
        year: billingYear
      }).catch(() => ({
        data: {
          payment: {
            paymentId: mockPayId,
            paidAt: new Date().toISOString()
          }
        }
      }));

      if (verifyRes.data?.invoice) {
        setMyStudentInvoice(verifyRes.data.invoice);
      }

      const verifiedRecord = {
        paymentId: verifyRes.data?.payment?.paymentId || mockPayId,
        orderId: orderId,
        amount: totalPayableFee,
        method: razorpayMethod,
        paidAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      };

      setPaidRecord(verifiedRecord);
      setIsRazorpayModalOpen(false);
      setActionSuccess(`Payment of ₹${totalPayableFee.toLocaleString('en-IN')} verified and invoice marked PAID! (Payment ID: ${verifiedRecord.paymentId})`);
    } catch (err) {
      console.error('Razorpay test payment error:', err);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleResetDemoFeePayment = async () => {
    try {
      await axios.post('/api/payment/reset-demo', { month: billingMonth, year: billingYear }).catch(() => {});
    } catch (e) {
      console.warn('Reset demo bill notice:', e);
    }
    setPaidRecord(null);
    setMyStudentInvoice(prev => (prev ? { ...prev, status: 'UNPAID', razorpayPaymentId: null, razorpayOrderId: null } : prev));
    setActionSuccess('Fee Bill reset to unpaid for demo testing.');
  };

  // Open Profile Modal and populate fields
  const openProfileModal = () => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      setProfileParentName(user.parentName || '');
      setProfileParentPhone(user.parentPhone || '');
      setProfileSchoolName(user.schoolName || '');
      setProfileSubject(user.subject || '');
      setProfileQualification(user.qualification || '');
      setProfileBankAccount(user.bankAccount || '');
      setProfileDesignation(user.designation || '');
    }
    setIsProfileModalOpen(true);
  };

  // Open Schedule Modal and set default subject and student
  const openScheduleModal = () => {
    setSubject(user?.subject || 'Mathematics');
    if (enrolledStudents.length > 0 && !selectedStudentId) {
      setSelectedStudentId(enrolledStudents[0].id);
      setStudentName(enrolledStudents[0].name);
    }
    setIsScheduleModalOpen(true);
  };

  // Save profile changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);

    try {
      await updateProfile({
        name: profileName,
        phone: profilePhone,
        parentName: profileParentName,
        parentPhone: profileParentPhone,
        schoolName: profileSchoolName,
        subject: profileSubject,
        qualification: profileQualification,
        bankAccount: profileBankAccount,
        designation: profileDesignation
      });

      setIsProfileModalOpen(false);
      setActionSuccess('Profile updated.');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Fast Demo Switcher handler
  const handleSwitchDemoRole = async (targetRole) => {
    try {
      await quickLogin(targetRole);
      setActionSuccess(`Switched to ${targetRole} view`);
      setTimeout(() => setActionSuccess(''), 2500);
    } catch (err) {
      console.error('Role switch failed', err);
    }
  };

  // Calculate exact decimal hours and duration in minutes between two HH:MM strings
  const computeDurationInfo = (start, end) => {
    if (!start || !end) return { minutes: 0, hours: 0, isValid: false, error: 'Start and end times are required.' };
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) {
      return { minutes: 0, hours: 0, isValid: false, error: 'Please enter valid HH:MM times.' };
    }
    const diff = (eh * 60 + em) - (sh * 60 + sm);
    if (diff <= 0) {
      return { minutes: 0, hours: 0, isValid: false, error: 'End time must be strictly later than start time.' };
    }
    const hours = Number((diff / 60).toFixed(2));
    return { minutes: diff, hours, isValid: true, error: null };
  };

  const logDurationInfo = computeDurationInfo(logStartTime, logEndTime);
  const currentDuration = logDurationInfo.isValid 
    ? `${logDurationInfo.hours} hrs (${logDurationInfo.minutes} mins)` 
    : 'Invalid Time';

  // Dynamic billing period options (rolling 6 months) and pagination helpers
  const buildBillingMonthOptions = () => {
    const opts = [];
    const base = new Date();
    base.setDate(1);
    for (let i = 0; i < 6; i++) {
      const d = new Date(base.getFullYear(), base.getMonth() - i, 1);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      opts.push({
        value: `${y}-${String(m).padStart(2, '0')}`,
        month: m,
        year: y,
        label: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      });
    }
    return opts;
  };
  const billingMonthOptions = buildBillingMonthOptions();
  const selectedBillingPeriodLabel = new Date(billingYear, billingMonth - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
  const selectedBillingCycleRange = (() => {
    const start = new Date(billingYear, billingMonth - 1, 1);
    const end = new Date(billingYear, billingMonth, 0);
    const shortMonth = start.toLocaleDateString('en-US', { month: 'short' });
    return `${shortMonth} 1 – ${shortMonth} ${end.getDate()}, ${billingYear}`;
  })();

  const handleBillingPeriodChange = (periodStr) => {
    const [yStr, mStr] = String(periodStr || '').split('-');
    const nextYear = parseInt(yStr, 10);
    const nextMonth = parseInt(mStr, 10);
    if (!Number.isInteger(nextYear) || !Number.isInteger(nextMonth)) return;
    setBillingYear(nextYear);
    setBillingMonth(nextMonth);
    setBillingPage(1);
    setAuditPage(1);
    fetchData(nextMonth, nextYear);
  };

  // Fetch initial data (or refresh for a selected billing month/year)
  useEffect(() => {
    fetchData(billingMonth, billingYear);
  }, [user]);

  const fetchData = async (targetMonth = billingMonth, targetYear = billingYear) => {
    setBillingError(null);
    try {
      const periodQuery = `month=${targetMonth}&year=${targetYear}`;
      const [gradesRes, sessionsRes, attendanceRes, logsRes, homeworkRes] = await Promise.all([
        axios.get('/api/schedule/grades').catch(() => ({ data: { grades: [] } })),
        axios.get('/api/schedule/sessions').catch(() => ({ data: { sessions: [] } })),
        axios.get('/api/attendance/all').catch(() => ({ data: { attendance: {} } })),
        axios.get(`/api/logs/monthly-summary?${periodQuery}`).catch(() => ({ data: { summary: { totalBillableHours: 0, logs: [] } } })),
        axios.get('/api/homework').catch(() => ({ data: { homeworks: [] } }))
      ]);

      setGrades(gradesRes.data?.grades || []);
      const loadedSessions = sessionsRes.data?.sessions || [];
      setSessions(loadedSessions);
      setAttendanceRecords(attendanceRes.data?.attendance || {});

      const loadedHomeworks = homeworkRes.data?.homeworks || [];
      setHomeworkList(loadedHomeworks);
      if (loadedHomeworks.length > 0 && !selectedHomeworkId) {
        setSelectedHomeworkId(loadedHomeworks[0].id);
      }

      const summary = logsRes.data?.summary || { totalBillableHours: 0, logs: [] };
      setClassLogs(summary.logs || []);
      setMonthlyHours(summary.totalBillableHours !== undefined ? summary.totalBillableHours : 0);

      if (loadedSessions.length > 0) {
        setSelectedSessionId(loadedSessions[0].id);
        setHwSessionId(loadedSessions[0].id);
        setLogStartTime(loadedSessions[0].startTime || '17:00');
        setLogEndTime(loadedSessions[0].endTime || '18:15'); // 75 mins demo standard
      }

      let studentFallback = Boolean(logsRes?.data?.isFallback);

      // Hydrate Student's persistent monthly invoice & payment status
      if (user?.role === 'STUDENT') {
        try {
          const myInvRes = await axios.get(`/api/billing/my-invoice?${periodQuery}`).catch(() => ({ data: null }));
          if (myInvRes?.data?.isFallback) studentFallback = true;
          const inv = myInvRes?.data?.invoice;
          if (inv) {
            setMyStudentInvoice(inv);
            if (inv.status === 'PAID' && (inv.razorpayPaymentId || inv.totalAmount > 0)) {
              setPaidRecord({
                paymentId: inv.razorpayPaymentId || inv.invoiceNumber,
                orderId: inv.razorpayOrderId || inv.id,
                amount: inv.totalAmount,
                method: inv.paymentMethod || 'Razorpay',
                paidAt: inv.paidAt
                  ? new Date(inv.paidAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                  : 'Settled'
              });
            } else {
              setPaidRecord(null);
            }
          } else {
            setMyStudentInvoice(null);
            setPaidRecord(null);
          }
        } catch (e) {
          console.warn('Student invoice fetch notice:', e);
        }
      }

      // Fetch enrolled students list for session scheduling (Teachers and Admins)
      if (user?.role === 'TEACHER' || user?.role === 'ADMIN') {
        try {
          const studentsRes = await axios.get('/api/schedule/students').catch(() => ({ data: { students: [] } }));
          const list = studentsRes.data?.students || [];
          setEnrolledStudents(list);
          if (list.length > 0) {
            setSelectedStudentId(list[0].id);
            setStudentName(list[0].name);
          }
        } catch (e) {
          console.warn('Enrolled students fetch notice:', e);
        }
      }

      // Fetch full Academy Directory, Invitation Codes, and Billing Data if Admin
      if (user?.role === 'ADMIN') {
        try {
          const [adminUsersRes, adminInvitesRes, billingSumRes, invoicesRes, payrollRes] = await Promise.all([
            axios.get('/api/admin/users').catch(() => ({ data: null })),
            axios.get('/api/admin/invites').catch(() => ({ data: null })),
            axios.get(`/api/billing/summary?${periodQuery}`).catch(() => ({ data: null })),
            axios.get(`/api/billing/invoices?${periodQuery}`).catch(() => ({ data: null })),
            axios.get(`/api/billing/payroll?${periodQuery}`).catch(() => ({ data: null }))
          ]);
          if (adminUsersRes?.data?.success) {
            setAdminDirectory(adminUsersRes.data);
          }
          if (adminInvitesRes?.data?.invites) {
            setGeneratedInviteList(adminInvitesRes.data.invites);
          }
          if (billingSumRes?.data?.metrics) {
            setBillingSummary(billingSumRes.data.metrics);
          }
          if (invoicesRes?.data?.invoices) {
            setAdminInvoices(invoicesRes.data.invoices);
          }
          if (payrollRes?.data?.payroll) {
            setAdminPayroll(payrollRes.data.payroll);
          }
          setBillingIsFallback(Boolean(
            studentFallback ||
            billingSumRes?.data?.isFallback ||
            invoicesRes?.data?.isFallback ||
            payrollRes?.data?.isFallback
          ));
        } catch (e) {
          console.warn('Admin users/invites/billing directory fetch notice:', e);
        }
      } else {
        setBillingIsFallback(studentFallback);
      }
    } catch (err) {
      console.error('Failed to load verified billing data', err);
      setBillingError('Failed to load verified billing records from server. Please refresh or retry.');
      setMonthlyHours(0);
      setClassLogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Record "Meeting link opened" on "Join Google Meet" click
  const handleJoinClass = async (session) => {
    setAttendanceError(null);
    setFailedSessionRetry(null);

    // Open meet link in a new window immediately
    window.open(session.meetLink || 'https://meet.google.com/new', '_blank');

    try {
      const res = await axios.post('/api/attendance/join', { sessionId: session.id });
      setAttendanceRecords(prev => ({ ...prev, [session.id]: res.data.record }));
      setActionSuccess(`Class joined at ${res.data.record.linkOpenedDisplay}. Attendance recorded.`);
      setTimeout(() => setActionSuccess(''), 5000);
    } catch (err) {
      console.error('Failed to log meeting link access', err);
      // DO NOT fabricate fake PRESENT state!
      setAttendanceError(`Failed to save join time for "${session.subject}". Server did not respond.`);
      setFailedSessionRetry(session);
    }
  };

  // Retry action if attendance logging failed
  const handleRetryJoinLog = async () => {
    if (!failedSessionRetry) return;
    try {
      const res = await axios.post('/api/attendance/join', { sessionId: failedSessionRetry.id });
      setAttendanceRecords(prev => ({ ...prev, [failedSessionRetry.id]: res.data.record }));
      setActionSuccess(`Class join time recorded at ${res.data.record.linkOpenedDisplay}.`);
      setAttendanceError(null);
      setFailedSessionRetry(null);
      setTimeout(() => setActionSuccess(''), 5000);
    } catch (err) {
      setAttendanceError('Retry failed: Unable to connect to server. Please check your network.');
    }
  };

  // Handle Post-Class Log Submission
  const handleSubmitPostClassLog = async (e) => {
    if (e) e.preventDefault();
    setLogTimeError('');
    setLogSubmitError(null);

    const durationInfo = computeDurationInfo(logStartTime, logEndTime);
    if (!durationInfo.isValid) {
      setLogTimeError(durationInfo.error);
      return;
    }

    setIsSubmittingLog(true);

    try {
      const activeSession = sessions.find(s => s.id === selectedSessionId) || sessions[0];
      const payload = {
        sessionId: selectedSessionId,
        studentId: activeSession?.studentId || 'user-student-1',
        studentName: activeSession?.studentName || 'Aryan Sharma',
        grade: activeSession?.grade || 'Grade 10 (Board)',
        subject: activeSession?.subject || 'Mathematics',
        date: activeSession?.date || new Date().toISOString().split('T')[0],
        startTime: logStartTime,
        endTime: logEndTime,
        isStudentPresent: isClassPresent,
        topicsCovered: topicsCoveredText,
        homeworkAssigned: homeworkAssignedText,
        recordingUrl: logRecordingUrl.trim() || undefined
      };

      const res = await axios.post('/api/logs/submit', payload);
      const newLog = res.data.log;

      setClassLogs(prev => [newLog, ...prev]);
      setMonthlyHours(prev => Number((prev + newLog.billableHours).toFixed(2)));
      setClassLogged(true);
      setSessions(prev => prev.map(s => s.id === selectedSessionId ? { ...s, recordingUrl: logRecordingUrl.trim() || s.recordingUrl, status: 'COMPLETED' } : s));
      setLogRecordingUrl('');
      setActionSuccess(`Class log saved. ${newLog.billableHours} hours added to the fee bill.`);
      setTimeout(() => setActionSuccess(''), 5000);
    } catch (err) {
      setLogSubmitError(err.response?.data?.error || 'Failed to submit post-class log. Tap retry to try again.');
    } finally {
      setIsSubmittingLog(false);
    }
  };

  // 🎥 Class Recording & Embed Helper Handlers
  const handleOpenEditRecording = (session) => {
    setEditingSessionForRecording(session);
    setEditRecordingInput(session.recordingUrl || '');
    setIsEditRecordingModalOpen(true);
  };

  const handleSaveRecordingUrl = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!editingSessionForRecording) return;
    setIsSavingRecording(true);
    try {
      const trimmed = editRecordingInput.trim() || null;
      await axios.patch(`/api/schedule/sessions/${editingSessionForRecording.id}/recording`, {
        recordingUrl: trimmed
      });
      setSessions(prev => prev.map(s => s.id === editingSessionForRecording.id ? { ...s, recordingUrl: trimmed } : s));
      setClassLogs(prev => prev.map(l => l.sessionId === editingSessionForRecording.id ? { ...l, recordingUrl: trimmed } : l));
      setIsEditRecordingModalOpen(false);
      setActionSuccess(trimmed ? 'Class recording attached successfully.' : 'Class recording removed.');
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      console.error('Failed to update class recording URL:', err);
    } finally {
      setIsSavingRecording(false);
    }
  };

  const getEmbeddableVideoUrl = (url) => {
    if (!url) return null;
    const clean = url.trim();

    // 1. Fathom AI recording embed & share URLs
    // e.g. https://fathom.video/share/{id} or https://fathom.video/embed/{id}
    const fathomMatch = clean.match(/fathom\.video\/(?:share|embed)\/([a-zA-Z0-9_-]+)/);
    if (fathomMatch && fathomMatch[1]) {
      const fathomId = fathomMatch[1];
      return {
        type: 'FATHOM',
        id: fathomId,
        src: `https://fathom.video/embed/${fathomId}`,
        shareUrl: `https://fathom.video/share/${fathomId}`
      };
    }

    // 2. YouTube standard & short URLs
    const ytMatch = clean.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return {
        type: 'YOUTUBE',
        src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`
      };
    }

    // 3. Google Drive video preview URL
    const driveMatch = clean.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      return {
        type: 'DRIVE',
        src: `https://drive.google.com/file/d/${driveMatch[1]}/preview`
      };
    }

    // 4. Loom video embed URL
    const loomMatch = clean.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);
    if (loomMatch && loomMatch[1]) {
      return {
        type: 'LOOM',
        src: `https://www.loom.com/embed/${loomMatch[1]}`
      };
    }

    // 5. Direct video files (.mp4, .webm)
    if (clean.endsWith('.mp4') || clean.endsWith('.webm') || clean.includes('.mp4?')) {
      return {
        type: 'DIRECT_VIDEO',
        src: clean
      };
    }

    // 6. Generic URL
    return {
      type: 'GENERIC',
      src: clean
    };
  };

  // Schedule a new 1-on-1 session
  const handleCreateSession = async (e) => {
    e.preventDefault();
    setScheduleTimeError('');

    const durationInfo = computeDurationInfo(startTime, endTime);
    if (!durationInfo.isValid) {
      setScheduleTimeError(durationInfo.error);
      return;
    }

    try {
      const chosenStudent = enrolledStudents.find(s => s.id === selectedStudentId || s.userId === selectedStudentId);
      const targetStudentName = chosenStudent ? chosenStudent.name : studentName;
      const targetStudentId = chosenStudent ? chosenStudent.id : selectedStudentId;

      const res = await axios.post('/api/schedule/sessions', {
        studentId: targetStudentId,
        studentName: targetStudentName,
        subject: subject || (user?.subject || 'Mathematics'),
        topic,
        date: classDate,
        startTime,
        endTime,
        meetLink
      });
      setSessions([res.data.session, ...sessions]);
      setIsScheduleModalOpen(false);
      setActionSuccess('Class scheduled.');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to schedule class');
    }
  };

  // Cancel a session
  const handleCancelSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to cancel this class? No amount will be billed.')) return;
    try {
      const res = await axios.patch(`/api/schedule/sessions/${sessionId}/cancel`);
      setSessions(sessions.map(s => s.id === sessionId ? res.data.session : s));
      setActionSuccess('Class cancelled. No charge.');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      alert('Failed to cancel session');
    }
  };

  const openAddGradeModal = () => {
    setEditingGradeId(null);
    setNewGradeName('');
    setNewStudentRate('');
    setNewTeacherRate('');
    setIsGradeModalOpen(true);
  };

  const openEditGradeModal = (gradeObj) => {
    setEditingGradeId(gradeObj.id);
    setNewGradeName(gradeObj.name);
    setNewStudentRate(String(gradeObj.studentHourlyRate));
    setNewTeacherRate(String(gradeObj.teacherHourlyRate));
    setIsGradeModalOpen(true);
  };

  // Create or Update a Grade Rate Card
  const handleCreateGrade = async (e) => {
    e.preventDefault();
    try {
      if (editingGradeId) {
        const res = await axios.put(`/api/schedule/grades/${editingGradeId}`, {
          name: newGradeName,
          studentHourlyRate: newStudentRate,
          teacherHourlyRate: newTeacherRate
        });
        setGrades(prev => prev.map(g => g.id === editingGradeId ? res.data.grade : g));
        setActionSuccess('Grade fee rate updated successfully.');
      } else {
        const res = await axios.post('/api/schedule/grades', {
          name: newGradeName,
          studentHourlyRate: newStudentRate,
          teacherHourlyRate: newTeacherRate
        });
        setGrades([...grades, res.data.grade]);
        setActionSuccess('Grade fee rate added.');
      }
      setIsGradeModalOpen(false);
      setEditingGradeId(null);
      setNewGradeName('');
      setNewStudentRate('');
      setNewTeacherRate('');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save grade rate');
    }
  };

  // Permanently remove a user from Academy Directory
  const handleDeleteDirectoryUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to permanently remove "${userName}" from the academy directory?`)) {
      return;
    }
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      setAdminDirectory(prev => ({
        ...prev,
        students: (prev.students || []).filter(s => s.id !== userId),
        teachers: (prev.teachers || []).filter(t => t.id !== userId),
        studentsCount: Math.max(0, (prev.studentsCount || 1) - 1),
        teachersCount: Math.max(0, (prev.teachersCount || 1) - 1)
      }));
      setActionSuccess(`Removed "${userName}" from directory.`);
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to remove user');
    }
  };

  // Helper to validate & read uploaded image/PDF as Data URL
  const readImageFileAsDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('No file selected'));
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        return reject(new Error('Unsupported file format. Please upload JPG, PNG, WEBP, GIF, or PDF.'));
      }
      if (file.size > 5 * 1024 * 1024) {
        return reject(new Error('File size exceeds 5 MB limit. Please upload a smaller photo.'));
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read selected file.'));
      reader.readAsDataURL(file);
    });
  };

  // Student selects a notebook photo for preview (does NOT auto-submit)
  const handleStudentSelectHomeworkFile = async (homeworkId, e) => {
    const file = e.target.files?.[0];
    if (!file || !homeworkId) return;
    setHomeworkUploadError(null);
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      setStagedHomeworkPhoto({
        homeworkId,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        dataUrl
      });
    } catch (err) {
      setHomeworkUploadError(err.message || 'Failed to read selected photo.');
    } finally {
      e.target.value = '';
    }
  };

  // Student explicitly confirms & submits the staged notebook photo
  const handleStudentConfirmSubmitHomework = async (homeworkId) => {
    if (!stagedHomeworkPhoto || stagedHomeworkPhoto.homeworkId !== homeworkId) return;
    setHomeworkUploadError(null);
    setIsUploadingHomework(true);
    try {
      const res = await axios.post(`/api/homework/${homeworkId}/submit`, {
        imageData: stagedHomeworkPhoto.dataUrl,
        fileName: stagedHomeworkPhoto.name
      });
      if (res.data?.homework) {
        setHomeworkList(prev => prev.map(h => h.id === homeworkId ? res.data.homework : h));
      }
      setStagedHomeworkPhoto(null);
      setActionSuccess('Notebook photo submitted for teacher review.');
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      setHomeworkUploadError(err.response?.data?.error || err.message || 'Failed to submit notebook photo.');
    } finally {
      setIsUploadingHomework(false);
    }
  };

  // Student removes/withdraws an unreviewed submission
  const handleStudentRemoveHomeworkSubmission = async (homeworkId) => {
    setHomeworkUploadError(null);
    setIsUploadingHomework(true);
    try {
      const res = await axios.delete(`/api/homework/${homeworkId}/submission`);
      if (res.data?.homework) {
        setHomeworkList(prev => prev.map(h => h.id === homeworkId ? res.data.homework : h));
      }
      setStagedHomeworkPhoto(null);
      setActionSuccess('Submitted notebook photo removed.');
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      setHomeworkUploadError(err.response?.data?.error || 'Failed to remove submission.');
    } finally {
      setIsUploadingHomework(false);
    }
  };

  // Teacher selects question sheet image before posting assignment
  const handleTeacherHomeworkPhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHomeworkUploadError(null);
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      setHwTeacherPhoto({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        dataUrl
      });
    } catch (err) {
      setHomeworkUploadError(err.message);
    } finally {
      e.target.value = '';
    }
  };

  // Teacher posts new homework assignment with optional question photo
  const handleTeacherCreateHomework = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!hwTitle.trim()) {
      setHomeworkUploadError('Please enter a homework title.');
      return;
    }
    setHomeworkUploadError(null);
    setIsCreatingHomework(true);
    try {
      const targetSess = sessions.find(s => s.id === hwSessionId) || sessions[0];
      const res = await axios.post('/api/homework', {
        sessionId: targetSess?.id,
        studentName: targetSess?.studentName,
        subject: targetSess?.subject,
        title: hwTitle.trim(),
        description: hwDescription.trim(),
        teacherImageData: hwTeacherPhoto?.dataUrl || null
      });
      if (res.data?.homework) {
        setHomeworkList(prev => [res.data.homework, ...prev]);
      }
      setHwTitle('');
      setHwDescription('');
      setHwTeacherPhoto(null);
      setActionSuccess('Homework assignment & question photo posted to student.');
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      setHomeworkUploadError(err.response?.data?.error || 'Failed to post homework assignment.');
    } finally {
      setIsCreatingHomework(false);
    }
  };

  // Teacher inspects & marks student notebook submission as REVIEWED or PENDING
  const handleTeacherReviewHomework = async (homeworkId, nextStatus = 'REVIEWED') => {
    try {
      const feedback = hwFeedbackInputs[homeworkId] || '';
      const res = await axios.patch(`/api/homework/${homeworkId}/review`, {
        status: nextStatus,
        feedback
      });
      if (res.data?.homework) {
        setHomeworkList(prev => prev.map(h => h.id === homeworkId ? res.data.homework : h));
      }
      setActionSuccess(nextStatus === 'REVIEWED' ? 'Student homework marked as reviewed.' : 'Homework sent back for revision.');
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      console.error('Review homework error:', err);
    }
  };

  // 🔑 Admin Dynamic Invitation Generator Handlers
  const handleGenerateInviteCode = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsGeneratingInvite(true);
    try {
      const res = await axios.post('/api/admin/invites', {
        role: inviteTargetRole,
        subject: inviteTargetRole === 'TEACHER' ? inviteSubject : 'Operations',
        customCode: customInviteCode.trim()
      });
      if (res.data?.success && res.data?.invite) {
        setLatestGeneratedCode(res.data.invite);
        setGeneratedInviteList(prev => [res.data.invite, ...prev.filter(i => i.code !== res.data.invite.code)]);
        setCustomInviteCode('');
        setActionSuccess(`Invitation code ${res.data.invite.code} generated successfully!`);
      }
    } catch (err) {
      console.error('Failed to generate invite code:', err);
      const subPrefix = inviteTargetRole === 'TEACHER' ? inviteSubject.substring(0, 4).toUpperCase() : 'ADM';
      const fallbackCode = customInviteCode.trim().toUpperCase() || `${inviteTargetRole === 'TEACHER' ? 'TUTOR' : 'ADMIN'}-${subPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
      const fallbackInvite = {
        id: `inv-${Date.now()}`,
        code: fallbackCode,
        role: inviteTargetRole,
        subject: inviteTargetRole === 'TEACHER' ? inviteSubject : 'Operations',
        createdBy: user?.name || 'Managing Director Sharma',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        usedBy: null,
        usedAt: null
      };
      setLatestGeneratedCode(fallbackInvite);
      setGeneratedInviteList(prev => [fallbackInvite, ...prev]);
      setCustomInviteCode('');
      setActionSuccess(`Invitation code ${fallbackCode} generated!`);
    } finally {
      setIsGeneratingInvite(false);
    }
  };

  const handleRevokeInviteCode = async (code) => {
    try {
      await axios.delete(`/api/admin/invites/${code}`).catch(() => {});
      setGeneratedInviteList(prev => prev.map(inv => inv.code === code ? { ...inv, status: 'REVOKED' } : inv));
      if (latestGeneratedCode?.code === code) {
        setLatestGeneratedCode(prev => prev ? { ...prev, status: 'REVOKED' } : null);
      }
      setActionSuccess(`Invitation code ${code} revoked.`);
    } catch (err) {
      console.error('Revoke invite error:', err);
    }
  };

  const getInviteRegistrationUrl = (invite) => {
    const code = invite?.code || (inviteTargetRole === 'TEACHER' ? 'TUTOR-2026-INVITE' : 'ADMIN-SUPER-2026');
    const role = invite?.role || inviteTargetRole;
    const sub = invite?.subject ? `&subject=${encodeURIComponent(invite.subject)}` : '';
    return `${window.location.origin}/register?role=${role}&code=${encodeURIComponent(code)}${sub}`;
  };

  const handleCopySpecificCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  const handleCopySpecificLink = (invite, id) => {
    navigator.clipboard.writeText(getInviteRegistrationUrl(invite));
    setCopiedCodeId(`${id}-link`);
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  const handleShareWhatsAppSpecific = (invite, id) => {
    const link = getInviteRegistrationUrl(invite);
    const roleTitle = invite.role === 'TEACHER' ? `Teacher (${invite.subject || 'Faculty'})` : 'Academy Staff';
    const msg = `Hello! You have been invited to join TuitionHub Academy as an authorized ${roleTitle}. Please complete your registration here: ${link} (Invitation Code: ${invite.code})`;
    navigator.clipboard.writeText(msg);
    setCopiedCodeId(`${id}-wa`);
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  // Legacy fallback copy handler
  const getGeneratedInviteLink = () => {
    return getInviteRegistrationUrl(latestGeneratedCode || { code: inviteTargetRole === 'TEACHER' ? 'TUTOR-2026-INVITE' : 'ADMIN-SUPER-2026', role: inviteTargetRole });
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(getGeneratedInviteLink());
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  const handleCopyWhatsAppInvite = () => {
    const link = getGeneratedInviteLink();
    const roleTitle = inviteTargetRole === 'TEACHER' ? 'Teacher' : 'Staff';
    const message = `Hello! You have been invited to join TuitionHub Academy as an authorized ${roleTitle}. Please complete your registration here: ${link}`;
    navigator.clipboard.writeText(message);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2500);
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  // Admin Simulator calculations (covers LKG through 12th Standard)
  const simRates = {
    prePrimary: { name: 'LKG – UKG (Pre-Primary)', studentRate: 250, teacherRate: 150 },
    primary: { name: 'Grade 1 – 5 (Primary)', studentRate: 300, teacherRate: 180 },
    middle: { name: 'Grade 6 – 7 (Middle School)', studentRate: 320, teacherRate: 200 },
    grade8: { name: 'Grade 8 – 9 (Foundation)', studentRate: 350, teacherRate: 220 },
    grade10: { name: 'Grade 10 (Board)', studentRate: 400, teacherRate: 250 },
    grade12: { name: 'Grade 11 – 12 (Board / JEE)', studentRate: 600, teacherRate: 350 }
  };
  const activeSim = simRates[adminSimGrade] || simRates.grade10;
  const simTotalRev = activeSim.studentRate * adminSimHours * adminSimStudents;
  const simTotalPay = activeSim.teacherRate * adminSimHours * adminSimStudents;
  const simNetProfit = simTotalRev - simTotalPay;
  const simMarginPct = Math.round((simNetProfit / simTotalRev) * 100);

  // Shared grade filter matcher covering LKG through Grade 12
  const matchesGradeFilter = (gradeStr, filterKey) => {
    if (filterKey === 'ALL') return true;
    const lower = String(gradeStr || '').toLowerCase();
    if (filterKey === 'PRE_PRIMARY') return /lkg|ukg|nursery|pre[-\s]?primary/.test(lower);
    const numMatch = lower.match(/\b(\d{1,2})\b/);
    const num = numMatch ? parseInt(numMatch[1], 10) : null;
    if (num === null) return false;
    if (filterKey === 'PRIMARY') return num >= 1 && num <= 5;
    if (filterKey === 'MIDDLE') return num >= 6 && num <= 7;
    if (filterKey === 'GRADE8') return num >= 8 && num <= 9;
    if (filterKey === 'GRADE10') return num === 10;
    if (filterKey === 'GRADE12') return num >= 11 && num <= 12;
    return true;
  };

  // Shared hourly rate resolver across LKG through Grade 12 (reads configured rate cards first)
  const resolveGradeRatePair = (gradeStr) => {
    const lower = String(gradeStr || '').toLowerCase();
    const matchFromCards = (predicate, fallback) => grades.find(predicate) || fallback;
    if (/lkg|ukg|nursery|pre[-\s]?primary/.test(lower)) {
      return matchFromCards(g => /lkg|ukg|pre[-\s]?primary/i.test(g.name), { studentHourlyRate: 250, teacherHourlyRate: 150 });
    }
    const numMatch = lower.match(/\b(\d{1,2})\b/);
    const num = numMatch ? parseInt(numMatch[1], 10) : null;
    if (num !== null) {
      if (num >= 11) return matchFromCards(g => /\b11\b|\b12\b/.test(g.name), { studentHourlyRate: 600, teacherHourlyRate: 350 });
      if (num === 10) return matchFromCards(g => /\b10\b/.test(g.name), { studentHourlyRate: 400, teacherHourlyRate: 250 });
      if (num >= 8) return matchFromCards(g => /\b8\b|\b9\b/.test(g.name), { studentHourlyRate: 350, teacherHourlyRate: 220 });
      if (num >= 6) return matchFromCards(g => /\b6\b|\b7\b/.test(g.name), { studentHourlyRate: 320, teacherHourlyRate: 200 });
      if (num >= 1) return matchFromCards(g => /\b1\s*[–-]\s*5\b|\(primary\)/i.test(g.name), { studentHourlyRate: 300, teacherHourlyRate: 180 });
    }
    return { studentHourlyRate: 400, teacherHourlyRate: 250 };
  };

  // Filtered class logs for Admin Quality Audit
  const filteredLogs = classLogs.filter(log => {
    const recUrl = log.recordingUrl || sessions.find(s => s.id === log.sessionId)?.recordingUrl;
    const term = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !term ||
      log.studentName?.toLowerCase().includes(term) ||
      log.teacherName?.toLowerCase().includes(term) ||
      log.subject?.toLowerCase().includes(term) ||
      log.topicsCovered?.toLowerCase().includes(term);
    
    const matchesGrade = matchesGradeFilter(log.grade, gradeFilter);

    const matchesProof =
      auditProofFilter === 'ALL' ||
      (auditProofFilter === 'RECORDED' && Boolean(recUrl)) ||
      (auditProofFilter === 'MISSING' && !recUrl);

    return matchesSearch && matchesGrade && matchesProof;
  });

  // Filtered Students Directory for Admin
  const filteredDirectoryStudents = (adminDirectory.students || []).filter(student => {
    const term = adminDirectorySearch.toLowerCase();
    const matchesSearch = 
      !term ||
      (student.name || '').toLowerCase().includes(term) ||
      (student.email || '').toLowerCase().includes(term) ||
      (student.phone || '').toLowerCase().includes(term) ||
      (student.parentName || '').toLowerCase().includes(term) ||
      (student.parentPhone || '').toLowerCase().includes(term) ||
      (student.schoolName || '').toLowerCase().includes(term);
    
    const matchesGrade = matchesGradeFilter(student.grade, adminDirectoryGradeFilter);
    
    return matchesSearch && matchesGrade;
  });

  // Filtered Teachers Directory for Admin
  const filteredDirectoryTeachers = (adminDirectory.teachers || []).filter(teacher => {
    const term = adminDirectorySearch.toLowerCase();
    const matchesSearch = 
      !term ||
      (teacher.name || '').toLowerCase().includes(term) ||
      (teacher.email || '').toLowerCase().includes(term) ||
      (teacher.phone || '').toLowerCase().includes(term) ||
      (teacher.subject || '').toLowerCase().includes(term);

    const matchesSubject = 
      adminDirectorySubjectFilter === 'ALL' || 
      (teacher.subject || '').toLowerCase().includes(adminDirectorySubjectFilter.toLowerCase());

    return matchesSearch && matchesSubject;
  });

  // Reset pagination to page 1 when search queries, filters, sub-tabs, or billing period change
  useEffect(() => {
    setDirectoryPage(1);
  }, [adminDirectoryTab, adminDirectorySearch, adminDirectoryGradeFilter, adminDirectorySubjectFilter]);

  useEffect(() => {
    setAuditPage(1);
  }, [searchQuery, gradeFilter, auditProofFilter, billingMonth, billingYear]);

  useEffect(() => {
    setBillingPage(1);
  }, [billingSubTab, invoiceSearchQuery, invoiceStatusFilter, billingMonth, billingYear]);

  // Shared pagination helper for 400+ scale directories, billing tables, and lecture audits
  const paginateItems = (items, page) => {
    const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    return {
      pagedItems: items.slice(start, start + PAGE_SIZE),
      safePage,
      totalPages,
      startIndex: items.length === 0 ? 0 : start + 1,
      endIndex: Math.min(start + PAGE_SIZE, items.length),
      totalItems: items.length
    };
  };

  const renderPaginationBar = (pageInfo, onPageChange) => {
    if (pageInfo.totalPages <= 1) return null;
    return (
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
        <span>
          Showing <strong className="text-slate-800">{pageInfo.startIndex}–{pageInfo.endIndex}</strong> of <strong className="text-slate-800">{pageInfo.totalItems}</strong>
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={pageInfo.safePage <= 1}
            onClick={() => onPageChange(pageInfo.safePage - 1)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>
          <span className="font-bold text-slate-700 px-2">
            Page {pageInfo.safePage} of {pageInfo.totalPages}
          </span>
          <button
            type="button"
            disabled={pageInfo.safePage >= pageInfo.totalPages}
            onClick={() => onPageChange(pageInfo.safePage + 1)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    );
  };

  const getHeaderTitle = () => {
    if (role === 'STUDENT') {
      if (activeTab === 'CLASSES') return 'Scheduled Classes';
      if (activeTab === 'HISTORY') return "Completed Classes";
      if (activeTab === 'RECORDINGS') return 'Class Recordings & Revision';
      if (activeTab === 'FEES') return 'Monthly Fee Bill';
      if (activeTab === 'HOMEWORK') return 'Homework & Practice';
      return 'Student Dashboard';
    }
    if (role === 'TEACHER') {
      if (activeTab === 'SCHEDULE') return 'Class Schedule';
      if (activeTab === 'LOG_ENTRY') return 'Save Class Log';
      if (activeTab === 'HOURS') return 'Hours & Payment';
      if (activeTab === 'TEACHER_HOMEWORK') return 'Homework & Submissions';
      return 'Teacher Dashboard';
    }
    if (role === 'ADMIN') {
      if (activeTab === 'OVERVIEW') return 'Academy Overview';
      if (activeTab === 'BILLING') return 'Fee Invoicing & Teacher Payroll';
      if (activeTab === 'DIRECTORY') return 'Academy Directory';
      if (activeTab === 'INVITES') return 'Teacher & Staff Invites';
      if (activeTab === 'LOGS_AUDIT') return 'Lecture Quality & Class Logs Audit';
      if (activeTab === 'SIMULATOR') return 'Revenue Simulator';
      if (activeTab === 'RATES') return 'Grade Fee Rates';
      return 'Admin Dashboard';
    }
    return 'Dashboard';
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden animate-fadeIn"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 🌟 Fixed Left Sidebar (Sticky / Non-Scrolling) */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 h-full bg-white border-r border-slate-200
        flex flex-col justify-between shrink-0 select-none
        transition-transform duration-200 ease-in-out shadow-lg md:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight block leading-tight">TuitionHub</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border inline-block mt-0.5 ${
                role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                role === 'TEACHER' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {role === 'ADMIN' ? 'Admin Portal' : role === 'TEACHER' ? 'Teacher Portal' : 'Student Portal'}
              </span>
            </div>
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Navigation
          </div>

          {/* Student Menu */}
          {role === 'STUDENT' && (
            <>
              <button
                onClick={() => { setActiveTab('CLASSES'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'CLASSES'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Scheduled Classes</span>
              </button>

              <button
                onClick={() => { setActiveTab('HISTORY'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'HISTORY'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-4 h-4 shrink-0" />
                <span>Completed Classes</span>
              </button>

              <button
                onClick={() => { setActiveTab('RECORDINGS'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'RECORDINGS'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Video className="w-4 h-4 shrink-0" />
                <span>Class Recordings &amp; Revision</span>
              </button>

              <button
                onClick={() => { setActiveTab('FEES'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'FEES'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>Monthly Fee Bill</span>
              </button>

              <button
                onClick={() => { setActiveTab('HOMEWORK'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'HOMEWORK'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Homework & Practice</span>
              </button>
            </>
          )}

          {/* Teacher Menu */}
          {role === 'TEACHER' && (
            <>
              <button
                onClick={() => { setActiveTab('SCHEDULE'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'SCHEDULE'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Class Schedule</span>
              </button>

              <button
                onClick={() => { setActiveTab('LOG_ENTRY'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'LOG_ENTRY'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-4 h-4 shrink-0" />
                <span>Save Class Log</span>
              </button>

              <button
                onClick={() => { setActiveTab('HOURS'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'HOURS'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                <span>Hours & Payment</span>
              </button>

              <button
                onClick={() => { setActiveTab('TEACHER_HOMEWORK'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'TEACHER_HOMEWORK'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>Homework &amp; Review</span>
                </div>
                {homeworkList.filter(h => h.status === 'SUBMITTED').length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    activeTab === 'TEACHER_HOMEWORK' ? 'bg-white text-indigo-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {homeworkList.filter(h => h.status === 'SUBMITTED').length}
                  </span>
                )}
              </button>
            </>
          )}

          {/* Admin Menu */}
          {role === 'ADMIN' && (
            <>
              <button
                onClick={() => { setActiveTab('OVERVIEW'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'OVERVIEW'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                <span>Academy Overview</span>
              </button>

              <button
                onClick={() => { setActiveTab('DIRECTORY'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'DIRECTORY'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>Academy Directory</span>
              </button>

              <button
                onClick={() => { setActiveTab('BILLING'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'BILLING'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>Fee Billing &amp; Payroll</span>
              </button>

              <button
                onClick={() => { setActiveTab('INVITES'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'INVITES'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>Teacher & Staff Invites</span>
              </button>

              <button
                onClick={() => { setActiveTab('LOGS_AUDIT'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'LOGS_AUDIT'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>Lecture &amp; Logs Audit</span>
              </button>

              <button
                onClick={() => { setActiveTab('SIMULATOR'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'SIMULATOR'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Calculator className="w-4 h-4 shrink-0" />
                <span>Revenue Simulator</span>
              </button>

              <button
                onClick={() => { setActiveTab('RATES'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'RATES'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>Grade Fee Rates</span>
              </button>
            </>
          )}
        </div>

        {/* 🔒 Pinned Bottom Profile & Sign Out (Fixed to bottom of sidebar) */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 space-y-2">
          {/* User Profile Card */}
          <button
            onClick={() => { openProfileModal(); setIsMobileMenuOpen(false); }}
            className="w-full p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all flex items-center gap-2.5 text-left group shadow-xs"
            title="Open Profile Settings"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0 ${
              role === 'ADMIN' ? 'bg-purple-600' :
              role === 'TEACHER' ? 'bg-blue-600' : 'bg-emerald-600'
            }`}>
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-slate-900 block truncate group-hover:text-indigo-600 transition-colors">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-400 block truncate">
                {user.emailOrPhone}
              </span>
            </div>
            <User className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
          </button>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full px-3 py-2 rounded-xl border border-transparent text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 🚀 Right Hand Side Independent Scrollable Content Area */}
      <div className="flex-1 h-full flex flex-col overflow-hidden min-w-0">
        
        {/* Top Header */}
        <header className="h-16 shrink-0 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger button for Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                {getHeaderTitle()}
              </h1>
            </div>
          </div>

          {/* ⚡ 1-Click Fast Role Switcher in Header (For Demo Presentation) */}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-2xl border border-slate-200">
            <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
              Live Role Switch:
            </span>
            <button 
              onClick={() => handleSwitchDemoRole('STUDENT')}
              className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                role === 'STUDENT' ? 'bg-white shadow text-emerald-700 border border-emerald-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👩‍🎓 <span className="hidden sm:inline">Student</span>
            </button>
            <button 
              onClick={() => handleSwitchDemoRole('TEACHER')}
              className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                role === 'TEACHER' ? 'bg-white shadow text-blue-700 border border-blue-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👨‍🏫 <span className="hidden sm:inline">Teacher</span>
            </button>
            <button 
              onClick={() => handleSwitchDemoRole('ADMIN')}
              className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                role === 'ADMIN' ? 'bg-white shadow text-purple-700 border border-purple-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👑 <span className="hidden sm:inline">Admin</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Pane */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Global Toast Notification */}
        {actionSuccess && (
          <div className="max-w-5xl mx-auto mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* 👩‍🎓 1. STUDENT VIEW */}
        {role === 'STUDENT' && (
          <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
            
            {/* Header Greeting (on Scheduled Classes & Class History views) */}
            {(activeTab === 'CLASSES' || activeTab === 'HISTORY') && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Welcome back, {user.name} 👋
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {user.grade || 'Grade 10'} &bull; Mathematics &bull; Fee rate: ₹{user.hourlyRate || 400} per hour
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={openProfileModal}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-600" />
                    <span>Student Profile</span>
                  </button>
                  <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    <span>Today's Class Ready</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error and Retry Banner for Attendance Telemetry */}
            {attendanceError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{attendanceError}</span>
                </div>
                {failedSessionRetry && (
                  <button 
                    onClick={handleRetryJoinLog}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shrink-0 transition-colors"
                  >
                    Retry Recording Join Time
                  </button>
                )}
              </div>
            )}

            {/* Tab 1: List of Scheduled Classes */}
            {activeTab === 'CLASSES' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Your Scheduled 1-on-1 Classes
              </h3>

              {sessions.filter(s => s.status !== 'CANCELLED').map((s) => {
                const attendance = attendanceRecords[s.id];
                const linkOpened = attendance?.status === 'LINK_OPENED' || attendance?.linkOpenedDisplay;

                return (
                  <div key={s.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${linkOpened ? 'bg-blue-500 animate-pulse' : 'bg-amber-500 animate-ping'}`} />
                          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                            linkOpened 
                              ? 'text-blue-700 bg-blue-50 border-blue-200' 
                              : 'text-indigo-700 bg-indigo-50 border-indigo-200'
                          }`}>
                            {linkOpened ? `Join time recorded at ${attendance.linkOpenedDisplay}` : `Scheduled: ${s.date}`}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-slate-900">{s.subject}: {s.topic}</h4>
                        <p className="text-sm text-slate-500 mt-1">
                          Teacher: <strong className="text-slate-800">{s.teacherName}</strong> &bull; Time: <strong>{s.startTime} – {s.endTime} ({s.durationHours} hrs)</strong>
                        </p>

                        {linkOpened && (
                          <div className="mt-2 text-xs font-medium text-blue-700 flex items-center gap-1.5 bg-blue-50/70 px-2.5 py-1 rounded-lg border border-blue-100">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            <span>Join time recorded at ${attendance.linkOpenedDisplay}. Attendance confirmed by teacher.</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-center sm:items-end w-full md:w-auto">
                        <button 
                          onClick={() => handleJoinClass(s)}
                          className={`w-full md:w-auto px-7 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md ${
                            linkOpened 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200' 
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                          }`}
                        >
                          <Video className="w-4 h-4" />
                          <span>{linkOpened ? 'Re-Open Google Meet' : 'Join Google Meet'}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                        </button>
                        <span className="text-[11px] text-slate-400 mt-1 text-center">
                          Opens 1-on-1 Google Meet classroom
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            )}

            {/* Tab 2: Verified Post-Class History for Student */}
            {activeTab === 'HISTORY' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    This Month's Completed Classes
                  </h3>
                  <p className="text-xs text-slate-500">Class duration recorded by your teacher</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                  {classLogs.length} Classes Recorded
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5">Subject & Topics Covered</th>
                      <th className="py-2.5">Teacher</th>
                      <th className="py-2.5">Attended Duration</th>
                      <th className="py-2.5">Homework Note</th>
                      <th className="py-2.5 text-right pr-2">Recording</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {classLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 font-semibold text-slate-800 text-xs">{log.date}</td>
                        <td className="py-3">
                          <div className="font-bold text-slate-900 text-xs">{log.subject}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{log.topicsCovered}</div>
                        </td>
                        <td className="py-3 text-xs text-slate-600">{log.teacherName}</td>
                        <td className="py-3">
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            log.billableHours > 0 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {log.billableHours > 0 ? `${log.billableHours} hrs` : '0.0 hrs (Absent)'}
                          </span>
                        </td>
                        <td className="py-3 text-xs text-slate-500 italic max-w-xs truncate">
                          {log.homeworkAssigned}
                        </td>
                        <td className="py-3 text-right pr-2">
                          {log.recordingUrl ? (
                            <a
                              href={log.recordingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold inline-flex items-center gap-1.5 transition-colors border border-indigo-200 shadow-sm"
                            >
                              <Play className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
                              <span>Watch</span>
                              <ExternalLink className="w-3 h-3 text-indigo-500" />
                            </a>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">No video</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            )}

            {/* Tab: Class Recordings & Revision Vault */}
            {activeTab === 'RECORDINGS' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <Video className="w-4 h-4" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                        Class Recordings &amp; Revision Vault
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 max-w-xl">
                      Replay 1-on-1 classes, review teacher explanations, and reinforce key concepts for tests and exams.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5" />
                      <span>{sessions.filter(s => !!s.recordingUrl).length + classLogs.filter(l => !!l.recordingUrl && !sessions.some(s => s.id === l.sessionId && s.recordingUrl === l.recordingUrl)).length} Video Revisions</span>
                    </span>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {['ALL', 'Mathematics', 'Physics', 'Chemistry', 'Biology'].map(sub => (
                      <button
                        key={sub}
                        onClick={() => setRecordingSubjectFilter(sub)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                          recordingSubjectFilter === sub
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {sub === 'ALL' ? 'All Subjects' : sub}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search topics or concepts..."
                      value={recordingSearch}
                      onChange={(e) => setRecordingSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Grid of Recordings */}
                {(() => {
                  const allRecorded = [
                    ...sessions.filter(s => !!s.recordingUrl),
                    ...classLogs
                      .filter(l => !!l.recordingUrl && !sessions.some(s => s.id === l.sessionId && !!s.recordingUrl))
                      .map(l => ({
                        id: l.sessionId || l.id,
                        subject: l.subject,
                        topic: l.topicsCovered,
                        teacherName: l.teacherName,
                        date: l.date,
                        durationHours: l.durationHours || 1.25,
                        recordingUrl: l.recordingUrl,
                        homeworkNote: l.homeworkAssigned
                      }))
                  ].filter(item => {
                    const matchesSub = recordingSubjectFilter === 'ALL' || (item.subject || '').toLowerCase().includes(recordingSubjectFilter.toLowerCase());
                    const term = recordingSearch.toLowerCase().trim();
                    const matchesSearch = !term || (item.topic || '').toLowerCase().includes(term) || (item.subject || '').toLowerCase().includes(term) || (item.teacherName || '').toLowerCase().includes(term);
                    return matchesSub && matchesSearch;
                  });

                  if (allRecorded.length === 0) {
                    return (
                      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                          <Video className="w-6 h-6 opacity-60" />
                        </div>
                        <h4 className="font-bold text-slate-800 text-base">No Class Recordings Found</h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          {recordingSearch ? `No recordings match "${recordingSearch}". Try another keyword.` : 'Completed class recordings will appear here once your teacher links them.'}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {allRecorded.map((rec) => {
                        const embedInfo = getEmbeddableVideoUrl(rec.recordingUrl);
                        return (
                          <div 
                            key={rec.id}
                            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
                          >
                            <a 
                              href={rec.recordingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="h-40 bg-gradient-to-br from-[#0c2340] via-[#1a365d] to-indigo-950 p-4 flex flex-col justify-between relative cursor-pointer group-hover:brightness-105 transition-all block"
                            >
                              <div className="flex items-center justify-between z-10">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/10">
                                  {rec.subject}
                                </span>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1 ${
                                  embedInfo?.type === 'FATHOM'
                                    ? 'bg-purple-600/80 text-purple-100 border border-purple-400/30 shadow-sm'
                                    : 'bg-black/30 text-slate-300'
                                }`}>
                                  {embedInfo?.type === 'FATHOM' && <Sparkles className="w-3 h-3 text-purple-200" />}
                                  <span>
                                    {embedInfo?.type === 'FATHOM' ? 'Fathom AI' : embedInfo?.type === 'YOUTUBE' ? 'YouTube' : embedInfo?.type === 'DRIVE' ? 'Google Drive' : embedInfo?.type === 'LOOM' ? 'Loom' : 'Class Video'}
                                  </span>
                                </span>
                              </div>

                              <div className="flex items-center justify-center z-10">
                                <div className="w-12 h-12 rounded-full bg-white/90 text-indigo-900 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                  <Play className="w-5 h-5 fill-indigo-900 ml-0.5" />
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-[11px] text-slate-300 z-10 font-medium">
                                <span>{rec.date}</span>
                                <span>{rec.durationHours ? `${rec.durationHours} hrs` : 'Completed Class'}</span>
                              </div>

                              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                            </a>

                            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                              <div>
                                <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                  {rec.topic || `${rec.subject} 1-on-1 Class Session`}
                                </h4>
                                <p className="text-xs text-slate-500 mt-1">
                                  Tutor: <strong className="text-slate-700">{rec.teacherName}</strong>
                                </p>
                              </div>

                              <a
                                href={rec.recordingUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                              >
                                <Play className="w-3.5 h-3.5 fill-white" />
                                <span>Watch Class Recording</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Tab 3: Monthly Fee Bill — Full-Page UI */}
            {activeTab === 'FEES' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Full-Page Bill Banner */}
                <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Official Fee Statement &bull; {selectedBillingPeriodLabel}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        paidRecord 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : Math.round(Number((monthlyHours ?? 0).toFixed(2)) * (user.hourlyRate || 400)) === 0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {paidRecord 
                          ? `Paid via Razorpay Test (${paidRecord.paymentId})`
                          : Math.round(Number((monthlyHours ?? 0).toFixed(2)) * (user.hourlyRate || 400)) === 0 
                            ? 'No amount due' 
                            : 'Payment due'}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Monthly Fee Bill
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Student: <strong className="text-slate-800">{user.name}</strong> &bull; {user.grade || 'Grade 10'} &bull; Fee Rate: <strong>₹{user.hourlyRate || 400} per hour</strong>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <select
                      aria-label="Billing Month"
                      value={`${billingYear}-${String(billingMonth).padStart(2, '0')}`}
                      onChange={(e) => handleBillingPeriodChange(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {billingMonthOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {paidRecord ? (
                      <button
                        onClick={handleResetDemoFeePayment}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        title="Reset payment status back to unpaid for another demo walkthrough"
                      >
                        <span>Reset Bill (Demo)</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleOpenRazorpayTest}
                        className="px-4 py-2.5 rounded-xl bg-[#0c2340] hover:bg-[#132f54] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                        title="Open Razorpay sandbox demo checkout"
                      >
                        <div className="w-4 h-4 rounded bg-blue-500/30 text-blue-300 flex items-center justify-center font-black text-[10px]">
                          R
                        </div>
                        <span>Pay via Razorpay Test</span>
                      </button>
                    )}
                    <button
                      onClick={() => setIsReceiptModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-100 transition-all"
                    >
                      <Printer className="w-4 h-4" />
                      <span>View Official Receipt</span>
                    </button>
                  </div>
                </div>

                {/* 💳 Razorpay Sandbox / Live Readiness Notice */}
                <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4 text-blue-700" />
                    </div>
                    <div>
                      <span className="font-bold text-blue-950 block text-xs">
                        Razorpay Fee Checkout (Sandbox Demo Active)
                      </span>
                      <p className="text-blue-800 text-[11px] mt-0.5 leading-relaxed">
                        Pay easily using Card, UPI (GPay / PhonePe), or NetBanking in Sandbox mode. Once the academy connects live Razorpay keys, real transactions and webhooks switch on automatically.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-200/70 text-blue-900 border border-blue-300 self-start sm:self-auto shrink-0">
                    Test Gateway Ready
                  </span>
                </div>

                {billingError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{billingError}</span>
                    </div>
                    <button 
                      onClick={fetchData} 
                      className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 shrink-0"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* 4 Summary KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" /> Attended Hours
                    </span>
                    <div className="text-3xl font-extrabold text-slate-900 mt-1">
                      {Number((monthlyHours ?? 0).toFixed(2))} hrs
                    </div>
                    <span className="text-[11px] text-emerald-600 font-bold mt-0.5 block">Verified class logs</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-indigo-600" /> Standard Rate
                    </span>
                    <div className="text-3xl font-extrabold text-indigo-600 mt-1">
                      ₹{user.hourlyRate || 400}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">Per billable hour</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" /> Classes Count
                    </span>
                    <div className="text-3xl font-extrabold text-slate-900 mt-1">
                      {classLogs.length}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">Delivered this month</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> Total Fee Due
                    </span>
                    <div className="text-3xl font-black text-emerald-600 mt-1">
                      {paidRecord ? '₹0' : `₹${Math.round(Number((monthlyHours ?? 0).toFixed(2)) * (user.hourlyRate || 400)).toLocaleString('en-IN')}`}
                    </div>
                    <span className={`text-[11px] font-bold mt-0.5 block ${
                      paidRecord 
                        ? 'text-emerald-600'
                        : Math.round(Number((monthlyHours ?? 0).toFixed(2)) * (user.hourlyRate || 400)) === 0 ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {paidRecord 
                        ? `Paid (ID: ${paidRecord.paymentId})`
                        : Math.round(Number((monthlyHours ?? 0).toFixed(2)) * (user.hourlyRate || 400)) === 0 ? 'All settled' : 'Payment due'}
                    </span>
                  </div>
                </div>

                {/* Itemized Billing Breakdown Table */}
                <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-indigo-600" />
                        Itemized Class-by-Class Fee Breakdown
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Every 1-on-1 class session verified with decimal duration hours and standard academy billing policy.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                      Billing Cycle: {selectedBillingCycleRange}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                          <th className="py-3 px-3">Date</th>
                          <th className="py-3 px-3">Subject & Topics Covered</th>
                          <th className="py-3 px-3">Teacher</th>
                          <th className="py-3 px-3">Attended Hours</th>
                          <th className="py-3 px-3">Rate</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3 text-right">Line Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {classLogs.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="py-8 text-center text-slate-400 text-xs italic">
                              No completed class records found for this billing cycle.
                            </td>
                          </tr>
                        ) : (
                          classLogs.map((log) => {
                            const durHours = log.billableHours || 0;
                            const rate = user?.hourlyRate || 400;
                            const lineTotal = Math.round(durHours * rate);

                            return (
                              <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-3 px-3 font-semibold text-slate-800 text-xs whitespace-nowrap">{log.date}</td>
                                <td className="py-3 px-3">
                                  <div className="font-bold text-slate-900 text-xs">{log.subject}</div>
                                  <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{log.topicsCovered || '1-on-1 Class'}</div>
                                </td>
                                <td className="py-3 px-3 text-xs text-slate-700">{log.teacherName}</td>
                                <td className="py-3 px-3 text-xs font-bold text-slate-800">
                                  {durHours > 0 ? `${durHours} hrs` : '0.0 hrs'}
                                </td>
                                <td className="py-3 px-3 text-xs text-slate-500 whitespace-nowrap">
                                  ₹{rate} per hour
                                </td>
                                <td className="py-3 px-3 text-xs">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    durHours > 0
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-red-50 text-red-700 border border-red-200'
                                  }`}>
                                    {durHours > 0 ? 'Confirmed Present' : 'Absent (No charge)'}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-xs text-right font-extrabold text-slate-900">
                                  {durHours > 0 ? `₹${lineTotal.toLocaleString('en-IN')}` : '₹0'}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                      <tfoot className="border-t-2 border-slate-200 bg-slate-50/50">
                        <tr>
                          <td colSpan="3" className="py-3 px-3 font-bold text-xs text-slate-700">Total Billed Attended Hours:</td>
                          <td className="py-3 px-3 font-extrabold text-xs text-indigo-700">{Number((monthlyHours ?? 0).toFixed(2))} hrs</td>
                          <td colSpan="2" className="py-3 px-3 text-right font-bold text-xs text-slate-700">Net Payable Amount:</td>
                          <td className="py-3 px-3 text-right font-black text-sm text-emerald-600">
                            ₹{Math.round(Number((monthlyHours ?? 0).toFixed(2)) * (user.hourlyRate || 400)).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Payment Instructions & Official Receipts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Box 1: Direct UPI / Digital Payment */}
                  <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-indigo-600" />
                          Direct Digital &amp; UPI Payment
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                          Instant Transfer
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                        Parents can pay monthly fees directly to TuitionHub Academy Director via Google Pay, PhonePe, Paytm or any UPI app.
                      </p>

                      <div className="space-y-3">
                        {/* Copyable UPI ID */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Academy Director UPI ID</span>
                            <span className="font-mono font-bold text-xs text-slate-800">tuitionhub@icici</span>
                          </div>
                          <button
                            onClick={handleCopyUpi}
                            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                          >
                            {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedUpi ? 'Copied UPI!' : 'Copy UPI'}</span>
                          </button>
                        </div>

                        {/* Copyable GPay Phone */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GPay &amp; PhonePe Mobile</span>
                            <span className="font-mono font-bold text-xs text-slate-800">+91 98000 00000</span>
                          </div>
                          <button
                            onClick={handleCopyPhone}
                            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                          >
                            {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedPhone ? 'Copied Number!' : 'Copy Number'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5">
                      {paidRecord ? (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                          <span className="text-xs font-bold text-emerald-900 block flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Payment Verified via Razorpay Test Gateway</span>
                          </span>
                          <span className="text-[10px] font-mono text-emerald-700 block">
                            ID: {paidRecord.paymentId} &bull; Recorded on {paidRecord.paidAt}
                          </span>
                        </div>
                      ) : (
                        <button 
                          onClick={handleOpenRazorpayTest}
                          className="w-full py-3 rounded-xl font-bold text-xs bg-[#0c2340] hover:bg-[#132f54] text-white flex items-center justify-center gap-2 shadow-md transition-all group"
                          title="Open interactive Razorpay sandbox demo checkout"
                        >
                          <div className="w-5 h-5 rounded bg-blue-500/20 text-blue-300 flex items-center justify-center font-black text-xs group-hover:scale-105 transition-transform">
                            R
                          </div>
                          <span>Pay ₹{totalPayableFee.toLocaleString('en-IN')} with Razorpay Test Gateway (Demo Mode)</span>
                        </button>
                      )}
                      <p className="text-[10px] text-slate-400 text-center">
                        ⚡ Razorpay Test Sandbox active for student demo walkthrough &bull; Simulated Card &amp; UPI
                      </p>
                    </div>
                  </div>

                  {/* Box 2: Official Stamped Receipts & Bank Details */}
                  <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                          <Building className="w-5 h-5 text-indigo-600" />
                          Official Receipt &amp; Bank Details
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Tax Compliant
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                        TuitionHub issues authentic digital fee receipts with complete hours breakdown for parents' educational records and employer claims.
                      </p>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-slate-700">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Account Holder:</span>
                          <strong className="text-slate-900">TuitionHub Coaching Academy</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Bank Name:</span>
                          <strong className="text-slate-900">ICICI Bank Ltd.</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Account Number:</span>
                          <span className="font-mono font-bold text-slate-900">012345678901</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">IFSC Code:</span>
                          <span className="font-mono font-bold text-indigo-700">ICIC0000123</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => setIsReceiptModalOpen(true)}
                        className="w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                      >
                        <Printer className="w-4 h-4 text-indigo-600" />
                        <span>Open Official Stamped Fee Receipt</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Tab 4: Homework & Practice — Full-Page UI */}
            {activeTab === 'HOMEWORK' && (() => {
              const activeHw = homeworkList.find(h => h.id === selectedHomeworkId) || homeworkList[0] || null;
              const pendingCount = homeworkList.filter(h => h.status === 'PENDING').length;
              const submittedCount = homeworkList.filter(h => h.status === 'SUBMITTED' || h.status === 'REVIEWED').length;

              return (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Full-Page Homework Banner */}
                <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Student Practice Hub &bull; {user?.grade || 'Grade 10'}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        pendingCount === 0
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {pendingCount === 0 ? 'All assignments submitted' : `${pendingCount} Pending task${pendingCount > 1 ? 's' : ''}`}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Homework &amp; Practice
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      View homework question sheets uploaded by your teacher and submit photos of your completed notebook pages.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      <span>{homeworkList.length} Assignment{homeworkList.length === 1 ? '' : 's'}</span>
                    </span>
                  </div>
                </div>

                {/* 3 Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Active Assignment
                    </span>
                    <div className="text-lg font-extrabold text-slate-900 mt-1 truncate">
                      {activeHw ? activeHw.title : 'No Homework Yet'}
                    </div>
                    <span className="text-[11px] text-indigo-600 font-bold mt-0.5 block">
                      {activeHw ? `${activeHw.subject} • ${activeHw.teacherName}` : 'All caught up'}
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-indigo-600" /> Submission Status
                    </span>
                    <div className={`text-2xl font-extrabold mt-1 ${
                      activeHw?.status === 'REVIEWED'
                        ? 'text-emerald-600'
                        : activeHw?.status === 'SUBMITTED'
                          ? 'text-blue-600'
                          : 'text-amber-600'
                    }`}>
                      {activeHw?.status === 'REVIEWED'
                        ? 'Reviewed'
                        : activeHw?.status === 'SUBMITTED'
                          ? 'Submitted'
                          : 'Pending Upload'}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
                      {submittedCount} of {homeworkList.length} tasks uploaded
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Assigned Teacher
                    </span>
                    <div className="text-2xl font-extrabold text-indigo-600 mt-1 truncate">
                      {activeHw?.teacherName || 'Subject Tutor'}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
                      Reviews notebook photos online
                    </span>
                  </div>
                </div>

                {/* Assignment Selector Strip if multiple homeworks exist */}
                {homeworkList.length > 1 && (
                  <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
                    <span className="text-xs font-bold text-slate-500 px-2">Select Assignment:</span>
                    {homeworkList.map((hw) => (
                      <button
                        key={hw.id}
                        type="button"
                        onClick={() => { setSelectedHomeworkId(hw.id); setStagedHomeworkPhoto(null); setHomeworkUploadError(null); }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                          activeHw?.id === hw.id
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate max-w-[200px]">{hw.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          hw.status === 'REVIEWED'
                            ? 'bg-emerald-500/20 text-emerald-100'
                            : hw.status === 'SUBMITTED'
                              ? 'bg-blue-500/20 text-blue-100'
                              : 'bg-amber-500/20 text-amber-200'
                        }`}>
                          {hw.status === 'REVIEWED' ? '✓' : hw.status === 'SUBMITTED' ? 'Sent' : 'Due'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {homeworkUploadError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 shadow-sm">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{homeworkUploadError}</span>
                  </div>
                )}

                {/* Main Active Assignment & Upload Grid */}
                {activeHw ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Column: Assignment Details & Question Photo (7 cols) */}
                    <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                            {activeHw.subject} &bull; Assigned Assignment
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                            {activeHw.title}
                          </h3>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                          activeHw.status === 'REVIEWED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : activeHw.status === 'SUBMITTED'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {activeHw.status === 'REVIEWED'
                            ? 'Reviewed by Teacher'
                            : activeHw.status === 'SUBMITTED'
                              ? 'Submitted for Review'
                              : 'Pending Notebook Upload'}
                        </span>
                      </div>

                      {activeHw.description && (
                        <div className="text-xs text-slate-700 space-y-1.5 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <span className="font-bold text-slate-900 block">Instructions from {activeHw.teacherName}:</span>
                          <p className="whitespace-pre-line">{activeHw.description}</p>
                        </div>
                      )}

                      {/* Teacher Question Sheet Photo Preview */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4 text-indigo-600" />
                            <span>Teacher Question Sheet / Worksheet</span>
                          </span>
                          {activeHw.teacherImageUrl && (
                            <button
                              type="button"
                              onClick={() => setLightboxImage({ title: `${activeHw.title} — Question Sheet`, src: activeHw.teacherImageUrl })}
                              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Zoom Full Screen</span>
                            </button>
                          )}
                        </div>

                        {activeHw.teacherImageUrl ? (
                          activeHw.teacherImageUrl.startsWith('data:application/pdf') ? (
                            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
                              <span className="text-xs font-bold text-indigo-900">PDF Worksheet Attached</span>
                              <a
                                href={activeHw.teacherImageUrl}
                                download={`${activeHw.title}.pdf`}
                                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold"
                              >
                                Download PDF
                              </a>
                            </div>
                          ) : (
                            <div
                              onClick={() => setLightboxImage({ title: `${activeHw.title} — Question Sheet`, src: activeHw.teacherImageUrl })}
                              className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 cursor-pointer hover:border-indigo-400 transition-all group relative"
                            >
                              <img
                                src={activeHw.teacherImageUrl}
                                alt="Teacher homework question sheet"
                                className="w-full max-h-72 object-contain bg-white"
                              />
                              <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 text-[11px] font-semibold text-slate-500 group-hover:text-indigo-600 flex items-center justify-between">
                                <span>Click image to inspect questions full-screen</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          )
                        ) : (
                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                            No question sheet image attached for this assignment. Follow the written instructions above.
                          </div>
                        )}
                      </div>

                      {activeHw.teacherFeedback && (
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                          <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Teacher Review Feedback:</span>
                          </span>
                          <p className="text-emerald-800">{activeHw.teacherFeedback}</p>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Interactive Notebook Upload & Preview -> Submit -> Remove (5 cols) */}
                    <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <Upload className="w-4 h-4 text-indigo-600" />
                        <span>Upload Completed Notebook Photo</span>
                      </h4>

                      {/* Step A: Preview Staged Photo Before Submitting */}
                      {stagedHomeworkPhoto && stagedHomeworkPhoto.homeworkId === activeHw.id ? (
                        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                                Preview Ready &bull; Not Submitted Yet
                              </span>
                              <span className="text-xs font-bold text-slate-900 truncate block">
                                {stagedHomeworkPhoto.name} ({stagedHomeworkPhoto.size})
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setStagedHomeworkPhoto(null)}
                              className="px-2.5 py-1 rounded-lg bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-1 shrink-0 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>

                          {!stagedHomeworkPhoto.dataUrl.startsWith('data:application/pdf') ? (
                            <div
                              onClick={() => setLightboxImage({ title: `Preview — ${stagedHomeworkPhoto.name}`, src: stagedHomeworkPhoto.dataUrl })}
                              className="rounded-xl overflow-hidden border border-indigo-200 bg-white cursor-pointer"
                            >
                              <img
                                src={stagedHomeworkPhoto.dataUrl}
                                alt="Selected notebook preview"
                                className="w-full max-h-52 object-contain"
                              />
                            </div>
                          ) : (
                            <div className="p-3 rounded-xl bg-white border border-indigo-100 text-xs font-semibold text-indigo-800">
                              PDF selected and ready to submit.
                            </div>
                          )}

                          <button
                            type="button"
                            disabled={isUploadingHomework}
                            onClick={() => handleStudentConfirmSubmitHomework(activeHw.id)}
                            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                          >
                            {isUploadingHomework ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Submitting...</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                <span>Submit Homework for Review</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : activeHw.studentSubmissionUrl ? (
                        /* Step B: Already Submitted / Reviewed Card */
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                              <span className="text-xs font-bold text-emerald-900 truncate">
                                {activeHw.submissionFileName || 'Notebook Submission'}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-800 shrink-0">
                              {activeHw.status === 'REVIEWED' ? 'Reviewed' : 'Submitted'}
                            </span>
                          </div>

                          {!activeHw.studentSubmissionUrl.startsWith('data:application/pdf') && (
                            <div
                              onClick={() => setLightboxImage({ title: `${activeHw.title} — Your Notebook Submission`, src: activeHw.studentSubmissionUrl })}
                              className="rounded-xl overflow-hidden border border-emerald-200 bg-white cursor-pointer hover:opacity-95"
                            >
                              <img
                                src={activeHw.studentSubmissionUrl}
                                alt="Student notebook submission"
                                className="w-full max-h-48 object-contain"
                              />
                            </div>
                          )}

                          <div className="flex items-center justify-between gap-2 pt-1">
                            <p className="text-[11px] text-emerald-800 leading-relaxed">
                              {activeHw.status === 'REVIEWED'
                                ? `Reviewed by ${activeHw.teacherName}.`
                                : `Saved for ${activeHw.teacherName} to inspect.`}
                            </p>
                            {activeHw.status !== 'REVIEWED' && (
                              <button
                                type="button"
                                disabled={isUploadingHomework}
                                onClick={() => handleStudentRemoveHomeworkSubmission(activeHw.id)}
                                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-200 text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove Photo</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-800 text-xs">
                          No notebook photo uploaded yet. Select a clear photo to preview before submitting.
                        </div>
                      )}

                      {/* Drag & Drop File Picker (hidden when reviewed or while staging preview is open) */}
                      {activeHw.status !== 'REVIEWED' && (!stagedHomeworkPhoto || stagedHomeworkPhoto.homeworkId !== activeHw.id) && (
                        <label className={`border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50/50 hover:bg-indigo-50/20 group ${isUploadingHomework ? 'opacity-60 pointer-events-none' : ''}`}>
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                            <Upload className="w-6 h-6 text-indigo-600" />
                          </div>
                          <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-center">
                            {activeHw.studentSubmissionUrl
                              ? 'Choose New Photo to Replace Submission'
                              : 'Select Notebook Photo (Preview Before Submit)'}
                          </span>
                          <span className="text-[11px] text-slate-400 mt-1 text-center">
                            Supports JPG, PNG, WEBP, GIF or PDF up to 5 MB
                          </span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif,.pdf"
                            className="hidden"
                            onChange={(e) => handleStudentSelectHomeworkFile(activeHw.id, e)}
                          />
                        </label>
                      )}
                    </div>

                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-sm text-slate-500">
                    No homework assignments have been posted yet. Check back after your next 1-on-1 class.
                  </div>
                )}

                {/* Homework History & Practice Log Table */}
                <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        Recent Homework &amp; Practice Tasks
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Tasks assigned by your teacher across previous classes.
                      </p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                      Curriculum Tracker
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Subject</th>
                          <th className="py-2.5 px-3">Homework Task</th>
                          <th className="py-2.5 px-3">Teacher</th>
                          <th className="py-2.5 px-3">Submission Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {classLogs.filter(l => l.homeworkAssigned).length === 0 ? (
                          <tr>
                            <td colSpan="5" className="py-6 text-center text-slate-400 text-xs italic">
                              No previous homework records logged yet.
                            </td>
                          </tr>
                        ) : (
                          classLogs.filter(l => l.homeworkAssigned).map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-3 px-3 font-semibold text-slate-800 text-xs whitespace-nowrap">{log.date}</td>
                              <td className="py-3 px-3 font-bold text-slate-900 text-xs whitespace-nowrap">{log.subject}</td>
                              <td className="py-3 px-3 text-xs text-slate-700 max-w-md">
                                {log.homeworkAssigned}
                              </td>
                              <td className="py-3 px-3 text-xs text-slate-600 whitespace-nowrap">{log.teacherName}</td>
                              <td className="py-3 px-3 text-xs">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                                  Completed &amp; Reviewed
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
              );
            })()}

          </div>
        )}

        {/* 👨‍🏫 2. TEACHER VIEW */}
        {role === 'TEACHER' && (
          <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
            
            {/* Header Greeting */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Teacher Portal &bull; {user.name}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  1-on-1 Classes &bull; Teacher rate: ₹{user.hourlyRate || 250} per hour &bull; Attendance recorded
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={openProfileModal}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Teacher Profile</span>
                </button>
                <button 
                  onClick={openScheduleModal}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-md shadow-indigo-100 transition-all"
                >
                  <Plus className="w-4 h-4" /> Schedule 1-on-1 Class
                </button>
              </div>
            </div>

            {billingError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{billingError}</span>
                </div>
                <button 
                  onClick={fetchData} 
                  className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 shrink-0"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Tab 1: Class Schedule & Upcoming Classes */}
            {activeTab === 'SCHEDULE' && (
              <>
            {/* Teacher Performance & Hours Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs font-semibold text-slate-500">Recorded Teaching Hours</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">{Number((monthlyHours ?? 0).toFixed(2))} hrs</div>
                <span className="text-[11px] text-emerald-600 font-bold mt-0.5 block">Recorded decimal duration</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs font-semibold text-slate-500">Teacher Payment</span>
                <div className="text-3xl font-extrabold text-emerald-600 mt-1">
                  ₹{Math.round(Number((monthlyHours ?? 0).toFixed(2)) * (user.hourlyRate || 250)).toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">Calculated at ₹{user.hourlyRate || 250} per hour</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs font-semibold text-slate-500">Classes Completed</span>
                <div className="text-3xl font-extrabold text-indigo-600 mt-1">{classLogs.length}</div>
                <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">Automatic calculations</span>
              </div>
            </div>

            {/* List of Teacher's 1-on-1 Classes */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Your 1-on-1 Classes Today & Tomorrow
                </h3>
                <span className="text-xs text-slate-500 font-medium">{sessions.length} sessions scheduled</span>
              </div>

              <div className="space-y-3">
                {sessions.map((s) => {
                  const attendance = attendanceRecords[s.id];
                  const linkOpened = attendance?.status === 'LINK_OPENED' || attendance?.linkOpenedDisplay;

                  return (
                    <div key={s.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            s.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border border-red-200' :
                            linkOpened ? 'bg-blue-50 text-blue-700 border border-blue-200' : 
                            'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}>
                            {s.status === 'CANCELLED' ? 'Cancelled (0 hrs)' : linkOpened ? 'JOIN TIME RECORDED' : s.status}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">{s.date} &bull; {s.startTime} - {s.endTime} ({s.durationHours} hrs)</span>
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 mt-1">
                          {s.studentName} ({s.grade}) &bull; {s.subject}
                        </h4>

                        {/* Meeting Link Telemetry */}
                        {linkOpened ? (
                          <div className="text-xs font-semibold text-blue-700 flex items-center gap-1.5 mt-1">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            <span>Join time recorded at {attendance.linkOpenedDisplay}. (Please confirm attendance below).</span>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                            <span>Meet Link:</span>
                            <a href={s.meetLink} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1 font-mono text-[11px]">
                              {s.meetLink} <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>

                      {s.status === 'SCHEDULED' ? (
                        <div className="flex items-center gap-2">
                          <button 
                            type="button"
                            onClick={() => handleCancelSession(s.id)}
                            className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
                          >
                            Cancel Class
                          </button>
                          <a 
                            href={s.meetLink} 
                            target="_blank" 
                            rel="noreferrer"
                            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm"
                          >
                            Start Class
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {s.recordingUrl && (
                            <a
                              href={s.recordingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                            >
                              <Play className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
                              <span>Play</span>
                              <ExternalLink className="w-3 h-3 text-indigo-500" />
                            </a>
                          )}
                          <button 
                            type="button"
                            onClick={() => handleOpenEditRecording(s)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                          >
                            <Video className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{s.recordingUrl ? 'Edit Recording' : 'Attach Recording'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

              </>
            )}

            {/* Tab 2: Save Class Log */}
            {activeTab === 'LOG_ENTRY' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    Save Class Log (Added to Teacher Payment)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    System calculates exact decimal duration hours. Cancelled or missed classes bill 0 hours as per academy policy.
                  </p>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold self-start sm:self-auto">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Calculated: {isClassPresent ? currentDuration : '0.0 hrs (Absent - No charge)'}</span>
                </div>
              </div>

              {classLogged ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="font-bold text-emerald-800 text-base">Class Log Saved</h4>
                  <p className="text-xs text-emerald-700">
                    Class duration was added to your teacher payment and student's fee bill.
                  </p>
                  <button 
                    onClick={() => setClassLogged(false)} 
                    className="mt-3 px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition-colors"
                  >
                    Log Another Completed Class
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitPostClassLog} className="space-y-4">
                  
                  {logTimeError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{logTimeError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Select Scheduled Class</label>
                      <select 
                        value={selectedSessionId}
                        onChange={(e) => {
                          const sid = e.target.value;
                          setSelectedSessionId(sid);
                          const s = sessions.find(item => item.id === sid);
                          if (s) {
                            setLogStartTime(s.startTime);
                            setLogEndTime(s.endTime);
                          }
                        }}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                      >
                        {sessions.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.studentName} ({s.subject}) &bull; {s.date}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Class Start Time</label>
                      <input 
                        type="time" 
                        required 
                        value={logStartTime} 
                        onChange={(e) => setLogStartTime(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white" 
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Class End Time</label>
                      <input 
                        type="time" 
                        required 
                        value={logEndTime} 
                        onChange={(e) => setLogEndTime(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white" 
                      />
                    </div>
                  </div>

                  {/* Attendance Checkbox with strict zero-charge override */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Teacher Final Attendance Confirmation
                      </span>
                      {attendanceRecords[selectedSessionId]?.linkOpenedDisplay && (
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 self-start sm:self-auto flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-600" />
                          <span>Student joined at {attendanceRecords[selectedSessionId].linkOpenedDisplay}</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      <label className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                        isClassPresent 
                          ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-bold shadow-sm' 
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}>
                        <input 
                          type="radio" 
                          name="teacherAttendanceConfirm"
                          checked={isClassPresent === true}
                          onChange={() => setIsClassPresent(true)}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" 
                        />
                        <div>
                          <span className="text-xs block font-bold">Confirmed Present</span>
                          <span className="text-[10px] text-emerald-700 font-medium block">
                            Billable: {logDurationInfo.isValid ? `${logDurationInfo.hours} hrs (${logDurationInfo.minutes} mins)` : 'Valid duration'}
                          </span>
                        </div>
                      </label>

                      <label className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                        !isClassPresent 
                          ? 'border-red-500 bg-red-50/70 text-red-900 font-bold shadow-sm' 
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}>
                        <input 
                          type="radio" 
                          name="teacherAttendanceConfirm"
                          checked={isClassPresent === false}
                          onChange={() => setIsClassPresent(false)}
                          className="w-4 h-4 text-red-600 focus:ring-red-500" 
                        />
                        <div>
                          <span className="text-xs block font-bold">Student Absent / Cancelled</span>
                          <span className="text-[10px] text-red-700 font-medium block">
                            No charge: 0.0 hrs billed
                          </span>
                        </div>
                      </label>
                    </div>

                    {!isClassPresent && (
                      <div className="mt-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <span>Academy Policy Applied: 0.0 billable hours will be charged for absent / missed classes.</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Topics Covered (Required)</label>
                    <textarea 
                      rows="2" 
                      required
                      value={topicsCoveredText}
                      onChange={(e) => setTopicsCoveredText(e.target.value)}
                      placeholder="e.g. Chapter 4 Quadratic Equations: Exercise 4.2 problem solving."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Homework Assigned (Optional)</label>
                    <input 
                      type="text" 
                      value={homeworkAssignedText}
                      onChange={(e) => setHomeworkAssignedText(e.target.value)}
                      placeholder="e.g. Solve 5 practice questions in notebook"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Class Recording Link (Optional - Fathom AI, Google Drive, or Zoom)
                    </label>
                    <input 
                      type="url" 
                      value={logRecordingUrl}
                      onChange={(e) => setLogRecordingUrl(e.target.value)}
                      placeholder="e.g. Fathom AI (https://fathom.video/share/...), Google Drive, or YouTube"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Paste a shareable link (Fathom AI, Google Drive, YouTube, Zoom, or Loom). Students can replay this class and view AI study notes in their revision vault.
                    </p>
                  </div>

                  {logSubmitError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <span>{logSubmitError}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={handleSubmitPostClassLog} 
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shrink-0 transition-colors"
                      >
                        Retry Saving
                      </button>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button 
                      type="submit"
                      disabled={isSubmittingLog}
                      className="px-6 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 flex items-center gap-2 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isSubmittingLog ? 'Saving...' : `Save Class Log (${isClassPresent && logDurationInfo.isValid ? `${logDurationInfo.hours} hrs` : '0.0 hrs'})`}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            )}

            {/* Tab 3: Hours & Payment History */}
            {activeTab === 'HOURS' && (
              <>
            {/* Teacher Performance & Hours Summary Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs font-semibold text-slate-500">Recorded Teaching Hours</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">{Number((monthlyHours ?? 0).toFixed(2))} hrs</div>
                <span className="text-[11px] text-emerald-600 font-bold mt-0.5 block">Recorded decimal duration</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs font-semibold text-slate-500">Teacher Payment</span>
                <div className="text-3xl font-extrabold text-emerald-600 mt-1">
                  ₹{Math.round(Number((monthlyHours ?? 0).toFixed(2)) * (user.hourlyRate || 250)).toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">Calculated at ₹{user.hourlyRate || 250} per hour</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs font-semibold text-slate-500">Classes Completed</span>
                <div className="text-3xl font-extrabold text-indigo-600 mt-1">{classLogs.length}</div>
                <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">Automatic calculations</span>
              </div>
            </div>

            {/* Teacher's Class Logs Table */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Your Class Logs History
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5">Student</th>
                      <th className="py-2.5">Subject & Topics</th>
                      <th className="py-2.5">Hours</th>
                      <th className="py-2.5">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {classLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 font-semibold text-slate-800 text-xs">{log.date}</td>
                        <td className="py-3 font-bold text-slate-900 text-xs">{log.studentName}</td>
                        <td className="py-3">
                          <div className="font-semibold text-xs text-slate-800">{log.subject}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">{log.topicsCovered}</div>
                        </td>
                        <td className="py-3 font-extrabold text-indigo-600 text-xs">
                          {log.billableHours} hrs
                        </td>
                        <td className="py-3">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Verified & Accrued
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
              </>
            )}

            {/* Tab 4: Teacher Homework Assignments & Notebook Submission Review (#8) */}
            {activeTab === 'TEACHER_HOMEWORK' && (() => {
              const submittedQueue = homeworkList.filter(h => h.status === 'SUBMITTED');
              const reviewedQueue = homeworkList.filter(h => h.status === 'REVIEWED');
              const filteredHw = homeworkList.filter(h => hwFilterStatus === 'ALL' || h.status === hwFilterStatus);

              return (
                <div className="space-y-6 animate-fadeIn">
                  {/* Top 3 KPI Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                      <span className="text-xs font-semibold text-slate-500">Total Assignments Posted</span>
                      <div className="text-3xl font-extrabold text-slate-900 mt-1">{homeworkList.length}</div>
                      <span className="text-[11px] text-indigo-600 font-bold mt-0.5 block">Synced with student portal</span>
                    </div>
                    <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                      <span className="text-xs font-semibold text-slate-500">Pending Teacher Review</span>
                      <div className="text-3xl font-extrabold text-amber-600 mt-1">{submittedQueue.length}</div>
                      <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">Notebook photos awaiting feedback</span>
                    </div>
                    <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                      <span className="text-xs font-semibold text-slate-500">Reviewed &amp; Completed</span>
                      <div className="text-3xl font-extrabold text-emerald-600 mt-1">{reviewedQueue.length}</div>
                      <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">Checked student submissions</span>
                    </div>
                  </div>

                  {/* Form: Post New Homework & Attach Question Photo */}
                  <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                      <Upload className="w-4 h-4 text-indigo-600" />
                      <span>Assign Homework with Question Sheet Photo</span>
                    </h3>

                    {homeworkUploadError && (
                      <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <span>{homeworkUploadError}</span>
                      </div>
                    )}

                    <form onSubmit={handleTeacherCreateHomework} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Linked 1-on-1 Class Session</label>
                          <select
                            value={hwSessionId}
                            onChange={(e) => setHwSessionId(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            {sessions.length === 0 ? (
                              <option value="">General Assignment (Aryan Sharma)</option>
                            ) : (
                              sessions.map(s => (
                                <option key={s.id} value={s.id}>
                                  {s.studentName} &bull; {s.subject} ({s.date})
                                </option>
                              ))
                            )}
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Homework Title *</label>
                          <input
                            type="text"
                            required
                            value={hwTitle}
                            onChange={(e) => setHwTitle(e.target.value)}
                            placeholder="e.g. Quadratic Formula Worksheet Ex 4.3"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                        <div className="md:col-span-7">
                          <label className="text-xs font-bold text-slate-700 block mb-1">Instructions for Student</label>
                          <textarea
                            rows={4}
                            value={hwDescription}
                            onChange={(e) => setHwDescription(e.target.value)}
                            placeholder="Write step-by-step instructions or specific textbook questions to solve..."
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="md:col-span-5">
                          <label className="text-xs font-bold text-slate-700 block mb-1">Attach Question Sheet Photo (Optional)</label>
                          {hwTeacherPhoto ? (
                            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 space-y-2">
                              <div className="flex items-center justify-between gap-2 text-xs">
                                <span className="font-bold text-indigo-900 truncate">{hwTeacherPhoto.name}</span>
                                <button
                                  type="button"
                                  onClick={() => setHwTeacherPhoto(null)}
                                  className="text-red-600 font-bold hover:underline shrink-0"
                                >
                                  Remove
                                </button>
                              </div>
                              {!hwTeacherPhoto.dataUrl.startsWith('data:application/pdf') && (
                                <img
                                  src={hwTeacherPhoto.dataUrl}
                                  alt="Question preview"
                                  className="w-full h-24 object-contain bg-white rounded-lg border border-indigo-100"
                                />
                              )}
                            </div>
                          ) : (
                            <label className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50/50 hover:bg-indigo-50/20 text-center">
                              <ImageIcon className="w-6 h-6 text-indigo-600 mb-1" />
                              <span className="text-xs font-bold text-slate-700">Upload Questions Photo / PDF</span>
                              <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP or PDF up to 5 MB</span>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif,.pdf"
                                className="hidden"
                                onChange={handleTeacherHomeworkPhotoSelect}
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isCreatingHomework}
                          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{isCreatingHomework ? 'Posting Assignment...' : 'Post Homework Assignment'}</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Submissions & Review Queue */}
                  <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Student Notebook Submissions &amp; Review</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Inspect uploaded notebook photos side-by-side and send feedback.</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {[
                          { key: 'ALL', label: 'All' },
                          { key: 'SUBMITTED', label: 'Needs Review' },
                          { key: 'PENDING', label: 'Not Submitted Yet' },
                          { key: 'REVIEWED', label: 'Reviewed' }
                        ].map(tab => (
                          <button
                            key={tab.key}
                            type="button"
                            onClick={() => setHwFilterStatus(tab.key)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              hwFilterStatus === tab.key
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {filteredHw.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        No homework items match this filter.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredHw.map((hw) => (
                          <div key={hw.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/40 space-y-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-extrabold text-slate-900">{hw.studentName}</span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                                    {hw.subject}
                                  </span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 mt-1">{hw.title}</h4>
                                {hw.description && <p className="text-xs text-slate-500 mt-0.5">{hw.description}</p>}
                              </div>

                              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                                hw.status === 'REVIEWED'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : hw.status === 'SUBMITTED'
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}>
                                {hw.status === 'REVIEWED'
                                  ? '✓ Reviewed'
                                  : hw.status === 'SUBMITTED'
                                    ? 'Submitted (Needs Review)'
                                    : 'Pending Student Upload'}
                              </span>
                            </div>

                            {/* Side-by-Side Question vs Student Notebook Photos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-3 rounded-xl bg-white border border-slate-200">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                                  Assigned Question Sheet
                                </span>
                                {hw.teacherImageUrl ? (
                                  hw.teacherImageUrl.startsWith('data:application/pdf') ? (
                                    <a href={hw.teacherImageUrl} download={`${hw.title}.pdf`} className="text-xs font-bold text-indigo-600 underline">
                                      Download PDF Worksheet
                                    </a>
                                  ) : (
                                    <img
                                      src={hw.teacherImageUrl}
                                      alt="Question sheet"
                                      onClick={() => setLightboxImage({ title: `${hw.title} — Question Sheet`, src: hw.teacherImageUrl })}
                                      className="w-full h-40 object-contain rounded-lg cursor-pointer hover:opacity-90 border border-slate-100"
                                    />
                                  )
                                ) : (
                                  <span className="text-xs text-slate-400 italic">Text instructions only</span>
                                )}
                              </div>

                              <div className="p-3 rounded-xl bg-white border border-slate-200">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                                  Student Notebook Submission
                                </span>
                                {hw.studentSubmissionUrl ? (
                                  hw.studentSubmissionUrl.startsWith('data:application/pdf') ? (
                                    <a href={hw.studentSubmissionUrl} download="student-notebook.pdf" className="text-xs font-bold text-emerald-600 underline">
                                      Download Student PDF
                                    </a>
                                  ) : (
                                    <img
                                      src={hw.studentSubmissionUrl}
                                      alt="Student notebook submission"
                                      onClick={() => setLightboxImage({ title: `${hw.studentName} — Notebook Submission`, src: hw.studentSubmissionUrl })}
                                      className="w-full h-40 object-contain rounded-lg cursor-pointer hover:opacity-90 border border-emerald-100"
                                    />
                                  )
                                ) : (
                                  <div className="h-40 flex items-center justify-center text-xs text-slate-400 italic bg-slate-50 rounded-lg">
                                    Student has not uploaded notebook photo yet
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Review Controls */}
                            {(hw.status === 'SUBMITTED' || hw.status === 'REVIEWED') && (
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-slate-200/70">
                                <input
                                  type="text"
                                  value={hwFeedbackInputs[hw.id] ?? hw.teacherFeedback ?? ''}
                                  onChange={(e) => setHwFeedbackInputs(prev => ({ ...prev, [hw.id]: e.target.value }))}
                                  placeholder="Add feedback note for student (optional)..."
                                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleTeacherReviewHomework(hw.id, 'REVIEWED')}
                                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all shrink-0"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{hw.status === 'REVIEWED' ? 'Update Review' : 'Approve & Mark Reviewed'}</span>
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

          </div>
        )}

        {/* 👑 3. ADMIN DASHBOARD */}
        {role === 'ADMIN' && (
          <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Admin Dashboard
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Managing {adminDirectory.studentsCount || 0} Students &amp; {adminDirectory.teachersCount || 0} Teachers &bull; Live Database
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={openProfileModal}
                  className="px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Profile</span>
                </button>
                <span className={`text-xs px-3 py-2 rounded-xl font-bold border ${
                  (adminDirectory.isFallback || billingIsFallback)
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {(adminDirectory.isFallback || billingIsFallback) ? '● Offline Fallback' : '● Live Sync'}
                </span>
              </div>
            </div>

            {(adminDirectory.isFallback || billingIsFallback) && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-start gap-2.5 text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">⚠️ Live Database Temporarily Unreachable — Showing Offline Demo Data</span>
                    <span className="text-amber-800">Showing cached fallback records while PostgreSQL connectivity recovers. Click retry to load live users and invoices.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fetchData(billingMonth, billingYear)}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold whitespace-nowrap self-start sm:self-auto transition-colors"
                >
                  Retry Connection
                </button>
              </div>
            )}

            {/* Tab 1: Academy Overview & Metrics */}
            {activeTab === 'OVERVIEW' && (
              <>
            {/* Live Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-500">Active Students</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">
                  {adminDirectory.studentsCount || 0}
                </div>
                <span className="text-[11px] text-emerald-600 mt-0.5 block">Enrolled students</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-500">Active Teachers</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">
                  {adminDirectory.teachersCount || 0}
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Dedicated teachers</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-500">Attended Hours</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">
                  {((adminDirectory.students || []).reduce((acc, s) => acc + (s.attendedHours || 0), 0)).toFixed(1)} hrs
                </div>
                <span className="text-[11px] text-indigo-600 mt-0.5 block">Recorded class hours</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-500">Total Accrued Fees</span>
                <div className="text-3xl font-extrabold text-emerald-600 mt-1">
                  ₹{((adminDirectory.students || []).reduce((acc, s) => acc + (s.totalFeeDue || 0), 0)).toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-emerald-600 mt-0.5 block">Monthly fee accruals</span>
              </div>
            </div>

            {/* Overview Quick Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" /> Academy Roster Snapshot
                </h4>
                <p className="text-xs text-slate-500 mb-4">Quick summary of registered members.</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 text-xs">
                    <span className="font-semibold text-slate-700">Enrolled Students</span>
                    <span className="font-bold text-indigo-600">{adminDirectory.studentsCount || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 text-xs">
                    <span className="font-semibold text-slate-700">Authorized Teachers</span>
                    <span className="font-bold text-purple-600">{adminDirectory.teachersCount || 0}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('DIRECTORY')}
                  className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                >
                  Open Full Academy Directory &rarr;
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-indigo-600" /> Active Invitation Keys
                </h4>
                <p className="text-xs text-slate-500 mb-4">Registration gatekeeper codes.</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 text-xs">
                    <span className="font-semibold text-slate-700">Teacher Code</span>
                    <span className="font-mono font-bold text-indigo-700">TUTOR-2026-INVITE</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 text-xs">
                    <span className="font-semibold text-slate-700">Admin Code</span>
                    <span className="font-mono font-bold text-purple-700">ADMIN-SUPER-2026</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('INVITES')}
                  className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                >
                  Generate New Invitation &rarr;
                </button>
              </div>
            </div>
              </>
            )}

            {/* Tab 3: INVITATION MANAGER WIDGET */}
            {activeTab === 'INVITES' && (
            <div className="space-y-6">
              {/* Generator Card */}
              <div className="p-6 sm:p-7 rounded-2xl bg-white border border-indigo-100 shadow-md shadow-indigo-50/50 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900">
                        Teacher & Admin Invitation Generator
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Students register directly. Teachers and administrators require an authorized invitation code with department assignment.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full self-start sm:self-auto flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Gatekeeper Protection Active</span>
                  </span>
                </div>

                {/* Generator Form */}
                <form onSubmit={handleGenerateInviteCode} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-3">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Role</label>
                    <select
                      value={inviteTargetRole}
                      onChange={(e) => setInviteTargetRole(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="TEACHER">Teacher / Faculty</option>
                      <option value="ADMIN">Administrative Staff</option>
                    </select>
                  </div>

                  {inviteTargetRole === 'TEACHER' ? (
                    <div className="md:col-span-3">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Assigned Department</label>
                      <select
                        value={inviteSubject}
                        onChange={(e) => setInviteSubject(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="English">English</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Economics">Economics</option>
                        <option value="General Studies">General Studies</option>
                      </select>
                    </div>
                  ) : (
                    <div className="md:col-span-3">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Assigned Department</label>
                      <input
                        type="text"
                        disabled
                        value="Operations & Academy Management"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-500"
                      />
                    </div>
                  )}

                  <div className="md:col-span-3">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Custom Code (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. TUTOR-CHEM-2026"
                      value={customInviteCode}
                      onChange={(e) => setCustomInviteCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold bg-white uppercase placeholder:font-normal placeholder:normal-case focus:border-indigo-500"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <button
                      type="submit"
                      disabled={isGeneratingInvite}
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      {isGeneratingInvite ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4" />
                          <span>Generate Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Latest Generated Code Showcase */}
                {latestGeneratedCode && (
                  <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200/80 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full inline-block mb-1">
                          🎉 Newly Generated Code Ready to Share
                        </span>
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl font-mono font-black text-slate-900 tracking-wider">
                            {latestGeneratedCode.code}
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                            {latestGeneratedCode.role === 'TEACHER' ? `Teacher • ${latestGeneratedCode.subject}` : 'Admin'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleCopySpecificCode(latestGeneratedCode.code, 'latest')}
                          className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          {copiedCodeId === 'latest' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCodeId === 'latest' ? 'Copied Code!' : 'Copy Code'}</span>
                        </button>
                        <button
                          onClick={() => handleCopySpecificLink(latestGeneratedCode, 'latest')}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          {copiedCodeId === 'latest-link' ? <Check className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                          <span>{copiedCodeId === 'latest-link' ? 'Copied Link!' : 'Copy Link'}</span>
                        </button>
                        <button
                          onClick={() => handleShareWhatsAppSpecific(latestGeneratedCode, 'latest')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          {copiedCodeId === 'latest-wa' ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                          <span>{copiedCodeId === 'latest-wa' ? 'Copied Text!' : 'WhatsApp'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Invitation Codes Roster / Table */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-indigo-600" />
                      <span>Issued Invitation Codes</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                        {generatedInviteList.length}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Share any active code or direct link with prospective tutors to allow them to register.
                    </p>
                  </div>
                </div>

                {generatedInviteList.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">
                    <KeyRound className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-xs font-medium">No custom invitation codes generated yet.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Use the generator above to issue codes for your teaching staff.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="pb-3 pl-2">Invitation Code</th>
                          <th className="pb-3">Role &amp; Department</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Issued By</th>
                          <th className="pb-3 text-right pr-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {generatedInviteList.map((inv) => (
                          <tr key={inv.id || inv.code} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3 pl-2">
                              <span className="font-mono font-bold text-slate-900 text-xs px-2 py-1 rounded bg-slate-100 border border-slate-200">
                                {inv.code}
                              </span>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                  inv.role === 'TEACHER' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                }`}>
                                  {inv.role}
                                </span>
                                <span className="font-semibold text-slate-800">{inv.subject || 'General'}</span>
                              </div>
                            </td>
                            <td className="py-3">
                              {inv.status === 'ACTIVE' && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  ● Active
                                </span>
                              )}
                              {inv.status === 'USED' && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200" title={`Redeemed on ${inv.usedAt}`}>
                                  ✓ Redeemed ({inv.usedBy || 'Used'})
                                </span>
                              )}
                              {inv.status === 'REVOKED' && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                                  Revoked
                                </span>
                              )}
                            </td>
                            <td className="py-3 text-slate-500 text-[11px]">
                              {inv.createdBy || 'Admin'}
                            </td>
                            <td className="py-3 pr-2 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleCopySpecificCode(inv.code, inv.id || inv.code)}
                                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors"
                                  title="Copy Code"
                                >
                                  {copiedCodeId === (inv.id || inv.code) ? 'Copied' : 'Copy'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCopySpecificLink(inv, inv.id || inv.code)}
                                  className="px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold transition-colors"
                                  title="Copy Direct Registration Link"
                                >
                                  {copiedCodeId === `${inv.id || inv.code}-link` ? 'Link Copied' : 'Link'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleShareWhatsAppSpecific(inv, inv.id || inv.code)}
                                  className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold transition-colors"
                                  title="Copy WhatsApp Message"
                                >
                                  {copiedCodeId === `${inv.id || inv.code}-wa` ? 'Text Copied' : 'WhatsApp'}
                                </button>
                                {inv.status === 'ACTIVE' && (
                                  <button
                                    type="button"
                                    onClick={() => handleRevokeInviteCode(inv.code)}
                                    className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-bold transition-colors"
                                    title="Revoke this code"
                                  >
                                    Revoke
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Tab 2: ACADEMY DIRECTORY (STUDENTS & TEACHERS ROSTER) */}
            {activeTab === 'DIRECTORY' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                      <Users className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      Academy Directory
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Directory of registered students and teachers with contact details, parent info, and class metrics.
                  </p>
                </div>

                {/* Switchable Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
                  <button
                    onClick={() => { setAdminDirectoryTab('STUDENTS'); setAdminDirectorySearch(''); }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      adminDirectoryTab === 'STUDENTS'
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Enrolled Students</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-50 text-indigo-700 font-extrabold">
                      {adminDirectory.students?.length || 0}
                    </span>
                  </button>

                  <button
                    onClick={() => { setAdminDirectoryTab('TEACHERS'); setAdminDirectorySearch(''); }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      adminDirectoryTab === 'TEACHERS'
                        ? 'bg-white text-purple-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Teachers</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-50 text-purple-700 font-extrabold">
                      {adminDirectory.teachers?.length || 0}
                    </span>
                  </button>
                </div>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={adminDirectorySearch}
                    onChange={(e) => setAdminDirectorySearch(e.target.value)}
                    placeholder={
                      adminDirectoryTab === 'STUDENTS'
                        ? "Search by student, parent, school, phone..."
                        : "Search by teacher name, subject, phone..."
                    }
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  {adminDirectoryTab === 'STUDENTS' ? (
                    <select
                      value={adminDirectoryGradeFilter}
                      onChange={(e) => setAdminDirectoryGradeFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white"
                    >
                      <option value="ALL">All Standards (LKG–12th)</option>
                      <option value="PRE_PRIMARY">LKG – UKG</option>
                      <option value="PRIMARY">Grade 1 – 5</option>
                      <option value="MIDDLE">Grade 6 – 7</option>
                      <option value="GRADE8">Grade 8 – 9</option>
                      <option value="GRADE10">Grade 10</option>
                      <option value="GRADE12">Grade 11 – 12</option>
                    </select>
                  ) : (
                    <select
                      value={adminDirectorySubjectFilter}
                      onChange={(e) => setAdminDirectorySubjectFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:bg-white"
                    >
                      <option value="ALL">All Subjects</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                    </select>
                  )}

                  <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">
                    Showing {adminDirectoryTab === 'STUDENTS' ? filteredDirectoryStudents.length : filteredDirectoryTeachers.length} results
                  </span>
                </div>
              </div>

              {/* TABLE 1: STUDENTS DIRECTORY */}
              {adminDirectoryTab === 'STUDENTS' && (
                <div className="overflow-x-auto">
                  {filteredDirectoryStudents.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                      No matching students found in directory.
                    </div>
                  ) : (
                    <>
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-400">
                          <th className="py-2.5">Student & School</th>
                          <th className="py-2.5">Standard & Rate</th>
                          <th className="py-2.5">Student Contact</th>
                          <th className="py-2.5">Parent / Guardian</th>
                          <th className="py-2.5">Attended Hours</th>
                          <th className="py-2.5">Billing Accrual</th>
                          <th className="py-2.5 text-right pr-2">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginateItems(filteredDirectoryStudents, directoryPage).pagedItems.map((student) => (
                          <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                                  {student.name.charAt(0)}
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 text-xs block">{student.name}</span>
                                  <span className="text-[11px] text-slate-400 block truncate max-w-[150px]">
                                    {student.schoolName || 'High School'}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 text-xs">
                              <span className="font-semibold text-slate-800 block">{student.grade}</span>
                              <span className="text-[11px] text-indigo-600 font-bold block">₹{student.hourlyRate} per hour</span>
                            </td>
                            <td className="py-3 text-xs">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1 text-slate-700 font-mono text-[11px]">
                                  <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span>{student.phone}</span>
                                </div>
                                <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate max-w-[140px]">{student.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 text-xs">
                              <div className="space-y-0.5">
                                <span className="font-semibold text-slate-800 block">{student.parentName || 'N/A'}</span>
                                {student.parentPhone && student.parentPhone !== 'N/A' && (
                                  <a
                                    href={`https://wa.me/${student.parentPhone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                    <span>{student.parentPhone}</span>
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="py-3 text-xs">
                              <span className="font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">
                                {student.attendedHours} hrs
                              </span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                {student.completedSessions} classes attended
                              </span>
                            </td>
                            <td className="py-3 text-xs">
                              <div className="font-extrabold text-slate-900">
                                ₹{student.totalFeeDue.toLocaleString('en-IN')}
                              </div>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                student.totalFeeDue > 0
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {student.totalFeeDue > 0 ? 'Payment due' : 'No amount due'}
                              </span>
                            </td>
                            <td className="py-3 text-xs text-right pr-2">
                              <button
                                onClick={() => handleDeleteDirectoryUser(student.id, student.name)}
                                title="Remove student from directory"
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {renderPaginationBar(paginateItems(filteredDirectoryStudents, directoryPage), setDirectoryPage)}
                  </>
                  )}
                </div>
              )}

              {/* TABLE 2: TEACHERS DIRECTORY */}
              {adminDirectoryTab === 'TEACHERS' && (
                <div className="overflow-x-auto">
                  {filteredDirectoryTeachers.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                      No matching teachers found in directory.
                    </div>
                  ) : (
                    <>
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-400">
                          <th className="py-2.5">Teacher & Department</th>
                          <th className="py-2.5">Contact Details</th>
                          <th className="py-2.5">Classes Delivered</th>
                          <th className="py-2.5">Teacher Payment</th>
                          <th className="py-2.5 text-right pr-2">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginateItems(filteredDirectoryTeachers, directoryPage).pagedItems.map((teacher) => (
                          <tr key={teacher.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                                  {teacher.name.charAt(0)}
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 text-xs block">{teacher.name}</span>
                                  <span className="text-[11px] text-purple-700 font-semibold block">
                                    {teacher.subject}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 text-xs">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1 text-slate-700 font-mono text-[11px]">
                                  <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span>{teacher.phone}</span>
                                </div>
                                <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate max-w-[140px]">{teacher.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 text-xs">
                              <span className="font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 inline-block">
                                {teacher.totalHoursTaken} hrs
                              </span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                {teacher.classesTaken} classes taken
                              </span>
                              <div className="mt-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${
                                  (teacher.complianceRate ?? 100) >= 80 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                    : (teacher.complianceRate ?? 100) >= 50 
                                    ? 'bg-amber-50 text-amber-700 border-amber-200' 
                                    : 'bg-red-50 text-red-700 border-red-200'
                                }`}>
                                  <span>{(teacher.complianceRate ?? 100) >= 80 ? '✓' : '⚠️'}</span>
                                  <span>{teacher.complianceRate ?? 100}% Proof</span>
                                </span>
                              </div>
                            </td>
                            <td className="py-3 text-xs">
                              <div className="font-extrabold text-slate-900">
                                ₹{teacher.accruedPayout.toLocaleString('en-IN')}
                              </div>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Payment Recorded
                              </span>
                            </td>
                            <td className="py-3 text-xs text-right pr-2">
                              <button
                                onClick={() => handleDeleteDirectoryUser(teacher.id, teacher.name)}
                                title="Remove teacher from directory"
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {renderPaginationBar(paginateItems(filteredDirectoryTeachers, directoryPage), setDirectoryPage)}
                  </>
                  )}
                </div>
              )}
            </div>

            )}

            {/* Tab 5: Academy Financial Economics & Profit Margin Simulator */}
            {activeTab === 'SIMULATOR' && (
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-bold text-white">Academy Revenue & Share Simulator</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tool to project monthly revenues, teacher payments, and academy share.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-white/10 text-indigo-200 rounded-full border border-white/10 self-start sm:self-auto">
                  Executive Dashboard
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Controls */}
                <div className="space-y-4 md:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Standard / Grade</label>
                      <select 
                        value={adminSimGrade}
                        onChange={(e) => setAdminSimGrade(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white"
                      >
                        <option value="prePrimary" className="bg-slate-900 text-white">LKG – UKG (₹250 / ₹150)</option>
                        <option value="primary" className="bg-slate-900 text-white">Grade 1 – 5 (₹300 / ₹180)</option>
                        <option value="middle" className="bg-slate-900 text-white">Grade 6 – 7 (₹320 / ₹200)</option>
                        <option value="grade8" className="bg-slate-900 text-white">Grade 8 – 9 (₹350 / ₹220)</option>
                        <option value="grade10" className="bg-slate-900 text-white">Grade 10 (₹400 / ₹250)</option>
                        <option value="grade12" className="bg-slate-900 text-white">Grade 11 – 12 (₹600 / ₹350)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        Hours / Month ({adminSimHours} hrs)
                      </label>
                      <input 
                        type="range"
                        min="4"
                        max="32"
                        step="2"
                        value={adminSimHours}
                        onChange={(e) => setAdminSimHours(Number(e.target.value))}
                        className="w-full accent-indigo-400 mt-1.5"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        Active Students ({adminSimStudents})
                      </label>
                      <input 
                        type="range"
                        min="5"
                        max="100"
                        step="5"
                        value={adminSimStudents}
                        onChange={(e) => setAdminSimStudents(Number(e.target.value))}
                        className="w-full accent-indigo-400 mt-1.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Gross Revenue</span>
                      <strong className="text-base text-white font-extrabold mt-0.5 block">
                        ₹{simTotalRev.toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Teacher Payments</span>
                      <strong className="text-base text-rose-300 font-extrabold mt-0.5 block">
                        ₹{simTotalPay.toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-emerald-300 text-[10px] uppercase font-bold block">Academy Share</span>
                      <strong className="text-base text-emerald-400 font-extrabold mt-0.5 block">
                        {simMarginPct}% Margin
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Net Profit Big Badge */}
                <div className="p-5 rounded-2xl bg-white/10 border border-white/15 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-extrabold tracking-wider text-emerald-300 uppercase block">
                    Academy Share
                  </span>
                  <div className="text-3xl font-black text-emerald-400 mt-1">
                    +₹{simNetProfit.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-slate-300 mt-1 block">
                    Monthly academy share after teacher payments
                  </span>
                </div>

              </div>
            </div>

            )}

            {/* Tab 4: Academy Class Logs Audit with Search & Filters */}
            {activeTab === 'LOGS_AUDIT' && (() => {
              const totalLogsCount = classLogs.length;
              const verifiedLogsCount = classLogs.filter(l => Boolean(l.recordingUrl || sessions.find(s => s.id === l.sessionId)?.recordingUrl)).length;
              const missingLogsCount = totalLogsCount - verifiedLogsCount;
              const overallCompliancePct = totalLogsCount > 0 ? Math.round((verifiedLogsCount / totalLogsCount) * 100) : 100;

              return (
                <div className="space-y-6">
                  {/* KPI Cards: Quality & Proof Audit Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Lectures Delivered</span>
                        <div className="text-2xl font-black text-slate-900 mt-1">{totalLogsCount}</div>
                        <span className="text-xs text-slate-500 mt-0.5 block">Recorded class logs</span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                        <FileText className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Lecture Proof Verified</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-2xl font-black text-emerald-600">{overallCompliancePct}%</span>
                          <span className="text-xs font-semibold text-slate-500">({verifiedLogsCount}/{totalLogsCount})</span>
                        </div>
                        <span className="text-xs text-slate-500 mt-0.5 block">Recordings available for review</span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Missing Proof Flagged</span>
                        <div className="text-2xl font-black text-rose-600 mt-1">{missingLogsCount}</div>
                        <span className="text-xs text-slate-500 mt-0.5 block">Classes lacking video proof</span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Audit Console Card */}
                  <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-indigo-600" />
                          Owner Lecture Quality &amp; Class Logs Audit
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Audit video recordings, syllabus delivery, and teacher compliance to resolve parent concerns.</p>
                      </div>

                      {/* Filter and Search Bar */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input 
                            type="text" 
                            placeholder="Search teacher, student, topic..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs w-52 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>

                        <select 
                          value={auditProofFilter} 
                          onChange={(e) => setAuditProofFilter(e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="ALL">All Proof Status</option>
                          <option value="RECORDED">🟢 Recorded &amp; Verified</option>
                          <option value="MISSING">🔴 Missing Proof</option>
                        </select>

                        <select 
                          value={gradeFilter} 
                          onChange={(e) => setGradeFilter(e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="ALL">All Standards (LKG–12th)</option>
                          <option value="PRE_PRIMARY">LKG – UKG</option>
                          <option value="PRIMARY">Grade 1 – 5</option>
                          <option value="MIDDLE">Grade 6 – 7</option>
                          <option value="GRADE8">Grade 8 – 9</option>
                          <option value="GRADE10">Grade 10</option>
                          <option value="GRADE12">Grade 11 – 12</option>
                        </select>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                            <th className="py-2.5">Date &amp; Time</th>
                            <th className="py-2.5">Teacher / Faculty</th>
                            <th className="py-2.5">Student &amp; Grade</th>
                            <th className="py-2.5">Syllabus &amp; Topics</th>
                            <th className="py-2.5">Duration</th>
                            <th className="py-2.5">Proof Status</th>
                            <th className="py-2.5 text-right pr-2">Owner Quality Audit</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredLogs.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                                No lectures match your search and filter criteria.
                              </td>
                            </tr>
                          ) : (
                            paginateItems(filteredLogs, auditPage).pagedItems.map((log) => {
                              const recUrl = log.recordingUrl || sessions.find(s => s.id === log.sessionId)?.recordingUrl;
                              const sessionObj = sessions.find(s => s.id === log.sessionId) || { id: log.sessionId, recordingUrl: recUrl };
                              const videoInfo = getEmbeddableVideoUrl(recUrl);

                              const ratePair = resolveGradeRatePair(log.grade);
                              const studentRate = ratePair.studentHourlyRate;
                              const teacherRate = ratePair.teacherHourlyRate;
                              const studentCharge = Math.round(log.billableHours * studentRate);
                              const teacherPay = Math.round(log.billableHours * teacherRate);

                              return (
                                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                                  <td className="py-3 text-xs">
                                    <div className="font-semibold text-slate-800">{log.date}</div>
                                    <div className="text-[10px] text-slate-400">{log.time || 'Completed Class'}</div>
                                  </td>
                                  <td className="py-3 text-xs">
                                    <div className="font-bold text-slate-900">{log.teacherName}</div>
                                    <div className="text-[10px] text-slate-400">Faculty</div>
                                  </td>
                                  <td className="py-3 text-xs">
                                    <span className="font-bold text-slate-800">{log.studentName}</span>
                                    <span className="text-slate-400 ml-1">({log.grade})</span>
                                  </td>
                                  <td className="py-3 text-xs max-w-xs">
                                    <span className="font-bold text-slate-800 block">{log.subject}</span>
                                    <div className="text-[11px] text-slate-500 truncate" title={log.topicsCovered}>
                                      {log.topicsCovered || 'No topics noted'}
                                    </div>
                                  </td>
                                  <td className="py-3 text-xs">
                                    <div className="font-bold text-indigo-600">{log.billableHours} hrs</div>
                                    <div className="text-[10px] text-slate-400">₹{studentCharge} billed / ₹{teacherPay} pay</div>
                                  </td>
                                  <td className="py-3 text-xs">
                                    {recUrl ? (
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <span>Verified ({videoInfo?.type === 'FATHOM' ? 'Fathom AI' : videoInfo?.type === 'YOUTUBE' ? 'YouTube' : 'Video'})</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                        <AlertCircle className="w-3 h-3 text-rose-500" />
                                        <span>Missing Proof</span>
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3 text-xs text-right pr-2">
                                    {recUrl ? (
                                      <a
                                        href={recUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
                                      >
                                        <Play className="w-3.5 h-3.5 fill-current" />
                                        <span>Audit Lecture ↗</span>
                                      </a>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleOpenEditRecording(sessionObj)}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-indigo-600 border border-slate-200 hover:border-indigo-300 bg-white hover:bg-indigo-50/50 transition-all"
                                      >
                                        <Plus className="w-3 h-3" />
                                        <span>Attach Link</span>
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                      {renderPaginationBar(paginateItems(filteredLogs, auditPage), setAuditPage)}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Tab: Automated Monthly Fee Invoicing & Teacher Payroll (Issue #6) */}
            {activeTab === 'BILLING' && (() => {
              const totalInv = billingSummary?.totalInvoiced ?? adminInvoices.reduce((s, i) => s + i.totalAmount, 0);
              const totalCol = billingSummary?.totalCollected ?? adminInvoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.totalAmount, 0);
              const totalOut = billingSummary?.totalOutstanding ?? adminInvoices.filter(i => i.status === 'UNPAID').reduce((s, i) => s + i.totalAmount, 0);
              const totalPay = billingSummary?.totalPayroll ?? adminPayroll.reduce((s, p) => s + p.totalPayoutAmount, 0);

              const filteredInvoices = adminInvoices.filter(inv => {
                const q = invoiceSearchQuery.toLowerCase().trim();
                const matchesSearch = !q ||
                  inv.studentName?.toLowerCase().includes(q) ||
                  inv.parentName?.toLowerCase().includes(q) ||
                  inv.grade?.toLowerCase().includes(q) ||
                  inv.invoiceNumber?.toLowerCase().includes(q);

                const matchesStatus = 
                  invoiceStatusFilter === 'ALL' ||
                  inv.status?.toUpperCase() === invoiceStatusFilter.toUpperCase();

                return matchesSearch && matchesStatus;
              });

              const filteredPayroll = adminPayroll.filter(p => {
                const q = invoiceSearchQuery.toLowerCase().trim();
                return !q ||
                  p.teacherName?.toLowerCase().includes(q) ||
                  p.subject?.toLowerCase().includes(q) ||
                  p.payrollNumber?.toLowerCase().includes(q);
              });

              return (
                <div className="space-y-6 animate-fadeIn">
                  {/* Top Executive KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Fees Invoiced</span>
                        <div className="text-2xl font-black text-slate-900 mt-1">₹{totalInv.toLocaleString('en-IN')}</div>
                        <span className="text-xs text-slate-500 mt-0.5 block">{adminInvoices.length} Student invoices</span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                        <FileText className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Fees Collected</span>
                        <div className="text-2xl font-black text-emerald-600 mt-1">₹{totalCol.toLocaleString('en-IN')}</div>
                        <span className="text-xs text-slate-500 mt-0.5 block">{adminInvoices.filter(i => i.status === 'PAID').length} Invoices settled (Paid)</span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Outstanding Due</span>
                        <div className="text-2xl font-black text-rose-600 mt-1">₹{totalOut.toLocaleString('en-IN')}</div>
                        <span className="text-xs text-slate-500 mt-0.5 block">{adminInvoices.filter(i => i.status === 'UNPAID').length} Pending collection</span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Teacher Payroll</span>
                        <div className="text-2xl font-black text-purple-600 mt-1">₹{totalPay.toLocaleString('en-IN')}</div>
                        <span className="text-xs text-slate-500 mt-0.5 block">{adminPayroll.length} Faculty payouts accrued</span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                        <Users className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Billing Module Console Card */}
                  <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                    {/* Header & Sub-Tab Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-indigo-600" />
                          Automated Fee Invoicing &amp; Teacher Payroll
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Calculated automatically from verified teaching hours: Hours &times; Grade Standard Rates.</p>
                      </div>

                      {/* Billing Period Picker + Sub-tab Switcher */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <select
                          aria-label="Admin Billing Period"
                          value={`${billingYear}-${String(billingMonth).padStart(2, '0')}`}
                          onChange={(e) => handleBillingPeriodChange(e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          {billingMonthOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>

                        <div className="flex items-center p-1 bg-slate-100 rounded-xl">
                        <button
                          onClick={() => setBillingSubTab('INVOICES')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            billingSubTab === 'INVOICES'
                              ? 'bg-white text-indigo-700 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <span>Student Fee Invoices</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            billingSubTab === 'INVOICES' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {adminInvoices.length}
                          </span>
                        </button>
                        <button
                          onClick={() => setBillingSubTab('PAYROLL')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            billingSubTab === 'PAYROLL'
                              ? 'bg-white text-indigo-700 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <span>Teacher Payroll Report</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            billingSubTab === 'PAYROLL' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {adminPayroll.length}
                          </span>
                        </button>
                      </div>
                      </div>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder={billingSubTab === 'INVOICES' ? 'Search student, parent, invoice...' : 'Search teacher or subject...'}
                          value={invoiceSearchQuery}
                          onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                          className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs w-60 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      {billingSubTab === 'INVOICES' && (
                        <div className="flex items-center gap-2">
                          <select
                            value={invoiceStatusFilter}
                            onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="ALL">All Invoices</option>
                            <option value="PAID">🟢 Paid Invoices</option>
                            <option value="UNPAID">🔴 Unpaid / Due</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Content: Student Invoices Table */}
                    {billingSubTab === 'INVOICES' && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                              <th className="py-2.5">Invoice #</th>
                              <th className="py-2.5">Student &amp; Grade</th>
                              <th className="py-2.5">Parent Contact</th>
                              <th className="py-2.5">Attended Hours</th>
                              <th className="py-2.5">Rate / Hour</th>
                              <th className="py-2.5">Total Amount</th>
                              <th className="py-2.5">Payment Status</th>
                              <th className="py-2.5 text-right pr-2">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredInvoices.length === 0 ? (
                              <tr>
                                <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                                  No invoices match your search or filter.
                                </td>
                              </tr>
                            ) : (
                              paginateItems(filteredInvoices, billingPage).pagedItems.map((inv) => (
                                <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                                  <td className="py-3 text-xs">
                                    <div className="font-bold text-slate-900 font-mono">{inv.invoiceNumber}</div>
                                    <div className="text-[10px] text-slate-400">{inv.monthName}</div>
                                  </td>
                                  <td className="py-3 text-xs">
                                    <div className="font-bold text-slate-800">{inv.studentName}</div>
                                    <div className="text-[10px] text-slate-500">{inv.grade}</div>
                                  </td>
                                  <td className="py-3 text-xs">
                                    <div className="font-medium text-slate-700">{inv.parentName}</div>
                                    <div className="text-[10px] text-slate-400">{inv.parentPhone || inv.studentPhone}</div>
                                  </td>
                                  <td className="py-3 text-xs">
                                    <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                                      {inv.attendedHours} hrs
                                    </span>
                                    <span className="text-[10px] text-slate-400 block mt-0.5">{inv.completedClassesCount} classes</span>
                                  </td>
                                  <td className="py-3 text-xs font-semibold text-slate-600">
                                    ₹{inv.hourlyRate}/hr
                                  </td>
                                  <td className="py-3 text-xs font-extrabold text-slate-900">
                                    ₹{inv.totalAmount.toLocaleString('en-IN')}
                                  </td>
                                  <td className="py-3 text-xs">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                      inv.status === 'PAID'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-rose-50 text-rose-700 border-rose-200'
                                    }`}>
                                      <span className={`w-1.5 h-1.5 rounded-full ${inv.status === 'PAID' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                      <span>{inv.status === 'PAID' ? 'Paid' : 'Unpaid / Due'}</span>
                                    </span>
                                    {inv.status === 'PAID' && inv.razorpayPaymentId && (
                                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{inv.razorpayPaymentId}</div>
                                    )}
                                  </td>
                                  <td className="py-3 text-xs text-right pr-2">
                                    <button
                                      type="button"
                                      onClick={() => { setSelectedInvoiceModal(inv); setIsInvoiceModalOpen(true); }}
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all shadow-xs"
                                    >
                                      <FileText className="w-3.5 h-3.5" />
                                      <span>View Invoice</span>
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                        {renderPaginationBar(paginateItems(filteredInvoices, billingPage), setBillingPage)}
                      </div>
                    )}

                    {/* Content: Teacher Payroll Table */}
                    {billingSubTab === 'PAYROLL' && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                              <th className="py-2.5">Payroll #</th>
                              <th className="py-2.5">Teacher / Faculty</th>
                              <th className="py-2.5">Subject Department</th>
                              <th className="py-2.5">Classes Delivered</th>
                              <th className="py-2.5">Taught Hours</th>
                              <th className="py-2.5">Payout Rate</th>
                              <th className="py-2.5">Total Accrued Payout</th>
                              <th className="py-2.5 text-right pr-2">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredPayroll.length === 0 ? (
                              <tr>
                                <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                                  No teacher payroll records match your search.
                                </td>
                              </tr>
                            ) : (
                              paginateItems(filteredPayroll, billingPage).pagedItems.map((pay) => (
                                <tr key={pay.id} className="hover:bg-slate-50/60 transition-colors">
                                  <td className="py-3 text-xs font-mono font-bold text-slate-900">
                                    {pay.payrollNumber}
                                  </td>
                                  <td className="py-3 text-xs">
                                    <div className="font-bold text-slate-900">{pay.teacherName}</div>
                                    <div className="text-[10px] text-slate-400">{pay.teacherPhone || pay.teacherEmail}</div>
                                  </td>
                                  <td className="py-3 text-xs">
                                    <span className="font-medium text-slate-800">{pay.subject}</span>
                                  </td>
                                  <td className="py-3 text-xs font-bold text-slate-700">
                                    {pay.classesCount} classes
                                  </td>
                                  <td className="py-3 text-xs">
                                    <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                                      {pay.taughtHours} hrs
                                    </span>
                                  </td>
                                  <td className="py-3 text-xs text-slate-600 font-medium">
                                    ₹250 - ₹350/hr
                                  </td>
                                  <td className="py-3 text-xs font-extrabold text-emerald-600 text-sm">
                                    ₹{pay.totalPayoutAmount.toLocaleString('en-IN')}
                                  </td>
                                  <td className="py-3 text-xs text-right pr-2">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                      <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                      <span>Calculated</span>
                                    </span>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                        {renderPaginationBar(paginateItems(filteredPayroll, billingPage), setBillingPage)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Tab 6: Configurable Grade Rate Cards Matrix */}
            {activeTab === 'RATES' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Grade Fee Rates</h3>
                  <p className="text-xs text-slate-500">Student fee rates and teacher rates vary by grade.</p>
                </div>
                <button 
                  onClick={openAddGradeModal}
                  className="text-xs px-3.5 py-2 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Grade Rate
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                      <th className="py-2.5">Grade / Standard</th>
                      <th className="py-2.5">Student Fee Rate</th>
                      <th className="py-2.5">Teacher Rate</th>
                      <th className="py-2.5">Academy Share</th>
                      <th className="py-2.5 text-right pr-2">Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {grades.map((g) => {
                      const margin = g.studentHourlyRate - g.teacherHourlyRate;
                      const marginPercent = g.studentHourlyRate > 0 ? Math.round((margin / g.studentHourlyRate) * 100) : 0;
                      return (
                        <tr key={g.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 font-semibold text-slate-800">{g.name}</td>
                          <td className="py-3 text-indigo-600 font-bold">₹{g.studentHourlyRate} per hour</td>
                          <td className="py-3 text-slate-500">₹{g.teacherHourlyRate} per hour</td>
                          <td className="py-3 text-emerald-600 font-semibold">+₹{margin} per hour ({marginPercent}%)</td>
                          <td className="py-3 text-right pr-2">
                            <button
                              type="button"
                              onClick={() => openEditGradeModal(g)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit Rate</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            )}

          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 mt-12">
          <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>TuitionHub Academy &bull; Private Portal</span>
            <span className="text-emerald-600 font-semibold">● Class Logging & Attendance Active</span>
          </div>
        </footer>

      </main>
    </div>

      {/* 👤 ROLE-BASED USER PROFILE MODAL & EDITOR */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-sm ${
                  role === 'ADMIN' ? 'bg-purple-600' :
                  role === 'TEACHER' ? 'bg-blue-600' : 'bg-emerald-600'
                }`}>
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{user.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      role === 'TEACHER' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {role} Profile
                    </span>
                    <span className="text-xs text-slate-400">&bull; {user.emailOrPhone}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              
              {/* Common Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* 👩‍🎓 Student Role Specific Profile Fields */}
              {role === 'STUDENT' && (
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
                  <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center justify-between">
                    <span>Academic & Parent Details</span>
                    <span className="text-xs font-black text-emerald-700">Fee rate: ₹{user.hourlyRate || 400} per hour</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Enrolled Grade</label>
                      <input
                        type="text"
                        readOnly
                        value={user.grade || 'Grade 10'}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-100/80 text-slate-600"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">School / Institution</label>
                      <input
                        type="text"
                        value={profileSchoolName}
                        onChange={(e) => setProfileSchoolName(e.target.value)}
                        placeholder="e.g. Delhi Public School"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Parent / Guardian Name</label>
                      <input
                        type="text"
                        value={profileParentName}
                        onChange={(e) => setProfileParentName(e.target.value)}
                        placeholder="e.g. Mr. Rajesh Sharma"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Parent Contact Number</label>
                      <input
                        type="tel"
                        value={profileParentPhone}
                        onChange={(e) => setProfileParentPhone(e.target.value)}
                        placeholder="+91 91234 56789"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 👨‍🏫 Teacher Role Specific Profile Fields */}
              {role === 'TEACHER' && (
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
                  <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center justify-between">
                    <span>Teacher Details & Payment Account</span>
                    <span className="text-xs font-black text-blue-700">Teacher rate: ₹{user.hourlyRate || 250} per hour</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Primary Subject Taught</label>
                      <input
                        type="text"
                        value={profileSubject}
                        onChange={(e) => setProfileSubject(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Educational Qualification</label>
                      <input
                        type="text"
                        value={profileQualification}
                        onChange={(e) => setProfileQualification(e.target.value)}
                        placeholder="e.g. M.Sc. Mathematics, B.Ed"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Bank or UPI for Payments</label>
                    <input
                      type="text"
                      value={profileBankAccount}
                      onChange={(e) => setProfileBankAccount(e.target.value)}
                      placeholder="e.g. HDFC Bank •••• 4892 (or UPI ID teacher@okaxis)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-mono"
                    />
                  </div>
                </div>
              )}

              {/* 👑 Admin Role Specific Profile Fields */}
              {role === 'ADMIN' && (
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
                  <div className="text-[11px] font-bold text-purple-900 uppercase tracking-wider">
                    Admin Role & Organization
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Administrative Role</label>
                    <input
                      type="text"
                      value={profileDesignation}
                      onChange={(e) => setProfileDesignation(e.target.value)}
                      placeholder="e.g. Operations Director / Academic Coordinator"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1 text-[11px] text-slate-500">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="block font-bold text-slate-800">204 Students</span>
                      <span>Under Active Administration</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="block font-bold text-slate-800">14 Dedicated Teachers</span>
                      <span>Assigned to 1-on-1 Classes</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 📄 Modal: Official Academy Fee Receipt (Student Portal) */}
      {isReceiptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">TuitionHub Coaching Academy</h3>
                  <span className="text-[10px] text-indigo-700 font-mono font-semibold">
                    Monthly Fee Receipt &bull; {myStudentInvoice?.invoiceNumber || `#INV-${billingYear}${String(billingMonth).padStart(2, '0')}-001`}
                  </span>
                </div>
              </div>
              <button onClick={() => setIsReceiptModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-slate-50">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Billed To Student</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{user?.name || 'Student'}</span>
                  <span className="text-slate-500">{user?.grade || 'Grade 10'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Billing Period</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{selectedBillingPeriodLabel}</span>
                  <span className={`font-bold px-2 py-0.5 rounded border text-[10px] inline-block mt-1 ${
                    paidRecord 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'text-amber-800 bg-amber-50 border-amber-200'
                  }`}>
                    {paidRecord ? `Status: PAID (${paidRecord.paymentId})` : 'Status: Payment due'}
                  </span>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="py-2 px-3">Subject / Description</th>
                      <th className="py-2 px-3">Attended</th>
                      <th className="py-2 px-3">Rate</th>
                      <th className="py-2 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {classLogs.filter(l => l.isStudentPresent).length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-4 px-3 text-center text-slate-400 italic">
                          No attended classes recorded for this billing cycle. Total due: ₹0.
                        </td>
                      </tr>
                    ) : (
                      classLogs.filter(l => l.isStudentPresent).map((log) => {
                        const durHours = log.durationMinutes ? Number((log.durationMinutes / 60).toFixed(2)) : (log.billableHours || 0);
                        const rate = user?.hourlyRate || 400;
                        const lineAmount = Math.round(durHours * rate);
                        return (
                          <tr key={log.id}>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">
                              {log.subject} ({log.topicsCovered ? (log.topicsCovered.length > 25 ? log.topicsCovered.slice(0, 25) + '...' : log.topicsCovered) : '1-on-1 Class'})
                            </td>
                            <td className="py-2.5 px-3">{durHours} hrs</td>
                            <td className="py-2.5 px-3">₹{rate} per hour</td>
                            <td className="py-2.5 px-3 text-right font-bold">₹{lineAmount}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                    <tr>
                      <td colSpan="3" className="py-2 px-3 text-slate-700">
                        Total Attended Hours ({Number((monthlyHours ?? 0).toFixed(2))} hrs):
                      </td>
                      <td className="py-2 px-3 text-right text-indigo-600 font-black text-sm">
                        ₹{Math.round(Number((monthlyHours ?? 0).toFixed(2)) * (user?.hourlyRate || 400)).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-medium flex items-center justify-between text-[11px]">
                <span>
                  {paidRecord 
                    ? `Paid via Razorpay Test Gateway • ID: ${paidRecord.paymentId} (${paidRecord.paidAt})` 
                    : 'Payment: Direct UPI / Bank Transfer (+91 98000 00000) • Razorpay Test Gateway Available'}
                </span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                  paidRecord ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}>
                  {paidRecord ? 'PAID' : 'Monthly Fee Bill'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button 
                onClick={() => setIsReceiptModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button 
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📄 Official Itemized Invoice Modal for Admin */}
      {isInvoiceModalOpen && selectedInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">TuitionHub Coaching Academy</h3>
                  <span className="text-[10px] text-indigo-700 font-mono font-semibold">Official Student Fee Invoice</span>
                </div>
              </div>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Invoice To Student</span>
                  <span className="font-bold text-slate-900 text-sm block mt-0.5">{selectedInvoiceModal.studentName}</span>
                  <span className="text-slate-500 block">{selectedInvoiceModal.grade}</span>
                  <span className="text-slate-400 text-[11px] block mt-1">Parent: {selectedInvoiceModal.parentName} ({selectedInvoiceModal.parentPhone || 'Phone on file'})</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Invoice Number</span>
                  <span className="font-mono font-bold text-slate-900 text-sm block mt-0.5">{selectedInvoiceModal.invoiceNumber}</span>
                  <span className="text-slate-500 block">Period: {selectedInvoiceModal.monthName}</span>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                      selectedInvoiceModal.status === 'PAID'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}>
                      {selectedInvoiceModal.status === 'PAID' ? '✓ STATUS: PAID' : '⚠️ STATUS: UNPAID / DUE'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Service Description</th>
                      <th className="py-2.5 px-3">Attended Hours</th>
                      <th className="py-2.5 px-3">Hourly Rate</th>
                      <th className="py-2.5 px-3 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">1-on-1 Academic Tuition &amp; Mentorship</div>
                        <div className="text-[10px] text-slate-400">{selectedInvoiceModal.completedClassesCount} verified classes completed</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">
                        {selectedInvoiceModal.attendedHours} hrs
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">
                        ₹{selectedInvoiceModal.hourlyRate}
                      </td>
                      <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                        ₹{selectedInvoiceModal.totalAmount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-900 block">Net Fee Amount Due</span>
                  <span className="text-[11px] text-indigo-700">Calculated strictly as Attended Hours &times; Standard Rate</span>
                </div>
                <div className="text-xl font-black text-indigo-700">
                  ₹{selectedInvoiceModal.totalAmount.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Schedule 1-on-1 Class */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Schedule 1-on-1 Class</h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Student</label>
                {enrolledStudents.length === 0 ? (
                  <input 
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter student full name"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                  />
                ) : (
                  <select 
                    value={selectedStudentId} 
                    onChange={(e) => {
                      const sid = e.target.value;
                      setSelectedStudentId(sid);
                      const s = enrolledStudents.find(item => item.id === sid || item.userId === sid);
                      if (s) setStudentName(s.name);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-medium"
                  >
                    {enrolledStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.grade})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                  <input 
                    type="text" 
                    required 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Topic</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Linear Equations" 
                    value={topic} 
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" 
                  />
                </div>
              </div>

              {scheduleTimeError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{scheduleTimeError}</span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Date</label>
                  <input 
                    type="date" 
                    required 
                    value={classDate} 
                    onChange={(e) => setClassDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Start Time</label>
                  <input 
                    type="time" 
                    required 
                    value={startTime} 
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">End Time</label>
                  <input 
                    type="time" 
                    required 
                    value={endTime} 
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" 
                  />
                </div>
              </div>

              {(() => {
                const schedDur = computeDurationInfo(startTime, endTime);
                return schedDur.isValid ? (
                  <div className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Calculated Duration: {schedDur.hours} hrs ({schedDur.minutes} minutes)</span>
                  </div>
                ) : null;
              })()}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Google Meet Link</label>
                <input 
                  type="url" 
                  required 
                  placeholder="https://meet.google.com/..." 
                  value={meetLink} 
                  onChange={(e) => setMeetLink(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-xs" 
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Grade Rate Card */}
      {isGradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                {editingGradeId ? 'Update Grade Rate Card' : 'Add Grade Rate Card'}
              </h3>
              <button onClick={() => setIsGradeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGrade} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Grade Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Grade 11 (Commerce)" 
                  value={newGradeName} 
                  onChange={(e) => setNewGradeName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Student Fee Rate (₹ per hour)</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="e.g. 500" 
                    value={newStudentRate} 
                    onChange={(e) => setNewStudentRate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Teacher Rate (₹ per hour)</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="e.g. 300" 
                    value={newTeacherRate} 
                    onChange={(e) => setNewTeacherRate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" 
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsGradeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100"
                >
                  Save Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* 💳 RAZORPAY TEST ACCOUNT CHECKOUT MODAL (STUDENT ROLE DEMO) */}
      {isRazorpayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden relative">
            
            {/* Razorpay Modal Brand Header */}
            <div className="bg-[#0c2340] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center font-black text-blue-400 text-lg">
                  R
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base tracking-tight">Razorpay</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-300 border border-blue-400/40">
                      Test Mode
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-300 block">TuitionHub Coaching Academy</span>
                </div>
              </div>

              <button 
                onClick={() => setIsRazorpayModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bill Amount Strip */}
            <div className="bg-slate-50 border-b border-slate-100 px-5 py-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Amount Payable</span>
                <span className="text-xl font-black text-slate-900">
                  ₹{totalPayableFee.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Student</span>
                <span className="text-xs font-bold text-slate-800">{user?.name}</span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRazorpayMethod('CARD')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    razorpayMethod === 'CARD' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRazorpayMethod('UPI')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    razorpayMethod === 'UPI' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>UPI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRazorpayMethod('NETBANKING')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    razorpayMethod === 'NETBANKING' ? 'bg-white shadow-sm text-purple-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>NetBanking</span>
                </button>
              </div>

              {/* Tab 1: Test Card Form */}
              {razorpayMethod === 'CARD' && (
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700">Test Card Number</label>
                      <button
                        type="button"
                        onClick={() => setTestCardNumber('4111 1111 1111 1111')}
                        className="text-[10px] text-blue-600 hover:underline font-semibold"
                      >
                        Auto-fill Test Card
                      </button>
                    </div>
                    <input
                      type="text"
                      value={testCardNumber}
                      onChange={(e) => setTestCardNumber(e.target.value)}
                      placeholder="4111 1111 1111 1111"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50 focus:bg-white focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Expiry</label>
                      <input
                        type="text"
                        value={testCardExpiry}
                        onChange={(e) => setTestCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">CVV</label>
                      <input
                        type="password"
                        value={testCardCvv}
                        onChange={(e) => setTestCardCvv(e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-blue-800 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Razorpay Sandbox: Any future expiry and 3-digit CVV will succeed.</span>
                  </div>
                </div>
              )}

              {/* Tab 2: Test UPI Form */}
              {razorpayMethod === 'UPI' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Virtual Payment Address (VPA)</label>
                    <input
                      type="text"
                      value={testUpiId}
                      onChange={(e) => setTestUpiId(e.target.value)}
                      placeholder="success@razorpay"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-800 space-y-1">
                    <span className="font-bold block">Test VPA: success@razorpay</span>
                    <p className="text-emerald-700">Simulates automatic instant approval via Google Pay / PhonePe sandbox.</p>
                  </div>
                </div>
              )}

              {/* Tab 3: Test NetBanking */}
              {razorpayMethod === 'NETBANKING' && (
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Bank</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['HDFC', 'ICICI', 'SBI', 'Axis Bank'].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setTestBank(bank)}
                        className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                          testBank === bank ? 'border-purple-500 bg-purple-50 text-purple-900' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Pay Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleSimulateRazorpayPayment}
                  className="w-full py-3 rounded-xl bg-[#0c2340] hover:bg-[#132f54] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing Razorpay Test Payment...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-blue-400" />
                      <span>Pay ₹{totalPayableFee.toLocaleString('en-IN')} (Demo Test)</span>
                    </>
                  )}
                </button>
                <span className="text-[10px] text-slate-400 text-center block mt-2">
                  🔒 Secured by Razorpay Sandbox Test Environment &bull; No real money charged
                </span>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 🎬 Theater-Mode Class Recording Player Modal */}
      {selectedRecordingSession && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setSelectedRecordingSession(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Play className="w-5 h-5 fill-indigo-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {selectedRecordingSession.subject}
                    </span>
                    <span className="text-xs text-slate-400">
                      {selectedRecordingSession.date} &bull; {selectedRecordingSession.durationHours || '1.0'} hrs
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-white mt-0.5">
                    {selectedRecordingSession.studentName ? `${selectedRecordingSession.studentName} - ` : ''}{selectedRecordingSession.subject} Revision Class
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedRecordingSession.recordingUrl && (
                  <a
                    href={selectedRecordingSession.recordingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                  >
                    <span>Open in Source Tab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedRecordingSession(null)}
                  className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Close Player"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Player Box (16:9 Aspect Ratio) */}
            <div className="relative w-full bg-black aspect-video flex items-center justify-center overflow-hidden">
              {(() => {
                const embed = getEmbeddableVideoUrl(selectedRecordingSession.recordingUrl);
                if (!embed) {
                  return (
                    <div className="text-center p-6 text-slate-400">
                      <AlertCircle className="w-10 h-10 mx-auto text-amber-400 mb-2" />
                      <p className="text-sm font-semibold">No recording URL available for this class.</p>
                    </div>
                  );
                }

                if (embed.type === 'DIRECT_VIDEO') {
                  return (
                    <video
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                      src={embed.src}
                    >
                      Your browser does not support the video tag.
                    </video>
                  );
                }

                if (embed.type === 'YOUTUBE' || embed.type === 'DRIVE' || embed.type === 'LOOM' || embed.type === 'FATHOM') {
                  return (
                    <iframe
                      src={embed.src}
                      title="Class Recording Player"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  );
                }

                // Fallback generic link
                return (
                  <div className="text-center p-8 text-slate-300 space-y-3">
                    <Video className="w-14 h-14 mx-auto text-indigo-400 stroke-1" />
                    <div>
                      <h4 className="font-bold text-white text-base">External Class Recording</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                        This session recording is hosted on an external service (e.g. Zoom cloud or private meeting drive).
                      </p>
                    </div>
                    <a
                      href={embed.src}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
                    >
                      <span>Watch Recording</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                );
              })()}
            </div>

            {/* Lesson Context Details */}
            <div className="p-5 bg-slate-900/90 border-t border-slate-800 space-y-3 overflow-y-auto">
              
              {/* Special Fathom AI Lesson Insights Card */}
              {(() => {
                const embed = getEmbeddableVideoUrl(selectedRecordingSession.recordingUrl);
                if (embed?.type === 'FATHOM') {
                  return (
                    <div className="p-3.5 rounded-2xl bg-purple-950/60 border border-purple-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-purple-200">Fathom AI Lesson Assistant</span>
                            <span className="text-[10px] font-semibold bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded-full border border-purple-700/50">
                              Chapters &amp; Transcript
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Automated AI meeting notes, searchable student-teacher transcript, and speaker talk-time.
                          </p>
                        </div>
                      </div>
                      <a
                        href={embed.shareUrl || selectedRecordingSession.recordingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto transition-colors shadow-sm"
                      >
                        <span>Open AI Notes &amp; Transcript</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  );
                }
                return null;
              })()}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                    Topics & Concepts Covered
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedRecordingSession.topicsCovered || 'Detailed chapter revision, solved examples, and interactive problem solving.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    Homework & Revision Practice
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedRecordingSession.homeworkAssigned || 'Review class notes and practice notebook problems assigned by teacher.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1">
                <span>Teacher: <strong className="text-slate-200">{selectedRecordingSession.teacherName || 'Academy Faculty'}</strong></span>
                <span>Session ID: <code className="text-[11px] font-mono text-slate-500">{selectedRecordingSession.id}</code></span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 📹 Attach / Edit Class Recording Modal */}
      {isEditRecordingModalOpen && editingSessionForRecording && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsEditRecordingModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {editingSessionForRecording.recordingUrl ? 'Edit Class Recording' : 'Attach Class Recording'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingSessionForRecording.studentName} &bull; {editingSessionForRecording.subject} ({editingSessionForRecording.date})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditRecordingModalOpen(false)}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRecordingUrl} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Class Video Recording URL
                </label>
                <input
                  type="url"
                  value={editRecordingInput}
                  onChange={(e) => setEditRecordingInput(e.target.value)}
                  placeholder="https://fathom.video/share/... or https://drive.google.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Supports Fathom AI, Google Drive, YouTube Unlisted, Zoom Cloud recordings, Loom, or direct MP4 files.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Revision Vault Integration
                </span>
                <p className="text-indigo-800/80 leading-relaxed">
                  Once saved, this video will immediately be available in the student's Class Recordings & Revision Vault for continuous self-study.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                {editingSessionForRecording.recordingUrl ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditRecordingInput('');
                    }}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    Clear Link
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditRecordingModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingRecording}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                  >
                    {isSavingRecording ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Recording</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 🔍 Full-Screen Image Lightbox Modal (Homework Sheets & Notebook Submissions) */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <ImageIcon className="w-4 h-4 text-indigo-600 shrink-0" />
                <h3 className="text-sm font-bold text-slate-900 truncate">{lightboxImage.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-slate-100 flex-1 overflow-auto flex items-center justify-center">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title}
                className="max-w-full max-h-[75vh] object-contain rounded-xl bg-white shadow-sm"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
