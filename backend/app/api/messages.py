from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
import datetime
from ..database import get_db
from ..models import User, Patient, Doctor, Message, Appointment
from ..schemas import MessageCreate, MessageResponse, ConversationSummary
from ..services.auth_service import get_current_user

router = APIRouter(prefix="/api/messages", tags=["Messages"])

@router.post("", response_model=MessageResponse)
def send_message(
    req: MessageCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    receiver = db.query(User).filter(User.id == req.receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Message recipient not found")

    if req.receiver_id == user.id:
        raise HTTPException(status_code=400, detail="Cannot send a message to yourself")

    msg = Message(
        sender_id=user.id,
        receiver_id=req.receiver_id,
        appointment_id=req.appointment_id,
        content=req.content.strip(),
        is_read=False,
        created_at=datetime.datetime.utcnow()
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    sender_name = user.email
    if user.role == "patient" and user.patient_profile:
        sender_name = user.patient_profile.full_name
    elif user.role == "doctor" and user.doctor_profile:
        sender_name = user.doctor_profile.full_name

    return MessageResponse(
        id=msg.id,
        sender_id=msg.sender_id,
        receiver_id=msg.receiver_id,
        appointment_id=msg.appointment_id,
        content=msg.content,
        is_read=msg.is_read,
        created_at=msg.created_at,
        sender_name=sender_name,
        sender_role=user.role
    )

@router.get("/conversations", response_model=List[ConversationSummary])
def get_conversations(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch all messages where current user is sender or receiver
    messages = db.query(Message).filter(
        or_(Message.sender_id == user.id, Message.receiver_id == user.id)
    ).order_by(Message.created_at.desc()).all()

    contacts_map = {}
    for m in messages:
        contact_id = m.receiver_id if m.sender_id == user.id else m.sender_id
        if contact_id not in contacts_map:
            contact_user = db.query(User).filter(User.id == contact_id).first()
            if not contact_user:
                continue

            contact_name = contact_user.email
            extra_info = None
            if contact_user.role == "doctor" and contact_user.doctor_profile:
                contact_name = contact_user.doctor_profile.full_name
                extra_info = contact_user.doctor_profile.specialization
            elif contact_user.role == "patient" and contact_user.patient_profile:
                contact_name = contact_user.patient_profile.full_name
                extra_info = f"DOB: {contact_user.patient_profile.dob}" if contact_user.patient_profile.dob else "Patient"

            unread = db.query(Message).filter(
                Message.sender_id == contact_id,
                Message.receiver_id == user.id,
                Message.is_read == False
            ).count()

            contacts_map[contact_id] = ConversationSummary(
                contact_user_id=contact_id,
                contact_name=contact_name,
                contact_role=contact_user.role,
                contact_specialization_or_dob=extra_info,
                last_message=m.content,
                last_message_time=m.created_at,
                unread_count=unread
            )

    return list(contacts_map.values())

@router.get("/thread/{contact_user_id}", response_model=List[MessageResponse])
def get_message_thread(
    contact_user_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    contact = db.query(User).filter(User.id == contact_user_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    # Mark all incoming messages from this contact as read
    db.query(Message).filter(
        Message.sender_id == contact_user_id,
        Message.receiver_id == user.id,
        Message.is_read == False
    ).update({"is_read": True})
    db.commit()

    # Retrieve all messages in this conversation
    messages = db.query(Message).filter(
        or_(
            and_(Message.sender_id == user.id, Message.receiver_id == contact_user_id),
            and_(Message.sender_id == contact_user_id, Message.receiver_id == user.id)
        )
    ).order_by(Message.created_at.asc()).all()

    results = []
    for m in messages:
        sender_user = db.query(User).filter(User.id == m.sender_id).first()
        sender_name = sender_user.email if sender_user else "User"
        if sender_user and sender_user.role == "patient" and sender_user.patient_profile:
            sender_name = sender_user.patient_profile.full_name
        elif sender_user and sender_user.role == "doctor" and sender_user.doctor_profile:
            sender_name = sender_user.doctor_profile.full_name

        results.append(MessageResponse(
            id=m.id,
            sender_id=m.sender_id,
            receiver_id=m.receiver_id,
            appointment_id=m.appointment_id,
            content=m.content,
            is_read=m.is_read,
            created_at=m.created_at,
            sender_name=sender_name,
            sender_role=sender_user.role if sender_user else "user"
        ))

    return results

@router.get("/contacts")
def get_available_chat_contacts(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Returns directory of available doctors (if user is patient) or patients (if user is doctor)."""
    if user.role == "patient":
        doctors = db.query(Doctor).all()
        return [
            {
                "user_id": d.user_id,
                "doctor_id": d.id,
                "full_name": d.full_name,
                "specialization": d.specialization,
                "clinic_name": d.clinic_name,
                "role": "doctor",
                "avatar_url": d.avatar_url
            } for d in doctors
        ]
    else:
        patients = db.query(Patient).all()
        return [
            {
                "user_id": p.user_id,
                "patient_id": p.id,
                "full_name": p.full_name,
                "email": p.email,
                "phone": p.phone,
                "role": "patient",
                "blood_group": p.blood_group
            } for p in patients
        ]
