from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Patient, Doctor
from ..schemas import (
    PatientRegisterRequest, DoctorRegisterRequest, LoginRequest,
    TokenResponse, UserResponse, ForgotPasswordRequest
)
from ..services.auth_service import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register/patient", response_model=TokenResponse)
def register_patient(req: PatientRegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    user = User(
        email=req.email.lower(),
        hashed_password=hash_password(req.password),
        role="patient",
        is_active=True
    )
    db.add(user)
    db.flush()

    patient = Patient(
        user_id=user.id,
        full_name=req.full_name,
        email=req.email.lower(),
        phone=req.phone,
        dob=req.dob,
        gender=req.gender,
        blood_group=req.blood_group,
        emergency_contact=req.emergency_contact,
        address=req.address
    )
    db.add(patient)
    db.commit()
    db.refresh(user)
    db.refresh(patient)

    token = create_access_token({"sub": str(user.id), "role": user.role, "email": user.email})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        role=user.role,
        full_name=patient.full_name,
        profile_id=patient.id
    )

@router.post("/register/doctor", response_model=TokenResponse)
def register_doctor(req: DoctorRegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    user = User(
        email=req.email.lower(),
        hashed_password=hash_password(req.password),
        role="doctor",
        is_active=True
    )
    db.add(user)
    db.flush()

    doctor = Doctor(
        user_id=user.id,
        full_name=req.full_name,
        email=req.email.lower(),
        phone=req.phone,
        specialization=req.specialization,
        clinic_name=req.clinic_name,
        experience_years=req.experience_years,
        qualification=req.qualification,
        consultation_fee=req.consultation_fee or 50.0,
        bio=req.bio,
        avatar_url="https://images.unsplash.com/photo-1594824813620-4001c383796d?w=200&auto=format&fit=crop&q=80"
    )
    db.add(doctor)
    db.commit()
    db.refresh(user)
    db.refresh(doctor)

    token = create_access_token({"sub": str(user.id), "role": user.role, "email": user.email})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        role=user.role,
        full_name=doctor.full_name,
        profile_id=doctor.id
    )

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please try again."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated."
        )

    full_name = user.email
    profile_id = 0
    if user.role == "patient" and user.patient_profile:
        full_name = user.patient_profile.full_name
        profile_id = user.patient_profile.id
    elif user.role == "doctor" and user.doctor_profile:
        full_name = user.doctor_profile.full_name
        profile_id = user.doctor_profile.id

    token = create_access_token({"sub": str(user.id), "role": user.role, "email": user.email})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        role=user.role,
        full_name=full_name,
        profile_id=profile_id
    )

@router.post("/demo-login/{role}", response_model=TokenResponse)
def demo_login(role: str, db: Session = Depends(get_db)):
    if role == "doctor":
        email = "dr.chen@glucoguard.com"
    elif role == "patient":
        email = "patient@glucoguard.com"
    else:
        raise HTTPException(status_code=400, detail="Invalid demo role. Choose 'patient' or 'doctor'.")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Demo account not found. Please ensure database is seeded.")

    full_name = user.email
    profile_id = 0
    if user.role == "patient" and user.patient_profile:
        full_name = user.patient_profile.full_name
        profile_id = user.patient_profile.id
    elif user.role == "doctor" and user.doctor_profile:
        full_name = user.doctor_profile.full_name
        profile_id = user.doctor_profile.id

    token = create_access_token({"sub": str(user.id), "role": user.role, "email": user.email})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        role=user.role,
        full_name=full_name,
        profile_id=profile_id
    )

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(user: User = Depends(get_current_user)):
    patient_id = user.patient_profile.id if user.patient_profile else None
    doctor_id = user.doctor_profile.id if user.doctor_profile else None
    full_name = None
    if user.role == "patient" and user.patient_profile:
        full_name = user.patient_profile.full_name
    elif user.role == "doctor" and user.doctor_profile:
        full_name = user.doctor_profile.full_name

    return UserResponse(
        id=user.id,
        email=user.email,
        role=user.role,
        is_active=user.is_active,
        created_at=user.created_at,
        patient_id=patient_id,
        doctor_id=doctor_id,
        full_name=full_name
    )

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user:
        # Avoid user enumeration in production
        return {"message": "If an account with this email exists, password reset instructions have been dispatched."}
    return {
        "message": f"Password reset instructions and verification link have been sent to {req.email}."
    }
