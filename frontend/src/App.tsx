import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PredictPage } from './pages/PredictPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { ClinicsPage } from './pages/ClinicsPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { MessagesPage } from './pages/MessagesPage';
import { MLInsightsPage } from './pages/MLInsightsPage';
import { ProfilePage } from './pages/ProfilePage';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole?: 'patient' | 'doctor' }> = ({
  children,
  allowedRole,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    if (user?.role === 'doctor') {
      return <Navigate to="/doctor/dashboard" replace />;
    } else {
      return <Navigate to="/patient/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/predict" element={<PredictPage />} />
              <Route path="/clinics" element={<ClinicsPage />} />
              <Route path="/ml-insights" element={<MLInsightsPage />} />

              {/* Patient Protected Routes */}
              <Route
                path="/patient/dashboard"
                element={
                  <ProtectedRoute allowedRole="patient">
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Doctor Protected Routes */}
              <Route
                path="/doctor/dashboard"
                element={
                  <ProtectedRoute allowedRole="doctor">
                    <DoctorDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Shared Protected Routes */}
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <AppointmentsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <MessagesPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
