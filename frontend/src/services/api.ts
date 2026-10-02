import axios from 'axios';
import {
  AuthResponse,
  PatientDashboardData,
  DoctorDashboardData,
  Prediction,
  PredictionInput,
  Clinic,
  Doctor,
  Appointment,
  Recommendation,
  Message,
  ConversationSummary,
  MLMetricsData,
  Patient
} from '../types';
import {
  INITIAL_CLINICS,
  INITIAL_DOCTORS,
  INITIAL_PATIENT,
  INITIAL_PREDICTIONS,
  INITIAL_APPOINTMENTS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_MESSAGES,
  ML_METRICS_DATA,
  calculateMLRisk,
  getLocalStore,
  setLocalStore
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000, // 3s timeout for fast fallback when backend is offline
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('glucoguard_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('glucoguard_token');
        localStorage.removeItem('glucoguard_user');
      }
    }
    return Promise.reject(error);
  }
);

// ==========================================
// 1. AUTH API WITH CLIENT-SIDE FALLBACK
// ==========================================

export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      return res.data;
    } catch (e) {
      // Fallback local auth
      if (email.includes('doctor') || email.includes('sundaram') || email.includes('chen')) {
        const docAuth: AuthResponse = {
          access_token: 'mock_jwt_token_doctor_' + Date.now(),
          token_type: 'bearer',
          user_id: 2,
          email: email || 'dr.sundaram@glucoguard.com',
          role: 'doctor',
          full_name: 'Dr. R. Sundaram, MD, DM',
          profile_id: 1,
        };
        return docAuth;
      }

      const patientAuth: AuthResponse = {
        access_token: 'mock_jwt_token_patient_' + Date.now(),
        token_type: 'bearer',
        user_id: 1,
        email: email || 'patient@glucoguard.com',
        role: 'patient',
        full_name: email.startsWith('dr') ? 'Dr. Specialist' : 'Priya Saravanan',
        profile_id: 1,
      };
      return patientAuth;
    }
  },

  demoLogin: async (role: 'patient' | 'doctor'): Promise<AuthResponse> => {
    try {
      const res = await api.post(`/api/auth/demo-login/${role}`);
      return res.data;
    } catch (e) {
      if (role === 'doctor') {
        return {
          access_token: 'mock_jwt_doctor_' + Date.now(),
          token_type: 'bearer',
          user_id: 2,
          email: 'dr.sundaram@glucoguard.com',
          role: 'doctor',
          full_name: 'Dr. R. Sundaram, MD, DM',
          profile_id: 1,
        };
      }
      return {
        access_token: 'mock_jwt_patient_' + Date.now(),
        token_type: 'bearer',
        user_id: 1,
        email: 'patient@glucoguard.com',
        role: 'patient',
        full_name: 'Priya Saravanan',
        profile_id: 1,
      };
    }
  },

  registerPatient: async (data: any): Promise<AuthResponse> => {
    try {
      const res = await api.post('/api/auth/register/patient', data);
      return res.data;
    } catch (e) {
      const newPatient: Patient = {
        id: Date.now(),
        user_id: Date.now(),
        full_name: data.full_name || 'Registered Patient',
        email: data.email,
        phone: data.phone,
        dob: data.dob,
        gender: data.gender,
        blood_group: data.blood_group,
        emergency_contact: data.emergency_contact,
        address: data.address,
        created_at: new Date().toISOString()
      };
      setLocalStore('glucoguard_current_patient', newPatient);

      return {
        access_token: 'mock_jwt_reg_' + Date.now(),
        token_type: 'bearer',
        user_id: newPatient.user_id,
        email: data.email,
        role: 'patient',
        full_name: data.full_name,
        profile_id: newPatient.id,
      };
    }
  },

  registerDoctor: async (data: any): Promise<AuthResponse> => {
    try {
      const res = await api.post('/api/auth/register/doctor', data);
      return res.data;
    } catch (e) {
      const newDoctor: Doctor = {
        id: Date.now(),
        user_id: Date.now(),
        full_name: data.full_name || 'Dr. Registered Specialist',
        email: data.email,
        phone: data.phone,
        specialization: data.specialization || 'Clinical Diabetologist',
        clinic_name: data.clinic_name || "Dr. Mohan's Diabetes Specialities Centre (HQ)",
        experience_years: Number(data.experience_years) || 10,
        qualification: data.qualification || 'MBBS, MD',
        consultation_fee: Number(data.consultation_fee) || 700,
        bio: data.bio || 'Consulting Diabetologist',
        avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
        created_at: new Date().toISOString()
      };
      const doctors = getLocalStore<Doctor[]>('glucoguard_doctors', INITIAL_DOCTORS);
      doctors.unshift(newDoctor);
      setLocalStore('glucoguard_doctors', doctors);

      return {
        access_token: 'mock_jwt_doc_reg_' + Date.now(),
        token_type: 'bearer',
        user_id: newDoctor.user_id,
        email: data.email,
        role: 'doctor',
        full_name: data.full_name,
        profile_id: newDoctor.id,
      };
    }
  },

  getCurrentUser: async () => {
    try {
      const res = await api.get('/api/auth/me');
      return res.data;
    } catch (e) {
      const savedUser = localStorage.getItem('glucoguard_user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      return res.data;
    } catch (e) {
      return { message: `Password reset instructions dispatched to ${email}.` };
    }
  },
};

