import json
import datetime
from sqlalchemy.orm import Session
from ..models import User, Patient, Doctor, Clinic, Prediction, Recommendation, Appointment, Message
from .auth_service import hash_password

def seed_database(db: Session):
    # Check if data already seeded with Chennai data
    existing_clinic = db.query(Clinic).filter(Clinic.name.ilike("%Mohan%")).first()
    if existing_clinic:
        return

    # Clear previous seed data if any old US data exists
    db.query(Message).delete()
    db.query(Appointment).delete()
    db.query(Recommendation).delete()
    db.query(Prediction).delete()
    db.query(Patient).delete()
    db.query(Doctor).delete()
    db.query(Clinic).delete()
    db.query(User).delete()
    db.commit()

    print("Seeding Chennai, Tamil Nadu clinics, doctors, patients, and appointments...")

    # 1. Seed Chennai Clinics
    clinics = [
        Clinic(
            name="Dr. Mohan's Diabetes Specialities Centre (HQ)",
            address="6B, Conran Smith Road, Gopalapuram, Chennai, Tamil Nadu 600086",
            latitude=13.0524,
            longitude=80.2508,
            phone="+91 44 4396 8888",
            email="gopalapuram@drmohans.com",
            rating=4.9,
            review_count=420,
            opening_hours="Mon - Sat: 7:30 AM - 7:30 PM | Sun: 8:00 AM - 1:00 PM",
            website="https://drmohans.com",
            services_offered="Comprehensive Diabetes Screening, Precision Continuous Glucose Monitoring (CGM), Diabetic Retinopathy Screening, Custom South Indian Diabetic Nutrition"
        ),
        Clinic(
            name="Apollo Sugar Clinics – Greams Road",
            address="21, Greams Lane, Thousand Lights, Chennai, Tamil Nadu 600006",
            latitude=13.0601,
            longitude=80.2523,
            phone="+91 44 2829 0200",
            email="care@apollosugar.com",
            rating=4.8,
            review_count=310,
            opening_hours="Mon - Sat: 8:00 AM - 8:00 PM",
            website="https://apollosugar.com",
            services_offered="Rapid HbA1c Profiling, Prediabetes Reversal Program, Thyroid & Endocrine Panel, Insulin Pump Initiation"
        ),
        Clinic(
            name="M.V. Hospital for Diabetes & Research Centre",
            address="4, West Mada Church Street, Royapuram, Chennai, Tamil Nadu 600013",
            latitude=13.1098,
            longitude=80.2936,
            phone="+91 44 2595 4913",
            email="info@mvhospital.in",
            rating=4.8,
            review_count=265,
            opening_hours="Mon - Sat: 8:00 AM - 7:00 PM",
            website="https://mvhospital.in",
            services_offered="Type 1 & Type 2 Management, Diabetic Kidney Care, Gestational Diabetes Clinic, Glycemic Stabilization"
        ),
        Clinic(
            name="Madras Diabetes Research & Endocrine Centre (MDRC)",
            address="Plot 28, 2nd Avenue, Anna Nagar East, Chennai, Tamil Nadu 600102",
            latitude=13.0878,
            longitude=80.2167,
            phone="+91 44 4350 1122",
            email="annanagar@mdrc.co.in",
            rating=4.9,
            review_count=190,
            opening_hours="Mon - Sat: 8:00 AM - 7:30 PM",
            website="https://mdrc.co.in",
            services_offered="Continuous Glucose Monitoring (CGM), Cardiovascular Risk Profiling, Genetic Pedigree Screening, Nutrition Counseling"
        ),
        Clinic(
            name="Fortis Malar Diabetes & Metabolic Wellness Clinic",
            address="52, 1st Main Road, Gandhi Nagar, Adyar, Chennai, Tamil Nadu 600020",
            latitude=13.0067,
            longitude=80.2573,
            phone="+91 44 4289 2222",
            email="malar.diabetes@fortishealthcare.com",
            rating=4.7,
            review_count=155,
            opening_hours="Mon - Sat: 8:30 AM - 6:30 PM",
            website="https://fortishealthcare.com",
            services_offered="Comprehensive Metabolic Screening, Lipid & Cholesterol Profiling, Diabetic Neuropathy Assessment"
        ),
        Clinic(
            name="Chettinad Health & Diabetes Care Clinic – Velachery",
            address="142, Velachery Main Road, Dhandeeswaram Nagar, Velachery, Chennai, Tamil Nadu 600042",
            latitude=12.9815,
            longitude=80.2180,
            phone="+91 44 2243 5566",
            email="velachery@chettinadhealth.org",
            rating=4.8,
            review_count=175,
            opening_hours="Mon - Fri: 8:00 AM - 8:00 PM | Sat: 8:00 AM - 3:00 PM",
            website="https://chettinadhealth.org",
            services_offered="Preventive Screening, Rapid Blood Glucose Sensor Setup, Diet & Lifestyle Therapy, Community Wellness"
        ),
        Clinic(
            name="Kauvery Diabetology & Endocrine Institute – Alwarpet",
            address="199, Luz Church Road, Alwarpet, Chennai, Tamil Nadu 600004",
            latitude=13.0336,
            longitude=80.2505,
            phone="+91 44 4000 6000",
            email="diabetes@kauveryhospital.com",
            rating=4.9,
            review_count=240,
            opening_hours="Mon - Sat: 8:00 AM - 8:00 PM",
            website="https://kauveryhospital.com",
            services_offered="Advanced Endocrine Panels, Insulin Resistance Reversal, Diabetic Foot Care, Tele-consultations"
        )
    ]
    db.add_all(clinics)
    db.flush()

    # 2. Seed Doctor Accounts
    doc_users = [
        User(email="dr.sundaram@glucoguard.com", hashed_password=hash_password("doctor123"), role="doctor", is_active=True),
        User(email="dr.chen@glucoguard.com", hashed_password=hash_password("doctor123"), role="doctor", is_active=True), # Alias for seamless demo
        User(email="dr.ramachandran@glucoguard.com", hashed_password=hash_password("doctor123"), role="doctor", is_active=True),
        User(email="dr.vijayakumar@glucoguard.com", hashed_password=hash_password("doctor123"), role="doctor", is_active=True),
        User(email="dr.preethi@glucoguard.com", hashed_password=hash_password("doctor123"), role="doctor", is_active=True),
    ]
    db.add_all(doc_users)
    db.flush()

    doctors = [
        Doctor(
            user_id=doc_users[0].id,
            full_name="Dr. R. Sundaram, MD, DM",
            email="dr.sundaram@glucoguard.com",
            phone="+91 98400 11223",
            specialization="Senior Diabetologist & Clinical Endocrinologist",
            clinic_id=clinics[0].id,
            clinic_name=clinics[0].name,
            experience_years=15,
            qualification="MBBS, MD, DM - Endocrinology (Madras Medical College)",
            consultation_fee=700.0,
            bio="Leading Diabetologist in Chennai specializing in precision glycemic therapy, insulin pump optimization, and diabetic complication prevention.",
            avatar_url="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80"
        ),
        Doctor(
            user_id=doc_users[1].id,
            full_name="Dr. Michael Chen, MD (Visiting Consultant)",
            email="dr.chen@glucoguard.com",
            phone="+91 98400 22334",
            specialization="Metabolic Disease Specialist & Clinical Diabetologist",
            clinic_id=clinics[1].id,
            clinic_name=clinics[1].name,
            experience_years=12,
            qualification="MD, FACP - Diabetes & Metabolism",
            consultation_fee=650.0,
            bio="Visiting Consultant at Apollo Sugar Clinics Chennai specializing in early glycemic intervention and wearable CGM telemetry.",
            avatar_url="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80"
        ),
        Doctor(
            user_id=doc_users[2].id,
            full_name="Dr. Ananya Ramachandran, MD",
            email="dr.ramachandran@glucoguard.com",
            phone="+91 98400 33445",
            specialization="Consultant Diabetologist & Preventive Medicine",
            clinic_id=clinics[1].id,
            clinic_name=clinics[1].name,
            experience_years=10,
            qualification="MBBS, MD - General Medicine, PG Diabetology (CMC Vellore)",
            consultation_fee=600.0,
            bio="Dedicated to prediabetes reversal programs, cardiovascular risk reduction, and individualized nutrition therapy for metabolic syndrome.",
            avatar_url="https://images.unsplash.com/photo-1594824813620-4001c383796d?w=200&auto=format&fit=crop&q=80"
        ),
        Doctor(
            user_id=doc_users[3].id,
            full_name="Dr. S. Vijayakumar, MD, FRCP",
            email="dr.vijayakumar@glucoguard.com",
            phone="+91 98400 44556",
            specialization="Senior Diabetologist & Research Director",
            clinic_id=clinics[2].id,
            clinic_name=clinics[2].name,
            experience_years=18,
            qualification="MBBS, MD, FRCP (Glasgow) - Diabetology",
            consultation_fee=800.0,
            bio="Over 18 years of clinical leadership in complex insulin resistance, gestational diabetes, and cardiometabolic health in Chennai.",
            avatar_url="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80"
        ),
        Doctor(
            user_id=doc_users[4].id,
            full_name="Dr. Preethi Balasubramanian, MD",
            email="dr.preethi@glucoguard.com",
            phone="+91 98400 55667",
            specialization="Consultant Diabetologist & Clinical Nutritionist",
            clinic_id=clinics[4].id,
            clinic_name=clinics[4].name,
            experience_years=8,
            qualification="MBBS, MD - Internal Medicine (Stanley Medical College)",
            consultation_fee=550.0,
            bio="Passionate about integrating South Indian dietary modification, sensor analytics, and patient education into daily diabetes care.",
            avatar_url="https://images.unsplash.com/photo-1594824813620-4001c383796d?w=200&auto=format&fit=crop&q=80"
        )
    ]
    db.add_all(doctors)
    db.flush()

    # 3. Seed Patient Accounts
    pat_users = [
        User(email="patient@glucoguard.com", hashed_password=hash_password("patient123"), role="patient", is_active=True),
        User(email="karthik.s@example.com", hashed_password=hash_password("patient123"), role="patient", is_active=True),
        User(email="meenakshi.s@example.com", hashed_password=hash_password("patient123"), role="patient", is_active=True),
    ]
    db.add_all(pat_users)
    db.flush()

    patients = [
        Patient(
            user_id=pat_users[0].id,
            full_name="Priya Saravanan",
            email="patient@glucoguard.com",
            phone="+91 98401 23456",
            dob="1990-05-18",
            gender="Female",
            blood_group="O+",
            emergency_contact="Saravanan (+91 98409 87654)",
            address="14, Usman Road, T. Nagar, Chennai, Tamil Nadu 600017"
        ),
        Patient(
            user_id=pat_users[1].id,
            full_name="Karthik Subramanian",
            email="karthik.s@example.com",
            phone="+91 98402 34567",
            dob="1978-08-24",
            gender="Male",
            blood_group="B+",
            emergency_contact="Deepa Subramanian (+91 98408 76543)",
            address="22, 4th Main Road, Anna Nagar West, Chennai, Tamil Nadu 600040"
        ),
        Patient(
            user_id=pat_users[2].id,
            full_name="Meenakshi Sundaram",
            email="meenakshi.s@example.com",
            phone="+91 98403 45678",
            dob="1994-11-12",
            gender="Female",
            blood_group="A+",
            emergency_contact="Ramesh Sundaram (+91 98407 65432)",
            address="45, Lattice Bridge Road, Adyar, Chennai, Tamil Nadu 600020"
        )
    ]
    db.add_all(patients)
    db.flush()

    # 4. Seed Predictions for Priya Saravanan
    now = datetime.datetime.utcnow()
    
    pred1 = Prediction(
        patient_id=patients[0].id,
        pregnancies=1,
        glucose=158.0,
        blood_pressure=86.0,
        skin_thickness=32.0,
        insulin=180.0,
        bmi=33.4,
        diabetes_pedigree_function=0.68,
        age=34,
        risk_score=0.78,
        risk_level="High Risk",
        prediction_label=1,
        factors_analysis_json=json.dumps([
            {"feature": "Glucose", "label": "Blood Glucose", "value": 158.0, "unit": "mg/dL", "status": "High Risk", "impact": "High Risk Factor", "description": "Fasting glucose of 158 mg/dL is above normal threshold (>140 mg/dL)."},
            {"feature": "BMI", "label": "Body Mass Index", "value": 33.4, "unit": "kg/m²", "status": "Obese (High Risk)", "impact": "High Risk Factor", "description": "BMI of 33.4 kg/m² contributes to insulin resistance."},
            {"feature": "BloodPressure", "label": "Diastolic BP", "value": 86.0, "unit": "mm Hg", "status": "Pre-hypertension", "impact": "Neutral", "description": "Borderline elevated diastolic pressure."}
        ]),
        created_at=now - datetime.timedelta(days=60)
    )

    pred2 = Prediction(
        patient_id=patients[0].id,
        pregnancies=1,
        glucose=138.0,
        blood_pressure=82.0,
        skin_thickness=28.0,
        insulin=130.0,
        bmi=31.2,
        diabetes_pedigree_function=0.68,
        age=34,
        risk_score=0.52,
        risk_level="Moderate Risk",
        prediction_label=1,
        factors_analysis_json=json.dumps([
            {"feature": "Glucose", "label": "Blood Glucose", "value": 138.0, "unit": "mg/dL", "status": "Elevated (Pre-diabetic)", "impact": "High Risk Factor", "description": "Fasting glucose reduced from 158 to 138 mg/dL after South Indian dietary adjustment."},
            {"feature": "BMI", "label": "Body Mass Index", "value": 31.2, "unit": "kg/m²", "status": "Obese Class 1", "impact": "High Risk Factor", "description": "BMI improved from 33.4 to 31.2 kg/m²."}
        ]),
        created_at=now - datetime.timedelta(days=25)
    )

    pred3 = Prediction(
        patient_id=patients[0].id,
        pregnancies=1,
        glucose=112.0,
        blood_pressure=78.0,
        skin_thickness=24.0,
        insulin=95.0,
        bmi=28.4,
        diabetes_pedigree_function=0.68,
        age=34,
        risk_score=0.28,
        risk_level="Low Risk",
        prediction_label=0,
        factors_analysis_json=json.dumps([
            {"feature": "Glucose", "label": "Blood Glucose", "value": 112.0, "unit": "mg/dL", "status": "Normal / Near Optimal", "impact": "Positive", "description": "Glucose significantly improved to 112 mg/dL with low-GI millets & regular walking."},
            {"feature": "BMI", "label": "Body Mass Index", "value": 28.4, "unit": "kg/m²", "status": "Overweight (Improving)", "impact": "Neutral", "description": "Weight loss achieved from lifestyle changes."}
        ]),
        created_at=now - datetime.timedelta(days=2)
    )

    # Seed for Karthik Subramanian (High Risk)
    pred_karthik = Prediction(
        patient_id=patients[1].id,
        pregnancies=0,
        glucose=172.0,
        blood_pressure=94.0,
        skin_thickness=36.0,
        insulin=210.0,
        bmi=36.8,
        diabetes_pedigree_function=0.85,
        age=46,
        risk_score=0.89,
        risk_level="High Risk",
        prediction_label=1,
        factors_analysis_json=json.dumps([
            {"feature": "Glucose", "label": "Blood Glucose", "value": 172.0, "unit": "mg/dL", "status": "High Risk", "impact": "High Risk Factor", "description": "Fasting glucose markedly elevated."},
            {"feature": "BMI", "label": "Body Mass Index", "value": 36.8, "unit": "kg/m²", "status": "Obese Class 2", "impact": "High Risk Factor", "description": "High visceral fat and insulin resistance."}
        ]),
        created_at=now - datetime.timedelta(days=5)
    )

    db.add_all([pred1, pred2, pred3, pred_karthik])
    db.flush()

    # 5. Seed Recommendations
    rec1 = Recommendation(
        patient_id=patients[0].id,
        doctor_id=doctors[0].id,
        prediction_id=pred2.id,
        general_advice="Follow traditional low-glycemic meals: foxtail/kodo millets, moringa leaves soup, and plenty of legumes.",
        clinical_recommendation="Patient showed commendable improvement in glycemic control. Target fasting glucose < 105 mg/dL. Repeat HbA1c test in 6 weeks at Dr. Mohan's Centre Gopalapuram.",
        lifestyle_advice="Brisk walking on Marina/Besant Nagar beach or community park for 45 minutes every morning.",
        dietary_advice="Replace white ponni rice with brown rice or barnyard millet (kuthiraivali). Include bitter gourd (pavakkai) twice weekly.",
        follow_up_date=(now + datetime.timedelta(days=14)).strftime("%Y-%m-%d"),
        notes="Patient is very receptive to South Indian diet modifications and regular monitoring.",
        created_at=now - datetime.timedelta(days=20)
    )
    db.add(rec1)
    db.flush()

    # 6. Seed Appointments
    appt1 = Appointment(
        patient_id=patients[0].id,
        doctor_id=doctors[0].id,
        clinic_id=clinics[0].id,
        appointment_date=(now + datetime.timedelta(days=3)).strftime("%Y-%m-%d"),
        time_slot="10:30 AM - 11:00 AM",
        reason="Follow-up consultation on glycemic progress and HbA1c review",
        notes="Reviewing 60-day glucose trends and updating millet diet protocol.",
        status="Confirmed",
        created_at=now - datetime.timedelta(days=2)
    )

    appt2 = Appointment(
        patient_id=patients[1].id,
        doctor_id=doctors[0].id,
        clinic_id=clinics[0].id,
        appointment_date=(now + datetime.timedelta(days=1)).strftime("%Y-%m-%d"),
        time_slot="02:00 PM - 02:30 PM",
        reason="Initial evaluation for high risk diabetes screening score (89%)",
        notes="Needs comprehensive oral glucose tolerance test (OGTT) and retinal scan.",
        status="Pending",
        created_at=now - datetime.timedelta(hours=12)
    )

    appt3 = Appointment(
        patient_id=patients[0].id,
        doctor_id=doctors[1].id,
        clinic_id=clinics[1].id,
        appointment_date=(now - datetime.timedelta(days=24)).strftime("%Y-%m-%d"),
        time_slot="11:00 AM - 11:30 AM",
        reason="Metabolic consultation & dietary planning at Greams Road",
        notes="Completed successfully. Initiated low-GI nutrition plan.",
        status="Completed",
        created_at=now - datetime.timedelta(days=30)
    )

    db.add_all([appt1, appt2, appt3])
    db.flush()

    # 7. Seed Messages
    msg1 = Message(
        sender_id=pat_users[0].id, # Priya
        receiver_id=doc_users[0].id, # Dr. Sundaram
        content="Vanakkam Dr. Sundaram, I completed my latest 30-day health assessment on GlucoGuard. My glucose readings have dropped from 158 to 112 mg/dL with the millet diet!",
        is_read=True,
        created_at=now - datetime.timedelta(days=2, hours=4)
    )
    msg2 = Message(
        sender_id=doc_users[0].id, # Dr. Sundaram
        receiver_id=pat_users[0].id, # Priya
        content="Vanakkam Priya! That is exceptional progress. Your risk score dropping into the Low Risk category demonstrates the efficacy of your walking and nutrition regimen. Let's review the complete panel during our clinic consultation at Gopalapuram this Thursday.",
        is_read=True,
        created_at=now - datetime.timedelta(days=2, hours=2)
    )
    msg3 = Message(
        sender_id=pat_users[0].id, # Priya
        receiver_id=doc_users[0].id, # Dr. Sundaram
        content="Thank you Doctor! Should I maintain an 8-hour overnight fast before coming to the Gopalapuram clinic?",
        is_read=True,
        created_at=now - datetime.timedelta(hours=5)
    )
    msg4 = Message(
        sender_id=doc_users[0].id, # Dr. Sundaram
        receiver_id=pat_users[0].id, # Priya
        content="Yes, please maintain an 8-hour overnight fast so we can run an accurate fasting blood glucose and lipid panel. See you at the clinic!",
        is_read=False,
        created_at=now - datetime.timedelta(hours=3)
    )

    db.add_all([msg1, msg2, msg3, msg4])
    db.commit()
    print("Chennai, Tamil Nadu database seeding completed successfully!")
