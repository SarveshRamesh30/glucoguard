import json
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Patient, Doctor, Clinic, Prediction, Appointment, Recommendation, Message
from ..schemas import (
    DoctorResponse, DoctorDashboardSummary, AppointmentResponse,
    PatientResponse, PredictionResponse, RecommendationResponse, FactorImpact
)
from ..services.auth_service import get_current_doctor, get_current_user

router = APIRouter(prefix="/api/doctors", tags=["Doctors"])

@router.get("", response_model=List[DoctorResponse])
def get_all_doctors(db: Session = Depends(get_db)):
    doctors = db.query(Doctor).all()
    return doctors

@router.get("/{id}", response_model=DoctorResponse)
def get_doctor_by_id(id: int, db: Session = Depends(get_db)):
    doctor = db.query(Doctor).filter(Doctor.id == id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor

@router.get("/dashboard/me", response_model=DoctorDashboardSummary)
def get_doctor_dashboard(
    doctor: Doctor = Depends(get_current_doctor),
    db: Session = Depends(get_db)
):
    # 1. Appointments for this doctor
    appts = db.query(Appointment).filter(
        Appointment.doctor_id == doctor.id
    ).order_by(Appointment.appointment_date.asc()).all()

    pending_count = sum(1 for a in appts if a.status == "Pending")
    upcoming_appts = [a for a in appts if a.status in ["Pending", "Confirmed"]]

    upcoming_responses = []
    for a in upcoming_appts:
        pat = db.query(Patient).filter(Patient.id == a.patient_id).first()
        cl = db.query(Clinic).filter(Clinic.id == a.clinic_id).first() if a.clinic_id else None
        upcoming_responses.append(AppointmentResponse(
            id=a.id,
            patient_id=a.patient_id,
            doctor_id=a.doctor_id,
            clinic_id=a.clinic_id,
            appointment_date=a.appointment_date,
            time_slot=a.time_slot,
            reason=a.reason,
            notes=a.notes,
            status=a.status,
            created_at=a.created_at,
            patient_name=pat.full_name if pat else "Patient",
            patient_email=pat.email if pat else "",
            patient_phone=pat.phone if pat else "",
            doctor_name=doctor.full_name,
            doctor_specialization=doctor.specialization,
            clinic_name=cl.name if cl else doctor.clinic_name,
            clinic_address=cl.address if cl else ""
        ))

    # 2. Associated Patients (from appointments or all patients in database)
    all_patients = db.query(Patient).all()
    
    high_risk_count = 0
    recent_patients_summary = []
    
    for pat in all_patients:
        latest_pred = db.query(Prediction).filter(
            Prediction.patient_id == pat.id
        ).order_by(Prediction.created_at.desc()).first()

        risk_level = latest_pred.risk_level if latest_pred else "No Test Recorded"
        risk_score = latest_pred.risk_score if latest_pred else 0.0
        risk_pct = round(risk_score * 100, 1) if latest_pred else 0.0

        if latest_pred and latest_pred.risk_level == "High Risk":
            high_risk_count += 1

        last_test_date = latest_pred.created_at.strftime("%Y-%m-%d") if latest_pred else None

        recent_patients_summary.append({
            "patient_id": pat.id,
            "user_id": pat.user_id,
            "full_name": pat.full_name,
            "email": pat.email,
            "phone": pat.phone,
            "gender": pat.gender,
            "dob": pat.dob,
            "blood_group": pat.blood_group,
            "risk_level": risk_level,
            "risk_score": risk_score,
            "risk_percentage": risk_pct,
            "latest_glucose": latest_pred.glucose if latest_pred else None,
            "latest_bmi": latest_pred.bmi if latest_pred else None,
            "last_test_date": last_test_date,
            "total_predictions": len(pat.predictions)
        })

    # Sort patients with High Risk first
    recent_patients_summary.sort(key=lambda x: x["risk_score"], reverse=True)

    # 3. Unread Messages Count
    unread_count = db.query(Message).filter(
        Message.receiver_id == doctor.user_id,
        Message.is_read == False
    ).count()

    return DoctorDashboardSummary(
        doctor=DoctorResponse.model_validate(doctor),
        total_patients=len(all_patients),
        high_risk_patients_count=high_risk_count,
        pending_appointments_count=pending_count,
        upcoming_appointments=upcoming_responses,
        recent_patients=recent_patients_summary,
        unread_messages_count=unread_count
    )

@router.get("/patients/{patient_id}")
def get_patient_clinical_details(
    patient_id: int,
    doctor: Doctor = Depends(get_current_doctor),
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    preds = db.query(Prediction).filter(
        Prediction.patient_id == patient.id
    ).order_by(Prediction.created_at.desc()).all()

    predictions_data = []
    for p in preds:
        factors = []
        if p.factors_analysis_json:
            try:
                factors = [FactorImpact(**f) for f in json.loads(p.factors_analysis_json)]
            except Exception:
                pass
        
        predictions_data.append({
            "id": p.id,
            "risk_score": p.risk_score,
            "risk_percentage": round(p.risk_score * 100, 1),
            "risk_level": p.risk_level,
            "prediction_label": p.prediction_label,
            "inputs": {
                "pregnancies": p.pregnancies,
                "glucose": p.glucose,
                "blood_pressure": p.blood_pressure,
                "skin_thickness": p.skin_thickness,
                "insulin": p.insulin,
                "bmi": p.bmi,
                "diabetes_pedigree_function": p.diabetes_pedigree_function,
                "age": p.age
            },
            "contributing_factors": [f.model_dump() for f in factors],
            "created_at": p.created_at.isoformat()
        })

    recs = db.query(Recommendation).filter(
        Recommendation.patient_id == patient.id
    ).order_by(Recommendation.created_at.desc()).all()

    recommendations_data = []
    for r in recs:
        doc = db.query(Doctor).filter(Doctor.id == r.doctor_id).first() if r.doctor_id else None
        recommendations_data.append({
            "id": r.id,
            "clinical_recommendation": r.clinical_recommendation,
            "general_advice": r.general_advice,
            "lifestyle_advice": r.lifestyle_advice,
            "dietary_advice": r.dietary_advice,
            "follow_up_date": r.follow_up_date,
            "notes": r.notes,
            "doctor_name": doc.full_name if doc else "Specialist",
            "created_at": r.created_at.isoformat()
        })

    return {
        "patient": PatientResponse.model_validate(patient),
        "predictions": predictions_data,
        "recommendations": recommendations_data
    }
