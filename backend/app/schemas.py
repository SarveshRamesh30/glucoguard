from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field
import datetime

# --- Auth Schemas ---
class PatientRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str
    phone: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    emergency_contact: Optional[str] = None
    address: Optional[str] = None

class DoctorRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str
    phone: Optional[str] = None
    specialization: str
    clinic_name: Optional[str] = None
    experience_years: int = 5
    qualification: Optional[str] = "MBBS, MD"
    consultation_fee: Optional[float] = 50.0
    bio: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str
    role: str
    full_name: str
    profile_id: int

class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    is_active: bool
    created_at: datetime.datetime
    patient_id: Optional[int] = None
    doctor_id: Optional[int] = None
    full_name: Optional[str] = None

    class Config:
        from_attributes = True

# --- Patient Schemas ---
class PatientResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    emergency_contact: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class PatientUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    emergency_contact: Optional[str] = None
    address: Optional[str] = None

# --- Doctor Schemas ---
class DoctorResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    specialization: str
    clinic_id: Optional[int] = None
    clinic_name: Optional[str] = None
    experience_years: int
    qualification: Optional[str] = None
    consultation_fee: float
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Clinic Schemas ---
class ClinicResponse(BaseModel):
    id: int
    name: str
    address: str
    latitude: float
    longitude: float
    phone: Optional[str] = None
    email: Optional[str] = None
    rating: float
    review_count: int
    opening_hours: str
    website: Optional[str] = None
    services_offered: Optional[str] = None
    distance_km: Optional[float] = None
    doctors_count: Optional[int] = None

    class Config:
        from_attributes = True

# --- Prediction Schemas ---
class PredictionInput(BaseModel):
    pregnancies: int = Field(default=0, ge=0, le=25, description="Number of pregnancies")
    glucose: float = Field(..., ge=40, le=300, description="Fasting / 2-hour plasma glucose in mg/dL")
    blood_pressure: float = Field(..., ge=40, le=200, description="Diastolic blood pressure in mm Hg")
    skin_thickness: float = Field(default=20.0, ge=0, le=100, description="Triceps skin fold thickness in mm")
    insulin: float = Field(default=80.0, ge=0, le=900, description="2-Hour serum insulin in mu U/ml")
    bmi: float = Field(..., ge=10.0, le=75.0, description="Body Mass Index (weight in kg / height in m²)")
    diabetes_pedigree_function: float = Field(default=0.47, ge=0.01, le=3.0, description="Diabetes pedigree genetic score")
    age: int = Field(..., ge=1, le=120, description="Age in years")
    patient_id: Optional[int] = None

class FactorImpact(BaseModel):
    feature: str
    label: str
    value: float
    unit: str
    status: str  # "Normal", "Elevated", "High Risk"
    impact: str  # "Positive", "Neutral", "High Risk Factor"
    description: str

class GeneralPrecaution(BaseModel):
    title: str
    category: str # "Diet", "Exercise", "Monitoring", "Medical"
    description: str
    priority: str # "High", "Medium", "General"

class PredictionResponse(BaseModel):
    id: Optional[int] = None
    patient_id: Optional[int] = None
    risk_score: float  # e.g. 0.74 = 74%
    risk_percentage: float # 74.0
    risk_level: str  # "Low Risk", "Moderate Risk", "High Risk"
    prediction_label: int  # 0 or 1
    summary: str
    disclaimer: str
    contributing_factors: List[FactorImpact]
    general_precautions: List[GeneralPrecaution]
    inputs: Dict[str, Any]
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Recommendation Schemas ---
class RecommendationCreate(BaseModel):
    patient_id: int
    prediction_id: Optional[int] = None
    clinical_recommendation: str
    general_advice: Optional[str] = None
    lifestyle_advice: Optional[str] = None
    dietary_advice: Optional[str] = None
    follow_up_date: Optional[str] = None
    notes: Optional[str] = None

class RecommendationResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: Optional[int] = None
    prediction_id: Optional[int] = None
    clinical_recommendation: str
    general_advice: Optional[str] = None
    lifestyle_advice: Optional[str] = None
    dietary_advice: Optional[str] = None
    follow_up_date: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime.datetime
    doctor_name: Optional[str] = None
    doctor_specialization: Optional[str] = None

    class Config:
        from_attributes = True

# --- Appointment Schemas ---
class AppointmentCreate(BaseModel):
    doctor_id: int
    clinic_id: Optional[int] = None
    appointment_date: str # YYYY-MM-DD
    time_slot: str # e.g. "10:00 AM - 10:30 AM"
    reason: str
    notes: Optional[str] = None

class AppointmentStatusUpdate(BaseModel):
    status: str # "Confirmed", "Completed", "Cancelled"
    notes: Optional[str] = None

class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    clinic_id: Optional[int] = None
    appointment_date: str
    time_slot: str
    reason: str
    notes: Optional[str] = None
    status: str
    created_at: datetime.datetime
    patient_name: Optional[str] = None
    patient_email: Optional[str] = None
    patient_phone: Optional[str] = None
    doctor_name: Optional[str] = None
    doctor_specialization: Optional[str] = None
    clinic_name: Optional[str] = None
    clinic_address: Optional[str] = None

    class Config:
        from_attributes = True

# --- Message Schemas ---
class MessageCreate(BaseModel):
    receiver_id: int
    content: str
    appointment_id: Optional[int] = None

class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    appointment_id: Optional[int] = None
    content: str
    is_read: bool
    created_at: datetime.datetime
    sender_name: Optional[str] = None
    sender_role: Optional[str] = None

    class Config:
        from_attributes = True

class ConversationSummary(BaseModel):
    contact_user_id: int
    contact_name: str
    contact_role: str
    contact_specialization_or_dob: Optional[str] = None
    last_message: str
    last_message_time: datetime.datetime
    unread_count: int

# --- Dashboard & Stats Schemas ---
class PatientDashboardSummary(BaseModel):
    patient: PatientResponse
    latest_prediction: Optional[PredictionResponse] = None
    total_predictions: int
    risk_trend: List[Dict[str, Any]]
    upcoming_appointments: List[AppointmentResponse]
    recent_recommendations: List[RecommendationResponse]
    unread_messages_count: int

class DoctorDashboardSummary(BaseModel):
    doctor: DoctorResponse
    total_patients: int
    high_risk_patients_count: int
    pending_appointments_count: int
    upcoming_appointments: List[AppointmentResponse]
    recent_patients: List[Dict[str, Any]]
    unread_messages_count: int
