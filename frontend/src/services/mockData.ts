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
  Patient,
  FactorImpact,
  GeneralPrecaution
} from '../types';

// ==========================================
// 1. INITIAL SEED DATA (CHENNAI & TAMIL NADU)
// ==========================================

export const INITIAL_CLINICS: Clinic[] = [
  {
    id: 1,
    name: "Dr. Mohan's Diabetes Specialities Centre (HQ)",
    address: "6B, Conran Smith Road, Gopalapuram, Chennai, Tamil Nadu 600086",
    latitude: 13.0524,
    longitude: 80.2508,
    phone: "+91 44 4396 8888",
    email: "gopalapuram@drmohans.com",
    rating: 4.9,
    review_count: 420,
    opening_hours: "Mon - Sat: 7:30 AM - 7:30 PM | Sun: 8:00 AM - 1:00 PM",
    website: "https://drmohans.com",
    services_offered: "Comprehensive Diabetes Screening, Precision Continuous Glucose Monitoring (CGM), Diabetic Retinopathy Screening, Custom South Indian Diabetic Nutrition",
    doctors_count: 2
  },
  {
    id: 2,
    name: "Apollo Sugar Clinics – Greams Road",
    address: "21, Greams Lane, Thousand Lights, Chennai, Tamil Nadu 600006",
    latitude: 13.0601,
    longitude: 80.2523,
    phone: "+91 44 2829 0200",
    email: "care@apollosugar.com",
    rating: 4.8,
    review_count: 310,
    opening_hours: "Mon - Sat: 8:00 AM - 8:00 PM",
    website: "https://apollosugar.com",
    services_offered: "Rapid HbA1c Profiling, Prediabetes Reversal Program, Thyroid & Endocrine Panel, Insulin Pump Initiation",
    doctors_count: 1
  },
  {
    id: 3,
    name: "M.V. Hospital for Diabetes & Research Centre",
    address: "4, West Mada Church Street, Royapuram, Chennai, Tamil Nadu 600013",
    latitude: 13.1098,
    longitude: 80.2936,
    phone: "+91 44 2595 4913",
    email: "info@mvhospital.in",
    rating: 4.8,
    review_count: 265,
    opening_hours: "Mon - Sat: 8:00 AM - 7:00 PM",
    website: "https://mvhospital.in",
    services_offered: "Type 1 & Type 2 Management, Diabetic Kidney Care, Gestational Diabetes Clinic, Glycemic Stabilization",
    doctors_count: 1
  },
  {
    id: 4,
    name: "Madras Diabetes Research & Endocrine Centre (MDRC)",
    address: "Plot 28, 2nd Avenue, Anna Nagar East, Chennai, Tamil Nadu 600102",
    latitude: 13.0878,
    longitude: 80.2167,
    phone: "+91 44 4350 1122",
    email: "annanagar@mdrc.co.in",
    rating: 4.9,
    review_count: 190,
    opening_hours: "Mon - Sat: 8:00 AM - 7:30 PM",
    website: "https://mdrc.co.in",
    services_offered: "Continuous Glucose Monitoring (CGM), Cardiovascular Risk Profiling, Genetic Pedigree Screening, Nutrition Counseling",
    doctors_count: 1
  },
  {
    id: 5,
    name: "Fortis Malar Diabetes & Metabolic Wellness Clinic",
    address: "52, 1st Main Road, Gandhi Nagar, Adyar, Chennai, Tamil Nadu 600020",
    latitude: 13.0067,
    longitude: 80.2573,
    phone: "+91 44 4289 2222",
    email: "malar.diabetes@fortishealthcare.com",
    rating: 4.7,
    review_count: 155,
    opening_hours: "Mon - Sat: 8:30 AM - 6:30 PM",
    website: "https://fortishealthcare.com",
    services_offered: "Comprehensive Metabolic Screening, Lipid & Cholesterol Profiling, Diabetic Neuropathy Assessment",
    doctors_count: 1
  },
  {
    id: 6,
    name: "Chettinad Health & Diabetes Care Clinic – Velachery",
    address: "142, Velachery Main Road, Dhandeeswaram Nagar, Velachery, Chennai, Tamil Nadu 600042",
    latitude: 12.9815,
    longitude: 80.2180,
    phone: "+91 44 2243 5566",
    email: "velachery@chettinadhealth.org",
    rating: 4.8,
    review_count: 175,
    opening_hours: "Mon - Fri: 8:00 AM - 8:00 PM | Sat: 8:00 AM - 3:00 PM",
    website: "https://chettinadhealth.org",
    services_offered: "Preventive Screening, Rapid Blood Glucose Sensor Setup, Diet & Lifestyle Therapy, Community Wellness",
    doctors_count: 1
  },
  {
    id: 7,
    name: "Kauvery Diabetology & Endocrine Institute – Alwarpet",
    address: "199, Luz Church Road, Alwarpet, Chennai, Tamil Nadu 600004",
    latitude: 13.0336,
    longitude: 80.2505,
    phone: "+91 44 4000 6000",
    email: "diabetes@kauveryhospital.com",
    rating: 4.9,
    review_count: 240,
    opening_hours: "Mon - Sat: 8:00 AM - 8:00 PM",
    website: "https://kauveryhospital.com",
    services_offered: "Advanced Endocrine Panels, Insulin Resistance Reversal, Diabetic Foot Care, Tele-consultations",
    doctors_count: 1
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 1,
    user_id: 2,
    full_name: "Dr. R. Sundaram, MD, DM",
    email: "dr.sundaram@glucoguard.com",
    phone: "+91 98400 11223",
    specialization: "Senior Diabetologist & Clinical Endocrinologist",
    clinic_id: 1,
    clinic_name: "Dr. Mohan's Diabetes Specialities Centre (HQ)",
    experience_years: 15,
    qualification: "MBBS, MD, DM - Endocrinology (Madras Medical College)",
    consultation_fee: 700.0,
    bio: "Leading Diabetologist in Chennai specializing in precision glycemic therapy, insulin pump optimization, and diabetic complication prevention.",
    avatar_url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80",
    created_at: new Date(Date.now() - 60 * 86400000).toISOString()
  },
  {
    id: 2,
    user_id: 3,
    full_name: "Dr. Michael Chen, MD",
    email: "dr.chen@glucoguard.com",
    phone: "+91 98401 22334",
    specialization: "Preventive Diabetology & Metabolic Care Specialist",
    clinic_id: 2,
    clinic_name: "Apollo Sugar Clinics – Greams Road",
    experience_years: 12,
    qualification: "MBBS, MD - General Medicine, PG Diabetology (CMC Vellore)",
    consultation_fee: 650.0,
    bio: "Expert in early metabolic syndrome interception, pre-diabetes reversal protocols, and continuous glucose monitoring telemetry.",
    avatar_url: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80",
    created_at: new Date(Date.now() - 50 * 86400000).toISOString()
  },
  {
    id: 3,
    user_id: 4,
    full_name: "Dr. S. Ramachandran, MD",
    email: "dr.ramachandran@glucoguard.com",
    phone: "+91 98402 33445",
    specialization: "Senior Consultant in Diabetes & Renal Endocrinology",
    clinic_id: 3,
    clinic_name: "M.V. Hospital for Diabetes & Research Centre",
    experience_years: 22,
    qualification: "MBBS, MD, FRCP (Glasgow), FICP",
    consultation_fee: 800.0,
    bio: "Pioneer in long-term glycemic stabilization and diabetes kidney protection therapies across South India.",
    avatar_url: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&auto=format&fit=crop&q=80",
    created_at: new Date(Date.now() - 40 * 86400000).toISOString()
  },
  {
    id: 4,
    user_id: 5,
    full_name: "Dr. K. Vijayakumar, MD",
    email: "dr.vijayakumar@glucoguard.com",
    phone: "+91 98403 44556",
    specialization: "Clinical Diabetologist & Lifestyle Medicine Specialist",
    clinic_id: 4,
    clinic_name: "Madras Diabetes Research & Endocrine Centre (MDRC)",
    experience_years: 14,
    qualification: "MBBS, MD (Medicine), Diploma in Diabetology",
    consultation_fee: 600.0,
    bio: "Specialist in integrating modern digital biomarkers with South Indian nutritional protocols for sustainable glycemic control.",
    avatar_url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80",
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 5,
    user_id: 6,
    full_name: "Dr. Preethi Annamalai, MBBS, DNB",
    email: "dr.preethi@glucoguard.com",
    phone: "+91 98404 55667",
    specialization: "Gestational & Pediatric Endocrine Specialist",
    clinic_id: 7,
    clinic_name: "Kauvery Diabetology & Endocrine Institute – Alwarpet",
    experience_years: 10,
    qualification: "MBBS, DNB (Endocrinology), Fellowship in Gestational Diabetology",
    consultation_fee: 750.0,
    bio: "Focuses on maternal gestational diabetes screening, young-onset diabetes, and holistic nutrition counseling.",
    avatar_url: "https://images.unsplash.com/photo-1594824813510-56930d68f276?w=200&auto=format&fit=crop&q=80",
    created_at: new Date(Date.now() - 20 * 86400000).toISOString()
  }
];

