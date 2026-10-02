import os
import json
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/ml", tags=["ML Insights"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
METRICS_PATH = os.path.join(BASE_DIR, "ml", "metrics.json")

@router.get("/metrics")
def get_ml_metrics():
    if not os.path.exists(METRICS_PATH):
        try:
            from ml.train_models import train_and_evaluate
            metrics = train_and_evaluate()
            return metrics
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to generate ML metrics: {str(e)}")

    with open(METRICS_PATH, "r") as f:
        metrics = json.load(f)
    return metrics
