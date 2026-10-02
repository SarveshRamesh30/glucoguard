import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { predictionsAPI } from '../services/api';
import { Prediction, PredictionInput } from '../types';
import { RiskGauge } from '../components/RiskGauge';
import { AppointmentModal } from '../components/AppointmentModal';
import confetti from 'canvas-confetti';
import {
  HeartPulse,
  Activity,
  ShieldAlert,
  Calendar,
  MapPin,
  MessageSquare,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Apple,
  Dumbbell,
  Stethoscope,
  Info
} from 'lucide-react';

export const PredictPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState<PredictionInput>({
    pregnancies: 1,
    glucose: 145,
    blood_pressure: 84,
    skin_thickness: 28,
    insulin: 160,
    bmi: 32.5,
    diabetes_pedigree_function: 0.62,
    age: 42,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Prediction | null>(null);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState<boolean>(false);

  // Preset Handlers for Instant Demo
  const loadPreset = (presetType: 'high' | 'moderate' | 'low') => {
    if (presetType === 'high') {
      setFormData({
        pregnancies: 3,
        glucose: 175,
        blood_pressure: 92,
        skin_thickness: 34,
        insulin: 220,
        bmi: 36.4,
        diabetes_pedigree_function: 0.88,
        age: 50,
      });
    } else if (presetType === 'moderate') {
      setFormData({
        pregnancies: 2,
        glucose: 132,
        blood_pressure: 82,
        skin_thickness: 26,
        insulin: 125,
        bmi: 29.8,
        diabetes_pedigree_function: 0.52,
        age: 38,
      });
    } else {
      setFormData({
        pregnancies: 0,
        glucose: 92,
        blood_pressure: 72,
        skin_thickness: 18,
        insulin: 65,
        bmi: 22.4,
        diabetes_pedigree_function: 0.28,
        age: 26,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const predictionResult = await predictionsAPI.predict({
        ...formData,
        patient_id: user?.patient_id || undefined,
      });

      setResult(predictionResult);

      // Trigger confetti if low risk achieved
      if (predictionResult.risk_level === 'Low Risk') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#059669', '#38bdf8'],
        });
      }

      // Smooth scroll to top of results
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Prediction failed. Please verify your input parameters.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Predictive Screening Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Diabetes Risk Assessment
          </h1>
          <p className="text-slate-600 text-sm">
            Enter your clinical parameters below to compute your statistical diabetes risk probability and receive personalized preventive guidelines.
          </p>
        </div>

        {/* Results Screen */}
        {result ? (
          <div className="space-y-8 animate-fade-in">
            
            {/* Top Result Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Gauge */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50/80 rounded-3xl border border-slate-100">
                  <RiskGauge
                    score={result.risk_score}
                    riskLevel={result.risk_level}
                    size="lg"
                  />
                </div>

                {/* Right Breakdown */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Machine Learning Assessment
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Model: Gradient Boosting ML
                    </span>
                  </div>

                  <h2 className="text-2xl font-extrabold text-slate-900">
                    Diabetes Risk: <span className={
                      result.risk_level === 'High Risk'
                        ? 'text-rose-600'
                        : result.risk_level === 'Moderate Risk'
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }>{result.risk_level}</span>
                  </h2>

                  <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {result.summary}
                  </p>

                  {/* Action CTAs */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => setAppointmentModalOpen(true)}
                      className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Book Doctor Consultation</span>
                    </button>

                    <Link
                      to="/clinics"
                      className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-2 transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-sky-600" />
                      <span>Nearby Clinics</span>
                    </Link>

                    <button
                      onClick={handleReset}
                      className="px-4 py-3 rounded-xl font-semibold text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center gap-1.5 ml-auto transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Assess Another Profile</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Contributing Factor Analysis */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-lg">
                    Clinical Factor Risk Breakdown
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Parameter Impact</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.contributing_factors.map((factor, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                      factor.impact === 'High Risk Factor'
                        ? 'bg-rose-50/70 border-rose-200'
                        : factor.impact === 'Positive'
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-900 text-sm">{factor.label}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] ${
                        factor.impact === 'High Risk Factor'
                          ? 'bg-rose-100 text-rose-800'
                          : factor.impact === 'Positive'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-800'
                      }`}>
                        {factor.status}
                      </span>
                    </div>
                    <div className="text-slate-600 font-semibold">
                      Measured: {factor.value} {factor.unit}
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {factor.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* General Precautions */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Apple className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-slate-900 text-lg">
                    Recommended General Precautions & Action Plan
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Evidence-Based</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.general_precautions.map((prec, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-teal-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        {prec.title}
                      </h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-200/60 text-teal-900">
                        {prec.category}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      {prec.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mandatory Medical Disclaimer Banner */}
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-amber-950 uppercase tracking-wide">
                  Official Medical Disclaimer
                </span>
                <p className="leading-relaxed">
                  {result.disclaimer}
                </p>
              </div>
            </div>

          </div>
        ) : (
          /* Form Input Screen */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl space-y-8">
            
            {/* 3 Quick Demo Preset Buttons */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  College Demo Testing Presets (Instant Fill)
                </span>
                <span className="text-[11px] text-slate-400">Click to populate sample patient data</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => loadPreset('high')}
                  className="p-2.5 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span>Sample High Risk (Pre-Diabetic)</span>
                </button>

                <button
                  type="button"
                  onClick={() => loadPreset('moderate')}
                  className="p-2.5 rounded-xl bg-white hover:bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>Sample Moderate Risk</span>
                </button>

                <button
                  type="button"
                  onClick={() => loadPreset('low')}
                  className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Sample Low Risk (Healthy)</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1. Glucose */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>Blood Glucose *</span>
                    <span className="text-[11px] text-slate-400 font-normal">mg/dL</span>
                  </label>
                  <input
                    type="number"
                    name="glucose"
                    value={formData.glucose}
                    onChange={handleChange}
                    min={40}
                    max={300}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold"
                  />
                  <p className="text-[11px] text-slate-400">Normal Fasting: 70–99 mg/dL | Pre-diabetic: 100–125</p>
                </div>

                {/* 2. BMI */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>Body Mass Index (BMI) *</span>
                    <span className="text-[11px] text-slate-400 font-normal">kg/m²</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="bmi"
                    value={formData.bmi}
                    onChange={handleChange}
                    min={10}
                    max={70}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold"
                  />
                  <p className="text-[11px] text-slate-400">Normal: 18.5–24.9 | Overweight: 25–29.9 | Obese: 30+</p>
                </div>

                {/* 3. Blood Pressure */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>Diastolic Blood Pressure *</span>
                    <span className="text-[11px] text-slate-400 font-normal">mm Hg</span>
                  </label>
                  <input
                    type="number"
                    name="blood_pressure"
                    value={formData.blood_pressure}
                    onChange={handleChange}
                    min={40}
                    max={200}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold"
                  />
                  <p className="text-[11px] text-slate-400">Normal Diastolic: &lt;80 mm Hg | Elevated: 80–89</p>
                </div>

                {/* 4. Age */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>Age *</span>
                    <span className="text-[11px] text-slate-400 font-normal">years</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min={1}
                    max={120}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold"
                  />
                  <p className="text-[11px] text-slate-400">Age factor in metabolic risk stratification</p>
                </div>

                {/* 5. Insulin */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>Serum Insulin</span>
                    <span className="text-[11px] text-slate-400 font-normal">µU/ml</span>
                  </label>
                  <input
                    type="number"
                    name="insulin"
                    value={formData.insulin}
                    onChange={handleChange}
                    min={0}
                    max={900}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold"
                  />
                  <p className="text-[11px] text-slate-400">Normal 2h serum insulin: 16–166 µU/ml</p>
                </div>

                {/* 6. Diabetes Pedigree Function */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>Diabetes Pedigree Score</span>
                    <span className="text-[11px] text-slate-400 font-normal">score (0.0–2.5)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="diabetes_pedigree_function"
                    value={formData.diabetes_pedigree_function}
                    onChange={handleChange}
                    min={0.01}
                    max={3.0}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold"
                  />
                  <p className="text-[11px] text-slate-400">Family genetic predisposition indicator</p>
                </div>

                {/* 7. Skin Thickness */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>Triceps Skin Fold</span>
                    <span className="text-[11px] text-slate-400 font-normal">mm</span>
                  </label>
                  <input
                    type="number"
                    name="skin_thickness"
                    value={formData.skin_thickness}
                    onChange={handleChange}
                    min={0}
                    max={100}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold"
                  />
                  <p className="text-[11px] text-slate-400">Subcutaneous body fat calibration</p>
                </div>

                {/* 8. Pregnancies */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>Number of Pregnancies</span>
                    <span className="text-[11px] text-slate-400 font-normal">count</span>
                  </label>
                  <input
                    type="number"
                    name="pregnancies"
                    value={formData.pregnancies}
                    onChange={handleChange}
                    min={0}
                    max={20}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold"
                  />
                  <p className="text-[11px] text-slate-400">0 for males or nulliparous</p>
                </div>

              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Data is evaluated in real-time by the Gradient Boosting classifier.</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/25 disabled:opacity-60 flex items-center justify-center gap-2 transition-all hover:scale-102"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Computing ML Prediction...</span>
                    </>
                  ) : (
                    <>
                      <HeartPulse className="w-5 h-5" />
                      <span>Compute Diabetes Risk</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        )}

      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
      />
    </div>
  );
};
