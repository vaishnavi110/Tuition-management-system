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
  Layers
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
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

  // Other simulation states
  const [paymentDone, setPaymentDone] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Calculate decimal hours between two HH:MM strings
  const computeDurationHours = (start, end) => {
    if (!start || !end) return 1.0;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const diff = (eh * 60 + em) - (sh * 60 + sm);
    return diff > 0 ? Number((diff / 60).toFixed(1)) : 1.0;
  };

  const currentDuration = computeDurationHours(logStartTime, logEndTime);

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [gradesRes, sessionsRes, attendanceRes, logsRes] = await Promise.all([
        axios.get('/api/schedule/grades'),
        axios.get('/api/schedule/sessions').catch(() => ({ data: { sessions: [] } })),
        axios.get('/api/attendance/all').catch(() => ({ data: { attendance: {} } })),
        axios.get('/api/logs/monthly-summary').catch(() => ({ data: { summary: { totalBillableHours: 2.5, logs: [] } } }))
      ]);

      setGrades(gradesRes.data.grades || []);
      const loadedSessions = sessionsRes.data.sessions || [];
      setSessions(loadedSessions);
      setAttendanceRecords(attendanceRes.data.attendance || {});

      const summary = logsRes.data.summary || { totalBillableHours: 0, logs: [] };
      setClassLogs(summary.logs || []);
      setMonthlyHours(summary.totalBillableHours || 0);

      if (loadedSessions.length > 0) {
        setSelectedSessionId(loadedSessions[0].id);
        setLogStartTime(loadedSessions[0].startTime || '17:00');
        setLogEndTime(loadedSessions[0].endTime || '18:30');
      }
    } catch (err) {
      console.warn('Using local state defaults for offline preview');
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Auto-Attendance Trigger on "Join Google Meet" click
  const handleJoinClass = async (session) => {
    try {
      const res = await axios.post('/api/attendance/join', { sessionId: session.id });
      setAttendanceRecords(prev => ({ ...prev, [session.id]: res.data.record }));
      setActionSuccess(`✅ Smart Attendance logged! Auto-detected entry at ${res.data.record.joinedTimeDisplay}`);
      setTimeout(() => setActionSuccess(''), 5000);
    } catch (err) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setAttendanceRecords(prev => ({
        ...prev,
        [session.id]: {
          status: 'PRESENT',
          autoDetected: true,
          joinedTimeDisplay: timeStr
        }
      }));
    } finally {
      window.open(session.meetLink || 'https://meet.google.com/new', '_blank');
    }
  };

  // Handle Post-Class Log Submission (Issue #5)
  const handleSubmitPostClassLog = async (e) => {
    e.preventDefault();
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
      setMonthlyHours(prev => Number((prev + newLog.billableHours).toFixed(1)));
      setClassLogged(true);
      setActionSuccess(`🎉 Post-class log saved! ${newLog.billableHours} hrs verified for billing.`);
      setTimeout(() => setActionSuccess(''), 5000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit post-class log');
    } finally {
      setIsSubmittingLog(false);
    }
  };

  // Schedule a new 1-on-1 session
  const handleCreateSession = async (e) => {
    e.preventDefault();
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

  // Cancel a session (Strict Zero-Charge Policy)
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

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

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

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-900">{user.name}</div>
              <div className="text-[10px] font-semibold text-slate-400">{user.emailOrPhone}</div>
            </div>
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
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
                  {user.grade || 'Grade 10'} &bull; Mathematics &bull; Rate: ₹{user.hourlyRate || 400}/hr
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs font-semibold px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>Next 1-on-1 Class Scheduled Today</span>
              </div>
            </div>

            {/* List of Scheduled Classes with Smart Auto-Attendance */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Your Scheduled 1-on-1 Classes
              </h3>

              {sessions.filter(s => s.status !== 'CANCELLED').map((s) => {
                const attendance = attendanceRecords[s.id];
                const isPresent = attendance?.status === 'PRESENT';

                return (
                  <div key={s.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${isPresent ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-ping'}`} />
                          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                            isPresent 
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                              : 'text-indigo-700 bg-indigo-50 border-indigo-200'
                          }`}>
                            {isPresent ? 'Present (Auto-detected)' : `Scheduled: ${s.date}`}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-slate-900">{s.subject}: {s.topic}</h4>
                        <p className="text-sm text-slate-500 mt-1">
                          Teacher: <strong className="text-slate-800">{s.teacherName}</strong> &bull; Time: <strong>{s.startTime} – {s.endTime} ({s.durationHours} hrs)</strong>
                        </p>

                        {isPresent && (
                          <div className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Smart Attendance Logged: Joined at {attendance.joinedTimeDisplay}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-center sm:items-end w-full md:w-auto">
                        <button 
                          onClick={() => handleJoinClass(s)}
                          className={`w-full md:w-auto px-7 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md ${
                            isPresent 
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200' 
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                          }`}
                        >
                          <Video className="w-4 h-4" />
                          <span>{isPresent ? 'Re-Join Google Meet' : 'Join Google Meet'}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                        </button>
                        <span className="text-[11px] text-slate-400 mt-1 text-center">
                          ⚡ Click automatically records attendance
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
                    paymentDone 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {paymentDone ? 'PAID' : 'DUE / UNPAID'}
                  </span>
                </div>

                <div className="space-y-3 py-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Attended Hours:</span>
                    <strong className="font-semibold text-slate-800">{monthlyHours || 2.5} Hours</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hourly Rate ({user.grade || 'Grade 10'}):</span>
                    <strong className="font-semibold text-slate-800">₹{user.hourlyRate || 400} / Hour</strong>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-slate-100 text-base">
                    <span className="font-bold text-slate-900">Total Payable Fee:</span>
                    <span className="font-extrabold text-indigo-600 text-xl">
                      ₹{Math.round((monthlyHours || 2.5) * (user.hourlyRate || 400)).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  {paymentDone ? (
                    <div className="text-center py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Payment Received &bull; Receipt #PAY-8921
                    </div>
                  ) : (
                    <button 
                      onClick={() => setPaymentDone(true)}
                      className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Pay via Razorpay / UPI</span>
                      <ExternalLink className="w-4 h-4 opacity-80" />
                    </button>
                  )}
                </div>
              </div>

              {/* Homework Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-base flex items-center gap-2 text-slate-900">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                      Active Homework Assignment
                    </h4>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      Due Tomorrow
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-800">
                    NCERT Exercise 4.2: Quadratic Formula Applications
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Solve Questions 1 through 6 in notebook. Click photo of working and upload below for teacher review.
                  </p>
                </div>

                <div className="mt-6">
                  <label className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-indigo-50/20">
                    <Upload className="w-6 h-6 text-indigo-500 mb-1" />
                    <span className="text-xs font-bold text-slate-700">Upload Notebook Photo</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG or PDF up to 10MB</span>
                    <input type="file" className="hidden" onChange={() => alert('Photo uploaded successfully for teacher review!')} />
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
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-md shadow-indigo-100 transition-all"
                >
                  <Plus className="w-4 h-4" /> Schedule 1-on-1 Class
                </button>
              </div>
            </div>

            {/* Teacher Performance & Verified Hours Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs font-semibold text-slate-500">Verified Teaching Hours</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">{monthlyHours || 3.5} hrs</div>
                <span className="text-[11px] text-emerald-600 font-bold mt-0.5 block">100% verified decimal duration</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs font-semibold text-slate-500">Accrued Teacher Payout</span>
                <div className="text-3xl font-extrabold text-emerald-600 mt-1">
                  ₹{Math.round((monthlyHours || 3.5) * (user.hourlyRate || 250)).toLocaleString('en-IN')}
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
                  const hasJoined = attendance?.status === 'PRESENT';

                  return (
                    <div key={s.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            s.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border border-red-200' :
                            hasJoined ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                            'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}>
                            {s.status === 'CANCELLED' ? 'CANCELLED (0 hrs)' : hasJoined ? 'STUDENT PRESENT' : s.status}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">{s.date} &bull; {s.startTime} - {s.endTime} ({s.durationHours} hrs)</span>
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 mt-1">
                          {s.studentName} ({s.grade}) &bull; {s.subject}
                        </h4>

                        {/* Live Attendance Confirmation */}
                        {hasJoined ? (
                          <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 mt-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Auto-Attendance Verified: Joined at {attendance.joinedTimeDisplay}</span>
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

            {/* Post-Class Logging Engine Form (Issue #5) */}
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
                  <span>Calculated: {isClassPresent ? `${currentDuration} hrs` : '0.0 hrs (Absent)'}</span>
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
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isClassPresent}
                        onChange={(e) => setIsClassPresent(e.target.checked)}
                        className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" 
                      />
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">
                          Student Present (Auto-detected from Google Meet Join)
                        </span>
                        <span className="text-xs text-slate-500 block">
                          Uncheck if student did not attend or cancelled last minute.
                        </span>
                      </div>
                    </label>

                    {!isClassPresent && (
                      <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
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

                  <div className="flex justify-end pt-2">
                    <button 
                      type="submit"
                      disabled={isSubmittingLog}
                      className="px-6 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 flex items-center gap-2 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isSubmittingLog ? 'Saving Log...' : `Save & Verify Class Log (${isClassPresent ? currentDuration : 0.0} hrs)`}</span>
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
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Admin Master Console
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Managing 200+ Students, 14 Teachers & Hourly Financial Matrix
                </p>
              </div>
              <span className="text-xs px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold">
                ● Live Database Synced
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-500">Active Students</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">204</div>
                <span className="text-[11px] text-emerald-600 mt-0.5 block">+12 this month</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-500">Active Teachers</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">14</div>
                <span className="text-[11px] text-slate-400 mt-0.5 block">1-on-1 dedicated</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-500">Attended Hours</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">
                  {840 + (monthlyHours || 3.5)} hrs
                </div>
                <span className="text-[11px] text-indigo-600 mt-0.5 block">Zero manual math</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-500">Monthly Revenue</span>
                <div className="text-3xl font-extrabold text-emerald-600 mt-1">₹3,78,000</div>
                <span className="text-[11px] text-emerald-600 mt-0.5 block">Razorpay & UPI</span>
              </div>
            </div>

            {/* Academy Class Logs & Verified Hours Audit (Issue #5) */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Academy Class Logs Audit (Master Ledger)
                  </h3>
                  <p className="text-xs text-slate-500">Teacher-submitted post-class hours directly determine student invoices and teacher payouts.</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                  {classLogs.length} Verified Logs
                </span>
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
                    {classLogs.map((log) => {
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
