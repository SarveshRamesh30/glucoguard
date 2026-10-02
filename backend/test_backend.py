"""
Backend Verification & Test Suite
"""
import sys
import os

# Add ML proj to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from backend.app.main import app

def test_backend_end_to_end():
    with TestClient(app) as client:
        # 1. Health check
        print("Testing /api/health...")
        resp = client.get("/api/health")
        assert resp.status_code == 200, f"Health check failed: {resp.text}"
        print("Health check passed:", resp.json())

    # 2. Demo Login Patient
    print("\nTesting Demo Login for Patient...")
    resp = client.post("/api/auth/demo-login/patient")
    assert resp.status_code == 200, f"Patient demo login failed: {resp.text}"
    patient_auth = resp.json()
    patient_token = patient_auth["access_token"]
    patient_headers = {"Authorization": f"Bearer {patient_token}"}
    print(f"Logged in as {patient_auth['full_name']} ({patient_auth['email']})")

    # 3. Demo Login Doctor
    print("\nTesting Demo Login for Doctor...")
    resp = client.post("/api/auth/demo-login/doctor")
    assert resp.status_code == 200, f"Doctor demo login failed: {resp.text}"
    doctor_auth = resp.json()
    doctor_token = doctor_auth["access_token"]
    doctor_headers = {"Authorization": f"Bearer {doctor_token}"}
    print(f"Logged in as {doctor_auth['full_name']} ({doctor_auth['email']})")

    # 4. Test ML Prediction
    print("\nTesting ML Prediction (POST /api/predictions/predict)...")
    pred_payload = {
        "pregnancies": 3,
        "glucose": 160.0,
        "blood_pressure": 88.0,
        "skin_thickness": 30.0,
        "insulin": 190.0,
        "bmi": 34.5,
        "diabetes_pedigree_function": 0.75,
        "age": 42
    }
    resp = client.post("/api/predictions/predict", json=pred_payload, headers=patient_headers)
    assert resp.status_code == 200, f"Prediction failed: {resp.text}"
    pred_res = resp.json()
    print(f"Prediction result: Risk Level = {pred_res['risk_level']}, Score = {pred_res['risk_score']} ({pred_res['risk_percentage']}%)")
    print(f"Factors: {len(pred_res['contributing_factors'])}, Precautions: {len(pred_res['general_precautions'])}")
    assert "disclaimer" in pred_res
    new_pred_id = pred_res.get("id")

    # 5. Test Patient Dashboard
    print("\nTesting Patient Dashboard (GET /api/patients/dashboard)...")
    resp = client.get("/api/patients/dashboard", headers=patient_headers)
    assert resp.status_code == 200, f"Patient dashboard failed: {resp.text}"
    dash_data = resp.json()
    print(f"Patient dashboard loaded: {dash_data['total_predictions']} predictions, {len(dash_data['upcoming_appointments'])} upcoming appts, {dash_data['unread_messages_count']} unread messages")

    # 6. Test Doctor Dashboard
    print("\nTesting Doctor Dashboard (GET /api/doctors/dashboard/me)...")
    resp = client.get("/api/doctors/dashboard/me", headers=doctor_headers)
    assert resp.status_code == 200, f"Doctor dashboard failed: {resp.text}"
    doc_dash = resp.json()
    print(f"Doctor dashboard loaded: {doc_dash['total_patients']} patients, {doc_dash['high_risk_patients_count']} high-risk patients, {doc_dash['pending_appointments_count']} pending appts")

    # 7. Test Clinics API
    print("\nTesting Clinics list (GET /api/clinics with lat/lng)...")
    resp = client.get("/api/clinics?lat=13.0827&lng=80.2707")
    assert resp.status_code == 200, f"Clinics failed: {resp.text}"
    clinics = resp.json()
    print(f"Found {len(clinics)} clinics. Nearest: {clinics[0]['name']} ({clinics[0]['distance_km']} km away)")

    # 8. Test Appointment Booking & Status Change
    print("\nTesting Appointment Booking...")
    appt_payload = {
        "doctor_id": doctor_auth["profile_id"],
        "clinic_id": clinics[0]["id"],
        "appointment_date": "2026-10-15",
        "time_slot": "04:00 PM - 04:30 PM",
        "reason": "Comprehensive diabetes screening & lab review",
        "notes": "Fastest available slot please"
    }
    resp = client.post("/api/appointments", json=appt_payload, headers=patient_headers)
    assert resp.status_code == 200, f"Booking failed: {resp.text}"
    appt = resp.json()
    appt_id = appt["id"]
    print(f"Appointment #{appt_id} booked. Status: {appt['status']}")

    # Doctor confirms appointment
    resp = client.patch(f"/api/appointments/{appt_id}/status", json={"status": "Confirmed", "notes": "Approved by Dr. Chen"}, headers=doctor_headers)
    assert resp.status_code == 200, f"Status update failed: {resp.text}"
    print(f"Appointment #{appt_id} confirmed by doctor!")

    # 9. Test Doctor Recommendation
    print("\nTesting Doctor Recommendation...")
    rec_payload = {
        "patient_id": patient_auth["profile_id"],
        "prediction_id": new_pred_id,
        "clinical_recommendation": "Prescribed HbA1c test and CGM tracking. Maintain fasting glucose below 110 mg/dL.",
        "general_advice": "Focus on high-fiber Mediterranean diet with plenty of leafy vegetables.",
        "lifestyle_advice": "45 mins aerobic brisk walking 5 days/week.",
        "dietary_advice": "Limit refined carbs and sweet beverages.",
        "follow_up_date": "2026-11-01",
        "notes": "Patient is actively tracking metrics on GlucoGuard."
    }
    resp = client.post("/api/recommendations", json=rec_payload, headers=doctor_headers)
    assert resp.status_code == 200, f"Recommendation failed: {resp.text}"
    print("Recommendation created successfully:", resp.json()["clinical_recommendation"])

    # 10. Test Doctor-Patient Messaging
    print("\nTesting Doctor-Patient Messaging...")
    msg_payload = {
        "receiver_id": doctor_auth["user_id"],
        "content": "Hello Dr. Chen, I uploaded my latest glucose and blood pressure assessment.",
        "appointment_id": appt_id
    }
    resp = client.post("/api/messages", json=msg_payload, headers=patient_headers)
    assert resp.status_code == 200, f"Messaging failed: {resp.text}"
    print("Message sent by patient:", resp.json()["content"])

    # Doctor reads thread
    resp = client.get(f"/api/messages/thread/{patient_auth['user_id']}", headers=doctor_headers)
    assert resp.status_code == 200
    messages = resp.json()
    print(f"Doctor retrieved thread with {len(messages)} messages.")

    # 11. Test ML Metrics API
    print("\nTesting ML Metrics (GET /api/ml/metrics)...")
    resp = client.get("/api/ml/metrics")
    assert resp.status_code == 200, f"ML metrics failed: {resp.text}"
    ml_data = resp.json()
    print(f"ML Metrics loaded: Best model is '{ml_data['best_model']}' with {len(ml_data['models'])} models benchmarked.")

    print("\nAll Backend Tests Passed Successfully with 100% Green Output!")

if __name__ == "__main__":
    test_backend_end_to_end()
