import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { patientsAPI } from '../services/api';
import { Patient } from '../types';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Heart,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, isDoctor } = useAuth();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [gender, setGender] = useState<string>('Female');
  const [bloodGroup, setBloodGroup] = useState<string>('O+');
  const [emergencyContact, setEmergencyContact] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    if (!isDoctor) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [isDoctor]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await patientsAPI.getProfile();
      setPatient(data);
      setFullName(data.full_name || '');
      setPhone(data.phone || '');
      setDob(data.dob || '');
      setGender(data.gender || 'Female');
      setBloodGroup(data.blood_group || 'O+');
      setEmergencyContact(data.emergency_contact || '');
      setAddress(data.address || '');
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDoctor) return;

    try {
      setSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const updated = await patientsAPI.updateProfile({
        full_name: fullName,
        phone,
        dob,
        gender,
        blood_group: bloodGroup,
        emergency_contact: emergencyContact,
        address,
      });

      setPatient(updated);
      setSuccessMsg('Patient profile updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <p className="text-sm font-semibold text-slate-600">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>User Profile & Health Records</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Personal Information
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Manage your personal and medical information used across GlucoGuard.
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-6">
          
          {/* User Badge Top */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-xl shadow-xs">
              {isDoctor ? <Stethoscope className="w-7 h-7 text-teal-700" /> : fullName.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                {user?.full_name || fullName || user?.email}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {user?.email} • <span className="capitalize text-emerald-700 font-bold">{user?.role} Account</span>
              </p>
            </div>
          </div>

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isDoctor ? (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-2">
              <p className="font-bold text-slate-800 text-sm">Doctor Profile Status</p>
              <p>Your specialist qualifications and clinic affiliations are managed by clinical administration.</p>
              <p>To update your consultation fee or clinic hours, contact the platform support desk.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="Contact Name & Number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, City, State, ZIP"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center gap-2 text-xs transition-all"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Update Profile</span>
                    </>
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
