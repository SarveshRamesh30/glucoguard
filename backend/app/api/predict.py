import json
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Patient, Prediction, Doctor
from ..schemas import PredictionInput, PredictionResponse, FactorImpact, GeneralPrecaution
from ..services.ml_service import predict_diabetes_risk
from ..services.auth_service import get_current_user, get_current_patient

router = APIRouter(prefix="/api/predictions", tags=["Predictions"])

@router.post("/predict", response_model=PredictionResponse)
def run_prediction(
    req: PredictionInput,
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None)
):
    # ML inference
    result = predict_diabetes_risk(
        pregnancies=req.pregnancies,
        glucose=req.glucose,
        blood_pressure=req.blood_pressure,
        skin_thickness=req.skin_thickness,
        insulin=req.insulin,
        bmi=req.bmi,
        diabetes_pedigree_function=req.diabetes_pedigree_function,
        age=req.age
    )

    patient_id = req.patient_id
    saved_pred_id = None

    # Check if auth header provided to link prediction
    if not patient_id and authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        try:
            from ..services.auth_service import jwt, SECRET_KEY, ALGORITHM
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = int(payload.get("sub"))
            patient = db.query(Patient).filter(Patient.user_id == user_id).first()
            if patient:
                patient_id = patient.id
        except Exception:
            pass

    # Save to database if patient found or specified
    if patient_id:
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if patient:
            factors_json = json.dumps([f.model_dump() for f in result["contributing_factors"]])
            db_pred = Prediction(
                patient_id=patient.id,
                pregnancies=req.pregnancies,
                glucose=req.glucose,
                blood_pressure=req.blood_pressure,
                skin_thickness=req.skin_thickness,
                insulin=req.insulin,
                bmi=req.bmi,
                diabetes_pedigree_function=req.diabetes_pedigree_function,
                age=req.age,
                risk_score=result["risk_score"],
                risk_level=result["risk_level"],
                prediction_label=result["prediction_label"],
                factors_analysis_json=factors_json
            )
            db.add(db_pred)
            db.commit()
            db.refresh(db_pred)
            saved_pred_id = db_pred.id

    return PredictionResponse(
        id=saved_pred_id,
        patient_id=patient_id,
        risk_score=result["risk_score"],
        risk_percentage=result["risk_percentage"],
        risk_level=result["risk_level"],
        prediction_label=result["prediction_label"],
        summary=result["summary"],
        disclaimer=result["disclaimer"],
        contributing_factors=result["contributing_factors"],
        general_precautions=result["general_precautions"],
        inputs=result["inputs"],
        created_at=datetime.datetime.utcnow()
    )

@router.get("/history", response_model=List[PredictionResponse])
def get_prediction_history(
    patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    preds = db.query(Prediction).filter(Prediction.patient_id == patient.id).order_by(Prediction.created_at.desc()).all()
    
    output = []
    for p in preds:
        factors = []
        if p.factors_analysis_json:
            try:
                raw_factors = json.loads(p.factors_analysis_json)
                factors = [FactorImpact(**f) for f in raw_factors]
            except Exception:
                pass
                
        # Generate summary
        risk_pct = round(p.risk_score * 100, 1)
        summary = f"Risk assessment: {p.risk_level} ({risk_pct}%)."
        
        output.append(PredictionResponse(
            id=p.id,
            patient_id=p.patient_id,
            risk_score=p.risk_score,
            risk_percentage=risk_pct,
            risk_level=p.risk_level,
            prediction_label=p.prediction_label,
            summary=summary,
            disclaimer="ML-based risk estimate. Not a medical diagnosis.",
            contributing_factors=factors,
            general_precautions=[],
            inputs={
                "pregnancies": p.pregnancies,
                "glucose": p.glucose,
                "blood_pressure": p.blood_pressure,
                "skin_thickness": p.skin_thickness,
                "insulin": p.insulin,
                "bmi": p.bmi,
                "diabetes_pedigree_function": p.diabetes_pedigree_function,
                "age": p.age
            },
            created_at=p.created_at
        ))
    return output

@router.get("/{id}", response_model=PredictionResponse)
def get_prediction_by_id(
    id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pred = db.query(Prediction).filter(Prediction.id == id).first()
    if not pred:
        raise HTTPException(status_code=404, detail="Prediction not found")

    # Authorization check
    if user.role == "patient" and (not user.patient_profile or user.patient_profile.id != pred.patient_id):
        raise HTTPException(status_code=403, detail="Unauthorized to access this prediction record")

    factors = []
    if pred.factors_analysis_json:
        try:
            raw_factors = json.loads(pred.factors_analysis_json)
            factors = [FactorImpact(**f) for f in raw_factors]
        except Exception:
            pass

    from ..services.ml_service import generate_general_precautions
    precautions = generate_general_precautions(pred.risk_level, factors)

    return PredictionResponse(
        id=pred.id,
        patient_id=pred.patient_id,
        risk_score=pred.risk_score,
        risk_percentage=round(pred.risk_score * 100, 1),
        risk_level=pred.risk_level,
        prediction_label=pred.prediction_label,
        summary=f"Risk assessment: {pred.risk_level} ({round(pred.risk_score * 100, 1)}%).",
        disclaimer="ML-based risk estimate. Not a medical diagnosis.",
        contributing_factors=factors,
        general_precautions=precautions,
        inputs={
            "pregnancies": pred.pregnancies,
            "glucose": pred.glucose,
            "blood_pressure": pred.blood_pressure,
            "skin_thickness": pred.skin_thickness,
            "insulin": pred.insulin,
            "bmi": pred.bmi,
            "diabetes_pedigree_function": pred.diabetes_pedigree_function,
            "age": pred.age
        },
        created_at=pred.created_at
    )
