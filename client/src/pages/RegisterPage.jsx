import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Building
} from 'lucide-react';

export default function RegisterPage() {
  const { registerUser, error, setError, user } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('STUDENT'); // STUDENT | TEACHER | ADMIN
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Student specific fields
  const [grade, setGrade] = useState('Grade 10 (Board)');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [schoolName, setSchoolName] = useState('');

  // Teacher specific fields
  const [subject, setSubject] = useState('Mathematics');
  const [qualification, setQualification] = useState('');

  // Admin specific fields
  const [designation, setDesignation] = useState('Academic Coordinator');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setError(null);

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
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Your Account</h2>
            <p className="text-xs text-slate-500 mt-1">Join TuitionHub Academy Portal for personalized 1-on-1 classes</p>
          </div>

          {/* Role Selection Tabs */}
          <div className="mb-6">
            <label className="text-xs font-bold text-slate-700 block mb-2 text-center uppercase tracking-wider">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setRole('STUDENT')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  role === 'STUDENT'
                    ? 'bg-white shadow text-emerald-700 border border-emerald-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('TEACHER')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  role === 'TEACHER'
                    ? 'bg-white shadow text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Teacher</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('ADMIN')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  role === 'ADMIN'
                    ? 'bg-white shadow text-purple-700 border border-purple-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Staff / Admin</span>
              </button>
            </div>
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
            
            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aryan Sharma"
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

            {/* Role Specific Fields */}
            {role === 'STUDENT' && (
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
                <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Student Academic Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Grade / Standard</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                    >
                      <option value="Grade 8">Grade 8 (₹350/hr)</option>
                      <option value="Grade 9">Grade 9 (₹350/hr)</option>
                      <option value="Grade 10 (Board)">Grade 10 Board Exam (₹400/hr)</option>
                      <option value="Grade 11 (Science)">Grade 11 Science/JEE/NEET (₹600/hr)</option>
                      <option value="Grade 12 (Board)">Grade 12 Board/Entrance (₹600/hr)</option>
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

            {role === 'TEACHER' && (
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
                <div className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tutor Qualification & Subjects</span>
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
                  ● Verified compensation rate: ₹250/hr for 1-on-1 conducted classes.
                </span>
              </div>
            )}

            {role === 'ADMIN' && (
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
                <div className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Administrative Role Verification</span>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Staff Designation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Academic Coordinator / Center Manager"
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
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              <span>{isSubmitting ? 'Creating Account...' : `Register as ${role.charAt(0) + role.slice(1).toLowerCase()}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch to Login Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-500">Already have an academy account? </span>
            <Link to="/login" className="text-xs font-bold text-indigo-600 hover:underline">
              Sign In Here
            </Link>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 mt-8">
        TuitionHub Academy Management &bull; Private & Secure Portal
      </footer>

    </div>
  );
}
