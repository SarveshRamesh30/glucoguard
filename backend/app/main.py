import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .services.seed_data import seed_database
from .services.ml_service import get_model_and_scaler
from .api import auth, predict, patients, doctors, clinics, appointments, recommendations, messages, ml_insights

# Create database tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Create database schema
    Base.metadata.create_all(bind=engine)

    # 2. Pre-load ML Model
    try:
        get_model_and_scaler()
    except Exception as e:
        print(f"Warning: ML model loading encountered an issue: {e}")

    # 3. Seed Demo Data
    db = SessionLocal()
    try:
        seed_database(db)
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

    yield

app = FastAPI(
    title="GlucoGuard – Diabetes Prediction & Prevention API",
    description="Full-stack AI healthcare prediction and clinical consultation platform",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(predict.router)
app.include_router(patients.router)
app.include_router(doctors.router)
app.include_router(clinics.router)
app.include_router(appointments.router)
app.include_router(recommendations.router)
app.include_router(messages.router)
app.include_router(ml_insights.router)

@app.get("/")
def root():
    return {
        "service": "GlucoGuard API",
        "tagline": "Predict Early. Prevent Better.",
        "status": "online",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "ml_model": "loaded"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