export const INITIAL_PATIENT: Patient = {
  id: 1,
  user_id: 1,
  full_name: "Priya Saravanan",
  email: "patient@glucoguard.com",
  phone: "+91 98412 87654",
  dob: "1988-05-14",
  gender: "Female",
  blood_group: "O+",
  emergency_contact: "+91 98412 11223 (Karthik - Spouse)",
  address: "Flat 4B, Emerald Residency, Anna Nagar West, Chennai, Tamil Nadu 600040",
  created_at: new Date(Date.now() - 90 * 86400000).toISOString()
};

export const INITIAL_PREDICTIONS: Prediction[] = [
  {
    id: 1,
    patient_id: 1,
    risk_score: 0.764,
    risk_percentage: 76.4,
    risk_level: "High Risk",
    prediction_label: 1,
    summary: "Elevated risk for Type 2 Diabetes detected based on key clinical biomarkers (High fasting glucose 158 mg/dL, elevated BMI 33.2, family pedigree indicator). Immediate clinical consultation recommended.",
    disclaimer: "GlucoGuard is an AI screening tool and does not constitute a formal clinical diagnosis. Please consult a licensed endocrinologist for laboratory testing.",
    contributing_factors: [
      {
        feature: "Glucose",
        label: "Blood Glucose",
        value: 158,
        unit: "mg/dL",
        status: "High Risk",
        impact: "High Risk Factor",
        description: "Significantly elevated fasting glucose (158 mg/dL) strongly drives diabetes risk."
      },
      {
        feature: "BMI",
        label: "Body Mass Index",
        value: 33.2,
        unit: "kg/m²",
        status: "Obese (High Risk)",
        impact: "High Risk Factor",
        description: "BMI of 33.2 kg/m² contributes to insulin resistance."
      },
      {
        feature: "BloodPressure",
        label: "Diastolic Blood Pressure",
        value: 86,
        unit: "mm Hg",
        status: "Pre-hypertension",
        impact: "Neutral",
        description: "Borderline diastolic pressure (86 mm Hg)."
      },
      {
        feature: "Insulin",
        label: "Serum Insulin",
        value: 180,
        unit: "µU/ml",
        status: "Borderline Elevated",
        impact: "Neutral",
        description: "Insulin at 180 µU/ml indicates compensatory hyperinsulinemia."
      },
      {
        feature: "DPF",
        label: "Diabetes Pedigree Function",
        value: 0.72,
        unit: "score",
        status: "Elevated Genetic Tendency",
        impact: "High Risk Factor",
        description: "Family history score (0.72) indicates elevated hereditary predisposition."
      },
      {
        feature: "Age",
        label: "Age",
        value: 36,
        unit: "years",
        status: "Standard Adult Category",
        impact: "Neutral",
        description: "Age 36 is within standard adult risk screening profile."
      }
    ],
    general_precautions: [
      {
        title: "South Indian Low-GI Millet Nutrition",
        category: "Diet",
        description: "Replace refined white ponni rice with foxtail millet (thinai), kodo millet (varagu), or barnyard millet (kuthiraivali). Incorporate moringa greens (murungai keerai) and soluble fenugreek fiber (vendhayam).",
        priority: "High"
      },
      {
        title: "Structured 150-Min Aerobic Protocol",
        category: "Exercise",
        description: "Engage in 30 minutes of brisk walking or swimming 5 days per week to enhance cellular GLUT-4 insulin receptor sensitivity.",
        priority: "High"
      },
      {
        title: "Scheduled Clinical Fasting & HbA1c Lab Panel",
        category: "Medical",
        description: "Book an in-person consultation with a Chennai diabetologist for formal HbA1c, OGTT, and lipid panel profiling.",
        priority: "High"
      },
      {
        title: "Bi-Weekly Fasting Blood Glucose Log",
        category: "Monitoring",
        description: "Monitor fasting glucose twice weekly using a digital glucometer. Target fasting < 100 mg/dL and 2-hr postprandial < 140 mg/dL.",
        priority: "Medium"
      }
    ],
    inputs: {
      pregnancies: 2,
      glucose: 158,
      blood_pressure: 86,
      skin_thickness: 30,
      insulin: 180,
      bmi: 33.2,
      diabetes_pedigree_function: 0.72,
      age: 36
    },
    created_at: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 2,
    patient_id: 1,
    risk_score: 0.642,
    risk_percentage: 64.2,
    risk_level: "Moderate Risk",
    prediction_label: 1,
    summary: "Moderate diabetes risk profile. Glucose levels are borderline pre-diabetic (138 mg/dL) with elevated BMI (31.4 kg/m²). Lifestyle modifications recommended.",
    disclaimer: "GlucoGuard is an AI screening tool and does not constitute a formal clinical diagnosis.",
    contributing_factors: [
      {
        feature: "Glucose",
        label: "Blood Glucose",
        value: 138,
        unit: "mg/dL",
        status: "Elevated (Pre-diabetic Range)",
        impact: "High Risk Factor",
        description: "Glucose at 138 mg/dL indicates impaired fasting glucose / prediabetes."
      },
      {
        feature: "BMI",
        label: "Body Mass Index",
        value: 31.4,
        unit: "kg/m²",
        status: "Obese (High Risk)",
        impact: "High Risk Factor",
        description: "BMI of 31.4 kg/m² contributes to insulin resistance."
      },
      {
        feature: "BloodPressure",
        label: "Diastolic Blood Pressure",
        value: 82,
        unit: "mm Hg",
        status: "Pre-hypertension",
        impact: "Neutral",
        description: "Borderline diastolic pressure."
      }
    ],
    general_precautions: [
      {
        title: "Dietary Carbohydrate Reduction",
        category: "Diet",
        description: "Switch to whole grains, increase fiber intake, and avoid sweetened beverages.",
        priority: "High"
      },
      {
        title: "Regular Physical Activity",
        category: "Exercise",
        description: "Aim for at least 30 minutes of moderate cardiovascular activity daily.",
        priority: "High"
      }
    ],
    inputs: {
      pregnancies: 2,
      glucose: 138,
      blood_pressure: 82,
      skin_thickness: 28,
      insulin: 140,
      bmi: 31.4,
      diabetes_pedigree_function: 0.65,
      age: 36
    },
    created_at: new Date(Date.now() - 25 * 86400000).toISOString()
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 1,
    patient_id: 1,
    doctor_id: 1,
    clinic_id: 1,
    appointment_date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    time_slot: "10:30 AM",
    reason: "Elevated AI risk score review & comprehensive HbA1c screening",
    notes: "Patient reported family history and recent postprandial fatigue.",
    status: "Confirmed",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    patient_name: "Priya Saravanan",
    patient_email: "patient@glucoguard.com",
    patient_phone: "+91 98412 87654",
    doctor_name: "Dr. R. Sundaram, MD, DM",
    doctor_specialization: "Senior Diabetologist & Clinical Endocrinologist",
    clinic_name: "Dr. Mohan's Diabetes Specialities Centre (HQ)",
    clinic_address: "6B, Conran Smith Road, Gopalapuram, Chennai, Tamil Nadu 600086"
  }
];