// ==========================================
// 2. PREDICTIONS API WITH CLIENT-SIDE ML
// ==========================================

export const predictionsAPI = {
  predict: async (data: PredictionInput): Promise<Prediction> => {
    try {
      const res = await api.post('/api/predictions/predict', data);
      return res.data;
    } catch (e) {
      // Execute local client-side ML engine calculation
      const prediction = calculateMLRisk(data);
      const history = getLocalStore<Prediction[]>('glucoguard_predictions', INITIAL_PREDICTIONS);
      history.unshift(prediction);
      setLocalStore('glucoguard_predictions', history);
      return prediction;
    }
  },

  getHistory: async (): Promise<Prediction[]> => {
    try {
      const res = await api.get('/api/predictions/history');
      return res.data;
    } catch (e) {
      return getLocalStore<Prediction[]>('glucoguard_predictions', INITIAL_PREDICTIONS);
    }
  },

  getById: async (id: number): Promise<Prediction> => {
    try {
      const res = await api.get(`/api/predictions/${id}`);
      return res.data;
    } catch (e) {
      const history = getLocalStore<Prediction[]>('glucoguard_predictions', INITIAL_PREDICTIONS);
      return history.find((p) => p.id === id) || history[0];
    }
  },
};

// ==========================================
// 3. PATIENTS & DASHBOARD API
// ==========================================

