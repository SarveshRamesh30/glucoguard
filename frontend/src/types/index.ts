export const GLUCOGUARD_VERSION = '1.0.0';

export type UserRole = 'patient' | 'doctor';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  patient_id?: number | null;
  doctor_id?: number | null;
  full_name?: string | null;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  email: string;
  role: UserRole;
  full_name: string;
  profile_id: number;
}

export interface Patient {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  dob?: string | null;
  gender?: string | null;
  blood_group?: string | null;
  emergency_contact?: string | null;
  address?: string | null;
  created_at: string;
}

export interface Doctor {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  specialization: string;
  clinic_id?: number | null;
  clinic_name?: string | null;
  experience_years: number;
  qualification?: string | null;
  consultation_fee: number;
  bio?: string | null;
  avatar_url?: string | null;
  created_at: string;
}

export interface Clinic {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string | null;
  email?: string | null;
  rating: number;
  review_count: number;
  opening_hours: string;
  website?: string | null;
  services_offered?: string | null;
  distance_km?: number | null;
  doctors_count?: number | null;
}

export interface FactorImpact {
  feature: string;
  label: string;
  value: number;
  unit: string;
  status: string;
  impact: string;
  description: string;
}

export interface GeneralPrecaution {
  title: string;
  category: 'Diet' | 'Exercise' | 'Monitoring' | 'Medical';
  description: string;
  priority: 'High' | 'Medium' | 'General';
}

export interface PredictionInput {
  pregnancies: number;
  glucose: number;
  blood_pressure: number;
  skin_thickness: number;
  insulin: number;
  bmi: number;
  diabetes_pedigree_function: number;
  age: number;
  patient_id?: number;
}

export interface Prediction {
  id?: number;
  patient_id?: number;
  risk_score: number;
  risk_percentage: number;
  risk_level: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  prediction_label: number;
  summary: string;
  disclaimer: string;
  contributing_factors: FactorImpact[];
  general_precautions: GeneralPrecaution[];
  inputs: Record<string, number>;
  created_at: string;
}

export interface Recommendation {
  id: number;
  patient_id: number;
  doctor_id?: number | null;
  prediction_id?: number | null;
  clinical_recommendation: string;
  general_advice?: string | null;
  lifestyle_advice?: string | null;
  dietary_advice?: string | null;
  follow_up_date?: string | null;
  notes?: string | null;
  created_at: string;
  doctor_name?: string | null;
  doctor_specialization?: string | null;
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  clinic_id?: number | null;
  appointment_date: string;
  time_slot: string;
  reason: string;
  notes?: string | null;
  status: AppointmentStatus;
  created_at: string;
  patient_name?: string;
  patient_email?: string;
  patient_phone?: string;
  doctor_name?: string;
  doctor_specialization?: string;
  clinic_name?: string;
  clinic_address?: string;
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  appointment_id?: number | null;
  content: string;
  is_read: boolean;
  created_at: string;
  sender_name?: string;
  sender_role?: string;
}

export interface ConversationSummary {
  contact_user_id: number;
  contact_name: string;
  contact_role: string;
  contact_specialization_or_dob?: string | null;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export interface PatientDashboardData {
  patient: Patient;
  latest_prediction?: Prediction | null;
  total_predictions: number;
  risk_trend: Array<{
    id: number;
    date: string;
    full_date: string;
    risk_percentage: number;
    risk_score: number;
    risk_level: string;
    glucose: number;
    bmi: number;
    blood_pressure: number;
  }>;
  upcoming_appointments: Appointment[];
  recent_recommendations: Recommendation[];
  unread_messages_count: number;
}

export interface DoctorDashboardData {
  doctor: Doctor;
  total_patients: number;
  high_risk_patients_count: number;
  pending_appointments_count: number;
  upcoming_appointments: Appointment[];
  recent_patients: Array<{
    patient_id: number;
    user_id: number;
    full_name: string;
    email: string;
    phone?: string;
    gender?: string;
    dob?: string;
    blood_group?: string;
    risk_level: string;
    risk_score: number;
    risk_percentage: number;
    latest_glucose?: number;
    latest_bmi?: number;
    last_test_date?: string;
    total_predictions: number;
  }>;
  unread_messages_count: number;
}

export interface MLModelResult {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  cv_accuracy_mean: number;
  cv_accuracy_std: number;
  confusion_matrix: number[][];
  roc_curve: Array<{ fpr: number; tpr: number }>;
}

export interface MLMetricsData {
  best_model: string;
  models: Record<string, MLModelResult>;
  feature_importances: Array<{
    feature: string;
    importance: number;
    percentage: number;
  }>;
  dataset_summary: {
    total_records: number;
    diabetic_count: number;
    non_diabetic_count: number;
    diabetic_percentage: number;
    features: string[];
    feature_stats: Record<string, {
      mean: number;
      std: number;
      min: number;
      max: number;
      median: number;
    }>;
  };
  training_date: string;
}
