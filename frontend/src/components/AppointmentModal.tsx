import React, { useState, useEffect } from 'react';
import { Doctor, Clinic } from '../types';
import { doctorsAPI, clinicsAPI, appointmentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, Calendar, Clock, Stethoscope, MapPin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoctorId?: number | null;
  initialClinicId?: number | null;
  onSuccess?: () => void;
}

const TIME_SLOTS = [
  "09:00 AM - 09:30 AM",
  "09:30 AM - 10:00 AM",
  "10:00 AM - 10:30 AM",
  "10:30 AM - 11:00 AM",
  "11:00 AM - 11:30 AM",
  "11:30 AM - 12:00 PM",
  "02:00 PM - 02:30 PM",
  "02:30 PM - 03:00 PM",
  "03:00 PM - 03:30 PM",
  "03:30 PM - 04:00 PM",
  "04:00 PM - 04:30 PM",
  "04:30 PM - 05:00 PM",
];

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  initialDoctorId,
  initialClinicId,
  onSuccess,
}) => {
  const { isAuthenticated, isPatient } = useAuth();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | ''>(initialDoctorId || '');
  const [selectedClinicId, setSelectedClinicId] = useState<number | ''>(initialClinicId || '');
  const [date, setDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [reason, setReason] = useState<string>('Diabetes Risk Review & Glycemic Consultation');
  const [notes, setNotes] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccess(false);
      if (!date) setDate(minDateStr);
      if (initialDoctorId) setSelectedDoctorId(initialDoctorId);
      if (initialClinicId) setSelectedClinicId(initialClinicId);

      fetchOptions();
    }
  }, [isOpen, initialDoctorId, initialClinicId]);

  const fetchOptions = async () => {
    try {
      setLoading(true);
      const [docsData, clinicsData] = await Promise.all([
        doctorsAPI.getAll(),
        clinicsAPI.getClinics(),
      ]);
      setDoctors(docsData);
      setClinics(clinicsData);
      if (!selectedDoctorId && docsData.length > 0) {
        setSelectedDoctorId(docsData[0].id);
      }
    } catch (err: any) {
      setError('Failed to load doctors and clinics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorChange = (docId: number) => {
    setSelectedDoctorId(docId);
    const doc = doctors.find((d) => d.id === docId);
    if (doc && doc.clinic_id) {
      setSelectedClinicId(doc.clinic_id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isPatient) {
      setError('Only registered patients can book appointments. Please login as a patient.');
      return;
    }
    if (!selectedDoctorId) {
      setError('Please select a doctor.');
      return;
    }
    if (!date) {
      setError('Please select a preferred date.');
      return;
    }
    if (!timeSlot) {
      setError('Please select an available time slot.');
      return;
    }
    if (!reason.trim()) {
      setError('Please specify the reason for your visit.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await appointmentsAPI.book({
        doctor_id: Number(selectedDoctorId),
        clinic_id: selectedClinicId ? Number(selectedClinicId) : null,
        appointment_date: date,
        time_slot: timeSlot,
        reason: reason.trim(),
        notes: notes.trim() || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1800);
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to book appointment. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 leading-tight">
                Schedule Doctor Consultation
              </h3>
              <p className="text-xs text-slate-500">
                Book an in-clinic or telemedicine evaluation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {success ? (
            <div className="py-8 flex flex-col items-center text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-1">
                Appointment Booked Successfully!
              </h4>
              <p className="text-sm text-slate-600 max-w-sm mb-4">
                Your consultation request has been submitted to the doctor. You can track confirmation status in your dashboard.
              </p>
              <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold">
                Scheduled for {date} at {timeSlot}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Booking Conflict / Error:</span>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              {/* Doctor Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                  Select Consulting Specialist
                </label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => handleDoctorChange(Number(e.target.value))}
                  disabled={loading}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white font-medium"
                >
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.full_name} – {doc.specialization} (₹{doc.consultation_fee})
                    </option>
                  ))}
                </select>
              </div>

              {/* Clinic Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  Clinic / Location
                </label>
                <select
                  value={selectedClinicId}
                  onChange={(e) => setSelectedClinicId(Number(e.target.value))}
                  disabled={loading}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white font-medium"
                >
                  <option value="">Clinic Assigned to Doctor</option>
                  {clinics.map((cl) => (
                    <option key={cl.id} value={cl.id}>
                      {cl.name} ({cl.address})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Slot Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    min={minDateStr}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white font-medium"
                  >
                    <option value="">Choose slot...</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Reason for Consultation
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., High diabetes risk score follow-up, HbA1c testing"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Additional Clinical Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Any symptoms, current medications, or recent blood test figures..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || loading}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 disabled:opacity-60 flex items-center gap-2 transition-all"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirming Slot...</span>
                    </>
                  ) : (
                    <span>Confirm Booking</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