export const patientsAPI = {
  getDashboard: async (): Promise<PatientDashboardData> => {
    try {
      const res = await api.get('/api/patients/dashboard');
      return res.data;
    } catch (e) {
      const patient = getLocalStore<Patient>('glucoguard_current_patient', INITIAL_PATIENT);
      const predictions = getLocalStore<Prediction[]>('glucoguard_predictions', INITIAL_PREDICTIONS);
      const appointments = getLocalStore<Appointment[]>('glucoguard_appointments', INITIAL_APPOINTMENTS);
      const recommendations = getLocalStore<Recommendation[]>('glucoguard_recommendations', INITIAL_RECOMMENDATIONS);

      const riskTrend = predictions.map((p) => ({
        id: p.id || 0,
        date: new Date(p.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        full_date: new Date(p.created_at).toLocaleDateString(),
        risk_percentage: p.risk_percentage,
        risk_score: p.risk_score,
        risk_level: p.risk_level,
        glucose: p.inputs?.glucose || 120,
        bmi: p.inputs?.bmi || 28,
        blood_pressure: p.inputs?.blood_pressure || 80,
      })).reverse();

      return {
        patient,
        latest_prediction: predictions.length > 0 ? predictions[0] : null,
        total_predictions: predictions.length,
        risk_trend: riskTrend,
        upcoming_appointments: appointments.filter((a) => a.status !== 'Cancelled'),
        recent_recommendations: recommendations,
        unread_messages_count: 0,
      };
    }
  },

  getProfile: async (): Promise<Patient> => {
    try {
      const res = await api.get('/api/patients/profile');
      return res.data;
    } catch (e) {
      return getLocalStore<Patient>('glucoguard_current_patient', INITIAL_PATIENT);
    }
  },

  updateProfile: async (data: Partial<Patient>): Promise<Patient> => {
    try {
      const res = await api.put('/api/patients/profile', data);
      return res.data;
    } catch (e) {
      const current = getLocalStore<Patient>('glucoguard_current_patient', INITIAL_PATIENT);
      const updated = { ...current, ...data };
      setLocalStore('glucoguard_current_patient', updated);
      return updated;
    }
  },
};

// ==========================================
// 4. DOCTORS & CLINICAL WORKSPACE API
// ==========================================

export const doctorsAPI = {
  getAll: async (): Promise<Doctor[]> => {
    try {
      const res = await api.get('/api/doctors');
      return res.data;
    } catch (e) {
      return getLocalStore<Doctor[]>('glucoguard_doctors', INITIAL_DOCTORS);
    }
  },

  getById: async (id: number): Promise<Doctor> => {
    try {
      const res = await api.get(`/api/doctors/${id}`);
      return res.data;
    } catch (e) {
      const docs = getLocalStore<Doctor[]>('glucoguard_doctors', INITIAL_DOCTORS);
      return docs.find((d) => d.id === id) || docs[0];
    }
  },

  getDashboard: async (): Promise<DoctorDashboardData> => {
    try {
      const res = await api.get('/api/doctors/dashboard/me');
      return res.data;
    } catch (e) {
      const docs = getLocalStore<Doctor[]>('glucoguard_doctors', INITIAL_DOCTORS);
      const appointments = getLocalStore<Appointment[]>('glucoguard_appointments', INITIAL_APPOINTMENTS);
      const predictions = getLocalStore<Prediction[]>('glucoguard_predictions', INITIAL_PREDICTIONS);
      const patient = getLocalStore<Patient>('glucoguard_current_patient', INITIAL_PATIENT);

      const latestPred = predictions[0] || INITIAL_PREDICTIONS[0];

      return {
        doctor: docs[0],
        total_patients: 12,
        high_risk_patients_count: 4,
        pending_appointments_count: appointments.filter((a) => a.status === 'Pending').length,
        upcoming_appointments: appointments,
        recent_patients: [
          {
            patient_id: patient.id,
            user_id: patient.user_id,
            full_name: patient.full_name,
            email: patient.email,
            phone: patient.phone || undefined,
            gender: patient.gender || 'Female',
            dob: patient.dob || '1988-05-14',
            blood_group: patient.blood_group || 'O+',
            risk_level: latestPred.risk_level,
            risk_score: latestPred.risk_score,
            risk_percentage: latestPred.risk_percentage,
            latest_glucose: latestPred.inputs?.glucose || 158,
            latest_bmi: latestPred.inputs?.bmi || 33.2,
            last_test_date: latestPred.created_at,
            total_predictions: predictions.length
          },
          {
            patient_id: 2,
            user_id: 102,
            full_name: "Karthik Subramanian",
            email: "karthik.s@example.com",
            phone: "+91 98405 67890",
            gender: "Male",
            dob: "1979-11-20",
            blood_group: "B+",
            risk_level: "High Risk",
            risk_score: 0.812,
            risk_percentage: 81.2,
            latest_glucose: 172,
            latest_bmi: 34.5,
            last_test_date: new Date(Date.now() - 5 * 86400000).toISOString(),
            total_predictions: 3
          },
          {
            patient_id: 3,
            user_id: 103,
            full_name: "Meenakshi Raman",
            email: "meena.raman@example.com",
            phone: "+91 98409 33221",
            gender: "Female",
            dob: "1992-03-12",
            blood_group: "A+",
            risk_level: "Moderate Risk",
            risk_score: 0.485,
            risk_percentage: 48.5,
            latest_glucose: 128,
            latest_bmi: 27.6,
            last_test_date: new Date(Date.now() - 7 * 86400000).toISOString(),
            total_predictions: 1
          }
        ],
        unread_messages_count: 1
      };
    }
  },

  getPatientDetails: async (patientId: number): Promise<any> => {
    try {
      const res = await api.get(`/api/doctors/patients/${patientId}`);
      return res.data;
    } catch (e) {
      const patient = getLocalStore<Patient>('glucoguard_current_patient', INITIAL_PATIENT);
      const predictions = getLocalStore<Prediction[]>('glucoguard_predictions', INITIAL_PREDICTIONS);
      const recommendations = getLocalStore<Recommendation[]>('glucoguard_recommendations', INITIAL_RECOMMENDATIONS);

      return {
        patient,
        predictions,
        recommendations
      };
    }
  },
};

// ==========================================
// 5. CLINICS & MAP API
// ==========================================

export const clinicsAPI = {
  getClinics: async (lat?: number, lng?: number, search?: string): Promise<Clinic[]> => {
    try {
      const params: any = {};
      if (lat !== undefined && lng !== undefined) {
        params.lat = lat;
        params.lng = lng;
      }
      if (search) params.search = search;
      const res = await api.get('/api/clinics', { params });
      return res.data;
    } catch (e) {
      let list = getLocalStore<Clinic[]>('glucoguard_clinics', INITIAL_CLINICS);
      if (search) {
        const s = search.toLowerCase();
        list = list.filter((c) =>
          c.name.toLowerCase().includes(s) ||
          c.address.toLowerCase().includes(s) ||
          (c.services_offered && c.services_offered.toLowerCase().includes(s))
        );
      }
      // Calculate approximate distance if lat & lng provided
      if (lat && lng) {
        list = list.map((c) => {
          const R = 6371; // km
          const dLat = ((c.latitude - lat) * Math.PI) / 180;
          const dLon = ((c.longitude - lng) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat * Math.PI) / 180) *
              Math.cos((c.latitude * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return { ...c, distance_km: Math.round(dist * 10) / 10 };
        }).sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0));
      }
      return list;
    }
  },

  getById: async (id: number): Promise<{ clinic: Clinic; doctors: Doctor[] }> => {
    try {
      const res = await api.get(`/api/clinics/${id}`);
      return res.data;
    } catch (e) {
      const clinics = getLocalStore<Clinic[]>('glucoguard_clinics', INITIAL_CLINICS);
      const doctors = getLocalStore<Doctor[]>('glucoguard_doctors', INITIAL_DOCTORS);
      const clinic = clinics.find((c) => c.id === id) || clinics[0];
      const clinicDocs = doctors.filter((d) => d.clinic_id === clinic.id);
      return { clinic, doctors: clinicDocs.length > 0 ? clinicDocs : [doctors[0]] };
    }
  },
};

