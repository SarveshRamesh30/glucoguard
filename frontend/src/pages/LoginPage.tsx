import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import {
  Activity,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2,
  Stethoscope,
  User,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [demoLoading, setDemoLoading] = useState<'patient' | 'doctor' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both your email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      // Determine where to navigate based on role from storage
      const savedUser = localStorage.getItem('glucoguard_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u.role === 'doctor') {
          navigate('/doctor/dashboard');
        } else {
          navigate('/patient/dashboard');
        }
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'patient' | 'doctor') => {
    try {
      setDemoLoading(role);
      setError(null);
      await demoLogin(role);
      if (role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err) {
      setError('Failed to initiate demo login. Please try again.');
    } finally {
      setDemoLoading(null);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      const res = await authAPI.forgotPassword(forgotEmail);
      setForgotMsg(res.message);
    } catch (e) {
      setForgotMsg('Password reset instructions dispatched.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 relative">
      <div className="max-w-md w-full space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Activity className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              Gluco<span className="text-emerald-600">Guard</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-500">
            Access your diabetes prediction portal and doctor consultations
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200/80">
          
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@glucoguard.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 disabled:opacity-60 flex items-center justify-center gap-2 transition-all text-sm mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-1.5 mb-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant 1-Click Demo Login</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('patient')}
                disabled={demoLoading !== null}
                className="p-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/80 text-emerald-900 text-left transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold text-xs flex items-center gap-1 text-emerald-800">
                    <User className="w-3.5 h-3.5" /> Patient
                  </span>
                  {demoLoading === 'patient' && <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />}
                </div>
                <div className="text-[11px] text-emerald-700 font-medium">Priya Saravanan</div>
                <div className="text-[10px] text-emerald-600/80">patient@glucoguard.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('doctor')}
                disabled={demoLoading !== null}
                className="p-3 rounded-2xl border border-teal-200 bg-teal-50/60 hover:bg-teal-100/80 text-teal-900 text-left transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold text-xs flex items-center gap-1 text-teal-800">
                    <Stethoscope className="w-3.5 h-3.5" /> Doctor
                  </span>
                  {demoLoading === 'doctor' && <Loader2 className="w-3 h-3 animate-spin text-teal-600" />}
                </div>
                <div className="text-[11px] text-teal-700 font-medium">Dr. R. Sundaram</div>
                <div className="text-[10px] text-teal-600/80">dr.sundaram@glucoguard.com</div>
              </button>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-emerald-600 hover:underline">
                Create new account
              </Link>
            </p>
          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 animate-fade-in">
            <h3 className="font-bold text-lg text-slate-900 mb-1">Reset Password</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your registered email address and we'll send you a password reset link.
            </p>
            {forgotMsg ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl mb-4 flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{forgotMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="patient@glucoguard.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotModalOpen(false);
                      setForgotMsg(null);
                    }}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                  >
                    Send Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
