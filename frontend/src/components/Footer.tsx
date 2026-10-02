import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, Heart, Cpu, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Medical Disclaimer Banner */}
      <div className="bg-emerald-950/60 border-b border-emerald-800/40 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3 text-emerald-200/90 text-xs sm:text-sm">
          <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
          <p>
            <strong className="font-semibold text-emerald-300">Clinical Disclaimer:</strong> GlucoGuard provides machine learning-based risk estimation for screening and educational purposes. It does not provide medical diagnoses or replace licensed clinical consultations.
          </p>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Gluco<span className="text-emerald-400">Guard</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering early detection, intelligent risk stratification, and seamless doctor consultations to prevent diabetes complications.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-emerald-400 font-medium">
                <Cpu className="w-3.5 h-3.5" /> Gradient Boosting ML
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-sky-400 font-medium">
                <Sparkles className="w-3.5 h-3.5" /> Pima Dataset
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Platform Features
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/predict" className="hover:text-emerald-400 transition-colors">
                  AI Diabetes Risk Prediction
                </Link>
              </li>
              <li>
                <Link to="/clinics" className="hover:text-emerald-400 transition-colors">
                  Find Nearby Clinics & Map
                </Link>
              </li>
              <li>
                <Link to="/ml-insights" className="hover:text-emerald-400 transition-colors">
                  ML Model Insights & Benchmarks
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="hover:text-emerald-400 transition-colors">
                  Doctor Appointment Booking
                </Link>
              </li>
            </ul>
          </div>

          {/* Clinical Prevention */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Diabetes Prevention
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Glycemic Index Management</li>
              <li>150min Weekly Exercise Regimen</li>
              <li>Insulin Sensitivity Protocols</li>
              <li>Continuous Glucose Monitoring</li>
              <li>Prediabetes Reversal Pathways</li>
            </ul>
          </div>

          {/* College Project Meta */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Project Architecture
            </h3>
            <div className="space-y-2 text-xs text-slate-400">
              <p><strong className="text-slate-300">Backend:</strong> Python FastAPI, SQLAlchemy, SQLite</p>
              <p><strong className="text-slate-300">ML Engine:</strong> Scikit-learn, Pandas, Joblib</p>
              <p><strong className="text-slate-300">Frontend:</strong> React 19, TypeScript, Tailwind CSS, Leaflet</p>
              <p><strong className="text-slate-300">Security:</strong> JWT, Bcrypt Password Hashing</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 GlucoGuard – Diabetes Prediction & Prevention System. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built for early healthcare intervention with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5" />
          </div>
        </div>
      </div>
    </footer>
  );
};
