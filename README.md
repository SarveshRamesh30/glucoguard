# GlucoGuard – Diabetes Prediction & Prevention System (Chennai & Tamil Nadu Edition)

> **Tagline:** *Predict Early. Prevent Better.*

GlucoGuard is a full-stack AI healthcare web platform designed for early diabetes risk screening, personalized preventive care, Chennai clinic discovery via interactive maps, appointment scheduling, and doctor-patient communication.

---

## 🌟 Key Features

1. **Machine Learning Risk Prediction**:
   - Real-time risk estimation using a tuned **Gradient Boosting Classifier** trained on clinical diabetes indicators.
   - Outputs calibrated risk probability score ($0-100\%$) and risk categorization:
     - 🟢 **Low Risk** ($<35\%$)
     - 🟡 **Moderate Risk** ($35-70\%$)
     - 🔴 **High Risk** ($\ge 70\%$)
   - Factor impact breakdown analyzing individual biomarkers (Glucose, BMI, BP, Insulin, Pedigree score, Age).
   - Clear medical disclaimer distinguishing AI screening from clinical diagnoses.

2. **Personalized Preventive Precautions**:
   - Categorized lifestyle guidance across **Nutrition & Diet** (Low-GI South Indian millets, foxtail/kodo millet, soluble fiber), **Physical Activity** (150 min aerobic protocol), **Self-Monitoring**, and **Medical Consultation**.
   - Clear distinction between automated AI precautions and licensed doctor recommendations.

3. **Interactive Nearby Clinics & Map (Chennai, Tamil Nadu)**:
   - Interactive Leaflet / OpenStreetMap centered on Chennai, Tamil Nadu.
   - Real-time distance calculation via Haversine formula from your location.
   - Prominent specialized diabetes centers across Chennai:
     - **Dr. Mohan's Diabetes Specialities Centre (HQ)** – Gopalapuram
     - **Apollo Sugar Clinics** – Greams Road, Thousand Lights
     - **M.V. Hospital for Diabetes & Research Centre** – Royapuram
     - **Madras Diabetes Research & Endocrine Centre (MDRC)** – Anna Nagar East
     - **Kauvery Diabetology & Endocrine Institute** – Alwarpet
     - **Fortis Malar Diabetes & Metabolic Wellness Clinic** – Adyar
     - **Chettinad Health & Diabetes Care Clinic** – Velachery
   - Clinic details: operating hours, Indian contact numbers (+91), ratings, services offered, and doctor roster.
   - Direct appointment booking with consultation fees in INR (₹).

4. **Smart Appointment Booking**:
   - Patient-doctor appointment scheduling with conflict prevention (avoids double-booking doctors for the same slot).
   - Status lifecycle: `Pending` ➔ `Confirmed` ➔ `Completed` / `Cancelled`.

5. **Doctor-Patient Messaging**:
   - Secure threaded chat system with real-time updates, unread counters, and quick reply templates.

6. **Doctor Workspace & Clinical Queue**:
   - Prioritized patient risk queue with high-risk alerts.
   - Full clinical history drawer to inspect previous prediction timelines and glucose trends.
   - Dedicated recommendation publishing modal for lifestyle and medical advice.

7. **ML Insights & Academic Benchmark Dashboard (College Project Demo)**:
   - Live benchmark comparison across 5 models: **Gradient Boosting, Random Forest, Logistic Regression, Support Vector Machine (SVM), and Decision Tree**.
   - Interactive **Confusion Matrix** visual heatmap with Sensitivity, Specificity, and Precision metrics.
   - **Feature Importance** ranking chart.
   - **ROC-AUC Curves** and dataset summary statistics.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend** | Python 3.13+, FastAPI, SQLAlchemy, SQLite, Pydantic, PyJWT, Bcrypt |
| **Machine Learning** | Scikit-learn, Pandas, NumPy, Joblib, SciPy |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS |
| **Data Viz & Maps** | Recharts, Leaflet, React-Leaflet, Lucide React, Canvas Confetti |

---

## 🚀 Getting Started

### 1. Backend Server
```bash
uvicorn backend.app.main:app --reload --port 8000
```
- **Backend API:** `http://localhost:8000`
- **Interactive Swagger Docs:** `http://localhost:8000/docs`
- **Health Check:** `http://localhost:8000/api/health`

### 2. Frontend Application
```bash
cd frontend
npm run dev
```
- **Frontend App:** `http://localhost:5173`

---

## 🔑 Login Accounts

| Role | Name | Email | Password |
|---|---|---|---|
| **Patient** | Priya Saravanan | `patient@glucoguard.com` | `patient123` |
| **Doctor** | Dr. R. Sundaram, MD | `dr.sundaram@glucoguard.com` | `doctor123` |
| **Doctor (Visiting)** | Dr. Michael Chen, MD | `dr.chen@glucoguard.com` | `doctor123` |

---

## 📄 License
Created for academic demonstration and diabetes prevention research in Chennai, Tamil Nadu.
