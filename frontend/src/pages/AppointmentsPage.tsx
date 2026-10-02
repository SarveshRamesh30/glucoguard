import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentsAPI } from '../services/api';
import { Appointment, AppointmentStatus } from '../types';
import { AppointmentModal } from '../components/AppointmentModal';
import {
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  PlusCircle,
  Loader2,
  Filter,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AppointmentsPage: React.FC = () => {
  const { user, isDoctor, isPatient } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentsAPI.list();
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: AppointmentStatus) => {
    try {
      setActionLoading(id);
      await appointmentsAPI.updateStatus(id, status);
      fetchAppointments();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update appointment status.');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (statusFilter === 'ALL') return true;
    return a.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>Consultation Schedule</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Appointment Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Track consultation requests, manage time slots, and connect with clinical specialists.
            </p>
          </div>

          {isPatient && (
            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-102"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book New Appointment</span>
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['ALL', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === tab
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab === 'ALL' ? 'All Bookings' : tab}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-xs text-slate-500 font-semibold">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredAppointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 text-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                        {isDoctor ? <User className="w-5 h-5 text-teal-600" /> : <Stethoscope className="w-5 h-5 text-emerald-600" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-tight">
                          {isDoctor ? appt.patient_name : appt.doctor_name}
                        </h3>
                        <p className="text-slate-500 text-[11px]">
                          {isDoctor ? `Patient #${appt.patient_id}` : appt.doctor_specialization}
                        </p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      appt.status === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : appt.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : appt.status === 'Completed'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {appt.status}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 font-medium text-slate-700">
                    <p className="flex items-center gap-1.5 text-slate-800 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>{appt.appointment_date} • {appt.time_slot}</span>
                    </p>
                    {appt.clinic_name && (
                      <p className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span className="truncate">{appt.clinic_name}</span>
                      </p>
                    )}
                    <p className="text-slate-600 pt-1">
                      <strong>Reason:</strong> {appt.reason}
                    </p>
                  </div>

                  {appt.notes && (
                    <div className="text-slate-500 text-[11px] italic bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                      Notes: {appt.notes}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to="/messages"
                    className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </Link>

                  <div className="flex items-center gap-2">
                    {/* Doctor Controls */}
                    {isDoctor && appt.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(appt.id, 'Confirmed')}
                          disabled={actionLoading === appt.id}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px]"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(appt.id, 'Cancelled')}
                          disabled={actionLoading === appt.id}
                          className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-xl text-[11px]"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {isDoctor && appt.status === 'Confirmed' && (
                      <button
                        onClick={() => handleStatusUpdate(appt.id, 'Completed')}
                        disabled={actionLoading === appt.id}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-[11px]"
                      >
                        Complete
                      </button>
                    )}

                    {/* Patient Controls */}
                    {isPatient && (appt.status === 'Pending' || appt.status === 'Confirmed') && (
                      <button
                        onClick={() => handleStatusUpdate(appt.id, 'Cancelled')}
                        disabled={actionLoading === appt.id}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-[11px] border border-rose-200"
                      >
                        Cancel Appointment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400 bg-white rounded-3xl border border-slate-200 space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No appointments found in this category.</p>
            {isPatient && (
              <button
                onClick={() => setModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold inline-block"
              >
                Book Your Consultation
              </button>
            )}
          </div>
        )}

      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchAppointments}
      />
    </div>
  );
};