// ==========================================
// 6. APPOINTMENTS API
// ==========================================

export const appointmentsAPI = {
  book: async (data: {
    doctor_id: number;
    clinic_id?: number | null;
    appointment_date: string;
    time_slot: string;
    reason: string;
    notes?: string;
  }): Promise<Appointment> => {
    try {
      const res = await api.post('/api/appointments', data);
      return res.data;
    } catch (e) {
      const doctors = getLocalStore<Doctor[]>('glucoguard_doctors', INITIAL_DOCTORS);
      const clinics = getLocalStore<Clinic[]>('glucoguard_clinics', INITIAL_CLINICS);
      const doctor = doctors.find((d) => d.id === data.doctor_id) || doctors[0];
      const clinic = clinics.find((c) => c.id === data.clinic_id) || clinics[0];

      const newAppointment: Appointment = {
        id: Date.now(),
        patient_id: 1,
        doctor_id: data.doctor_id,
        clinic_id: data.clinic_id || null,
        appointment_date: data.appointment_date,
        time_slot: data.time_slot,
        reason: data.reason,
        notes: data.notes || null,
        status: 'Confirmed',
        created_at: new Date().toISOString(),
        patient_name: "Priya Saravanan",
        patient_email: "patient@glucoguard.com",
        patient_phone: "+91 98412 87654",
        doctor_name: doctor.full_name,
        doctor_specialization: doctor.specialization,
        clinic_name: clinic?.name || doctor.clinic_name || "Specialized Clinic",
        clinic_address: clinic?.address || "Chennai, Tamil Nadu"
      };

      const list = getLocalStore<Appointment[]>('glucoguard_appointments', INITIAL_APPOINTMENTS);
      list.unshift(newAppointment);
      setLocalStore('glucoguard_appointments', list);
      return newAppointment;
    }
  },

  list: async (): Promise<Appointment[]> => {
    try {
      const res = await api.get('/api/appointments');
      return res.data;
    } catch (e) {
      return getLocalStore<Appointment[]>('glucoguard_appointments', INITIAL_APPOINTMENTS);
    }
  },

  updateStatus: async (id: number, status: string, notes?: string): Promise<Appointment> => {
    try {
      const res = await api.patch(`/api/appointments/${id}/status`, { status, notes });
      return res.data;
    } catch (e) {
      const list = getLocalStore<Appointment[]>('glucoguard_appointments', INITIAL_APPOINTMENTS);
      const apt = list.find((a) => a.id === id);
      if (apt) {
        apt.status = status as any;
        if (notes) apt.notes = notes;
        setLocalStore('glucoguard_appointments', list);
        return apt;
      }
      return list[0];
    }
  },
};

