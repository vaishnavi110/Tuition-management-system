import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Sparkles,
  Zap,
  Lock,
  Check,
  Activity,
  Play
} from 'lucide-react';

export default function HomePage() {
  // Interactive Hero Mockup state
  const [heroAttended, setHeroAttended] = useState(false);
  const [heroJoinedTime, setHeroJoinedTime] = useState('5:01 PM');

  const handleHeroJoinMeet = () => {
    setHeroAttended(true);
    const now = new Date();
    setHeroJoinedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-indigo-100/40 via-violet-50/30 to-transparent pointer-events-none -z-10" />
      <div className="absolute -top-40 right-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-60 left-1/4 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 🌟 Header / Public Navbar */}
      <header className="bg-white/80 border-b border-slate-200/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">TuitionHub</span>
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Official Portal
              </span>
            </div>
          </Link>

          {/* Navigation Links & Sign In CTA */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <a href="#features" className="hidden sm:inline-block text-xs font-semibold text-slate-600 hover:text-slate-900">
              Features
            </a>
            <a href="#portals" className="hidden sm:inline-block text-xs font-semibold text-slate-600 hover:text-slate-900">
              User Roles
            </a>
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 transition-all flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In to Portal</span>
            </Link>
          </div>

        </div>
      </header>

      {/* 🚀 Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            
            {/* Pill Announcement */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-indigo-200 text-indigo-700 text-xs font-bold mb-6 shadow-sm backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Replacing 200+ Student WhatsApp Chaos with Automation</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
              Automated 1-on-1 Tuition & <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">
                Billing Management System
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              A private, automated platform for academy students, teachers, and administration. Smart Google Meet auto-attendance, strictly hourly fee calculation, and instant digital payments.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Access Your Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto px-6 py-4 rounded-xl font-bold text-sm bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition-all text-center"
              >
                Learn How It Works
              </a>
            </div>

            {/* 🖥️ Interactive Floating Product Preview Mockup (Issue #15) */}
            <div className="mt-14 max-w-4xl mx-auto text-left animate-fadeIn">
              <div className="bg-white/95 rounded-3xl border border-slate-200/90 shadow-2xl shadow-indigo-100/50 backdrop-blur-xl overflow-hidden">
                
                {/* Browser Window Header Chrome */}
                <div className="bg-slate-100/80 border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                    <span className="text-xs text-slate-400 font-mono ml-2 hidden sm:inline">
                      https://tuitionhub.academy/portal/dashboard
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Academy System Preview
                    </span>
                  </div>
                </div>

                {/* Inner Window Preview Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  
                  {/* Top Notification Bar inside Mockup */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        AS
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Aryan Sharma &bull; Grade 10 (Board)</div>
                        <div className="text-xs text-slate-500">Student Portal &bull; Billing Rate: ₹400 / hr</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="px-3 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold">
                        1-on-1 Dedicated Class
                      </span>
                    </div>
                  </div>

                  {/* Interactive Class Card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    
                    {/* Class Details */}
                    <div className="md:col-span-2 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                          heroAttended 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}>
                          {heroAttended ? 'PRESENT (AUTO-DETECTED)' : 'HAPPENING TODAY &bull; 5:00 PM'}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">Mathematics &bull; 1.5 Hours</span>
                      </div>

                      <h4 className="text-lg font-bold text-slate-900">
                        Quadratic Equations &bull; Exercise 4.2 Problem Solving
                      </h4>

                      <p className="text-xs text-slate-500">
                        Assigned Tutor: <strong className="text-slate-700">Mrs. Sunita Verma</strong> &bull; Google Meet Verified
                      </p>

                      {heroAttended ? (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>Smart Auto-Attendance Logged! Entry verified at {heroJoinedTime}. Post-class form pre-filled.</span>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Clicking "Join Meet" below will auto-timestamp attendance in the real system.</span>
                        </div>
                      )}
                    </div>

                    {/* Interactive Button */}
                    <div className="flex flex-col items-center sm:items-end justify-center">
                      <button
                        onClick={handleHeroJoinMeet}
                        className={`w-full py-3.5 px-6 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                          heroAttended
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100 hover:scale-[1.02]'
                        }`}
                      >
                        <Video className="w-4 h-4" />
                        <span>{heroAttended ? 'Attendance Verified ✓' : 'Join Google Meet (Test)'}</span>
                      </button>
                      <span className="text-[10px] text-slate-400 mt-1.5 text-center">
                        {heroAttended ? 'Attendance recorded in database' : '⚡ Click to test auto-attendance'}
                      </span>
                    </div>

                  </div>

                  {/* Financial & Metric Telemetry Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Month Attended</span>
                      <span className="text-base font-extrabold text-slate-900">12.5 Hours</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hourly Rate</span>
                      <span className="text-base font-extrabold text-slate-900">₹400 / hr</span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Total Accrued</span>
                      <span className="text-base font-extrabold text-emerald-700">₹5,000 (PAID)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Missed Classes</span>
                      <span className="text-base font-extrabold text-indigo-600">₹0 (Strict Rule)</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-14 pt-8 border-t border-slate-200/60 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-black text-slate-900">200+</div>
                <div className="text-xs text-slate-500 mt-0.5">Active Students</div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">Strictly 1-on-1</div>
                <div className="text-xs text-slate-500 mt-0.5">Custom Scheduling</div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">Auto-Attendance</div>
                <div className="text-xs text-slate-500 mt-0.5">Google Meet Linked</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-600">Razorpay & UPI</div>
                <div className="text-xs text-slate-500 mt-0.5">Instant Digital Receipts</div>
              </div>
            </div>

          </div>
        </section>

        {/* 🎯 Feature Highlights Section */}
        <section id="features" className="py-16 bg-white border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Core Capabilities</h2>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">Built to Eliminate Daily Operational Headaches</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                  <Video className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">1-Click Google Meet & Smart Attendance</h4>
                <p className="text-sm text-slate-500 mt-2">
                  Teachers paste their Google Meet links. When students click "Join", the system automatically timestamps their entry and marks attendance as Present.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Strictly Hourly Grade-Based Billing</h4>
                <p className="text-sm text-slate-500 mt-2">
                  No manual math or disputed fees. Fees and salaries calculate automatically: Attended Hours × Grade Hourly Rate. Cancelled classes are strictly ₹0.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Automated Razorpay Invoices</h4>
                <p className="text-sm text-slate-500 mt-2">
                  Parents pay directly with GPay, PhonePe, Cards, or NetBanking. Invoices update to PAID automatically, generating instant digital receipts.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 👥 3 User Portals Section */}
        <section id="portals" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Role-Based Access</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">Dedicated Portals for Every Member</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Student Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Student Portal
                </span>
                <h4 className="text-xl font-bold text-slate-900 mt-3">For Students & Parents</h4>
                <ul className="mt-3 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">✅ 1-Click "Join Google Meet" button</li>
                  <li className="flex items-center gap-2">✅ Live attendance history</li>
                  <li className="flex items-center gap-2">✅ Monthly fee bill with Razorpay "Pay Now"</li>
                  <li className="flex items-center gap-2">✅ Homework photo upload</li>
                </ul>
              </div>
              <Link to="/login" className="mt-6 block text-center py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                Student Sign In &rarr;
              </Link>
            </div>

            {/* Teacher Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Teacher Portal
                </span>
                <h4 className="text-xl font-bold text-slate-900 mt-3">For Academy Tutors</h4>
                <ul className="mt-3 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">✅ View assigned 1-on-1 students</li>
                  <li className="flex items-center gap-2">✅ Set/Reschedule class & paste Meet link</li>
                  <li className="flex items-center gap-2">✅ Post-class logging (duration & topics)</li>
                  <li className="flex items-center gap-2">✅ Live monthly salary tracker</li>
                </ul>
              </div>
              <Link to="/login" className="mt-6 block text-center py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                Teacher Sign In &rarr;
              </Link>
            </div>

            {/* Admin Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200">
                  Admin Console
                </span>
                <h4 className="text-xl font-bold text-slate-900 mt-3">For Academy Management</h4>
                <ul className="mt-3 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">✅ Configure grade hourly rate matrix</li>
                  <li className="flex items-center gap-2">✅ Assign teachers to students</li>
                  <li className="flex items-center gap-2">✅ Monitor master schedules & logs</li>
                  <li className="flex items-center gap-2">✅ View revenue, fee invoices & payroll</li>
                </ul>
              </div>
              <Link to="/login" className="mt-6 block text-center py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                Admin Sign In &rarr;
              </Link>
            </div>

          </div>
        </section>
      </main>

      {/* 🌟 Public Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-700">TuitionHub Portal</span>
            <span>&bull; Private Academy Management</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Portal Login
            </Link>
            <span>&bull;</span>
            <span className="text-slate-400">Version 1.0 (MVP)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
