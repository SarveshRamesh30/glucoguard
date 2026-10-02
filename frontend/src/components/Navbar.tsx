import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  HeartPulse,
  MapPin,
  Calendar,
  MessageSquare,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  Stethoscope,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isDoctor, isPatient, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Gluco<span className="text-emerald-600">Guard</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  ML AI
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium tracking-wide">
                Predict Early. Prevent Better.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>

            <Link
              to="/predict"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/predict') ? 'text-emerald-600 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <HeartPulse className="w-4 h-4 text-emerald-500" />
              <span>Predict Risk</span>
            </Link>

            <Link
              to="/clinics"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/clinics') ? 'text-emerald-600 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4 text-sky-500" />
              <span>Nearby Clinics</span>
            </Link>

            <Link
              to="/ml-insights"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/ml-insights') ? 'text-emerald-600 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-purple-500" />
              <span>ML Insights</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to={isDoctor ? '/doctor/dashboard' : '/patient/dashboard'}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive(isDoctor ? '/doctor/dashboard' : '/patient/dashboard')
                      ? 'text-emerald-600 bg-emerald-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Activity className="w-4 h-4 text-teal-500" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/appointments"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/appointments') ? 'text-emerald-600 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>Appointments</span>
                </Link>

                <Link
                  to="/messages"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/messages') ? 'text-emerald-600 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                  <span>Messages</span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Action & User Controls */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/50 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    {isDoctor ? <Stethoscope className="w-4 h-4 text-emerald-700" /> : user?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 leading-tight">
                      {user?.full_name || user?.email}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-medium capitalize">
                      {user?.role} Account
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to={isDoctor ? '/doctor/dashboard' : '/patient/dashboard'}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
                    >
                      <Activity className="w-4 h-4" />
                      <span>{isDoctor ? 'Doctor Workspace' : 'Patient Health Portal'}</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/appointments"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Appointments</span>
                    </Link>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 text-left font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-sm shadow-emerald-600/20 hover:shadow-md hover:shadow-emerald-600/30 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/predict"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-600 hover:bg-emerald-50"
          >
            Predict Risk
          </Link>
          <Link
            to="/clinics"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-sky-600 hover:bg-sky-50"
          >
            Nearby Clinics
          </Link>
          <Link
            to="/ml-insights"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-purple-600 hover:bg-purple-50"
          >
            ML Insights
          </Link>

          {isAuthenticated ? (
            <>
              <div className="border-t border-slate-200 my-2 pt-2">
                <Link
                  to={isDoctor ? '/doctor/dashboard' : '/patient/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  Dashboard
                </Link>
                <Link
                  to="/appointments"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  Appointments
                </Link>
                <Link
                  to="/messages"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  Messages
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="border-t border-slate-200 my-2 pt-3 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl font-semibold text-white bg-emerald-600"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
