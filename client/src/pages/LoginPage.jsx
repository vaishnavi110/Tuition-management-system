import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  ShieldCheck, 
  Calendar, 
  Video, 
  ArrowRight, 
  AlertCircle, 
  Lock, 
  Mail,
  ChevronLeft
} from 'lucide-react';

export default function LoginPage() {
  const { login, quickLogin, error, setError, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setIsSubmitting(true);
    try {
      await quickLogin(role);
      navigate('/dashboard');
    } catch (err) {
      // Error handled
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-12 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Back Link */}
      <div className="max-w-md mx-auto w-full px-4 mb-4">
        <Link 
          to="/" 
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full px-4">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-200/50">
          
          {/* Logo & Heading */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-indigo-100">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Portal Sign In</h2>
            <p className="text-xs text-slate-500 mt-1">Sign in with your registered academy credentials</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email or Mobile Number</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="name@tuition.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span>{isSubmitting ? 'Verifying...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-Click Fast Demo Testing Section */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
              Fast Testing &bull; 1-Click Role Login
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('STUDENT')}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-all text-center group"
              >
                <Video className="w-4 h-4 text-slate-600 group-hover:text-emerald-600 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-slate-700 group-hover:text-emerald-700 block">Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('TEACHER')}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-all text-center group"
              >
                <Calendar className="w-4 h-4 text-slate-600 group-hover:text-blue-600 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-slate-700 group-hover:text-blue-700 block">Teacher</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('ADMIN')}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-purple-50 hover:border-purple-200 transition-all text-center group"
              >
                <ShieldCheck className="w-4 h-4 text-slate-600 group-hover:text-purple-600 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-700 block">Admin</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 mt-8">
        TuitionHub Management &bull; Private & Secure Portal
      </footer>

    </div>
  );
}
