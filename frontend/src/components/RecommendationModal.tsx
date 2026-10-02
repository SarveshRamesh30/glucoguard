import React, { useState } from 'react';
import { recommendationsAPI } from '../services/api';
import { X, Stethoscope, CheckCircle2, AlertCircle, Loader2, Apple, Dumbbell, Calendar, FileText } from 'lucide-react';

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: number;
  patientName: string;
  predictionId?: number | null;
  onSuccess?: () => void;
}

export const RecommendationModal: React.FC<RecommendationModalProps> = ({
  isOpen,
  onClose,
  patientId,
  patientName,
  predictionId,
  onSuccess,
}) => {
  const [clinicalRec, setClinicalRec] = useState<string>(
    'Schedule HbA1c diagnostic testing. Target fasting blood glucose < 105 mg/dL. Monitor postprandial glucose after heavy meals.'
  );
  const [generalAdvice, setGeneralAdvice] = useState<string>(
    'Maintain consistent sleep cycles and monitor daily hydration.'
  );
  const [lifestyleAdvice, setLifestyleAdvice] = useState<string>(
    'Engage in 35-45 minutes of moderate aerobic exercise 5 days per week. Include resistance training twice weekly.'
  );
  const [dietaryAdvice, setDietaryAdvice] = useState<string>(
    'Adopt a Mediterranean-style low glycemic index diet. Replace refined carbohydrates with whole grains and increase soluble fiber.'
  );
  const [followUpDate, setFollowUpDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicalRec.trim()) {
      setError('Please provide clinical recommendation details.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await recommendationsAPI.create({
        patient_id: patientId,
        prediction_id: predictionId || null,
        clinical_recommendation: clinicalRec.trim(),
        general_advice: generalAdvice.trim() || undefined,
        lifestyle_advice: lifestyleAdvice.trim() || undefined,
        dietary_advice: dietaryAdvice.trim() || undefined,
        follow_up_date: followUpDate || undefined,
        notes: notes.trim() || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1600);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit recommendation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-xl w-full max-h-[90vh] overflow-y-auto relative">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 leading-tight">
                Add Doctor Recommendations
              </h3>
              <p className="text-xs text-slate-500">
                Personalized clinical precautions for <span className="font-semibold text-slate-800">{patientName}</span>
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

        {/* Form Body */}
        <div className="p-6">
          {success ? (
            <div className="py-8 flex flex-col items-center text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-1">
                Recommendations Published!
              </h4>
              <p className="text-sm text-slate-600 max-w-sm">
                The precautions and clinical guidance have been added to {patientName}'s medical portal.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Clinical Recommendation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-600" />
                  Clinical & Medical Guidance *
                </label>
                <textarea
                  value={clinicalRec}
                  onChange={(e) => setClinicalRec(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm font-sans"
                  placeholder="Clinical assessment, medications, target glucose ranges..."
                />
              </div>

              {/* Dietary Advice */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Apple className="w-3.5 h-3.5 text-emerald-600" />
                  Dietary & Nutritional Instructions
                </label>
                <textarea
                  value={dietaryAdvice}
                  onChange={(e) => setDietaryAdvice(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm font-sans"
                  placeholder="Carb intake, fiber suggestions, meal timing..."
                />
              </div>

              {/* Lifestyle / Exercise */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5 text-sky-600" />
                  Exercise & Physical Activity Protocol
                </label>
                <textarea
                  value={lifestyleAdvice}
                  onChange={(e) => setLifestyleAdvice(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm font-sans"
                  placeholder="Weekly aerobic targets, step goals, resistance routines..."
                />
              </div>

              {/* Follow-up Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  Recommended Follow-up Date
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm font-sans"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Internal Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Patient adherence, motivation notes..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
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
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-md shadow-teal-600/20 disabled:opacity-60 flex items-center gap-2 transition-all"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Guidance...</span>
                    </>
                  ) : (
                    <span>Publish Recommendations</span>
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
