import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doctorsAPI, appointmentsAPI } from '../services/api';
import { DoctorDashboardData, Appointment } from '../types';
import { RecommendationModal } from '../components/RecommendationModal';
import {
  Stethoscope,
  Users,
  AlertOctagon,
  Calendar,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Activity,
  PlusCircle,
  Loader2,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const { user, isDoctor } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState<DoctorDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Patient Clinical Drawer
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [patientDetails, setPatientDetails] = useState<any | null>(null);
  const [loadingPatientDetails, setLoadingPatientDetails] = useState<boolean>(false);

  // Recommendation Modal
  const [recModalOpen, setRecModalOpen] = useState<boolean>(false);
  const [recTargetPatient, setRecTargetPatient] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    if (!isDoctor) {
      navigate('/patient/dashboard');
      return;
    }
    fetchDashboard();
  }, [isDoctor]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await doctorsAPI.getDashboard();
      setDashboardData(data);
    } catch (err: any) {
      setError('Failed to load doctor workspace. Please make sure you are logged in as a doctor.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPatientHistory = async (patientId: number) => {
    try {
      setSelectedPatientId(patientId);
      setLoadingPatientDetails(true);
      const data = await doctorsAPI.getPatientDetails(patientId);
      setPatientDetails(data);
    } catch (err: any) {
      console.error('Error fetching patient clinical records:', err);
    } finally {
      setLoadingPatientDetails(false);
    }
  };

  const handleUpdateAppointment = async (apptId: number, status: string) => {
    try {
      await appointmentsAPI.updateStatus(apptId, status);
      fetchDashboard();
    } catch (err: any) {
      alert('Failed to update appointment status.');
    }
  };

  const handleOpenRecModal = (patientId: number, patientName: string) => {
    setRecTargetPatient({ id: patientId, name: patientName });
    setRecModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
        <p className="text-sm font-semibold text-slate-600">Loading Doctor Workspace...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-3xl text-rose-700 max-w-md mx-auto">
          <p className="font-bold text-base mb-2">Workspace Access Error</p>
          <p className="text-xs mb-4">{error}</p>
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

  const { doctor, total_patients, high_risk_patients_count, pending_appointments_count, upcoming_appointments, recent_patients, unread_messages_count } = dashboardData;

  const filteredPatients = recent_patients.filter((p) =>
    p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.risk_level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Welcome Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-400/20">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Doctor Workspace • {doctor.specialization}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {doctor.full_name}
              </h1>
              <p className="text-xs sm:text-sm text-teal-100/80 leading-relaxed">
                {doctor.clinic_name || 'Metropolitan Diabetes Institute'} • {doctor.qualification || 'MD Endocrinology'} ({doctor.experience_years} yrs exp)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/messages"
                className="px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm text-slate-900 bg-white hover:bg-teal-50 shadow-md flex items-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-teal-600" />
                <span>Patient Messages ({unread_messages_count})</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Metrics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Patients
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {total_patients}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Enrolled for screening</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                High-Risk Flagged
              </p>
              <h3 className="text-2xl font-extrabold text-rose-600 mt-1">
                {high_risk_patients_count}
              </h3>
              <p className="text-xs text-rose-600 font-semibold mt-0.5">Requires clinical follow-up</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertOctagon className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Pending Consults
              </p>
              <h3 className="text-2xl font-extrabold text-amber-600 mt-1">
                {pending_appointments_count}
              </h3>
              <p className="text-xs text-amber-600 font-semibold mt-0.5">Awaiting confirmation</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Unread Messages
              </p>
              <h3 className="text-2xl font-extrabold text-indigo-600 mt-1">
                {unread_messages_count}
              </h3>
              <p className="text-xs text-indigo-600 font-semibold mt-0.5">Direct patient questions</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Patient Roster & Risk Severity Queue */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Patient Clinical Risk Queue
              </h3>
              <p className="text-xs text-slate-500">
                Patients sorted by ML risk severity for prioritized clinical review
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient name, email, risk..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Patients Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">ML Risk Tier</th>
                  <th className="py-3 px-4">Risk Probability</th>
                  <th className="py-3 px-4">Latest Glucose</th>
                  <th className="py-3 px-4">BMI</th>
                  <th className="py-3 px-4">Last Assessment</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredPatients.map((p) => (
                  <tr key={p.patient_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{p.full_name}</div>
                      <div className="text-slate-400 text-[11px]">{p.email} • {p.gender}, DOB: {p.dob}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        p.risk_level === 'High Risk'
                          ? 'bg-rose-100 text-rose-800'
                          : p.risk_level === 'Moderate Risk'
                          ? 'bg-amber-100 text-amber-800'
                          : p.risk_level === 'Low Risk'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {p.risk_level}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {p.risk_percentage > 0 ? `${p.risk_percentage}%` : 'N/A'}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {p.latest_glucose ? `${p.latest_glucose} mg/dL` : '--'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {p.latest_bmi ? `${p.latest_bmi} kg/m²` : '--'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {p.last_test_date || 'No tests'}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenPatientHistory(p.patient_id)}
                        className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-[11px] transition-colors"
                      >
                        Clinical Record
                      </button>

                      <button
                        onClick={() => handleOpenRecModal(p.patient_id, p.full_name)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors shadow-2xs"
                      >
                        + Add Advice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Appointment Requests & Management */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Consultation Appointments
              </h3>
              <p className="text-xs text-slate-500">
                Manage upcoming and pending patient consultations
              </p>
            </div>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
              {upcoming_appointments.length} Total Bookings
            </span>
          </div>

          {upcoming_appointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcoming_appointments.map((appt) => (
                <div
                  key={appt.id}
                  className={`p-5 rounded-2xl border text-xs space-y-3 ${
                    appt.status === 'Pending'
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {appt.patient_name}
                      </h4>
                      <p className="text-slate-500 text-[11px]">{appt.patient_email} • {appt.patient_phone}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      appt.status === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : appt.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {appt.status}
                    </span>
                  </div>

                  <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-100">
                    <p className="font-medium text-slate-700"><strong>Reason:</strong> {appt.reason}</p>
                    <p className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{appt.appointment_date} at {appt.time_slot}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    {appt.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateAppointment(appt.id, 'Confirmed')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 text-[11px]"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept & Confirm</span>
                        </button>
                        <button
                          onClick={() => handleUpdateAppointment(appt.id, 'Cancelled')}
                          className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg font-semibold flex items-center gap-1 text-[11px]"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {appt.status === 'Confirmed' && (
                      <button
                        onClick={() => handleUpdateAppointment(appt.id, 'Completed')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold text-[11px]"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-xs text-slate-400">
              No appointments on schedule.
            </div>
          )}
        </div>

      </div>

      {/* Patient Clinical Drawer Modal */}
      {selectedPatientId && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl p-6 overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-lg">Patient Clinical Record</h3>
              </div>
              <button
                onClick={() => setSelectedPatientId(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingPatientDetails ? (
              <div className="py-20 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                <p className="text-xs text-slate-500 font-medium">Fetching clinical records...</p>
              </div>
            ) : patientDetails ? (
              <div className="space-y-6 text-xs">
                
                {/* Patient Summary Card */}
                <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-teal-950">{patientDetails.patient.full_name}</h4>
                    <span className="font-semibold text-teal-700">Blood Group: {patientDetails.patient.blood_group || 'N/A'}</span>
                  </div>
                  <p className="text-slate-600">{patientDetails.patient.email} • Phone: {patientDetails.patient.phone || 'N/A'}</p>
                  <p className="text-slate-600">Address: {patientDetails.patient.address || 'N/A'}</p>
                </div>

                {/* Prediction History Timeline */}
                <div className="space-y-3">
                  <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[11px]">
                    ML Prediction Timeline ({patientDetails.predictions.length} tests)
                  </h4>
                  {patientDetails.predictions.map((pred: any) => (
                    <div key={pred.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          pred.risk_level === 'High Risk'
                            ? 'bg-rose-100 text-rose-800'
                            : pred.risk_level === 'Moderate Risk'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {pred.risk_level} ({pred.risk_percentage}%)
                        </span>
                        <span className="text-slate-400 text-[11px]">{new Date(pred.created_at).toLocaleDateString()}</span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 pt-1 text-[11px] font-medium text-slate-700">
                        <div>Glucose: <strong className="text-slate-900">{pred.inputs.glucose}</strong></div>
                        <div>BMI: <strong className="text-slate-900">{pred.inputs.bmi}</strong></div>
                        <div>BP: <strong className="text-slate-900">{pred.inputs.blood_pressure}</strong></div>
                        <div>Age: <strong className="text-slate-900">{pred.inputs.age}</strong></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Existing Recommendations */}
                <div className="space-y-3">
                  <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[11px]">
                    Prescribed Advice History
                  </h4>
                  {patientDetails.recommendations.map((rec: any) => (
                    <div key={rec.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <p className="font-medium text-slate-800">"{rec.clinical_recommendation}"</p>
                      {rec.lifestyle_advice && <p className="text-slate-600"><strong>Lifestyle:</strong> {rec.lifestyle_advice}</p>}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>By {rec.doctor_name}</span>
                        <span>{new Date(rec.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      const pName = patientDetails.patient.full_name;
                      const pId = patientDetails.patient.id;
                      setSelectedPatientId(null);
                      handleOpenRecModal(pId, pName);
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md"
                  >
                    + Publish New Recommendations For This Patient
                  </button>
                </div>

              </div>
            ) : null}

          </div>
        </div>
      )}

      {/* Recommendation Writer Modal */}
      {recTargetPatient && (
        <RecommendationModal
          isOpen={recModalOpen}
          onClose={() => setRecModalOpen(false)}
          patientId={recTargetPatient.id}
          patientName={recTargetPatient.name}
          onSuccess={fetchDashboard}
        />
      )}
    </div>
  );
};
