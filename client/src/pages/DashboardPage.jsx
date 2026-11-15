import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Bell 
} from 'lucide-react';

export default function DashboardPage() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  // If not logged in, redirect to login
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Simulation states
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [classLogged, setClassLogged] = useState(false);

  const handleJoinClass = () => {
    setAttendanceMarked(true);
    window.open('https://meet.google.com/new', '_blank');
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
          
          {/* Logo & Portal Role Badge */}
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
                {role} Portal
              </span>
            </div>
          </div>

          {/* User Profile & Sign Out */}
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

      {/* 🚀 Dedicated Role Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">

        {/* 👩‍🎓 1. STUDENT DASHBOARD */}
        {role === 'STUDENT' && (
          <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
            
            {/* Greeting */}
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
                  <span>Next Class: Today at 5:00 PM</span>
                </div>
              )}
            </div>

            {/* Core Action: Today's 1-on-1 Class Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-100/40 to-transparent rounded-bl-full pointer-events-none" />
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Live 1-on-1 Class Ready
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Mathematics: Quadratic Equations (Ch 4)</h3>
                  <p className="text-sm text-slate-500 mt-1.5">
                    Assigned Teacher: <strong className="text-slate-800 font-semibold">Mrs. Sunita Verma</strong> &bull; Scheduled: <strong>5:00 PM – 6:30 PM (1.5 hrs)</strong>
                  </p>
                </div>

                <div className="flex flex-col items-center sm:items-end w-full md:w-auto">
                  <button 
                    onClick={handleJoinClass}
                    className={`w-full md:w-auto px-7 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md ${
                      attendanceMarked 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                    }`}
                  >
                    <Video className="w-5 h-5" />
                    <span>{attendanceMarked ? 'Re-Join Google Meet' : 'Join Google Meet'}</span>
                    <ExternalLink className="w-4 h-4 opacity-75" />
                  </button>
                  <span className="text-[11px] text-slate-400 mt-1.5 text-center">
                    ⚡ Clicking automatically records attendance
                  </span>
                </div>
              </div>
            </div>

            {/* Billing & Homework Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Fee Statement Card */}
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
                    Homework Task
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
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Teacher Portal &bull; {user.name}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {user.subject || 'Mathematics'} &bull; 8 Assigned 1-on-1 Students
                </p>
              </div>
              <button className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold">
                + Schedule 1-on-1 Class
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-500">Today's Sessions</span>
                <div className="text-2xl font-black text-slate-900 mt-1">3 Classes</div>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-500">Hours Taught (Nov)</span>
                <div className="text-2xl font-black text-slate-900 mt-1">28.5 hrs</div>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-500">Hourly Rate</span>
                <div className="text-2xl font-black text-slate-900 mt-1">₹250 - ₹350/hr</div>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-500">Est. Monthly Payout</span>
                <div className="text-2xl font-black text-emerald-600 mt-1">₹9,450</div>
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

            {/* Master Metrics Grid */}
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

            {/* Grade Hourly Rate Matrix */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Grade Rate Cards (Configurable Matrix)</h3>
                  <p className="text-xs text-slate-500">Student billing and teacher payout rates vary strictly by grade.</p>
                </div>
                <button className="text-xs px-3 py-1.5 rounded-lg font-bold bg-slate-100 hover:bg-slate-200 text-slate-700">
                  + Add New Grade
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
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 font-semibold text-slate-800">Grade 8 – 9</td>
                      <td className="py-3 text-indigo-600 font-bold">₹350 / hr</td>
                      <td className="py-3 text-slate-500">₹220 / hr</td>
                      <td className="py-3 text-emerald-600 font-semibold">+₹130 / hr (37%)</td>
                      <td className="py-3 text-right text-xs text-indigo-600 font-semibold cursor-pointer">Edit</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-slate-800">Grade 10 (Board)</td>
                      <td className="py-3 text-indigo-600 font-bold">₹400 / hr</td>
                      <td className="py-3 text-slate-500">₹250 / hr</td>
                      <td className="py-3 text-emerald-600 font-semibold">+₹150 / hr (38%)</td>
                      <td className="py-3 text-right text-xs text-indigo-600 font-semibold cursor-pointer">Edit</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-slate-800">Grade 11 – 12 (JEE/NEET)</td>
                      <td className="py-3 text-indigo-600 font-bold">₹600 / hr</td>
                      <td className="py-3 text-slate-500">₹350 / hr</td>
                      <td className="py-3 text-emerald-600 font-semibold">+₹250 / hr (42%)</td>
                      <td className="py-3 text-right text-xs text-indigo-600 font-semibold cursor-pointer">Edit</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>TuitionHub Management &bull; Authenticated Session</span>
          <span className="text-emerald-600 font-semibold">● Live Session Active</span>
        </div>
      </footer>

    </div>
  );
}