// ==========================================
// 7. RECOMMENDATIONS API
// ==========================================

export const recommendationsAPI = {
  create: async (data: {
    patient_id: number;
    prediction_id?: number | null;
    clinical_recommendation: string;
    general_advice?: string;
    lifestyle_advice?: string;
    dietary_advice?: string;
    follow_up_date?: string;
    notes?: string;
  }): Promise<Recommendation> => {
    try {
      const res = await api.post('/api/recommendations', data);
      return res.data;
    } catch (e) {
      const newRec: Recommendation = {
        id: Date.now(),
        patient_id: data.patient_id,
        doctor_id: 1,
        prediction_id: data.prediction_id || null,
        clinical_recommendation: data.clinical_recommendation,
        general_advice: data.general_advice || null,
        lifestyle_advice: data.lifestyle_advice || null,
        dietary_advice: data.dietary_advice || null,
        follow_up_date: data.follow_up_date || null,
        notes: data.notes || null,
        created_at: new Date().toISOString(),
        doctor_name: "Dr. R. Sundaram, MD, DM",
        doctor_specialization: "Senior Diabetologist & Clinical Endocrinologist"
      };
      const list = getLocalStore<Recommendation[]>('glucoguard_recommendations', INITIAL_RECOMMENDATIONS);
      list.unshift(newRec);
      setLocalStore('glucoguard_recommendations', list);
      return newRec;
    }
  },

  getMy: async (): Promise<Recommendation[]> => {
    try {
      const res = await api.get('/api/recommendations/my');
      return res.data;
    } catch (e) {
      return getLocalStore<Recommendation[]>('glucoguard_recommendations', INITIAL_RECOMMENDATIONS);
    }
  },

  getForPatient: async (patientId: number): Promise<Recommendation[]> => {
    try {
      const res = await api.get(`/api/recommendations/patient/${patientId}`);
      return res.data;
    } catch (e) {
      const list = getLocalStore<Recommendation[]>('glucoguard_recommendations', INITIAL_RECOMMENDATIONS);
      return list.filter((r) => r.patient_id === patientId);
    }
  },
};

// ==========================================
// 8. MESSAGES & CONSULTATION CHAT API
// ==========================================

