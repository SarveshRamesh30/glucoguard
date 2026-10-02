import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { patientsAPI } from '../services/api';
import { PatientDashboardData } from '../types';
import { RiskGauge } from '../components/RiskGauge';
import { AppointmentModal } from '../components/AppointmentModal';
import {
  HeartPulse,
  Calendar,
  MapPin,
  MessageSquare,
  TrendingUp,
  Stethoscope,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Loader2,
  PlusCircle,
  FileText,
  User,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const PatientDashboard: React.FC = () => {
  const { user, isDoctor } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState<PatientDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isDoctor) {
      navigate('/doctor/dashboard');
      return;
    }
    fetchDashboard();
  }, [isDoctor]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientsAPI.getDashboard();
      setDashboardData(data);
    } catch (err: any) {
      setError('Failed to load dashboard data. Please make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <p className="text-sm font-semibold text-slate-600">Loading Patient Health Portal...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-3xl text-rose-700 max-w-md mx-auto">
          <p className="font-bold text-base mb-2">Error Loading Dashboard</p>
          <p className="text-xs mb-4">{error || 'Please log in again.'}</p>
          <button
            onClick={fetchDashboard}
            className="px-4 py-2 bg-rose-600 text-white font-semibold rounded-xl text-xs"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { patient, latest_prediction, risk_trend, upcoming_appointments, recent_recommendations, unread_messages_count } = dashboardData;

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Welcome Banner & Fast Action Bar */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Patient Health Dashboard • ID: #{patient.id}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Hello, {patient.full_name}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                Monitor your diabetes risk trajectory, review personalized doctor precautions, and keep track of your upcoming clinic consultations.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/predict"
                className="px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm text-slate-900 bg-white hover:bg-emerald-50 shadow-md flex items-center gap-2 transition-all hover:scale-102"
              >
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <span>Start New Prediction</span>
              </Link>

              <button
                onClick={() => setAppointmentModalOpen(true)}
                className="px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center gap-2 transition-all hover:scale-102"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Risk Status */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Current Risk Status
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                {latest_prediction ? latest_prediction.risk_level : 'No Assessment'}
              </h3>
              <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                {latest_prediction ? `${latest_prediction.risk_percentage}% Probability` : 'Run your first test'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <HeartPulse className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Latest Glucose */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Latest Glucose Level
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                {latest_prediction ? `${latest_prediction.inputs?.glucose || 112} mg/dL` : '--'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Target: &lt;100 mg/dL (fasting)
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Upcoming Appointment */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Next Appointment
              </p>
              <h3 className="text-sm font-extrabold text-slate-900 mt-1 truncate max-w-[150px]">
                {upcoming_appointments.length > 0
                  ? upcoming_appointments[0].appointment_date
                  : 'None Scheduled'}
              </h3>
              <p className="text-xs text-amber-600 font-semibold mt-0.5 truncate max-w-[150px]">
                {upcoming_appointments.length > 0
                  ? `${upcoming_appointments[0].doctor_name}`
                  : 'Ready to book'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Unread Messages */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Doctor Messaging
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                {unread_messages_count > 0 ? `${unread_messages_count} New` : 'Up to date'}
              </h3>
              <Link to="/messages" className="text-xs text-indigo-600 font-bold hover:underline mt-0.5 inline-block">
                Open Chat Room →
              </Link>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Main Grid: Latest Prediction & Trend Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Latest Prediction Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <h3 className="font-bold text-slate-900 text-base">Latest Risk Assessment</h3>
                </div>
                <span className="text-xs text-slate-400">
                  {latest_prediction ? new Date(latest_prediction.created_at).toLocaleDateString() : ''}
                </span>
              </div>

              {latest_prediction ? (
                <div className="space-y-6">
                  <div className="flex justify-center py-2">
                    <RiskGauge
                      score={latest_prediction.risk_score}
                      riskLevel={latest_prediction.risk_level}
                      size="md"
                    />
                  </div>

                  {/* Factor Badges */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Evaluated Factor Highlights
                    </p>
                    <div className="space-y-2">
                      {latest_prediction.contributing_factors?.slice(0, 3).map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium"
                        >
                          <span className="text-slate-700">{f.label} ({f.value} {f.unit})</span>
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            f.impact === 'High Risk Factor'
                              ? 'bg-rose-100 text-rose-700'
                              : f.impact === 'Positive'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {f.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center space-y-3">
                  <HeartPulse className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">No predictions recorded yet</p>
                  <Link
                    to="/predict"
                    className="inline-block px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                  >
                    Run First Prediction
                  </Link>
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <Link to="/predict" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
                <span>Run New Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/clinics" className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1">
                <span>Find Doctors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Risk Progression Trend Chart */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-base">Diabetes Risk Progression</h3>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {risk_trend.length} Historical Tests
                </span>
              </div>

              {risk_trend.length > 0 ? (
                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={risk_trend}>
                      <defs>
                        <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} unit="%" tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderRadius: '1rem',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                          fontSize: '12px'
                        }}
                        formatter={(val: any) => [`${val}%`, 'Risk Score']}
                      />
                      <Area
                        type="monotone"
                        dataKey="risk_percentage"
                        stroke="#059669"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#riskGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                  Perform multiple predictions to view your historical risk curve.
                </div>
              )}
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Goal: Maintain risk probability below 35% (Low Risk)</span>
              <span className="font-semibold text-emerald-600">Active Glycemic Protocol</span>
            </div>
          </div>

        </div>

        {/* Bottom Split: Doctor Recommendations & Upcoming Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Doctor Recommendations */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">Doctor Recommendations</h3>
              </div>
              <span className="text-xs text-slate-400">Personalized Guidance</span>
            </div>

            {recent_recommendations.length > 0 ? (
              <div className="space-y-4">
                {recent_recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100/80 space-y-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-teal-900 text-sm">
                        {rec.doctor_name || 'Attending Specialist'}
                      </span>
                      <span className="text-teal-700 font-medium text-[11px]">
                        {new Date(rec.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-slate-700 leading-relaxed font-medium">
                      "{rec.clinical_recommendation}"
                    </p>

                    {rec.lifestyle_advice && (
                      <div className="pt-2 border-t border-teal-100 flex items-start gap-1.5 text-teal-800">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-teal-600" />
                        <span><strong>Lifestyle:</strong> {rec.lifestyle_advice}</span>
                      </div>
                    )}

                    {rec.follow_up_date && (
                      <div className="flex items-center gap-1.5 text-amber-800 font-semibold pt-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Follow-up Date: {rec.follow_up_date}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-xs text-slate-400 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-300" />
                <p>No doctor recommendations yet.</p>
                <p>Book a consultation to receive personalized clinical guidance.</p>
              </div>
            )}
          </div>

          {/* Upcoming & Past Appointments */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">My Appointments</h3>
              </div>
              <Link to="/appointments" className="text-xs font-bold text-emerald-600 hover:underline">
                View All →
              </Link>
            </div>

            {upcoming_appointments.length > 0 ? (
              <div className="space-y-3">
                {upcoming_appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{appt.doctor_name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          appt.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : appt.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                      <p className="text-slate-600 font-medium">{appt.clinic_name}</p>
                      <p className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{appt.appointment_date} • {appt.time_slot}</span>
                      </p>
                    </div>

                    <Link
                      to="/messages"
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 text-xs font-semibold shrink-0 shadow-2xs hover:bg-emerald-50 transition-colors"
                    >
                      Message Doctor
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-xs text-slate-400 space-y-2">
                <Calendar className="w-8 h-8 mx-auto text-slate-300" />
                <p>No upcoming appointments scheduled.</p>
                <button
                  onClick={() => setAppointmentModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold inline-block"
                >
                  Schedule Consultation
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        onSuccess={fetchDashboard}
      />
    </div>
  );
};
