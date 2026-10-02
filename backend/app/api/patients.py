import json
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Patient, Prediction, Appointment, Recommendation, Message, Doctor, Clinic
from ..schemas import (
    PatientResponse, PatientUpdateRequest, PatientDashboardSummary,
    PredictionResponse, AppointmentResponse, RecommendationResponse, FactorImpact
)
from ..services.auth_service import get_current_patient, get_current_user

router = APIRouter(prefix="/api/patients", tags=["Patients"])

@router.get("/profile", response_model=PatientResponse)
def get_patient_profile(patient: Patient = Depends(get_current_patient)):
    return patient

@router.put("/profile", response_model=PatientResponse)
def update_patient_profile(
    req: PatientUpdateRequest,
    patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    if req.full_name is not None:
        patient.full_name = req.full_name
    if req.phone is not None:
        patient.phone = req.phone
    if req.dob is not None:
        patient.dob = req.dob
    if req.gender is not None:
        patient.gender = req.gender
    if req.blood_group is not None:
        patient.blood_group = req.blood_group
    if req.emergency_contact is not None:
        patient.emergency_contact = req.emergency_contact
    if req.address is not None:
        patient.address = req.address

    db.commit()
    db.refresh(patient)
    return patient

@router.get("/dashboard", response_model=PatientDashboardSummary)
def get_patient_dashboard(
    patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    # 1. Predictions
    preds = db.query(Prediction).filter(Prediction.patient_id == patient.id).order_by(Prediction.created_at.desc()).all()
    
    latest_pred_resp = None
    if preds:
        latest = preds[0]
        factors = []
        if latest.factors_analysis_json:
            try:
                factors = [FactorImpact(**f) for f in json.loads(latest.factors_analysis_json)]
            except Exception:
                pass
        from ..services.ml_service import generate_general_precautions
        precautions = generate_general_precautions(latest.risk_level, factors)
        
        latest_pred_resp = PredictionResponse(
            id=latest.id,
            patient_id=latest.patient_id,
            risk_score=latest.risk_score,
            risk_percentage=round(latest.risk_score * 100, 1),
            risk_level=latest.risk_level,
            prediction_label=latest.prediction_label,
            summary=f"Latest Risk: {latest.risk_level} ({round(latest.risk_score * 100, 1)}%)",
            disclaimer="ML-based risk estimate. Not a medical diagnosis.",
            contributing_factors=factors,
            general_precautions=precautions,
            inputs={
                "pregnancies": latest.pregnancies,
                "glucose": latest.glucose,
                "blood_pressure": latest.blood_pressure,
                "skin_thickness": latest.skin_thickness,
                "insulin": latest.insulin,
                "bmi": latest.bmi,
                "diabetes_pedigree_function": latest.diabetes_pedigree_function,
                "age": latest.age
            },
            created_at=latest.created_at
        )

    # 2. Risk trend (chronological order)
    risk_trend = []
    for p in reversed(preds):
        risk_trend.append({
            "id": p.id,
            "date": p.created_at.strftime("%b %d"),
            "full_date": p.created_at.strftime("%Y-%m-%d"),
            "risk_percentage": round(p.risk_score * 100, 1),
            "risk_score": p.risk_score,
            "risk_level": p.risk_level,
            "glucose": p.glucose,
            "bmi": p.bmi,
            "blood_pressure": p.blood_pressure
        })

    # 3. Upcoming Appointments
    appts = db.query(Appointment).filter(
        Appointment.patient_id == patient.id,
        Appointment.status.in_(["Pending", "Confirmed"])
    ).order_by(Appointment.appointment_date.asc()).all()

    appt_responses = []
    for a in appts:
        doc = db.query(Doctor).filter(Doctor.id == a.doctor_id).first()
        cl = db.query(Clinic).filter(Clinic.id == a.clinic_id).first() if a.clinic_id else None
        appt_responses.append(AppointmentResponse(
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
            patient_name=patient.full_name,
            doctor_name=doc.full_name if doc else "Specialist",
            doctor_specialization=doc.specialization if doc else "Diabetologist",
            clinic_name=cl.name if cl else "Clinic",
            clinic_address=cl.address if cl else ""
        ))

    # 4. Recent Doctor Recommendations
    recs = db.query(Recommendation).filter(
        Recommendation.patient_id == patient.id
    ).order_by(Recommendation.created_at.desc()).limit(5).all()

    rec_responses = []
    for r in recs:
        doc = db.query(Doctor).filter(Doctor.id == r.doctor_id).first() if r.doctor_id else None
        rec_responses.append(RecommendationResponse(
            id=r.id,
            patient_id=r.patient_id,
            doctor_id=r.doctor_id,
            prediction_id=r.prediction_id,
            clinical_recommendation=r.clinical_recommendation,
            general_advice=r.general_advice,
            lifestyle_advice=r.lifestyle_advice,
            dietary_advice=r.dietary_advice,
            follow_up_date=r.follow_up_date,
            notes=r.notes,
            created_at=r.created_at,
            doctor_name=doc.full_name if doc else "Attending Specialist",
            doctor_specialization=doc.specialization if doc else "Diabetologist"
        ))

    # 5. Unread Messages Count
    unread_count = db.query(Message).filter(
        Message.receiver_id == patient.user_id,
        Message.is_read == False
    ).count()

    return PatientDashboardSummary(
        patient=PatientResponse.model_validate(patient),
        latest_prediction=latest_pred_resp,
        total_predictions=len(preds),
        risk_trend=risk_trend,
        upcoming_appointments=appt_responses,
        recent_recommendations=rec_responses,
        unread_messages_count=unread_count
    )