export const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 1,
    patient_id: 1,
    doctor_id: 1,
    prediction_id: 1,
    clinical_recommendation: "Prescribed 12-week intensive prediabetes reversal pathway. Conduct laboratory fasting plasma glucose, HbA1c, and serum lipid profile.",
    general_advice: "Maintain consistent meal timing. Limit tiffin items made purely from refined rice flour; replace with ragi or whole wheat adai.",
    lifestyle_advice: "30-40 minutes morning brisk walk in Semmozhi Poonga or local park. Maintain 7-8 hours sleep hygiene.",
    dietary_advice: "Emphasize high-fiber vegetables (ash gourd, bitter gourd, beans). Drink warm water infused with fenugreek seeds in the morning.",
    follow_up_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    notes: "Patient is highly motivated. Follow up post lab reports.",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    doctor_name: "Dr. R. Sundaram, MD, DM",
    doctor_specialization: "Senior Diabetologist & Clinical Endocrinologist"
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    sender_id: 1,
    receiver_id: 2,
    appointment_id: 1,
    content: "Vanakkam Dr. Sundaram, I completed my GlucoGuard risk prediction and got a 76.4% risk score. I booked a slot for Thursday morning.",
    is_read: true,
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
    sender_name: "Priya Saravanan",
    sender_role: "patient"
  },
  {
    id: 2,
    sender_id: 2,
    receiver_id: 1,
    appointment_id: 1,
    content: "Hello Priya, do not worry. Your elevated glucose and BMI indicate early insulin resistance which is very reversible. Please come fasting (8-10 hours) on Thursday so we can run an accurate baseline HbA1c and lipid test.",
    is_read: true,
    created_at: new Date(Date.now() - 45 * 3600000).toISOString(),
    sender_name: "Dr. R. Sundaram, MD, DM",
    sender_role: "doctor"
  },
  {
    id: 3,
    sender_id: 1,
    receiver_id: 2,
    appointment_id: 1,
    content: "Sure Doctor, I will follow the fasting guidelines and bring all past medical files. Thank you!",
    is_read: true,
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    sender_name: "Priya Saravanan",
    sender_role: "patient"
  }
];

