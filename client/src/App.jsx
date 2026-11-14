import React, { useEffect, useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  Calendar, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Video
} from 'lucide-react';

export default function App() {
  const [apiStatus, setApiStatus] = useState('Connecting to backend...');
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setApiStatus(data.message || 'Backend Connected');
        setIsBackendOnline(true);
      })
      .catch(() => {
        setApiStatus('Backend offline (Run: npm run dev)');
        setIsBackendOnline(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">TuitionPortal</span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                v0.1-MVP
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-2 text-xs font-medium px-3 py-1.5 rounded-full border ${
              isBackendOnline 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isBackendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{apiStatus}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero & Role Entry Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            1-on-1 Tuition & Billing <br />
            <span className="text-indigo-600">Management System</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Replacing manual WhatsApp operations with automated 1-on-1 scheduling, smart Google Meet auto-attendance, and instant fee calculations.
          </p>
        </div>

        {/* 3 Role Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Admin Portal Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Admin Portal</h3>
            <p className="text-sm text-slate-500 mt-2">
              Configure grade hourly rates, assign teachers to students, track master schedules, and view monthly billing reports.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                Management
              </span>
              <button className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                Access <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Teacher Portal Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Teacher Portal</h3>
            <p className="text-sm text-slate-500 mt-2">
              Schedule 1-on-1 classes, paste Google Meet links, log post-class duration hours, and record topics covered.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                Teaching & Logs
              </span>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Access <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Student Portal Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Student Portal</h3>
            <p className="text-sm text-slate-500 mt-2">
              1-click Google Meet class join with smart auto-attendance, class history, and automated monthly fee statements.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                Learning & Fees
              </span>
              <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                Access <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-16 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <Clock className="w-5 h-5 text-indigo-600 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-800">Strictly Hourly Rates</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Hours × Grade Rate</div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-800">Smart Attendance</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Auto-logs on Join click</div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <CreditCard className="w-5 h-5 text-indigo-600 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-800">Razorpay & UPI</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Auto-marks as PAID</div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <Users className="w-5 h-5 text-indigo-600 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-800">Zero Charge Policy</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Cancelled classes = ₹0</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        Tuition Management System &bull; Private & Proprietary &bull; Issue #1 Scaffolding
      </footer>
    </div>
  );
}

