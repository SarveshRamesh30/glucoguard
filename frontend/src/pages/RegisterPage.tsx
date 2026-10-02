import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  User,
  Stethoscope,
  Lock,
  Mail,
  Phone,
  Calendar,
  Building2,
  Award,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { registerPatient, registerDoctor } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Common Fields
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  // Patient Fields
  const [dob, setDob] = useState<string>('1990-01-01');
  const [gender, setGender] = useState<string>('Female');
  const [bloodGroup, setBloodGroup] = useState<string>('O+');
  const [emergencyContact, setEmergencyContact] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  // Doctor Fields
  const [specialization, setSpecialization] = useState<string>('Diabetologist & Endocrinologist');
  const [clinicName, setClinicName] = useState<string>('Metro Diabetes & Endocrine Care');
  const [experienceYears, setExperienceYears] = useState<number>(8);
  const [qualification, setQualification] = useState<string>('MBBS, MD - Endocrinology');
  const [consultationFee, setConsultationFee] = useState<number>(60);
  const [bio, setBio] = useState<string>('Dedicated to evidence-based glycemic control and preventive diabetes therapeutics.');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill out all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (role === 'patient') {
        await registerPatient({
          full_name: fullName,
          email,
          password,
          phone,
          dob,
          gender,
          blood_group: bloodGroup,
          emergency_contact: emergencyContact || undefined,
          address: address || undefined,
        });
        navigate('/patient/dashboard');
      } else {
        await registerDoctor({
          full_name: fullName,
          email,
          password,
          phone,
          specialization,
          clinic_name: clinicName,
          experience_years: Number(experienceYears),
          qualification,
          consultation_fee: Number(consultationFee),
          bio: bio || undefined,
        });
        navigate('/doctor/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-2xl w-full space-y-6">
        
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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Create Your Account
          </h2>
          <p className="text-xs text-slate-500">
            Join the diabetes prediction & prevention healthcare network
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="bg-slate-200/80 p-1.5 rounded-2xl grid grid-cols-2 gap-1.5 shadow-inner">
          <button
            type="button"
            onClick={() => setRole('patient')}
            className={`py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              role === 'patient'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-emerald-600" />
            <span>I am a Patient</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('doctor')}
            className={`py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              role === 'doctor'
                ? 'bg-white text-teal-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-teal-600" />
            <span>I am a Doctor / Specialist</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200/80">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Common Credentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={role === 'patient' ? "e.g. Sarah Connor" : "e.g. Dr. Michael Chen"}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password (min 6 chars) *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>

              {/* Role specific field in top grid */}
              {role === 'patient' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Clinical Specialization *
                  </label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    required
                    placeholder="e.g. Diabetologist, Endocrinologist"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                  />
                </div>
              )}
            </div>

            {/* Patient Specific Fields */}
            {role === 'patient' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
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
                    placeholder="Name (+1 555-123)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
            )}

            {/* Doctor Specific Fields */}
            {role === 'doctor' && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Clinic / Hospital
                    </label>
                    <input
                      type="text"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      placeholder="e.g. Metro Care"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Consultation Fee ($)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={consultationFee}
                      onChange={(e) => setConsultationFee(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Qualifications & Degrees
                  </label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="e.g. MBBS, MD (Endocrinology), FACP"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Professional Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm resize-none"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 disabled:opacity-60 flex items-center justify-center gap-2 transition-all text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Register as {role === 'patient' ? 'Patient' : 'Doctor'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-emerald-600 hover:underline">
                Sign In here
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
