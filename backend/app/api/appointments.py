from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Patient, Doctor, Clinic, Appointment
from ..schemas import AppointmentCreate, AppointmentStatusUpdate, AppointmentResponse
from ..services.auth_service import get_current_user

router = APIRouter(prefix="/api/appointments", tags=["Appointments"])

@router.post("", response_model=AppointmentResponse)
def book_appointment(
    req: AppointmentCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user.role != "patient" or not user.patient_profile:
        raise HTTPException(status_code=403, detail="Only registered patients can book appointments.")

    patient = user.patient_profile

    # Validate Doctor
    doctor = db.query(Doctor).filter(Doctor.id == req.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Selected doctor was not found.")

    # Check for Double-Booking
    existing_booking = db.query(Appointment).filter(
        Appointment.doctor_id == req.doctor_id,
        Appointment.appointment_date == req.appointment_date,
        Appointment.time_slot == req.time_slot,
        Appointment.status.in_(["Pending", "Confirmed"])
    ).first()

    if existing_booking:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"This time slot ({req.time_slot}) on {req.appointment_date} with {doctor.full_name} is already booked. Please choose another slot or date."
        )

    clinic_id = req.clinic_id or doctor.clinic_id

    appointment = Appointment(
        patient_id=patient.id,
        doctor_id=doctor.id,
        clinic_id=clinic_id,
        appointment_date=req.appointment_date,
        time_slot=req.time_slot,
        reason=req.reason,
        notes=req.notes,
        status="Pending"
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    clinic = db.query(Clinic).filter(Clinic.id == clinic_id).first() if clinic_id else None

    return AppointmentResponse(
        id=appointment.id,
        patient_id=appointment.patient_id,
        doctor_id=appointment.doctor_id,
        clinic_id=appointment.clinic_id,
        appointment_date=appointment.appointment_date,
        time_slot=appointment.time_slot,
        reason=appointment.reason,
        notes=appointment.notes,
        status=appointment.status,
        created_at=appointment.created_at,
        patient_name=patient.full_name,
        patient_email=patient.email,
        patient_phone=patient.phone,
        doctor_name=doctor.full_name,
        doctor_specialization=doctor.specialization,
        clinic_name=clinic.name if clinic else doctor.clinic_name,
        clinic_address=clinic.address if clinic else ""
    )

@router.get("", response_model=List[AppointmentResponse])
def list_appointments(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Appointment)
    
    if user.role == "patient" and user.patient_profile:
        query = query.filter(Appointment.patient_id == user.patient_profile.id)
    elif user.role == "doctor" and user.doctor_profile:
        query = query.filter(Appointment.doctor_id == user.doctor_profile.id)
    else:
        return []

    appts = query.order_by(Appointment.appointment_date.desc()).all()
    results = []

    for a in appts:
        pat = db.query(Patient).filter(Patient.id == a.patient_id).first()
        doc = db.query(Doctor).filter(Doctor.id == a.doctor_id).first()
        cl = db.query(Clinic).filter(Clinic.id == a.clinic_id).first() if a.clinic_id else None

        results.append(AppointmentResponse(
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
            doctor_name=doc.full_name if doc else "Doctor",
            doctor_specialization=doc.specialization if doc else "Diabetologist",
            clinic_name=cl.name if cl else (doc.clinic_name if doc else "Clinic"),
            clinic_address=cl.address if cl else ""
        ))

    return results

@router.patch("/{id}/status", response_model=AppointmentResponse)
def update_appointment_status(
    id: int,
    req: AppointmentStatusUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    appointment = db.query(Appointment).filter(Appointment.id == id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    valid_statuses = ["Pending", "Confirmed", "Completed", "Cancelled"]
    if req.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}")

    # Role permissions
    if user.role == "patient":
        if not user.patient_profile or user.patient_profile.id != appointment.patient_id:
            raise HTTPException(status_code=403, detail="Unauthorized")
        if req.status not in ["Cancelled"]:
            raise HTTPException(status_code=403, detail="Patients can only cancel appointments.")
    elif user.role == "doctor":
        if not user.doctor_profile or user.doctor_profile.id != appointment.doctor_id:
            raise HTTPException(status_code=403, detail="Unauthorized")

    appointment.status = req.status
    if req.notes:
        appointment.notes = (appointment.notes or "") + f"\nUpdate: {req.notes}"

    db.commit()
    db.refresh(appointment)

    pat = db.query(Patient).filter(Patient.id == appointment.patient_id).first()
    doc = db.query(Doctor).filter(Doctor.id == appointment.doctor_id).first()
    cl = db.query(Clinic).filter(Clinic.id == appointment.clinic_id).first() if appointment.clinic_id else None

    return AppointmentResponse(
        id=appointment.id,
        patient_id=appointment.patient_id,
        doctor_id=appointment.doctor_id,
        clinic_id=appointment.clinic_id,
        appointment_date=appointment.appointment_date,
        time_slot=appointment.time_slot,
        reason=appointment.reason,
        notes=appointment.notes,
        status=appointment.status,
        created_at=appointment.created_at,
        patient_name=pat.full_name if pat else "Patient",
        patient_email=pat.email if pat else "",
        patient_phone=pat.phone if pat else "",
        doctor_name=doc.full_name if doc else "Doctor",
        doctor_specialization=doc.specialization if doc else "Diabetologist",
        clinic_name=cl.name if cl else (doc.clinic_name if doc else "Clinic"),
        clinic_address=cl.address if cl else ""
    )
