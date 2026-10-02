import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  HeartPulse,
  MapPin,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Cpu,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  TrendingUp,
  Award,
  Users,
  Building2,
  BarChart3
} from 'lucide-react';
import { RiskGauge } from '../components/RiskGauge';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Next-Gen Machine Learning Diabetes Prevention</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Predict Early. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600">
                  Prevent Better.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed">
                GlucoGuard combines clinical data intelligence with advanced machine learning to estimate diabetes risk, generate personalized lifestyle precautions, and connect you with top endocrinologists.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/predict"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/35 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5"
                >
                  <HeartPulse className="w-5 h-5" />
                  <span>Start Free Prediction</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/clinics"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex items-center justify-center gap-2"
                >
                  <MapPin className="w-5 h-5 text-sky-500" />
                  <span>Find Nearby Clinics</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-2xl font-extrabold text-slate-900">95.7%</div>
                  <div className="text-xs text-slate-500 font-medium">Model ROC-AUC</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900">5+ Models</div>
                  <div className="text-xs text-slate-500 font-medium">Benchmarked</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900">6 Clinics</div>
                  <div className="text-xs text-slate-500 font-medium">Mapped & Ready</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Preview Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-100 relative">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">Live AI Screening Demo</span>
                </div>

                <div className="py-6 flex flex-col items-center">
                  <RiskGauge score={0.28} riskLevel="Low Risk" size="md" />
                </div>

                <div className="space-y-2.5 bg-slate-50 rounded-2xl p-3.5 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-700">
                    <span>Key Marker: Blood Glucose</span>
                    <span className="text-emerald-600 font-bold">112 mg/dL (Normal)</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold text-slate-700">
                    <span>Body Mass Index (BMI)</span>
                    <span className="text-slate-600">28.4 kg/m²</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold text-slate-700">
                    <span>Doctor Recommendation</span>
                    <span className="text-teal-600 font-bold">✓ Reviewed</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium text-emerald-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Statistical Risk Assessment
                  </span>
                  <Link to="/predict" className="text-emerald-600 font-bold hover:underline">
                    Try now →
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Platform Core Features Section */}
      <section className="py-20 bg-slate-50/70 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              End-To-End Prevention Ecosystem
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Designed For Patient Empowerment & Doctor Synergy
            </h3>
            <p className="text-slate-600 text-base">
              GlucoGuard bridges machine learning screening with real-world clinical follow-ups, appointment scheduling, and localized clinic maps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2.5">
                AI Diabetes Risk Prediction
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enter clinical health parameters (glucose, blood pressure, insulin, BMI, age) to receive an instant calibrated risk probability and categorized risk tier.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2.5">
                Patient Health Timeline & Trends
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track your risk score evolution and vital metrics over time with interactive Recharts data visualizations and historical health records.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-6">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2.5">
                Doctor Review & Consultation
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Dedicated Doctor workspace allows endocrinologists to review patient screening results and publish personalized clinical guidance and follow-up plans.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2.5">
                Smart Appointment Scheduling
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Book in-person or telemedicine slots with double-booking prevention, status updates (Pending, Confirmed, Completed), and calendar management.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2.5">
                Nearby Clinics & OpenStreetMap
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Interactive map discovery powered by Leaflet to locate specialized diabetes and metabolic clinics, complete with contact details, ratings, and distance filters.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2.5">
                ML Pipeline Insights (College Demo)
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Demonstrate model benchmarks, confusion matrices, ROC curves, and feature importance rankings directly within the application for academic review.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. 4-Step Workflow Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              How GlucoGuard Works
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900">
              Simple, Seamless, and Scientifically Grounded
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-emerald-600/30">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-base">Enter Health Vitals</h4>
              <p className="text-xs text-slate-600">
                Input basic demographic and routine lab values like fasting glucose, blood pressure, and BMI.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-teal-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-teal-600/30">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-base">ML Risk Estimation</h4>
              <p className="text-xs text-slate-600">
                The tuned Gradient Boosting pipeline evaluates multi-factor impact and computes risk category.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-sky-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-sky-600/30">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-base">Personalized Precautions</h4>
              <p className="text-xs text-slate-600">
                Receive targeted dietary, exercise, and monitoring precautions tailored to your specific risk drivers.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-indigo-600/30">
                4
              </div>
              <h4 className="font-bold text-slate-900 text-base">Doctor Consultation</h4>
              <p className="text-xs text-slate-600">
                Book an appointment at a nearby clinic and communicate directly through encrypted messaging.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. College ML Project Showcase Callout */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Cpu className="w-4 h-4" />
                <span>Academic ML Demonstration Ready</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold">
                Explore Machine Learning Architecture & Metrics
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Review model comparisons (Gradient Boosting, Random Forest, Logistic Regression, SVM, Decision Tree), confusion matrices, and feature importances trained on the Pima Indians Diabetes Dataset.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <Link
                to="/ml-insights"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-slate-900 bg-white hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 text-sm shadow-md"
              >
                <BarChart3 className="w-4 h-4 text-purple-600" />
                <span>View ML Benchmark Analytics</span>
              </Link>
              <Link
                to="/predict"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <span>Live Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