// ==========================================
// 2. ML BENCHMARK DATA (FROM TRAINING)
// ==========================================

export const ML_METRICS_DATA: MLMetricsData = {
  best_model: "Gradient Boosting",
  models: {
    "Gradient Boosting": {
      accuracy: 0.8831,
      precision: 0.8364,
      recall: 0.8519,
      f1_score: 0.8440,
      roc_auc: 0.9572,
      cv_accuracy_mean: 0.8950,
      cv_accuracy_std: 0.0085,
      confusion_matrix: [[92, 8], [8, 46]],
      roc_curve: [
        { fpr: 0.0, tpr: 0.0 },
        { fpr: 0.0, tpr: 0.25 },
        { fpr: 0.01, tpr: 0.55 },
        { fpr: 0.02, tpr: 0.72 },
        { fpr: 0.05, tpr: 0.85 },
        { fpr: 0.08, tpr: 0.92 },
        { fpr: 0.12, tpr: 0.96 },
        { fpr: 0.25, tpr: 0.98 },
        { fpr: 1.0, tpr: 1.0 }
      ]
    },
    "Random Forest": {
      accuracy: 0.8636,
      precision: 0.8113,
      recall: 0.7963,
      f1_score: 0.8037,
      roc_auc: 0.9446,
      cv_accuracy_mean: 0.8795,
      cv_accuracy_std: 0.0097,
      confusion_matrix: [[90, 10], [11, 43]],
      roc_curve: [
        { fpr: 0.0, tpr: 0.0 },
        { fpr: 0.01, tpr: 0.42 },
        { fpr: 0.02, tpr: 0.68 },
        { fpr: 0.07, tpr: 0.76 },
        { fpr: 0.11, tpr: 0.83 },
        { fpr: 0.14, tpr: 0.92 },
        { fpr: 0.22, tpr: 0.96 },
        { fpr: 0.41, tpr: 0.98 },
        { fpr: 1.0, tpr: 1.0 }
      ]
    },
    "Support Vector Machine (SVM)": {
      accuracy: 0.7727,
      precision: 0.7143,
      recall: 0.6481,
      f1_score: 0.6796,
      roc_auc: 0.8752,
      cv_accuracy_mean: 0.8242,
      cv_accuracy_std: 0.0125,
      confusion_matrix: [[84, 16], [19, 35]],
      roc_curve: [
        { fpr: 0.0, tpr: 0.0 },
        { fpr: 0.04, tpr: 0.35 },
        { fpr: 0.12, tpr: 0.65 },
        { fpr: 0.22, tpr: 0.82 },
        { fpr: 1.0, tpr: 1.0 }
      ]
    },
    "Logistic Regression": {
      accuracy: 0.7078,
      precision: 0.5882,
      recall: 0.5556,
      f1_score: 0.5714,
      roc_auc: 0.8263,
      cv_accuracy_mean: 0.7899,
      cv_accuracy_std: 0.0160,
      confusion_matrix: [[79, 21], [24, 30]],
      roc_curve: [
        { fpr: 0.0, tpr: 0.0 },
        { fpr: 0.08, tpr: 0.37 },
        { fpr: 0.21, tpr: 0.57 },
        { fpr: 0.28, tpr: 0.88 },
        { fpr: 1.0, tpr: 1.0 }
      ]
    },
    "Decision Tree": {
      accuracy: 0.7208,
      precision: 0.5965,
      recall: 0.6296,
      f1_score: 0.6126,
      roc_auc: 0.7607,
      cv_accuracy_mean: 0.7383,
      cv_accuracy_std: 0.0195,
      confusion_matrix: [[77, 23], [20, 34]],
      roc_curve: [
        { fpr: 0.0, tpr: 0.0 },
        { fpr: 0.23, tpr: 0.63 },
        { fpr: 1.0, tpr: 1.0 }
      ]
    }
  },
  feature_importances: [
    { feature: "Glucose", importance: 0.3842, percentage: 38.4 },
    { feature: "BMI", importance: 0.2215, percentage: 22.2 },
    { feature: "Age", importance: 0.1340, percentage: 13.4 },
    { feature: "DiabetesPedigreeFunction", importance: 0.1085, percentage: 10.9 },
    { feature: "Insulin", importance: 0.0620, percentage: 6.2 },
    { feature: "BloodPressure", importance: 0.0418, percentage: 4.2 },
    { feature: "SkinThickness", importance: 0.0265, percentage: 2.7 },
    { feature: "Pregnancies", importance: 0.0215, percentage: 2.2 }
  ],
  dataset_summary: {
    total_records: 768,
    diabetic_count: 268,
    non_diabetic_count: 500,
    diabetic_percentage: 34.9,
    features: [
      "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
      "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"
    ],
    feature_stats: {
      "Glucose": { mean: 120.89, std: 31.97, min: 44.0, max: 199.0, median: 117.0 },
      "BMI": { mean: 31.99, std: 7.88, min: 18.2, max: 67.1, median: 32.0 },
      "BloodPressure": { mean: 69.10, std: 19.35, min: 24.0, max: 122.0, median: 72.0 },
      "Insulin": { mean: 79.79, std: 115.24, min: 14.0, max: 846.0, median: 30.5 },
      "Age": { mean: 33.24, std: 11.76, min: 21.0, max: 81.0, median: 29.0 },
      "DiabetesPedigreeFunction": { mean: 0.47, std: 0.33, min: 0.08, max: 2.42, median: 0.37 },
      "Pregnancies": { mean: 3.84, std: 3.37, min: 0.0, max: 17.0, median: 3.0 },
      "SkinThickness": { mean: 20.53, std: 15.95, min: 7.0, max: 99.0, median: 23.0 }
    }
  },
  training_date: new Date().toISOString().split('T')[0]
};

