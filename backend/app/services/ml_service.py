import os
import json
import numpy as np
import joblib
from typing import Dict, Any, List, Tuple
from ..schemas import FactorImpact, GeneralPrecaution

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
SAVED_MODELS_DIR = os.path.join(BASE_DIR, "ml", "saved_models")
MODEL_PATH = os.path.join(SAVED_MODELS_DIR, "glucoguard_model.joblib")
SCALER_PATH = os.path.join(SAVED_MODELS_DIR, "scaler.joblib")

_model = None
_scaler = None

def get_model_and_scaler():
    global _model, _scaler
    if _model is None or _scaler is None:
        if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
            print("Model files not found. Running training pipeline...")
            from ml.train_models import train_and_evaluate
            train_and_evaluate()
        
        _model = joblib.load(MODEL_PATH)
        _scaler = joblib.load(SCALER_PATH)
    return _model, _scaler

def evaluate_factor_impacts(
    pregnancies: int,
    glucose: float,
    blood_pressure: float,
    skin_thickness: float,
    insulin: float,
    bmi: float,
    dpf: float,
    age: int
) -> List[FactorImpact]:
    factors = []

    # 1. Glucose
    if glucose < 100:
        status, impact = "Normal", "Positive"
        desc = "Fasting glucose is within the healthy optimal range (<100 mg/dL)."
    elif glucose <= 140:
        status, impact = "Elevated (Pre-diabetic Range)", "High Risk Factor"
        desc = f"Glucose at {glucose} mg/dL indicates impaired glucose tolerance / prediabetes."
    else:
        status, impact = "High Risk", "High Risk Factor"
        desc = f"Significantly elevated glucose level ({glucose} mg/dL) strongly drives diabetes risk."
    factors.append(FactorImpact(
        feature="Glucose", label="Blood Glucose", value=glucose, unit="mg/dL",
        status=status, impact=impact, description=desc
    ))

    # 2. BMI
    if bmi < 18.5:
        status, impact = "Underweight", "Neutral"
        desc = "BMI below standard healthy range."
    elif bmi < 25.0:
        status, impact = "Normal", "Positive"
        desc = f"Healthy BMI ({bmi} kg/m²)."
    elif bmi < 30.0:
        status, impact = "Overweight", "Neutral"
        desc = f"BMI ({bmi} kg/m²) indicates mild excess weight; increasing activity is beneficial."
    else:
        status, impact = "Obese (High Risk)", "High Risk Factor"
        desc = f"BMI of {bmi} kg/m² contributes to insulin resistance."
    factors.append(FactorImpact(
        feature="BMI", label="Body Mass Index", value=bmi, unit="kg/m²",
        status=status, impact=impact, description=desc
    ))

    # 3. Blood Pressure
    if blood_pressure < 80:
        status, impact = "Normal", "Positive"
        desc = f"Healthy diastolic blood pressure ({blood_pressure} mm Hg)."
    elif blood_pressure <= 89:
        status, impact = "Pre-hypertension", "Neutral"
        desc = f"Borderline diastolic pressure ({blood_pressure} mm Hg)."
    else:
        status, impact = "Stage 2 Hypertension", "High Risk Factor"
        desc = f"Elevated blood pressure ({blood_pressure} mm Hg) increases cardiovascular & metabolic strain."
    factors.append(FactorImpact(
        feature="BloodPressure", label="Diastolic Blood Pressure", value=blood_pressure, unit="mm Hg",
        status=status, impact=impact, description=desc
    ))

    # 4. Insulin
    if insulin <= 140:
        status, impact = "Normal", "Positive"
        desc = f"Serum insulin ({insulin} µU/ml) is within standard limits."
    elif insulin <= 200:
        status, impact = "Borderline Elevated", "Neutral"
        desc = f"Insulin at {insulin} µU/ml may indicate mild compensatory hyperinsulinemia."
    else:
        status, impact = "Elevated (Hyperinsulinemia)", "High Risk Factor"
        desc = f"Elevated insulin level ({insulin} µU/ml) suggests underlying insulin resistance."
    factors.append(FactorImpact(
        feature="Insulin", label="Serum Insulin", value=insulin, unit="µU/ml",
        status=status, impact=impact, description=desc
    ))

    # 5. Diabetes Pedigree Function
    if dpf < 0.4:
        status, impact = "Low Genetic Risk", "Positive"
        desc = f"Genetic pedigree score ({dpf}) indicates low family predisposition."
    elif dpf <= 0.8:
        status, impact = "Moderate Family Risk", "Neutral"
        desc = f"Moderate family history factor ({dpf})."
    else:
        status, impact = "Strong Family Predisposition", "High Risk Factor"
        desc = f"High pedigree score ({dpf}) indicates strong hereditary genetic factor."
    factors.append(FactorImpact(
        feature="DiabetesPedigreeFunction", label="Genetic Predigree Score", value=dpf, unit="score",
        status=status, impact=impact, description=desc
    ))

    # 6. Age
    if age < 35:
        status, impact = "Young Adult", "Positive"
        desc = f"Age {age} has lower baseline age-related metabolic risk."
    elif age < 50:
        status, impact = "Middle Age", "Neutral"
        desc = f"Age {age} enters moderate epidemiological risk threshold."
    else:
        status, impact = "Senior / Elevated", "High Risk Factor"
        desc = f"Age {age} increases likelihood of gradual metabolic changes."
    factors.append(FactorImpact(
        feature="Age", label="Age", value=float(age), unit="years",
        status=status, impact=impact, description=desc
    ))

    return factors

