import math
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Clinic, Doctor
from ..schemas import ClinicResponse

router = APIRouter(prefix="/api/clinics", tags=["Clinics"])

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    # Radius of earth in kilometers
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

@router.get("", response_model=List[ClinicResponse])
def get_clinics(
    lat: Optional[float] = Query(None, description="User latitude"),
    lng: Optional[float] = Query(None, description="User longitude"),
    search: Optional[str] = Query(None, description="Search term for clinic name, services, or location"),
    db: Session = Depends(get_db)
):
    query = db.query(Clinic)
    
    if search:
        search_filter = f"%{search.lower()}%"
        query = query.filter(
            Clinic.name.ilike(search_filter) |
            Clinic.address.ilike(search_filter) |
            Clinic.services_offered.ilike(search_filter)
        )
        
    clinics = query.all()
    results = []

    for c in clinics:
        dist = None
        if lat is not None and lng is not None:
            dist = haversine_distance(lat, lng, c.latitude, c.longitude)

        doc_count = db.query(Doctor).filter(Doctor.clinic_id == c.id).count()

        results.append(ClinicResponse(
            id=c.id,
            name=c.name,
            address=c.address,
            latitude=c.latitude,
            longitude=c.longitude,
            phone=c.phone,
            email=c.email,
            rating=c.rating,
            review_count=c.review_count,
            opening_hours=c.opening_hours,
            website=c.website,
            services_offered=c.services_offered,
            distance_km=dist,
            doctors_count=doc_count
        ))

    # Sort by distance if coordinates provided, else by rating
    if lat is not None and lng is not None:
        results.sort(key=lambda x: x.distance_km if x.distance_km is not None else 999999)
    else:
        results.sort(key=lambda x: x.rating, reverse=True)

    return results

@router.get("/{id}")
def get_clinic_by_id(id: int, db: Session = Depends(get_db)):
    clinic = db.query(Clinic).filter(Clinic.id == id).first()
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")

    doctors = db.query(Doctor).filter(Doctor.clinic_id == clinic.id).all()
    
    return {
        "clinic": ClinicResponse.model_validate(clinic),
        "doctors": [
            {
                "id": d.id,
                "user_id": d.user_id,
                "full_name": d.full_name,
                "email": d.email,
                "phone": d.phone,
                "specialization": d.specialization,
                "experience_years": d.experience_years,
                "qualification": d.qualification,
                "consultation_fee": d.consultation_fee,
                "bio": d.bio,
                "avatar_url": d.avatar_url
            } for d in doctors
        ]
    }