// ==========================================
// 3. CLIENT-SIDE ML PREDICTION ENGINE
// ==========================================

export function calculateMLRisk(input: PredictionInput): Prediction {
  const {
    pregnancies = 0,
    glucose = 100,
    blood_pressure = 80,
    skin_thickness = 20,
    insulin = 80,
    bmi = 25,
    diabetes_pedigree_function = 0.5,
    age = 30
  } = input;

  // Normalized feature calculations approximating trained Gradient Boosting weights
  let z = -5.8; // base log-odds

  // Glucose impact (primary factor)
  if (glucose > 100) {
    z += ((glucose - 100) / 22.0) * 1.65;
  } else {
    z -= ((100 - glucose) / 25.0) * 0.8;
  }

  // BMI impact
  if (bmi > 25) {
    z += ((bmi - 25) / 5.5) * 0.95;
  } else {
    z -= ((25 - bmi) / 4.0) * 0.5;
  }

  // Age impact
  if (age > 30) {
    z += ((age - 30) / 12.0) * 0.55;
  }

  // DPF impact
  if (diabetes_pedigree_function > 0.4) {
    z += (diabetes_pedigree_function - 0.4) * 1.8;
  }

  // Blood Pressure
  if (blood_pressure > 80) {
    z += ((blood_pressure - 80) / 15.0) * 0.35;
  }

  // Insulin
  if (insulin > 140) {
    z += ((insulin - 140) / 60.0) * 0.35;
  }

  // Pregnancies
  if (pregnancies > 2) {
    z += (pregnancies - 2) * 0.15;
  }

  // Sigmoid probability function
  const rawProb = 1 / (1 + Math.exp(-z));
  // Bound probability between 4% and 98%
  const riskScore = Math.min(0.98, Math.max(0.04, rawProb));
  const riskPercentage = Math.round(riskScore * 1000) / 10;

  let riskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk' = 'Low Risk';
  let predictionLabel = 0;
  if (riskPercentage >= 70) {
    riskLevel = 'High Risk';
    predictionLabel = 1;
  } else if (riskPercentage >= 35) {
    riskLevel = 'Moderate Risk';
    predictionLabel = 1;
  } else {
    riskLevel = 'Low Risk';
    predictionLabel = 0;
  }

  // Contributing factors
  const contributingFactors: FactorImpact[] = [];

  // 1. Glucose
  if (glucose < 100) {
    contributingFactors.push({
      feature: "Glucose",
      label: "Blood Glucose",
      value: glucose,
      unit: "mg/dL",
      status: "Normal",
      impact: "Positive",
      description: "Fasting glucose is within the optimal healthy range (<100 mg/dL)."
    });
  } else if (glucose <= 140) {
    contributingFactors.push({
      feature: "Glucose",
      label: "Blood Glucose",
      value: glucose,
      unit: "mg/dL",
      status: "Elevated (Pre-diabetic Range)",
      impact: "High Risk Factor",
      description: `Glucose at ${glucose} mg/dL indicates impaired glucose tolerance / prediabetes.`
    });
  } else {
    contributingFactors.push({
      feature: "Glucose",
      label: "Blood Glucose",
      value: glucose,
      unit: "mg/dL",
      status: "High Risk",
      impact: "High Risk Factor",
      description: `Significantly elevated glucose level (${glucose} mg/dL) strongly drives diabetes risk.`
    });
  }

  // 2. BMI
  if (bmi < 18.5) {
    contributingFactors.push({
      feature: "BMI",
      label: "Body Mass Index",
      value: bmi,
      unit: "kg/m²",
      status: "Underweight",
      impact: "Neutral",
      description: "BMI below standard healthy range."
    });
  } else if (bmi < 25.0) {
    contributingFactors.push({
      feature: "BMI",
      label: "Body Mass Index",
      value: bmi,
      unit: "kg/m²",
      status: "Normal",
      impact: "Positive",
      description: `Healthy BMI (${bmi} kg/m²).`
    });
  } else if (bmi < 30.0) {
    contributingFactors.push({
      feature: "BMI",
      label: "Body Mass Index",
      value: bmi,
      unit: "kg/m²",
      status: "Overweight",
      impact: "Neutral",
      description: `BMI (${bmi} kg/m²) indicates mild excess weight; increasing activity is beneficial.`
    });
  } else {
    contributingFactors.push({
      feature: "BMI",
      label: "Body Mass Index",
      value: bmi,
      unit: "kg/m²",
      status: "Obese (High Risk)",
      impact: "High Risk Factor",
      description: `BMI of ${bmi} kg/m² contributes to insulin resistance.`
    });
  }

  // 3. Blood Pressure
  if (blood_pressure < 80) {
    contributingFactors.push({
      feature: "BloodPressure",
      label: "Diastolic Blood Pressure",
      value: blood_pressure,
      unit: "mm Hg",
      status: "Normal",
      impact: "Positive",
      description: `Healthy diastolic blood pressure (${blood_pressure} mm Hg).`
    });
  } else if (blood_pressure <= 89) {
    contributingFactors.push({
      feature: "BloodPressure",
      label: "Diastolic Blood Pressure",
      value: blood_pressure,
      unit: "mm Hg",
      status: "Pre-hypertension",
      impact: "Neutral",
      description: `Borderline diastolic pressure (${blood_pressure} mm Hg).`
    });
  } else {
    contributingFactors.push({
      feature: "BloodPressure",
      label: "Diastolic Blood Pressure",
      value: blood_pressure,
      unit: "mm Hg",
      status: "Hypertension",
      impact: "High Risk Factor",
      description: `Elevated diastolic blood pressure (${blood_pressure} mm Hg) increases metabolic strain.`
    });
  }

  // 4. Insulin
  if (insulin <= 140) {
    contributingFactors.push({
      feature: "Insulin",
      label: "Serum Insulin",
      value: insulin,
      unit: "µU/ml",
      status: "Normal",
      impact: "Positive",
      description: `Serum insulin (${insulin} µU/ml) is within standard limits.`
    });
  } else {
    contributingFactors.push({
      feature: "Insulin",
      label: "Serum Insulin",
      value: insulin,
      unit: "µU/ml",
      status: "Elevated (Hyperinsulinemia)",
      impact: "High Risk Factor",
      description: `Elevated insulin level (${insulin} µU/ml) suggests underlying insulin resistance.`
    });
  }

  // 5. DPF
  if (diabetes_pedigree_function < 0.3) {
    contributingFactors.push({
      feature: "DPF",
      label: "Diabetes Pedigree Function",
      value: diabetes_pedigree_function,
      unit: "score",
      status: "Low Genetic Influence",
      impact: "Positive",
      description: "Low hereditary diabetes risk score in familial history."
    });
  } else if (diabetes_pedigree_function <= 0.6) {
    contributingFactors.push({
      feature: "DPF",
      label: "Diabetes Pedigree Function",
      value: diabetes_pedigree_function,
      unit: "score",
      status: "Moderate Genetic Influence",
      impact: "Neutral",
      description: `Moderate pedigree score (${diabetes_pedigree_function}) suggests some familial history.`
    });
  } else {
    contributingFactors.push({
      feature: "DPF",
      label: "Diabetes Pedigree Function",
      value: diabetes_pedigree_function,
      unit: "score",
      status: "Elevated Genetic Tendency",
      impact: "High Risk Factor",
      description: `High pedigree score (${diabetes_pedigree_function}) indicates strong genetic predisposition.`
    });
  }

  // 6. Age
  if (age < 35) {
    contributingFactors.push({
      feature: "Age",
      label: "Age",
      value: age,
      unit: "years",
      status: "Younger Cohort",
      impact: "Positive",
      description: `Age (${age}) is associated with baseline metabolic resilience.`
    });
  } else if (age <= 50) {
    contributingFactors.push({
      feature: "Age",
      label: "Age",
      value: age,
      unit: "years",
      status: "Moderate Risk Cohort",
      impact: "Neutral",
      description: `Age (${age}) aligns with standard adult diabetes screening windows.`
    });
  } else {
    contributingFactors.push({
      feature: "Age",
      label: "Age",
      value: age,
      unit: "years",
      status: "Elevated Age Factor",
      impact: "High Risk Factor",
      description: `Age (${age}) presents increased metabolic vulnerability.`
    });
  }

  // Precautions tailored to South Indian context & risk level
  const generalPrecautions: GeneralPrecaution[] = [];

  if (riskLevel === 'High Risk') {
    generalPrecautions.push(
      {
        title: "Immediate Clinical Diabetology Consultation",
        category: "Medical",
        description: "Schedule a comprehensive clinical screening including HbA1c, fasting plasma glucose, and renal panel with a specialized endocrinologist.",
        priority: "High"
      },
      {
        title: "South Indian Low-GI Millet Nutrition",
        category: "Diet",
        description: "Replace refined white ponni rice with foxtail millet (thinai), kodo millet (varagu), or barnyard millet (kuthiraivali). Incorporate moringa greens (murungai keerai) and soluble fenugreek fiber (vendhayam).",
        priority: "High"
      },
      {
        title: "Structured 150-Min Aerobic Protocol",
        category: "Exercise",
        description: "Engage in 30 minutes of brisk walking or swimming 5 days per week to enhance cellular GLUT-4 insulin receptor sensitivity.",
        priority: "High"
      },
      {
        title: "Continuous / Bi-Weekly Fasting Log",
        category: "Monitoring",
        description: "Track blood glucose levels twice weekly before breakfast. Target fasting < 100 mg/dL and postprandial < 140 mg/dL.",
        priority: "Medium"
      }
    );
  } else if (riskLevel === 'Moderate Risk') {
    generalPrecautions.push(
      {
        title: "Preventive Prediabetes Reversal Protocol",
        category: "Diet",
        description: "Minimize processed simple sugars and sweetened beverages. Incorporate unpolished red rice, sprouted pulses, and raw vegetable salads before main meals.",
        priority: "High"
      },
      {
        title: "Regular Cardiovascular Fitness",
        category: "Exercise",
        description: "Aim for at least 150 minutes of moderate-intensity exercise weekly (brisk walking, cycling, or yoga).",
        priority: "High"
      },
      {
        title: "Quarterly Fasting & HbA1c Screening",
        category: "Monitoring",
        description: "Have your fasting blood glucose and HbA1c checked every 3-6 months to monitor glycemic trajectory.",
        priority: "Medium"
      },
      {
        title: "Lifestyle Consultation with Diabetologist",
        category: "Medical",
        description: "Consult a diabetes specialist for early preventive counseling and personalized target setting.",
        priority: "General"
      }
    );
  } else {
    generalPrecautions.push(
      {
        title: "Maintain Balanced Whole-Food Nutrition",
        category: "Diet",
        description: "Continue consuming balanced meals rich in dietary fiber, vegetables, and lean proteins while moderating refined carbohydrates.",
        priority: "General"
      },
      {
        title: "Sustain Active Lifestyle Routine",
        category: "Exercise",
        description: "Maintain at least 30 minutes of physical activity daily to sustain cardiovascular and metabolic health.",
        priority: "General"
      },
      {
        title: "Annual Preventive Health Checkup",
        category: "Monitoring",
        description: "Schedule routine annual blood work to monitor blood glucose, lipid levels, and blood pressure over time.",
        priority: "General"
      }
    );
  }

  let summary = "";
  if (riskLevel === 'High Risk') {
    summary = `Elevated diabetes risk score (${riskPercentage}%). Factors such as glucose (${glucose} mg/dL) and BMI (${bmi} kg/m²) suggest significant insulin resistance. Early clinical consultation is advised.`;
  } else if (riskLevel === 'Moderate Risk') {
    summary = `Moderate diabetes risk score (${riskPercentage}%). Mildly elevated metabolic indicators present an ideal window for prediabetes reversal through dietary adjustments and exercise.`;
  } else {
    summary = `Low diabetes risk score (${riskPercentage}%). Biomarkers indicate healthy metabolic homeostasis. Continue your current active lifestyle and balanced diet.`;
  }

  const newPrediction: Prediction = {
    id: Date.now(),
    patient_id: input.patient_id || 1,
    risk_score: riskScore,
    risk_percentage: riskPercentage,
    risk_level: riskLevel,
    prediction_label: predictionLabel,
    summary,
    disclaimer: "GlucoGuard is an AI screening tool and does not constitute a formal clinical diagnosis. Please consult a licensed physician.",
    contributing_factors: contributingFactors,
    general_precautions: generalPrecautions,
    inputs: {
      pregnancies,
      glucose,
      blood_pressure,
      skin_thickness,
      insulin,
      bmi,
      diabetes_pedigree_function,
      age
    },
    created_at: new Date().toISOString()
  };

  return newPrediction;
}

// ==========================================
// 4. LOCAL STORAGE PERSISTENCE HELPERS
// ==========================================

export function getLocalStore<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
  }
  return defaultValue;
}

export function setLocalStore<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
}
