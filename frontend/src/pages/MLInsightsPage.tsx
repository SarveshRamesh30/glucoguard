import React, { useState, useEffect } from 'react';
import { mlAPI } from '../services/api';
import { MLMetricsData } from '../types';
import {
  Cpu,
  BarChart3,
  TrendingUp,
  Award,
  Database,
  Layers,
  Sparkles,
  Loader2,
  CheckCircle2,
  Info,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Cell
} from 'recharts';

export const MLInsightsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<MLMetricsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedModelKey, setSelectedModelKey] = useState<string>('Gradient Boosting');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await mlAPI.getMetrics();
      setMetrics(data);
      if (data.best_model) {
        setSelectedModelKey(data.best_model);
      }
    } catch (err) {
      console.error('Failed to load ML metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
        <p className="text-sm font-semibold text-slate-600">Loading ML Model Analytics & Benchmarks...</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="py-20 text-center text-rose-600">
        Failed to load ML benchmarks. Please ensure the backend is running.
      </div>
    );
  }

  const { best_model, models, feature_importances, dataset_summary, training_date } = metrics;
  const currentModelData = models[selectedModelKey] || models[best_model];
  const cm = currentModelData?.confusion_matrix || [[0, 0], [0, 0]]; // [[TN, FP], [FN, TP]]
  const tn = cm[0]?.[0] || 0;
  const fp = cm[0]?.[1] || 0;
  const fn = cm[1]?.[0] || 0;
  const tp = cm[1]?.[1] || 0;

  // Colors for Feature Importance Bar chart
  const barColors = ['#10b981', '#059669', '#0d9488', '#0284c7', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
            <Cpu className="w-3.5 h-3.5 text-purple-600" />
            <span>Academic Demonstration & Model Evaluation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Machine Learning Pipeline & Benchmarks
          </h1>
          <p className="text-slate-600 text-sm">
            Comprehensive evaluation of 5 classification models trained on the Pima Indians Diabetes Dataset with median zero-value imputation and standard scaling.
          </p>
        </div>

        {/* 4 Summary Stat Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Optimal Selected Model
              </p>
              <h3 className="text-lg font-extrabold text-emerald-700 mt-1">
                {best_model}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Highest F1 & AUC Balance</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Test Set Accuracy
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {Math.round(currentModelData.accuracy * 1000) / 10}%
              </h3>
              <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                CV: {Math.round(currentModelData.cv_accuracy_mean * 100)}% ± {(currentModelData.cv_accuracy_std * 100).toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                ROC-AUC Score
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {Math.round(currentModelData.roc_auc * 1000) / 10}%
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Area under curve metric</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Dataset Volume
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {dataset_summary.total_records} Records
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">8 Clinical Parameters</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Model Benchmark Comparison Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Multi-Model Performance Comparison
              </h3>
              <p className="text-xs text-slate-500">
                Evaluation results on 20% stratified hold-out test set
              </p>
            </div>
            <span className="text-[11px] text-slate-400">Trained: {training_date}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  <th className="py-3 px-4">Algorithm / Model</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Precision</th>
                  <th className="py-3 px-4">Recall</th>
                  <th className="py-3 px-4">F1-Score</th>
                  <th className="py-3 px-4">ROC-AUC</th>
                  <th className="py-3 px-4">5-Fold CV Mean</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {Object.entries(models).map(([name, m]) => {
                  const isBest = name === best_model;
                  const isSelected = name === selectedModelKey;
                  return (
                    <tr
                      key={name}
                      onClick={() => setSelectedModelKey(name)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-purple-50/70 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <span>{name}</span>
                        {isBest && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide">
                            Best Model
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">{(m.accuracy * 100).toFixed(1)}%</td>
                      <td className="py-3.5 px-4">{(m.precision * 100).toFixed(1)}%</td>
                      <td className="py-3.5 px-4">{(m.recall * 100).toFixed(1)}%</td>
                      <td className="py-3.5 px-4 font-bold text-purple-700">{(m.f1_score * 100).toFixed(1)}%</td>
                      <td className="py-3.5 px-4 font-bold text-sky-700">{(m.roc_auc * 100).toFixed(1)}%</td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {(m.cv_accuracy_mean * 100).toFixed(1)}% ± {(m.cv_accuracy_std * 100).toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedModelKey(name);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                            isSelected
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {isSelected ? 'Active View' : 'Inspect'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visual Analytics Grid: Feature Importances & Confusion Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Feature Importance Bar Chart */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  Feature Importance Ranking
                </h3>
                <p className="text-xs text-slate-500">
                  Relative predictive power of each clinical marker (Random Forest Gini / Tree Gain)
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                8 Features
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feature_importances} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} unit="%" />
                  <YAxis dataKey="feature" type="category" stroke="#64748b" fontSize={11} tickLine={false} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '1rem',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      fontSize: '12px'
                    }}
                    formatter={(val: any) => [`${val}%`, 'Predictive Weight']}
                  />
                  <Bar dataKey="percentage" radius={[0, 8, 8, 0]}>
                    {feature_importances.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              * Blood Glucose and BMI represent over 55% of the total model feature importance weight.
            </p>
          </div>

          {/* Confusion Matrix Visual Heatmap */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    Confusion Matrix
                  </h3>
                  <p className="text-xs text-slate-500">
                    Inspecting: <strong className="text-purple-700">{selectedModelKey}</strong>
                  </p>
                </div>
              </div>

              {/* 2x2 Matrix */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-3 text-center">
                  
                  {/* True Negative */}
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-800">
                      True Negative (TN)
                    </span>
                    <div className="text-2xl font-extrabold text-emerald-900 my-1">
                      {tn}
                    </div>
                    <span className="text-[10px] text-emerald-700">Correctly Non-Diabetic</span>
                  </div>

                  {/* False Positive */}
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                    <span className="text-[10px] uppercase font-bold text-amber-800">
                      False Positive (FP)
                    </span>
                    <div className="text-2xl font-extrabold text-amber-900 my-1">
                      {fp}
                    </div>
                    <span className="text-[10px] text-amber-700">Type I Error</span>
                  </div>

                  {/* False Negative */}
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                    <span className="text-[10px] uppercase font-bold text-rose-800">
                      False Negative (FN)
                    </span>
                    <div className="text-2xl font-extrabold text-rose-900 my-1">
                      {fn}
                    </div>
                    <span className="text-[10px] text-rose-700">Type II Error (Missed)</span>
                  </div>

                  {/* True Positive */}
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-800">
                      True Positive (TP)
                    </span>
                    <div className="text-2xl font-extrabold text-emerald-900 my-1">
                      {tp}
                    </div>
                    <span className="text-[10px] text-emerald-700">Correctly Identified Risk</span>
                  </div>

                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Sensitivity / Recall (TP / [TP + FN]):</span>
                  <strong className="text-slate-900">{(currentModelData.recall * 100).toFixed(1)}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Specificity (TN / [TN + FP]):</span>
                  <strong className="text-slate-900">{((tn / (tn + fp || 1)) * 100).toFixed(1)}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Precision (TP / [TP + FP]):</span>
                  <strong className="text-slate-900">{(currentModelData.precision * 100).toFixed(1)}%</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              Evaluated across 154 test samples (80/20 train/test split).
            </div>
          </div>

        </div>

        {/* Dataset Distribution & Preprocessing Architecture Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Dataset Statistics */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Database className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-lg">
                Pima Indians Dataset Overview
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Total Patient Samples</span>
                <strong className="text-slate-900 text-sm">{dataset_summary.total_records} instances</strong>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Diabetic Outcome Class (1)</span>
                <strong className="text-rose-700 text-sm">{dataset_summary.diabetic_count} ({dataset_summary.diabetic_percentage}%)</strong>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Non-Diabetic Outcome Class (0)</span>
                <strong className="text-emerald-700 text-sm">{dataset_summary.non_diabetic_count} ({(100 - dataset_summary.diabetic_percentage).toFixed(1)}%)</strong>
              </div>
            </div>
          </div>

          {/* Preprocessing Pipeline Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Layers className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-lg">
                Data Engineering & Preprocessing
              </h3>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Zero-Value Imputation:</strong> Biologically impossible zero measurements in Glucose, BP, Insulin, and BMI imputed with class-conditioned medians.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Standard Scaling:</strong> Scaled features using z-score normalization ($z = (x - \mu)/\sigma$) to prevent scale dominance.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Stratified K-Fold:</strong> 5-fold cross-validation preserving outcome class balance to prevent data leakage and overfitting.</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