def generate_general_precautions(risk_level: str, factors: List[FactorImpact]) -> List[GeneralPrecaution]:
    precautions = []
    
    # Check if glucose or BMI are high risk
    high_glucose = any(f.feature == "Glucose" and f.impact == "High Risk Factor" for f in factors)
    high_bmi = any(f.feature == "BMI" and f.impact == "High Risk Factor" for f in factors)
    high_bp = any(f.feature == "BloodPressure" and f.impact == "High Risk Factor" for f in factors)

    if risk_level == "High Risk":
        precautions.append(GeneralPrecaution(
            title="Immediate Medical Consultation",
            category="Medical",
            description="Book an appointment with an endocrinologist or diabetologist for an oral glucose tolerance test (OGTT) and HbA1c lab evaluation.",
            priority="High"
        ))
        precautions.append(GeneralPrecaution(
            title="Strict Glycemic Diet & Portion Control",
            category="Diet",
            description="Eliminate refined carbohydrates, sugary beverages, and trans fats. Focus on whole grains, non-starchy vegetables, lean proteins, and low-GI foods.",
            priority="High"
        ))
        precautions.append(GeneralPrecaution(
            title="Daily Blood Glucose Self-Monitoring",
            category="Monitoring",
            description="Check fasting and 2-hour post-meal blood glucose regularly as instructed by your physician.",
            priority="High"
        ))
        precautions.append(GeneralPrecaution(
            title="Structured Daily Physical Activity",
            category="Exercise",
            description="Engage in at least 30-45 minutes of moderate aerobic exercise (brisk walking, swimming, cycling) 5 days a week.",
            priority="Medium"
        ))
    elif risk_level == "Moderate Risk":
        precautions.append(GeneralPrecaution(
            title="Preventive Doctor Checkup",
            category="Medical",
            description="Schedule a preventive health consultation with a physician to evaluate metabolic indicators and HbA1c levels.",
            priority="High"
        ))
        precautions.append(GeneralPrecaution(
            title="Balanced Fiber-Rich Nutrition",
            category="Diet",
            description="Increase dietary soluble fiber (legumes, oats, leafy greens) to smooth post-prandial blood sugar spikes.",
            priority="Medium"
        ))
        precautions.append(GeneralPrecaution(
            title="Consistent Exercise Routine",
            category="Exercise",
            description="Aim for at least 150 minutes of moderate aerobic exercise weekly plus 2 days of strength resistance training.",
            priority="Medium"
        ))
        precautions.append(GeneralPrecaution(
            title="Periodic Glucose & Blood Pressure Tracking",
            category="Monitoring",
            description="Measure fasting glucose and blood pressure once a month or as suggested by your doctor.",
            priority="Medium"
        ))
    else: # Low Risk
        precautions.append(GeneralPrecaution(
            title="Maintain Active Healthy Lifestyle",
            category="Exercise",
            description="Continue regular physical exercise (at least 30 minutes 4-5 times a week) and maintain current muscle mass.",
            priority="General"
        ))
        precautions.append(GeneralPrecaution(
            title="Nutrient-Dense Balanced Diet",
            category="Diet",
            description="Maintain a balanced diet rich in vegetables, healthy fats (nuts, olive oil), quality proteins, and plenty of water.",
            priority="General"
        ))
        precautions.append(GeneralPrecaution(
            title="Annual Preventive Health Screening",
            category="Monitoring",
            description="Schedule annual routine checkups and baseline metabolic panels to ensure sustained long-term health.",
            priority="General"
        ))

    if high_bmi and risk_level != "High Risk":
        precautions.append(GeneralPrecaution(
            title="Weight Management & Caloric Balance",
            category="Diet",
            description="Achieving a 5-7% weight reduction can improve insulin sensitivity by over 50%.",
            priority="Medium"
        ))

    if high_bp:
        precautions.append(GeneralPrecaution(
            title="Sodium & Stress Management",
            category="Monitoring",
            description="Limit daily sodium intake to under 2,000 mg and incorporate stress-reduction practices like mindfulness or yoga.",
            priority="Medium"
        ))

    return precautions

