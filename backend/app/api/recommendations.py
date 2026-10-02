from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Patient, Doctor, Recommendation, Prediction
from ..schemas import RecommendationCreate, RecommendationResponse
from ..services.auth_service import get_current_user, get_current_doctor, get_current_patient

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

@router.post("", response_model=RecommendationResponse)
def create_recommendation(
    req: RecommendationCreate,
    doctor: Doctor = Depends(get_current_doctor),
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.id == req.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Target patient was not found.")

    if req.prediction_id:
        pred = db.query(Prediction).filter(Prediction.id == req.prediction_id).first()
        if not pred or pred.patient_id != patient.id:
            raise HTTPException(status_code=400, detail="Invalid prediction ID for this patient.")

    rec = Recommendation(
        patient_id=patient.id,
        doctor_id=doctor.id,
        prediction_id=req.prediction_id,
        clinical_recommendation=req.clinical_recommendation,
        general_advice=req.general_advice or "Maintain regular blood glucose monitoring and a balanced diet.",
        lifestyle_advice=req.lifestyle_advice,
        dietary_advice=req.dietary_advice,
        follow_up_date=req.follow_up_date,
        notes=req.notes
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)

    return RecommendationResponse(
        id=rec.id,
        patient_id=rec.patient_id,
        doctor_id=rec.doctor_id,
        prediction_id=rec.prediction_id,
        clinical_recommendation=rec.clinical_recommendation,
        general_advice=rec.general_advice,
        lifestyle_advice=rec.lifestyle_advice,
        dietary_advice=rec.dietary_advice,
        follow_up_date=rec.follow_up_date,
        notes=rec.notes,
        created_at=rec.created_at,
        doctor_name=doctor.full_name,
        doctor_specialization=doctor.specialization
    )

@router.get("/my", response_model=List[RecommendationResponse])
def get_my_recommendations(
    patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    recs = db.query(Recommendation).filter(
        Recommendation.patient_id == patient.id
    ).order_by(Recommendation.created_at.desc()).all()

    results = []
    for r in recs:
        doc = db.query(Doctor).filter(Doctor.id == r.doctor_id).first() if r.doctor_id else None
        results.append(RecommendationResponse(
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

    return results

@router.get("/patient/{patient_id}", response_model=List[RecommendationResponse])
def get_patient_recommendations(
    patient_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Authorization check
    if user.role == "patient" and (not user.patient_profile or user.patient_profile.id != patient_id):
        raise HTTPException(status_code=403, detail="Unauthorized access")

    recs = db.query(Recommendation).filter(
        Recommendation.patient_id == patient_id
    ).order_by(Recommendation.created_at.desc()).all()

    results = []
    for r in recs:
        doc = db.query(Doctor).filter(Doctor.id == r.doctor_id).first() if r.doctor_id else None
        results.append(RecommendationResponse(
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

    return results
