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
  MessageSquare
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

  // Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Form states for new session
  const [studentName, setStudentName] = useState('Aryan Sharma');
  const [subject, setSubject] = useState('Mathematics');
  const [topic, setTopic] = useState('');
  const [classDate, setClassDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('18:30');
  const [meetLink, setMeetLink] = useState('https://meet.google.com/new');

  // Form states for new grade rate
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

  // Admin Simulator state (Confidential Executive Tool)
  const [adminSimGrade, setAdminSimGrade] = useState('grade10');
  const [adminSimHours, setAdminSimHours] = useState(12);
  const [adminSimStudents, setAdminSimStudents] = useState(30);

  // Search & Filter state for Admin Ledger
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('ALL');

  // Admin Academy Directory state (Students & Teachers Roster)
  const [adminDirectory, setAdminDirectory] = useState({
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

  // Homework Upload state (Student Portal)
  const [uploadedHomeworkFile, setUploadedHomeworkFile] = useState(null);

  // Feedback state
  const [actionSuccess, setActionSuccess] = useState('');

  // Open Profile Modal and populate fields
  const openProfileModal = () => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      setProfileParentName(user.parentName || '');
      setProfileParentPhone(user.parentPhone || '');
      setProfileSchoolName(user.schoolName || '');
      setProfileSubject(user.subject || 'Mathematics');
      setProfileQualification(user.qualification || '');
      setProfileBankAccount(user.bankAccount || '');
      setProfileDesignation(user.designation || '');
    }
    setIsProfileModalOpen(true);
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
      setActionSuccess('✅ Profile updated successfully!');
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

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setBillingError(null);
    try {
      const [gradesRes, sessionsRes, attendanceRes, logsRes] = await Promise.all([
        axios.get('/api/schedule/grades').catch(() => ({ data: { grades: [] } })),
        axios.get('/api/schedule/sessions').catch(() => ({ data: { sessions: [] } })),
        axios.get('/api/attendance/all').catch(() => ({ data: { attendance: {} } })),
        axios.get('/api/logs/monthly-summary').catch(() => ({ data: { summary: { totalBillableHours: 0, logs: [] } } }))
      ]);

      setGrades(gradesRes.data?.grades || []);
      const loadedSessions = sessionsRes.data?.sessions || [];
      setSessions(loadedSessions);
      setAttendanceRecords(attendanceRes.data?.attendance || {});

      const summary = logsRes.data?.summary || { totalBillableHours: 0, logs: [] };
      setClassLogs(summary.logs || []);
      setMonthlyHours(summary.totalBillableHours !== undefined ? summary.totalBillableHours : 0);

      if (loadedSessions.length > 0) {
        setSelectedSessionId(loadedSessions[0].id);
        setLogStartTime(loadedSessions[0].startTime || '17:00');
        setLogEndTime(loadedSessions[0].endTime || '18:15'); // 75 mins demo standard
      }

      // Fetch full Academy Directory if Admin
      if (user?.role === 'ADMIN') {
        try {
          const adminUsersRes = await axios.get('/api/admin/users').catch(() => ({ data: null }));
          if (adminUsersRes?.data?.success) {
            setAdminDirectory(adminUsersRes.data);
          }
        } catch (e) {
          console.warn('Admin users directory fetch notice:', e);
        }
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
      setActionSuccess(`📡 Meeting link opened at ${res.data.record.linkOpenedDisplay}. Final attendance confirmed by teacher post-class.`);
      setTimeout(() => setActionSuccess(''), 5000);
    } catch (err) {
      console.error('Failed to log meeting link access', err);
      // DO NOT fabricate fake PRESENT state!
      setAttendanceError(`Failed to save meeting link access for "${session.subject}". Server did not respond.`);
      setFailedSessionRetry(session);
    }
  };

  // Retry action if attendance logging failed
  const handleRetryJoinLog = async () => {
    if (!failedSessionRetry) return;
    try {
      const res = await axios.post('/api/attendance/join', { sessionId: failedSessionRetry.id });
      setAttendanceRecords(prev => ({ ...prev, [failedSessionRetry.id]: res.data.record }));
      setActionSuccess(`📡 Meeting link access logged on retry at ${res.data.record.linkOpenedDisplay}.`);
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
        homeworkAssigned: homeworkAssignedText
      };

      const res = await axios.post('/api/logs/submit', payload);
      const newLog = res.data.log;

      setClassLogs(prev => [newLog, ...prev]);
      setMonthlyHours(prev => Number((prev + newLog.billableHours).toFixed(2)));
      setClassLogged(true);
      setActionSuccess(`🎉 Post-class log saved! ${newLog.billableHours} hrs verified for billing.`);
      setTimeout(() => setActionSuccess(''), 5000);
    } catch (err) {
      setLogSubmitError(err.response?.data?.error || 'Failed to submit post-class log. Tap retry to try again.');
    } finally {
      setIsSubmittingLog(false);
    }
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
      const res = await axios.post('/api/schedule/sessions', {
        studentName,
        subject,
        topic,
        date: classDate,
        startTime,
        endTime,
        meetLink
      });
      setSessions([res.data.session, ...sessions]);
      setIsScheduleModalOpen(false);
      setActionSuccess('1-on-1 Class scheduled successfully!');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to schedule class');
    }
  };

  // Cancel a session
  const handleCancelSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to cancel this class? (As per policy, 0 hours will be billed).')) return;
    try {
      const res = await axios.patch(`/api/schedule/sessions/${sessionId}/cancel`);
      setSessions(sessions.map(s => s.id === sessionId ? res.data.session : s));
      setActionSuccess('Class cancelled. ₹0 charged as per policy.');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      alert('Failed to cancel session');
    }
  };

  // Add a new Grade Rate
  const handleCreateGrade = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/schedule/grades', {
        name: newGradeName,
        studentHourlyRate: newStudentRate,
        teacherHourlyRate: newTeacherRate
      });
      setGrades([...grades, res.data.grade]);
      setIsGradeModalOpen(false);
      setNewGradeName('');
      setNewStudentRate('');
      setNewTeacherRate('');
      setActionSuccess('Grade rate card added successfully!');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add grade');
    }
  };

  // Homework file selection
  const handleHomeworkUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedHomeworkFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        previewUrl: URL.createObjectURL(file)
      });
      setActionSuccess('✅ Homework notebook uploaded and submitted for teacher review!');
      setTimeout(() => setActionSuccess(''), 4000);
    }
  };

  // Copy Invitation Link handler (Admin)
  const getGeneratedInviteLink = () => {
    const code = inviteTargetRole === 'TEACHER' ? 'TUTOR-2026-INVITE' : 'ADMIN-SUPER-2026';
    return `${window.location.origin}/register?role=${inviteTargetRole}&code=${code}`;
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(getGeneratedInviteLink());
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  const handleCopyWhatsAppInvite = () => {
    const link = getGeneratedInviteLink();
    const roleTitle = inviteTargetRole === 'TEACHER' ? '1-on-1 Tutor' : 'Operations Staff';
    const message = `Hello! You have been invited to join TuitionHub Academy as an authorized ${roleTitle}. Please complete your onboarding registration here: ${link}`;
    navigator.clipboard.writeText(message);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2500);
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  // Admin Simulator calculations
  const simRates = {
    grade8: { name: 'Grade 8 – 9', studentRate: 350, teacherRate: 220 },
    grade10: { name: 'Grade 10 (Board)', studentRate: 400, teacherRate: 250 },
    grade12: { name: 'Grade 11 – 12 (JEE/NEET)', studentRate: 600, teacherRate: 350 }
  };
  const activeSim = simRates[adminSimGrade] || simRates.grade10;
  const simTotalRev = activeSim.studentRate * adminSimHours * adminSimStudents;
  const simTotalPay = activeSim.teacherRate * adminSimHours * adminSimStudents;
  const simNetProfit = simTotalRev - simTotalPay;
  const simMarginPct = Math.round((simNetProfit / simTotalRev) * 100);

  // Filtered class logs for Admin
  const filteredLogs = classLogs.filter(log => {
    const matchesSearch = 
      log.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.teacherName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGrade = 
      gradeFilter === 'ALL' || 
      (gradeFilter === 'GRADE10' && log.grade?.includes('10')) ||
      (gradeFilter === 'GRADE12' && log.grade?.includes('12')) ||
      (gradeFilter === 'GRADE8' && (log.grade?.includes('8') || log.grade?.includes('9')));

    return matchesSearch && matchesGrade;
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
    
    const matchesGrade = 
      adminDirectoryGradeFilter === 'ALL' || 
      (adminDirectoryGradeFilter === 'GRADE10' && (student.grade || '').includes('10')) ||
      (adminDirectoryGradeFilter === 'GRADE12' && (student.grade || '').includes('12')) ||
      (adminDirectoryGradeFilter === 'GRADE8' && ((student.grade || '').includes('8') || (student.grade || '').includes('9')));
    
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      
      {/* 🌟 Authenticated Header */}
      <header className="bg-white/80 border-b border-slate-200/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">TuitionHub</span>
              <span className={`ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                role === 'TEACHER' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {role} Console
              </span>
            </div>
          </div>

          {/* ⚡ 1-Click Fast Role Switcher in Header (For Demo Presentation) */}
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-slate-100/90 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1.5">
              Live Role Switch:
            </span>
            <button 
              onClick={() => handleSwitchDemoRole('STUDENT')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                role === 'STUDENT' ? 'bg-white shadow text-emerald-700 border border-emerald-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👩‍🎓 Student
            </button>
            <button 
              onClick={() => handleSwitchDemoRole('TEACHER')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                role === 'TEACHER' ? 'bg-white shadow text-blue-700 border border-blue-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👨‍🏫 Teacher
            </button>
            <button 
              onClick={() => handleSwitchDemoRole('ADMIN')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                role === 'ADMIN' ? 'bg-white shadow text-purple-700 border border-purple-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👑 Admin
            </button>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-900">{user.name}</div>
              <div className="text-[10px] font-semibold text-slate-400">{user.emailOrPhone}</div>
            </div>

            {/* 👤 My Profile Button */}
            <button
              onClick={openProfileModal}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>My Profile</span>
            </button>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* 🚀 Main Workspace Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">

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
            
            {/* Header Greeting */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back, {user.name} 👋
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {user.grade || 'Grade 10'} &bull; Mathematics &bull; Verified Hourly Rate: ₹{user.hourlyRate || 400}/hr
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
                    Retry Saving Telemetry
                  </button>
                )}
              </div>
            )}

            {/* List of Scheduled Classes with Smart Auto-Attendance */}
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
                            {linkOpened ? `Meeting link opened at ${attendance.linkOpenedDisplay}` : `Scheduled: ${s.date}`}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-slate-900">{s.subject}: {s.topic}</h4>
                        <p className="text-sm text-slate-500 mt-1">
                          Teacher: <strong className="text-slate-800">{s.teacherName}</strong> &bull; Time: <strong>{s.startTime} – {s.endTime} ({s.durationHours} hrs)</strong>
                        </p>

                        {linkOpened && (
                          <div className="mt-2 text-xs font-medium text-blue-700 flex items-center gap-1.5 bg-blue-50/70 px-2.5 py-1 rounded-lg border border-blue-100">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            <span>Meeting link opened at {attendance.linkOpenedDisplay}. Final attendance confirmed by teacher post-class.</span>
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

            {/* Verified Post-Class History for Student */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    This Month's Completed & Verified Classes
                  </h3>
                  <p className="text-xs text-slate-500">Verified post-class duration logged by your teacher</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                  {classLogs.length} Sessions Logged
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5">Subject & Topics Covered</th>
                      <th className="py-2.5">Teacher</th>
                      <th className="py-2.5">Verified Duration</th>
                      <th className="py-2.5">Homework Note</th>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fee & Homework Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Fee Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-base flex items-center gap-2 text-slate-900">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    November Fee Statement
                  </h4>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    Math.round(Number((monthlyHours ?? 0).toFixed(2)) * (user.hourlyRate || 400)) === 0
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {Math.round(Number((monthlyHours ?? 0).toFixed(2)) * (user.hourlyRate || 400)) === 0 
                      ? 'NO DUES' 
                      : 'PAYMENT DUE'}
                  </span>
                </div>

                {billingError ? (
                  <div className="p-4 my-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between gap-3">
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
                ) : (
                  <div className="space-y-3 py-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Attended Hours:</span>
                      <strong className="font-semibold text-slate-800">{Number((monthlyHours ?? 0).toFixed(2))} Hours</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Hourly Rate ({user.grade || 'Grade 10'}):</span>
                      <strong className="font-semibold text-slate-800">₹{user.hourlyRate || 400} / Hour</strong>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-slate-100 text-base">
                      <span className="font-bold text-slate-900">Total Payable Fee:</span>
                      <span className="font-extrabold text-indigo-600 text-xl">
                        ₹{Math.round(Number((monthlyHours ?? 0).toFixed(2)) * (user.hourlyRate || 400)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-3">
                  {/* Disabled Checkout with Honest Roadmap Label */}
                  <div className="space-y-2">
                    <button 
                      disabled
                      className="w-full py-3 rounded-xl font-bold text-xs bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed flex items-center justify-center gap-2 shadow-inner"
                      title="Online payment gateway checkout is scheduled for v1.0 release"
                    >
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      <span>Online Payments (Razorpay & UPI) — Coming Soon</span>
                    </button>

                    {/* Direct Academy Offline Settlement Instructions */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-800 font-bold">
                        <span>Academy Fee Settlement</span>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">Direct Transfer</span>
                      </div>
                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        Pay via direct GPay / PhonePe to Academy Director: <strong className="text-slate-800 font-mono">+91 98000 00000</strong> (UPI: <span className="font-mono text-indigo-700">tuitionhub@icici</span>).
                      </p>
                    </div>

                    {/* Digital Receipts Notice (Hidden until Razorpay Integration in Milestone 2) */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Official Payment Receipts</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          Coming Soon in v1.0
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Official stamped payment receipts & PDF downloads will be generated automatically upon online checkout completion via Razorpay Gateway (scheduled in next release).
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Homework Card with Real File Preview */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-base flex items-center gap-2 text-slate-900">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                      Active Homework Assignment
                    </h4>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      Coming Soon in v1.0 (Milestone 2)
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-800">
                    NCERT Exercise 4.2: Quadratic Formula Applications
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Solve Questions 1 through 6 in notebook. Click photo of working and upload below for teacher review.
                  </p>

                  {/* Uploaded File Confirmation */}
                  {uploadedHomeworkFile && (
                    <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-emerald-900 block truncate">{uploadedHomeworkFile.name}</span>
                        <span className="text-[10px] text-emerald-700 block">Submitted at {uploadedHomeworkFile.time} ({uploadedHomeworkFile.size})</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-800">
                        Submitted
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <label className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-indigo-50/20">
                    <Upload className="w-6 h-6 text-indigo-500 mb-1" />
                    <span className="text-xs font-bold text-slate-700">
                      {uploadedHomeworkFile ? 'Upload New Photo / Re-submit' : 'Upload Notebook Photo'}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG or PDF up to 10MB</span>
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleHomeworkUpload} />
                  </label>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 👨‍🏫 2. TEACHER VIEW */}
        {role === 'TEACHER' && (
          <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
            
            {/* Header Greeting */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Instructor Portal &bull; {user.name}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  1-on-1 Classes &bull; Compensation: ₹{user.hourlyRate || 250}/hr &bull; Auto-Attendance Verified
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
                  onClick={() => setIsScheduleModalOpen(true)}
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

            {/* Teacher Performance & Verified Hours Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs font-semibold text-slate-500">Verified Teaching Hours</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">{Number((monthlyHours ?? 0).toFixed(2))} hrs</div>
                <span className="text-[11px] text-emerald-600 font-bold mt-0.5 block">100% verified decimal duration</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs font-semibold text-slate-500">Accrued Teacher Payout</span>
                <div className="text-3xl font-extrabold text-emerald-600 mt-1">
                  ₹{Math.round(Number((monthlyHours ?? 0).toFixed(2)) * (user.hourlyRate || 250)).toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">Calculated at ₹{user.hourlyRate || 250}/hr</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs font-semibold text-slate-500">Classes Completed</span>
                <div className="text-3xl font-extrabold text-indigo-600 mt-1">{classLogs.length}</div>
                <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">Zero manual calculations</span>
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
                            {s.status === 'CANCELLED' ? 'CANCELLED (0 hrs)' : linkOpened ? 'LINK OPENED' : s.status}
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
                            <span>Meeting link opened at {attendance.linkOpenedDisplay}. (Please confirm attendance below).</span>
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

                      {s.status === 'SCHEDULED' && (
                        <div className="flex items-center gap-2">
                          <button 
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
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Post-Class Logging Engine Form */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    Submit Post-Class Log (Mandatory for Hourly Payout)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    System calculates exact decimal duration hours. Cancelled or missed classes bill 0 hours as per academy policy.
                  </p>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold self-start sm:self-auto">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Calculated: {isClassPresent ? currentDuration : '0.0 hrs (Absent - ₹0 charged)'}</span>
                </div>
              </div>

              {classLogged ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="font-bold text-emerald-800 text-base">Class Log Recorded Successfully!</h4>
                  <p className="text-xs text-emerald-700">
                    Verified duration was added to your monthly payout and student's billing ledger.
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
                          <span>Student opened link at {attendanceRecords[selectedSessionId].linkOpenedDisplay}</span>
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
                            Strict Zero-Fee: 0.0 hrs billed
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
                      <span>{isSubmittingLog ? 'Saving Log...' : `Save & Verify Class Log (${isClassPresent && logDurationInfo.isValid ? `${logDurationInfo.hours} hrs` : '0.0 hrs'})`}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Teacher's Recent Verified Logs Table */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Your Verified Class Logs History
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5">Student</th>
                      <th className="py-2.5">Subject & Topics</th>
                      <th className="py-2.5">Hours</th>
                      <th className="py-2.5">Payout Status</th>
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

          </div>
        )}

        {/* 👑 3. ADMIN DASHBOARD */}
        {role === 'ADMIN' && (
          <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Admin Master Console
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Managing {adminDirectory.studentsCount || 0} Students &amp; {adminDirectory.teachersCount || 0} Tutors &bull; Real-time Render PostgreSQL
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
                <span className="text-xs px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold">
                  ● Live Sync
                </span>
              </div>
            </div>

            {/* Live Metrics from Render PostgreSQL */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-500">Active Students</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">
                  {adminDirectory.studentsCount || 0}
                </div>
                <span className="text-[11px] text-emerald-600 mt-0.5 block">Live in PostgreSQL</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-500">Active Teachers</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">
                  {adminDirectory.teachersCount || 0}
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5 block">1-on-1 dedicated</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-500">Attended Hours</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">
                  {((adminDirectory.students || []).reduce((acc, s) => acc + (s.attendedHours || 0), 0)).toFixed(1)} hrs
                </div>
                <span className="text-[11px] text-indigo-600 mt-0.5 block">Verified lecture logs</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-500">Total Accrued Fees</span>
                <div className="text-3xl font-extrabold text-emerald-600 mt-1">
                  ₹{((adminDirectory.students || []).reduce((acc, s) => acc + (s.totalFeeDue || 0), 0)).toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-emerald-600 mt-0.5 block">Verified billing due</span>
              </div>
            </div>

            {/* 🔐 TUTOR & STAFF INVITATION MANAGER WIDGET */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-indigo-100 shadow-md shadow-indigo-50/50 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      Tutor & Staff Invitation Manager (Controlled Onboarding)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Student enrollment is 100% public. Tutors & staff require an authorized invitation code issued below.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full self-start sm:self-auto">
                  Gatekeeper Access
                </span>
              </div>

              {/* Invitation Generator Controls */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                <div className="md:col-span-3">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Role</label>
                  <select
                    value={inviteTargetRole}
                    onChange={(e) => setInviteTargetRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                    <option value="TEACHER">Tutor / Teacher</option>
                    <option value="ADMIN">Administrative Staff</option>
                  </select>
                </div>

                {inviteTargetRole === 'TEACHER' && (
                  <div className="md:col-span-3">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Assigned Department</label>
                    <select
                      value={inviteSubject}
                      onChange={(e) => setInviteSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="English">English</option>
                    </select>
                  </div>
                )}

                <div className={inviteTargetRole === 'TEACHER' ? 'md:col-span-6' : 'md:col-span-9'}>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Authorized Invitation Link</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={getGeneratedInviteLink()}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50 text-slate-600 truncate select-all"
                    />
                    <button
                      onClick={handleCopyInviteLink}
                      className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-colors shadow-sm"
                    >
                      {copiedInvite ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedInvite ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                    <button
                      onClick={handleCopyWhatsAppInvite}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-colors shadow-sm"
                    >
                      {copiedWhatsApp ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                      <span>{copiedWhatsApp ? 'Copied Text!' : 'WhatsApp'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Invitation Keys Badge */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                <div className="flex items-center gap-3">
                  <span>Active Keys:</span>
                  <span className="font-mono font-bold text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded border">
                    TUTOR-2026-INVITE (Teachers)
                  </span>
                  <span className="font-mono font-bold text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded border">
                    ADMIN-SUPER-2026 (Staff)
                  </span>
                </div>
                <span className="text-[11px] text-indigo-600 font-semibold">
                  ⚡ Auto-fills role and secret key when opened
                </span>
              </div>
            </div>

            {/* 👥 4. ACADEMY DIRECTORY (STUDENTS & TEACHERS ROSTER) */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                      <Users className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      Academy Directory & User Management
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Live roster of registered students and onboarded tutors with contact details, parent info, and lecture metrics.
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
                    <span>Onboarded Tutors</span>
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
                        : "Search by tutor name, subject, phone..."
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
                      <option value="ALL">All Standards</option>
                      <option value="GRADE10">Grade 10</option>
                      <option value="GRADE12">Grade 11 – 12</option>
                      <option value="GRADE8">Grade 8 – 9</option>
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
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-400">
                          <th className="py-2.5">Student & School</th>
                          <th className="py-2.5">Standard & Rate</th>
                          <th className="py-2.5">Student Contact</th>
                          <th className="py-2.5">Parent / Guardian</th>
                          <th className="py-2.5">Attended Hours</th>
                          <th className="py-2.5">Billing Accrual</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredDirectoryStudents.map((student) => (
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
                              <span className="text-[11px] text-indigo-600 font-bold block">₹{student.hourlyRate}/hr</span>
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
                                {student.completedSessions} lectures attended
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
                                {student.totalFeeDue > 0 ? 'Payment Due' : 'Zero Balance'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* TABLE 2: TEACHERS DIRECTORY */}
              {adminDirectoryTab === 'TEACHERS' && (
                <div className="overflow-x-auto">
                  {filteredDirectoryTeachers.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                      No matching tutors found in directory.
                    </div>
                  ) : (
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-400">
                          <th className="py-2.5">Tutor & Department</th>
                          <th className="py-2.5">Contact Details</th>
                          <th className="py-2.5">Lectures Delivered</th>
                          <th className="py-2.5">Accrued Payout</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredDirectoryTeachers.map((teacher) => (
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
                            </td>
                            <td className="py-3 text-xs">
                              <div className="font-extrabold text-slate-900">
                                ₹{teacher.accruedPayout.toLocaleString('en-IN')}
                              </div>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Accrued & Verified
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>

            {/* 🔒 Academy Financial Economics & Profit Margin Simulator (Strictly for Admin) */}
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-bold text-white">Academy Revenue & Margin Simulator</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Confidential executive tool to project monthly revenues, teacher payouts, and net gross profits.
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
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Teacher Payroll</span>
                      <strong className="text-base text-rose-300 font-extrabold mt-0.5 block">
                        ₹{simTotalPay.toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-emerald-300 text-[10px] uppercase font-bold block">Institute Cut</span>
                      <strong className="text-base text-emerald-400 font-extrabold mt-0.5 block">
                        {simMarginPct}% Margin
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Net Profit Big Badge */}
                <div className="p-5 rounded-2xl bg-white/10 border border-white/15 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-extrabold tracking-wider text-emerald-300 uppercase block">
                    Net Projected Margin
                  </span>
                  <div className="text-3xl font-black text-emerald-400 mt-1">
                    +₹{simNetProfit.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-slate-300 mt-1 block">
                    Monthly margin after paying all teacher hourly fees
                  </span>
                </div>

              </div>
            </div>

            {/* Academy Class Logs & Verified Hours Audit with Search & Filters */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Academy Class Logs Audit (Master Ledger)
                  </h3>
                  <p className="text-xs text-slate-500">Teacher-submitted post-class hours directly determine student invoices and teacher payouts.</p>
                </div>

                {/* Filter and Search */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Search student or teacher..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs w-48 bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <select 
                    value={gradeFilter} 
                    onChange={(e) => setGradeFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-medium"
                  >
                    <option value="ALL">All Standards</option>
                    <option value="GRADE10">Grade 10</option>
                    <option value="GRADE12">Grade 12</option>
                    <option value="GRADE8">Grade 8-9</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5">Teacher</th>
                      <th className="py-2.5">Student & Grade</th>
                      <th className="py-2.5">Subject & Topics</th>
                      <th className="py-2.5">Duration</th>
                      <th className="py-2.5">Student Billable</th>
                      <th className="py-2.5">Teacher Payout</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLogs.map((log) => {
                      const studentRate = log.grade?.includes('12') ? 600 : 400;
                      const teacherRate = log.grade?.includes('12') ? 350 : 250;
                      const studentCharge = Math.round(log.billableHours * studentRate);
                      const teacherPay = Math.round(log.billableHours * teacherRate);

                      return (
                        <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 font-semibold text-slate-800 text-xs">{log.date}</td>
                          <td className="py-3 font-semibold text-slate-900 text-xs">{log.teacherName}</td>
                          <td className="py-3 text-xs">
                            <span className="font-bold text-slate-800">{log.studentName}</span>
                            <span className="text-slate-400 ml-1">({log.grade})</span>
                          </td>
                          <td className="py-3 text-xs">
                            <span className="font-bold text-slate-800">{log.subject}</span>
                            <div className="text-[11px] text-slate-400 truncate max-w-xs">{log.topicsCovered}</div>
                          </td>
                          <td className="py-3 text-xs font-bold text-indigo-600">
                            {log.billableHours} hrs
                          </td>
                          <td className="py-3 text-xs font-extrabold text-emerald-600">
                            ₹{studentCharge}
                          </td>
                          <td className="py-3 text-xs font-medium text-slate-600">
                            ₹{teacherPay}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Configurable Grade Rate Cards Matrix */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Grade Rate Cards (Configurable Matrix)</h3>
                  <p className="text-xs text-slate-500">Student billing and teacher payout rates vary strictly by grade.</p>
                </div>
                <button 
                  onClick={() => setIsGradeModalOpen(true)}
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
                      <th className="py-2.5">Student Billing Rate</th>
                      <th className="py-2.5">Teacher Payout Rate</th>
                      <th className="py-2.5">Institute Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {grades.map((g) => {
                      const margin = g.studentHourlyRate - g.teacherHourlyRate;
                      const marginPercent = Math.round((margin / g.studentHourlyRate) * 100);
                      return (
                        <tr key={g.id}>
                          <td className="py-3 font-semibold text-slate-800">{g.name}</td>
                          <td className="py-3 text-indigo-600 font-bold">₹{g.studentHourlyRate} / hr</td>
                          <td className="py-3 text-slate-500">₹{g.teacherHourlyRate} / hr</td>
                          <td className="py-3 text-emerald-600 font-semibold">+₹{margin} / hr ({marginPercent}%)</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

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
                    <span className="text-xs font-black text-emerald-700">Rate: ₹{user.hourlyRate || 400}/hr</span>
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
                    <span>Tutor Credentials & Payout Account</span>
                    <span className="text-xs font-black text-blue-700">Compensation: ₹{user.hourlyRate || 250}/hr</span>
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
                    <label className="font-bold text-slate-700 block mb-1">Registered Bank / UPI for Payouts</label>
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
                    Administrative Designation & Organization
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Staff Designation</label>
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
                      <span className="block font-bold text-slate-800">14 Dedicated Tutors</span>
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
                  <span className="text-[10px] text-indigo-700 font-mono font-semibold">Official Fee Statement & Proforma Invoice &bull; #INV-2026-8921</span>
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
                  <span className="font-bold text-slate-900 block mt-0.5">November 2026</span>
                  <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px] inline-block mt-1">
                    Status: PAYMENT DUE (DIRECT SETTLEMENT)
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
                            <td className="py-2.5 px-3">₹{rate}/hr</td>
                            <td className="py-2.5 px-3 text-right font-bold">₹{lineAmount}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                    <tr>
                      <td colSpan="3" className="py-2 px-3 text-slate-700">
                        Total Attended Verified Hours ({Number((monthlyHours ?? 0).toFixed(2))} hrs):
                      </td>
                      <td className="py-2 px-3 text-right text-indigo-600 font-black text-sm">
                        ₹{Math.round(Number((monthlyHours ?? 0).toFixed(2)) * (user?.hourlyRate || 400)).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-medium flex items-center justify-between text-[11px]">
                <span>Settlement Mode: Direct UPI / Bank Transfer (+91 98000 00000)</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Proforma Statement
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
                <select 
                  value={studentName} 
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="Aryan Sharma">Aryan Sharma (Grade 10)</option>
                  <option value="Priya Patel">Priya Patel (Grade 12)</option>
                  <option value="Rohan Kulkarni">Rohan Kulkarni (Grade 8)</option>
                </select>
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
              <h3 className="text-xl font-bold text-slate-900">Add Grade Rate Card</h3>
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
                  <label className="text-xs font-bold text-slate-700 block mb-1">Student Billing (₹/hr)</label>
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
                  <label className="text-xs font-bold text-slate-700 block mb-1">Teacher Payout (₹/hr)</label>
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
                  Save Rate Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>TuitionHub Management &bull; Authenticated Session</span>
          <span className="text-emerald-600 font-semibold">● Post-Class Logging & Smart Attendance Active</span>
        </div>
      </footer>

    </div>
  );
}