export const messagesAPI = {
  send: async (receiver_id: number, content: string, appointment_id?: number | null): Promise<Message> => {
    try {
      const res = await api.post('/api/messages', { receiver_id, content, appointment_id });
      return res.data;
    } catch (e) {
      const savedUser = localStorage.getItem('glucoguard_user');
      const currentUser = savedUser ? JSON.parse(savedUser) : null;
      const senderId = currentUser?.user_id || 1;

      const newMsg: Message = {
        id: Date.now(),
        sender_id: senderId,
        receiver_id,
        appointment_id: appointment_id || null,
        content,
        is_read: true,
        created_at: new Date().toISOString(),
        sender_name: currentUser?.full_name || (senderId === 2 ? 'Dr. R. Sundaram' : 'Priya Saravanan'),
        sender_role: currentUser?.role || (senderId === 2 ? 'doctor' : 'patient')
      };

      const messages = getLocalStore<Message[]>('glucoguard_messages', INITIAL_MESSAGES);
      messages.push(newMsg);
      setLocalStore('glucoguard_messages', messages);
      return newMsg;
    }
  },

  getConversations: async (): Promise<ConversationSummary[]> => {
    try {
      const res = await api.get('/api/messages/conversations');
      return res.data;
    } catch (e) {
      const messages = getLocalStore<Message[]>('glucoguard_messages', INITIAL_MESSAGES);
      const savedUser = localStorage.getItem('glucoguard_user');
      const currentUser = savedUser ? JSON.parse(savedUser) : null;
      const isDoc = currentUser?.role === 'doctor';

      const lastMsg = messages[messages.length - 1];

      if (isDoc) {
        return [
          {
            contact_user_id: 1,
            contact_name: "Priya Saravanan",
            contact_role: "patient",
            contact_specialization_or_dob: "DOB: 1988-05-14 (36 yrs)",
            last_message: lastMsg ? lastMsg.content : "Looking forward to our scheduled appointment.",
            last_message_time: lastMsg ? lastMsg.created_at : new Date().toISOString(),
            unread_count: 0
          },
          {
            contact_user_id: 102,
            contact_name: "Karthik Subramanian",
            contact_role: "patient",
            contact_specialization_or_dob: "DOB: 1979-11-20 (45 yrs)",
            last_message: "Doctor, can I take the fasting test tomorrow at 8 AM?",
            last_message_time: new Date(Date.now() - 6 * 3600000).toISOString(),
            unread_count: 1
          }
        ];
      }

      return [
        {
          contact_user_id: 2,
          contact_name: "Dr. R. Sundaram, MD, DM",
          contact_role: "doctor",
          contact_specialization_or_dob: "Senior Diabetologist & Clinical Endocrinologist",
          last_message: lastMsg ? lastMsg.content : "Please come fasting (8-10 hours) for the HbA1c test.",
          last_message_time: lastMsg ? lastMsg.created_at : new Date().toISOString(),
          unread_count: 0
        },
        {
          contact_user_id: 3,
          contact_name: "Dr. Michael Chen, MD",
          contact_role: "doctor",
          contact_specialization_or_dob: "Preventive Diabetology & Metabolic Care Specialist",
          last_message: "Your pre-diabetes reversal guidelines are active.",
          last_message_time: new Date(Date.now() - 48 * 3600000).toISOString(),
          unread_count: 0
        }
      ];
    }
  },

  getThread: async (contactUserId: number): Promise<Message[]> => {
    try {
      const res = await api.get(`/api/messages/thread/${contactUserId}`);
      return res.data;
    } catch (e) {
      const messages = getLocalStore<Message[]>('glucoguard_messages', INITIAL_MESSAGES);
      const savedUser = localStorage.getItem('glucoguard_user');
      const currentUserId = savedUser ? JSON.parse(savedUser).user_id : 1;

      return messages.filter(
        (m) =>
          (m.sender_id === currentUserId && m.receiver_id === contactUserId) ||
          (m.sender_id === contactUserId && m.receiver_id === currentUserId)
      );
    }
  },

  getContacts: async (): Promise<any[]> => {
    try {
      const res = await api.get('/api/messages/contacts');
      return res.data;
    } catch (e) {
      const doctors = getLocalStore<Doctor[]>('glucoguard_doctors', INITIAL_DOCTORS);
      return doctors.map((d) => ({
        user_id: d.user_id,
        full_name: d.full_name,
        role: 'doctor',
        email: d.email,
        specialization: d.specialization,
      }));
    }
  },
};

// ==========================================
// 9. ML INSIGHTS API
// ==========================================

export const mlAPI = {
  getMetrics: async (): Promise<MLMetricsData> => {
    try {
      const res = await api.get('/api/ml/metrics');
      return res.data;
    } catch (e) {
      return ML_METRICS_DATA;
    }
  },
};

export default api;
