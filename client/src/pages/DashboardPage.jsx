import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Users, 
  Calendar, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Video, 
  ExternalLink, 
  BookOpen, 
  Upload, 
  LogOut, 
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  X
} from 'lucide-react';

export default function DashboardPage() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  // If not logged in, redirect to login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Data states from API
  const [grades, setGrades] = useState([]);
  const [sessions, setSessions] = useState([]);
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

  // Simulation states
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [classLogged, setClassLogged] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [gradesRes, sessionsRes] = await Promise.all([
        axios.get('/api/schedule/grades'),
        axios.get('/api/schedule/sessions').catch(() => ({ data: { sessions: [] } }))
      ]);
      setGrades(gradesRes.data.grades || []);
      setSessions(sessionsRes.data.sessions || []);
    } catch (err) {
      console.warn('Using local state defaults for offline preview');
    } finally {
      setLoading(false);
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

  const handleJoinClass = (link) => {
    setAttendanceMarked(true);
    window.open(link || 'https://meet.google.com/new', '_blank');
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back, {user.name} 👋
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {user.grade || 'Grade 10'} &bull; Mathematics &bull; Rate: ₹{user.hourlyRate || 400}/hr
                </p>
              </div>

              {attendanceMarked ? (
                <div className="flex items-center space-x-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm animate-pulse">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Smart Attendance: PRESENT (Auto-detected at 5:02 PM)</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Next 1-on-1 Session Today</span>
                </div>
              )}
            </div>

            {/* List of Scheduled Classes */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Your Scheduled 1-on-1 Classes
              </h3>

              {sessions.filter(s => s.status !== 'CANCELLED').map((s) => (
                <div key={s.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Scheduled: {s.date}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">{s.subject}: {s.topic}</h4>
                      <p className="text-sm text-slate-500 mt-1">
                        Teacher: <strong className="text-slate-800">{s.teacherName}</strong> &bull; Time: <strong>{s.startTime} – {s.endTime} ({s.durationHours} hrs)</strong>
                      </p>
                    </div>

                    <div className="flex flex-col items-center sm:items-end w-full md:w-auto">
                      <button 
                        onClick={() => handleJoinClass(s.meetLink)}
                        className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                          attendanceMarked 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200' 
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                        }`}
                      >
                        <Video className="w-4 h-4" />
                        <span>{attendanceMarked ? 'Re-Join Google Meet' : 'Join Google Meet'}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                      </button>
                      <span className="text-[11px] text-slate-400 mt-1">
                        ⚡ Click auto-marks attendance
                      </span>
                    </div>
                  </div>
                </div>
              ))}
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
                    <strong className="font-semibold text-slate-800">12.5 Hours</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hourly Rate:</span>
                    <strong className="font-semibold text-slate-800">₹{user.hourlyRate || 400} / Hour</strong>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-slate-100 text-base">
                    <span className="font-bold text-slate-900">Total Payable Fee:</span>
                    <span className="font-extrabold text-indigo-600 text-xl">₹5,000</span>
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
                      className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-100 transition-all"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay Online via Razorpay (GPay/UPI/Card)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Homework Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-base flex items-center gap-2 text-slate-900">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    Homework Tasks
                  </h4>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    Due Tomorrow
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <p className="text-slate-600">
                    Teacher uploaded: <strong className="text-slate-900">Ex 4.2 Problems 5, 8, 12 (Notebook photo attached)</strong>
                  </p>
                  
                  <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                    <Upload className="w-6 h-6 mx-auto mb-1.5 text-indigo-500" />
                    <p className="text-xs font-bold text-slate-800">Upload Photo of Completed Notebook</p>
                    <button className="mt-2.5 px-3 py-1 bg-white rounded-lg text-xs font-bold border border-slate-200 shadow-sm text-slate-700 hover:bg-slate-50">
                      Select Photo
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 👨‍🏫 2. TEACHER DASHBOARD */}
        {role === 'TEACHER' && (
          <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
            
            {/* Header Greeting & Action */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Teacher Portal &bull; {user.name}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {user.subject || 'Mathematics'} &bull; 1-on-1 Class Scheduling & Hourly Logs
                </p>
              </div>
              <button 
                onClick={() => setIsScheduleModalOpen(true)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-100 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule 1-on-1 Class</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-500">Upcoming Sessions</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {sessions.filter(s => s.status === 'SCHEDULED').length} Classes
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-500">Hours Taught (Nov)</span>
                <div className="text-2xl font-black text-slate-900 mt-1">28.5 hrs</div>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-500">Hourly Pay Rate</span>
                <div className="text-2xl font-black text-slate-900 mt-1">₹250 - ₹350/hr</div>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-500">Est. Monthly Payout</span>
                <div className="text-2xl font-black text-emerald-600 mt-1">₹9,450</div>
              </div>
            </div>

            {/* 1-on-1 Sessions List */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Your 1-on-1 Class Sessions
              </h3>

              <div className="space-y-3">
                {sessions.map((s) => (
                  <div 
                    key={s.id} 
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                      s.status === 'CANCELLED' 
                        ? 'bg-slate-50 border-slate-200 opacity-60' 
                        : 'bg-white border-slate-200/80 hover:border-indigo-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          s.status === 'CANCELLED' 
                            ? 'bg-red-50 text-red-600 border border-red-200' 
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}>
                          {s.status}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">{s.date} &bull; {s.startTime} - {s.endTime} ({s.durationHours} hrs)</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">
                        {s.studentName} ({s.grade}) &bull; {s.subject}
                      </h4>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                        <span>Meet:</span>
                        <a href={s.meetLink} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1 font-mono text-[11px]">
                          {s.meetLink} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
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
                ))}
              </div>
            </div>

            {/* Post-Class Logging Form */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Submit Post-Class Log (Mandatory for Hourly Payout)
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                System calculates exact duration hours to ensure 100% accurate student billing and teacher compensation.
              </p>

              {classLogged ? (
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-center font-bold">
                  ✅ Class Log for Aryan Sharma (1.5 hrs) saved! Duration added to monthly payout.
                  <button onClick={() => setClassLogged(false)} className="block mx-auto mt-2 text-xs text-indigo-600 underline">
                    Log Another Class
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Student</label>
                      <input type="text" readOnly value="Aryan Sharma (Grade 10)" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-800" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Class Start Time</label>
                      <input type="text" defaultValue="5:00 PM" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Class End Time</label>
                      <input type="text" defaultValue="6:30 PM (1.5 hrs)" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-indigo-50 font-bold text-indigo-700" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Attendance Confirmation</label>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-slate-800">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded" />
                      <span>Present (Auto-detected when student joined Meet)</span>
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Topics Covered</label>
                    <textarea 
                      rows="2" 
                      defaultValue="Completed Chapter 4 Quadratic Equations: Exercise 4.2 Problem solving." 
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={() => setClassLogged(true)}
                      className="px-6 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100"
                    >
                      Save & Complete Class Log
                    </button>
                  </div>
                </div>
              )}
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
                <div className="text-3xl font-extrabold text-slate-900 mt-1">842 hrs</div>
                <span className="text-[11px] text-indigo-600 mt-0.5 block">Zero manual math</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-500">Monthly Revenue</span>
                <div className="text-3xl font-extrabold text-emerald-600 mt-1">₹3,78,000</div>
                <span className="text-[11px] text-emerald-600 mt-0.5 block">Razorpay & UPI</span>
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
          <span className="text-emerald-600 font-semibold">● 1-on-1 Schedulers Active</span>
        </div>
      </footer>

    </div>
  );
}
