import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="patient")  # "patient" or "doctor"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    patient_profile = relationship("Patient", back_populates="user", uselist=False, cascade="all, delete-orphan")
    doctor_profile = relationship("Doctor", back_populates="user", uselist=False, cascade="all, delete-orphan")
    sent_messages = relationship("Message", foreign_keys="Message.sender_id", back_populates="sender")
    received_messages = relationship("Message", foreign_keys="Message.receiver_id", back_populates="receiver")


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    dob = Column(String(50), nullable=True)  # YYYY-MM-DD
    gender = Column(String(20), nullable=True) # Male, Female, Other
    blood_group = Column(String(10), nullable=True) # A+, B+, etc.
    emergency_contact = Column(String(100), nullable=True)
    address = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="patient_profile")
    predictions = relationship("Prediction", back_populates="patient", cascade="all, delete-orphan", order_by="desc(Prediction.created_at)")
    appointments = relationship("Appointment", back_populates="patient", cascade="all, delete-orphan", order_by="desc(Appointment.appointment_date)")
    recommendations = relationship("Recommendation", back_populates="patient", cascade="all, delete-orphan", order_by="desc(Recommendation.created_at)")


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    specialization = Column(String(255), nullable=False, default="Diabetologist & Endocrinologist")
    clinic_id = Column(Integer, ForeignKey("clinics.id", ondelete="SET NULL"), nullable=True)
    clinic_name = Column(String(255), nullable=True)
    experience_years = Column(Integer, default=5)
    qualification = Column(String(255), default="MBBS, MD - Endocrinology")
    consultation_fee = Column(Float, default=50.0)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="doctor_profile")
    clinic = relationship("Clinic", back_populates="doctors")
    appointments = relationship("Appointment", back_populates="doctor", order_by="desc(Appointment.appointment_date)")
    recommendations = relationship("Recommendation", back_populates="doctor")


class Clinic(Base):
    __tablename__ = "clinics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    address = Column(String(500), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    phone = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)
    rating = Column(Float, default=4.8)
    review_count = Column(Integer, default=120)
    opening_hours = Column(String(255), default="Mon - Sat: 8:00 AM - 8:00 PM")
    website = Column(String(255), nullable=True)
    services_offered = Column(Text, default="Diabetes Screening, Insulin Therapy, Diet Consultation, HbA1c Testing")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    doctors = relationship("Doctor", back_populates="clinic")
    appointments = relationship("Appointment", back_populates="clinic")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    
    # Input health features
    pregnancies = Column(Integer, default=0)
    glucose = Column(Float, nullable=False)
    blood_pressure = Column(Float, nullable=False)
    skin_thickness = Column(Float, default=20.0)
    insulin = Column(Float, default=80.0)
    bmi = Column(Float, nullable=False)
    diabetes_pedigree_function = Column(Float, default=0.47)
    age = Column(Integer, nullable=False)

    # ML Output
    risk_score = Column(Float, nullable=False)  # 0.0 to 1.0 (e.g. 0.82 = 82%)
    risk_level = Column(String(50), nullable=False)  # "Low Risk", "Moderate Risk", "High Risk"
    prediction_label = Column(Integer, nullable=False) # 0 or 1
    factors_analysis_json = Column(Text, nullable=True) # JSON of key contributing factors
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    patient = relationship("Patient", back_populates="predictions")
    recommendations = relationship("Recommendation", back_populates="prediction")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id", ondelete="SET NULL"), nullable=True)
    prediction_id = Column(Integer, ForeignKey("predictions.id", ondelete="SET NULL"), nullable=True)
    
    general_advice = Column(Text, nullable=True)
    clinical_recommendation = Column(Text, nullable=False)
    lifestyle_advice = Column(Text, nullable=True)
    dietary_advice = Column(Text, nullable=True)
    follow_up_date = Column(String(50), nullable=True) # YYYY-MM-DD
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    patient = relationship("Patient", back_populates="recommendations")
    doctor = relationship("Doctor", back_populates="recommendations")
    prediction = relationship("Prediction", back_populates="recommendations")


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id", ondelete="CASCADE"), nullable=False)
    clinic_id = Column(Integer, ForeignKey("clinics.id", ondelete="SET NULL"), nullable=True)
    
    appointment_date = Column(String(50), nullable=False) # YYYY-MM-DD
    time_slot = Column(String(50), nullable=False) # e.g. "10:00 AM - 10:30 AM"
    reason = Column(String(500), nullable=False)
    notes = Column(Text, nullable=True)
    status = Column(String(50), default="Pending") # "Pending", "Confirmed", "Completed", "Cancelled"
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")
    clinic = relationship("Clinic", back_populates="appointments")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    appointment_id = Column(Integer, ForeignKey("appointments.id", ondelete="SET NULL"), nullable=True)
    
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_messages")
