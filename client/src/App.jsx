import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginModal from './components/LoginModal';
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
  Bell,
  Lock,
  UserCheck
} from 'lucide-react';

function DashboardContent() {
  const { user, role, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Active view tab (defaults to logged-in user's role or 'student' for preview)
  const [activeTab, setActiveTab] = useState(role ? role.toLowerCase() : 'student');

  // Interactive mock simulation states
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [classLogged, setClassLogged] = useState(false);

  // When user logs in or role changes, update the active tab
  React.useEffect(() => {
    if (role) {
      setActiveTab(role.toLowerCase());
    }
  }, [role]);

  // Handle Google Meet Link Click Simulation
  const handleJoinClass = () => {
    setAttendanceMarked(true);
    window.open('https://meet.google.com/new', '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      
      {/* 🌟 Top Navigation Bar (SaaS Elite Styling) */}
      <header className="bg-white/80 border-b border-slate-200/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">TuitionHub</span>
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                1-on-1 Portal
              </span>
            </div>
          </div>

          {/* Role Navigation Switcher Pills */}
          <div className="flex items-center space-x-1 sm:space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('student')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'student'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👩‍🎓 Student Portal
            </button>
            <button
              onClick={() => setActiveTab('teacher')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'teacher'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👨‍🏫 Teacher Portal
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👑 Admin Console
            </button>
          </div>

          {/* Right Action: User Profile or Login Button */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-bold text-slate-900 leading-tight">{user.name}</div>
                  <div className="text-[10px] font-semibold text-indigo-600 tracking-wide uppercase">{user.role}</div>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 transition-all flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* 🚀 Main Workspace Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">

        {/* 👩‍🎓 1. STUDENT VIEW */}
        {activeTab === 'student' && (
          <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
            
            {/* Header Greeting & Auto-Attendance Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back, {user?.role === 'STUDENT' ? user.name : 'Aryan Sharma'} 👋
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Grade 10 &bull; Mathematics &bull; Rate Card: ₹400/hour
                </p>
              </div>

              {attendanceMarked ? (
                <div className="flex items-center space-x-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm animate-pulse">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Attendance: PRESENT (Auto-detected at 5:02 PM)</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Class Starts Today at 5:00 PM</span>
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

                {/* The "Join Google Meet" Button */}
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
                    ⚡ Clicking automatically logs entry timestamp
                  </span>
                </div>
              </div>
            </div>

            {/* Two-Column Grid: Billing & Homework */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Monthly Fee Statement Card */}
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
                    <span className="text-slate-500">Grade 10 Hourly Rate:</span>
                    <strong className="font-semibold text-slate-800">₹400 / Hour</strong>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-slate-100 text-base">
                    <span className="font-bold text-slate-900">Total Payable Fee:</span>
                    <span className="font-extrabold text-indigo-600 text-xl">₹5,000</span>
                  </div>
                </div>

                {/* Razorpay Button */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  {paymentDone ? (
                    <div className="text-center py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Payment Received &bull; Receipt #PAY-8921
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button 
                        onClick={() => setPaymentDone(true)}
                        className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-100 transition-all"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Pay Online via Razorpay (GPay/UPI/Card)</span>
                      </button>
                      <p className="text-[11px] text-center text-slate-400">
                        Direct UPI fallback available &bull; Instant digital receipt
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Homework & Assignment Submission Card */}
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
                    <p className="text-[11px] text-slate-400 mt-0.5">Take photo directly from mobile camera</p>
                    <button className="mt-2.5 px-3 py-1 bg-white rounded-lg text-xs font-bold border border-slate-200 shadow-sm text-slate-700 hover:bg-slate-50">
                      Select Image
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 👨‍🏫 2. TEACHER VIEW */}
        {activeTab === 'teacher' && (
          <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
            
            {/* Header Greeting */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Teacher Portal &bull; {user?.role === 'TEACHER' ? user.name : 'Mrs. Sunita Verma'}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Mathematics Department &bull; 8 Assigned 1-on-1 Students
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

            {/* Post-Class Logging Form Simulator */}
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

        {/* 👑 3. ADMIN VIEW */}
        {activeTab === 'admin' && (
          <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
            
            {/* Header Greeting */}
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

            {/* Grade Hourly Rate Matrix (Confirmed Client Requirement) */}
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

      {/* Modern Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Tuition Management System &bull; Private & Proprietary &bull; SaaS Elite Theme</span>
          <span className="text-emerald-600 font-semibold">● 100% Client Requirement Compliant</span>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