def predict_diabetes_risk(
    pregnancies: int,
    glucose: float,
    blood_pressure: float,
    skin_thickness: float,
    insulin: float,
    bmi: float,
    diabetes_pedigree_function: float,
    age: int
) -> Dict[str, Any]:
    model, scaler = get_model_and_scaler()

    # Feature vector matching training columns
    # ["Pregnancies", "Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"]
    raw_features = np.array([[
        pregnancies,
        glucose,
        blood_pressure,
        skin_thickness,
        insulin,
        bmi,
        diabetes_pedigree_function,
        age
    ]])

    # Scale
    features_scaled = scaler.transform(raw_features)

    # Predict Probabilities
    prob_diabetic = float(model.predict_proba(features_scaled)[0, 1])
    pred_label = int(model.predict(features_scaled)[0])

    # Calibrate risk score (round to 4 decimals)
    risk_score = round(prob_diabetic, 4)
    risk_percentage = round(prob_diabetic * 100, 1)

    # Risk level categorization
    if risk_score < 0.35:
        risk_level = "Low Risk"
        summary = f"Based on your clinical markers, your estimated diabetes risk is Low ({risk_percentage}%). Continue your healthy habits and preventive routines."
    elif risk_score < 0.70:
        risk_level = "Moderate Risk"
        summary = f"Your health indicators show a Moderate diabetes risk ({risk_percentage}%). Lifestyle interventions, nutritional adjustments, and doctor review are advised."
    else:
        risk_level = "High Risk"
        summary = f"Your indicators indicate a High diabetes risk ({risk_percentage}%). We strongly recommend consulting a healthcare specialist for diagnostic testing."

    factors = evaluate_factor_impacts(
        pregnancies, glucose, blood_pressure, skin_thickness, insulin, bmi, diabetes_pedigree_function, age
    )
    precautions = generate_general_precautions(risk_level, factors)

    disclaimer = (
        "IMPORTANT MEDICAL DISCLAIMER: This assessment is an artificial intelligence-based predictive estimate "
        "trained on epidemiological machine learning datasets. It is designed solely for informational and educational "
        "screening purposes and does NOT constitute a clinical medical diagnosis, prescription, or treatment plan. "
        "Always consult a qualified healthcare provider for proper medical evaluation."
    )

    return {
        "risk_score": risk_score,
        "risk_percentage": risk_percentage,
        "risk_level": risk_level,
        "prediction_label": pred_label,
        "summary": summary,
        "disclaimer": disclaimer,
        "contributing_factors": factors,
        "general_precautions": precautions,
        "inputs": {
            "pregnancies": pregnancies,
            "glucose": glucose,
            "blood_pressure": blood_pressure,
            "skin_thickness": skin_thickness,
            "insulin": insulin,
            "bmi": bmi,
            "diabetes_pedigree_function": diabetes_pedigree_function,
            "age": age
        }
    }
