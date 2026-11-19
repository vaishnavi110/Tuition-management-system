import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  ArrowRight, 
  AlertCircle, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  BookOpen, 
  ChevronLeft,
  CheckCircle2,
  ShieldCheck,
  Video,
  Award,
  KeyRound,
  Info
} from 'lucide-react';

// Strict Validation helpers
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

const isValidPhoneNumber = (phoneNumber) => {
  if (!phoneNumber || typeof phoneNumber !== 'string') return false;
  const cleaned = phoneNumber.replace(/[\s\-()]/g, '');
  return /^(\+91|0)?[6-9]\d{9}$/.test(cleaned);
};

export default function RegisterPage() {
  const { registerUser, error, setError, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL query params support (e.g. /register?role=TEACHER&code=TUTOR-2026-INVITE&subject=Chemistry)
  const initialRole = searchParams.get('role')?.toUpperCase() || 'STUDENT';
  const initialCode = searchParams.get('code') || '';
  const initialSubject = searchParams.get('subject') || 'Mathematics';

  const [role, setRole] = useState(initialRole); // STUDENT | TEACHER | ADMIN
  const [inviteCode, setInviteCode] = useState(initialCode);
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Student specific fields (100% Public)
  const [grade, setGrade] = useState('Grade 10 (Board)');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [schoolName, setSchoolName] = useState('');

  // Teacher specific fields (Authorized Invite Only)
  const [subject, setSubject] = useState(initialSubject);
  const [qualification, setQualification] = useState('');

  // Admin specific fields (Authorized Invite Only)
  const [designation, setDesignation] = useState('Operations Manager');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setError(null);

    // Security check: If registering as Teacher or Admin, require an invitation code
    if (role !== 'STUDENT' && !inviteCode.trim()) {
      setValidationError(`An invitation code is required to register as a ${role === 'TEACHER' ? 'Teacher' : 'Admin'}.`);
      return;
    }

    // 📧 Strict Email / Gmail Validation
    if (!emailOrPhone.trim()) {
      setValidationError('Email address is required.');
      return;
    }
    if (!isValidEmail(emailOrPhone.trim())) {
      setValidationError('Please enter a valid email address (e.g. name@gmail.com).');
      return;
    }

    // 📱 Strict Mobile Contact Validation
    if (!phone.trim()) {
      setValidationError('Mobile contact number is required.');
      return;
    }
    if (!isValidPhoneNumber(phone.trim())) {
      setValidationError('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9 (e.g. 9876543210 or +91 9876543210).');
      return;
    }

    // 👨‍👩‍👧 Parent Phone validation if entered for student
    if (role === 'STUDENT' && parentPhone.trim() && !isValidPhoneNumber(parentPhone.trim())) {
      setValidationError('Please enter a valid 10-digit parent/guardian mobile number (e.g. 9123456789 or +91 9123456789).');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name,
        emailOrPhone,
        phone,
        password,
        role,
        inviteCode: role !== 'STUDENT' ? inviteCode.trim() : undefined,
        grade: role === 'STUDENT' ? grade : undefined,
        parentName: role === 'STUDENT' ? parentName : undefined,
        parentPhone: role === 'STUDENT' ? parentPhone : undefined,
        schoolName: role === 'STUDENT' ? schoolName : undefined,
        subject: role === 'TEACHER' ? subject : undefined,
        qualification: role === 'TEACHER' ? qualification : undefined,
        designation: role === 'ADMIN' ? designation : undefined
      };

      await registerUser(payload);
      navigate('/dashboard');
    } catch (err) {
      // Handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-8 sm:py-12 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Back Link */}
      <div className="max-w-xl mx-auto w-full px-4 mb-4">
        <Link 
          to="/" 
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Registration Card */}
      <div className="max-w-xl mx-auto w-full px-4">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-200/50">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-indigo-100">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {role === 'STUDENT' ? 'Student Registration' : 'Teacher & Admin Registration'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {role === 'STUDENT' 
                ? 'Tuition enrollment for students & parents' 
                : 'Teacher & Admin accounts require an invitation code'}
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => { setRole('STUDENT'); setValidationError(''); setError(null); }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  role === 'STUDENT'
                    ? 'bg-white shadow text-emerald-700 border border-emerald-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Student / Parent</span>
              </button>

              <button
                type="button"
                onClick={() => { setRole('TEACHER'); setValidationError(''); setError(null); }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  role !== 'STUDENT'
                    ? 'bg-white shadow text-indigo-700 border border-indigo-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Teacher / Admin (Invite Only)</span>
              </button>
            </div>

            {/* Sub-toggle for Teacher vs Admin if Invite Only is selected */}
            {role !== 'STUDENT' && (
              <div className="flex items-center justify-center gap-3 mt-3 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-600">Role:</span>
                <button
                  type="button"
                  onClick={() => setRole('TEACHER')}
                  className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                    role === 'TEACHER' 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Teacher
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                    role === 'ADMIN' 
                      ? 'bg-purple-50 text-purple-700 border-purple-200' 
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Admin
                </button>
              </div>
            )}
          </div>

          {/* Error Banner */}
          {(error || validationError) && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error || validationError}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* INVITATION CODE INPUT (Mandatory for Teacher and Admin) */}
            {role !== 'STUDENT' && (
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Invitation Code (Required)</span>
                  </label>
                  <span className="text-[10px] font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                    Invite-Only Access
                  </span>
                </div>

                <input
                  type="text"
                  required
                  placeholder={role === 'TEACHER' ? 'e.g. TUTOR-2026-INVITE' : 'e.g. ADMIN-SUPER-2026'}
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-300 text-sm font-mono tracking-wider font-bold text-indigo-900 bg-white uppercase focus:ring-2 focus:ring-indigo-500/20"
                />

                <div className="flex items-center justify-between text-[11px] text-indigo-700">
                  <span>Enter the invitation code issued by the academy.</span>
                  <button
                    type="button"
                    onClick={() => setInviteCode(role === 'TEACHER' ? 'TUTOR-2026-INVITE' : 'ADMIN-SUPER-2026')}
                    className="text-xs font-bold underline text-indigo-800 hover:text-indigo-950"
                  >
                    Fill Demo Code
                  </button>
                </div>
              </div>
            )}

            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder={role === 'STUDENT' ? 'e.g. Aryan Sharma' : 'e.g. Mrs. Sunita Verma'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Contact</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Email / Username */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address (Login ID)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all bg-white"
                />
              </div>
            </div>

            {/* Public Student Information */}
            {role === 'STUDENT' && (
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
                <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Student Academic Details</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    No Invite Code Needed
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Grade / Standard</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                    >
                      <option value="Grade 8">Grade 8 (₹350 per hour)</option>
                      <option value="Grade 9">Grade 9 (₹350 per hour)</option>
                      <option value="Grade 10 (Board)">Grade 10 Board Exam (₹400 per hour)</option>
                      <option value="Grade 11 (Science)">Grade 11 Science/JEE/NEET (₹600 per hour)</option>
                      <option value="Grade 12 (Board)">Grade 12 Board/Entrance (₹600 per hour)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Current School Name</label>
                    <input
                      type="text"
                      placeholder="e.g. DPS / St. Xavier's"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Parent / Guardian Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Mr. Rajesh Sharma"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Parent Contact Number</label>
                    <input
                      type="tel"
                      placeholder="+91 91234 56789"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Teacher Information */}
            {role === 'TEACHER' && (
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
                <div className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  <span>Teacher Subject & Qualifications</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Primary Teaching Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="English">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Educational Qualification</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. M.Sc. Math, B.Ed"
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>
                <span className="text-[11px] text-blue-700 font-semibold block">
                  ● Teacher rate: ₹250 per hour for conducted classes.
                </span>
              </div>
            )}

            {/* Admin Information */}
            {role === 'ADMIN' && (
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
                <div className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Admin Role</span>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Administrative Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Operations Director / Academic Coordinator"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>
            )}

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all bg-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-2 ${
                role === 'STUDENT'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-100'
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-indigo-100'
              }`}
            >
              <span>
                {isSubmitting 
                  ? 'Registering...' 
                  : role === 'STUDENT'
                    ? 'Register Student'
                    : `Register as ${role === 'TEACHER' ? 'Teacher' : 'Admin'}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch to Login Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-500">Already registered with the academy? </span>
            <Link to="/login" className="text-xs font-bold text-indigo-600 hover:underline">
              Sign In
            </Link>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 mt-8">
        TuitionHub Academy &bull; Private Portal
      </footer>

    </div>
  );
}
