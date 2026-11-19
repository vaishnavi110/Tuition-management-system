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
  Menu
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
        homeworkAssigned: homeworkAssignedText
      };

      const res = await axios.post('/api/logs/submit', payload);
      const newLog = res.data.log;

      setClassLogs(prev => [newLog, ...prev]);
      setMonthlyHours(prev => Number((prev + newLog.billableHours).toFixed(2)));
      setClassLogged(true);
      setActionSuccess(`Class log saved. ${newLog.billableHours} hours added to the fee bill.`);
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
      setActionSuccess('Grade fee rate added.');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add grade');
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
      setActionSuccess('Work submitted for teacher review.');
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

  const getHeaderTitle = () => {
    if (role === 'STUDENT') {
      if (activeTab === 'CLASSES') return 'Scheduled Classes';
      if (activeTab === 'HISTORY') return "Completed Classes";
      if (activeTab === 'FEES') return 'Monthly Fee Bill';
      if (activeTab === 'HOMEWORK') return 'Homework & Practice';
      return 'Student Dashboard';
    }
    if (role === 'TEACHER') {
      if (activeTab === 'SCHEDULE') return 'Class Schedule';
      if (activeTab === 'LOG_ENTRY') return 'Save Class Log';
      if (activeTab === 'HOURS') return 'Hours & Payment';
      return 'Teacher Dashboard';
    }
    if (role === 'ADMIN') {
      if (activeTab === 'OVERVIEW') return 'Academy Overview';
      if (activeTab === 'DIRECTORY') return 'Academy Directory';
      if (activeTab === 'INVITES') return 'Teacher & Staff Invites';
      if (activeTab === 'LOGS_AUDIT') return 'Class Logs Audit';
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
                <span>Class Logs Audit</span>
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
            
            {/* Header Greeting */}
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

            )}

            {/* Tab 3: Monthly Fee Bill */}
            {activeTab === 'FEES' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm max-w-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-base flex items-center gap-2 text-slate-900">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    November Fee Bill
                  </h4>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    Math.round(Number((monthlyHours ?? 0).toFixed(2)) * (user.hourlyRate || 400)) === 0
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {Math.round(Number((monthlyHours ?? 0).toFixed(2)) * (user.hourlyRate || 400)) === 0 
                      ? 'No amount due' 
                      : 'Payment due'}
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
                      <span className="text-slate-500">Fee Rate ({user.grade || 'Grade 10'}):</span>
                      <strong className="font-semibold text-slate-800">₹{user.hourlyRate || 400} per hour</strong>
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
                  {/* Disabled Checkout */}
                  <div className="space-y-2">
                    <button 
                      disabled
                      className="w-full py-3 rounded-xl font-bold text-xs bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed flex items-center justify-center gap-2 shadow-inner"
                      title="Online payment gateway checkout is scheduled for a future update"
                    >
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      <span>Online Payments (UPI & Cards) — Planned for later</span>
                    </button>

                    {/* Direct Academy Offline Payment Instructions */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-800 font-bold">
                        <span>Academy Fee Payment</span>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">Direct Transfer</span>
                      </div>
                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        Pay via direct GPay / PhonePe to Academy Director: <strong className="text-slate-800 font-mono">+91 98000 00000</strong> (UPI: <span className="font-mono text-indigo-700">tuitionhub@icici</span>).
                      </p>
                    </div>

                    {/* Digital Receipts Notice */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Official Payment Receipts</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          Planned for later
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Official payment receipts and PDF downloads will be available once online payments are enabled.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            )}

            {/* Tab 4: Homework & Practice */}
            {activeTab === 'HOMEWORK' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between max-w-2xl">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-base flex items-center gap-2 text-slate-900">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                      Active Homework Assignment
                    </h4>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      Planned for later
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-800">
                    NCERT Exercise 4.2: Quadratic Formula Applications
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Complete practice questions. Upload photo of completed work for teacher review.
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
                      {uploadedHomeworkFile ? 'Upload New Photo' : 'Upload Photo of Completed Work'}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG or PDF up to 10MB</span>
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleHomeworkUpload} />
                  </label>
                </div>
              </div>
            )}

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
                <span className="text-xs px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold">
                  ● Live Sync
                </span>
              </div>
            </div>

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
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-indigo-100 shadow-md shadow-indigo-50/50 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      Teacher & Admin Invitation Manager
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Students can register directly. Teachers and administrators require an invitation code.
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
                    <option value="TEACHER">Teacher</option>
                    <option value="ADMIN">Admin</option>
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
                    ADMIN-SUPER-2026 (Admin)
                  </span>
                </div>
                <span className="text-[11px] text-indigo-600 font-semibold">
                  ⚡ Auto-fills role and invitation code when opened
                </span>
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
                          <th className="py-2.5 text-right pr-2">Action</th>
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
            {activeTab === 'LOGS_AUDIT' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Academy Class Logs Audit
                  </h3>
                  <p className="text-xs text-slate-500">Teacher class logs determine student fee bills and teacher payments.</p>
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
                      <th className="py-2.5">Student Fee</th>
                      <th className="py-2.5">Teacher Payment</th>
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

            )}

            {/* Tab 6: Configurable Grade Rate Cards Matrix */}
            {activeTab === 'RATES' && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Grade Fee Rates</h3>
                  <p className="text-xs text-slate-500">Student fee rates and teacher rates vary by grade.</p>
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
                      <th className="py-2.5">Student Fee Rate</th>
                      <th className="py-2.5">Teacher Rate</th>
                      <th className="py-2.5">Academy Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {grades.map((g) => {
                      const margin = g.studentHourlyRate - g.teacherHourlyRate;
                      const marginPercent = Math.round((margin / g.studentHourlyRate) * 100);
                      return (
                        <tr key={g.id}>
                          <td className="py-3 font-semibold text-slate-800">{g.name}</td>
                          <td className="py-3 text-indigo-600 font-bold">₹{g.studentHourlyRate} per hour</td>
                          <td className="py-3 text-slate-500">₹{g.teacherHourlyRate} per hour</td>
                          <td className="py-3 text-emerald-600 font-semibold">+₹{margin} per hour ({marginPercent}%)</td>
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
                  <span className="text-[10px] text-indigo-700 font-mono font-semibold">Monthly Fee Bill &bull; #INV-2026-8921</span>
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
                    Status: Payment due
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
                <span>Payment: Direct UPI / Bank Transfer (+91 98000 00000)</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Monthly Fee Bill
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



    </div>
  );
}
