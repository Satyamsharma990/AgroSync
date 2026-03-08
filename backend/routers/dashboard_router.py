from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from sqlalchemy import desc
import models, auth
from database import get_db
from services.translation_service import translate_json

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)

@router.get("/")
def get_dashboard_data(x_language: str = Header(default="en-IN"), db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Fetch recent predictions and data for the dashboard
    recent_crop_rec = db.query(models.CropPrediction).filter(models.CropPrediction.user_id == current_user.id).order_by(desc(models.CropPrediction.timestamp)).first()
    recent_income_sim = db.query(models.IncomeSimulation).filter(models.IncomeSimulation.user_id == current_user.id).order_by(desc(models.IncomeSimulation.timestamp)).first()
    recent_disease = db.query(models.DiseaseDetection).filter(models.DiseaseDetection.user_id == current_user.id).order_by(desc(models.DiseaseDetection.timestamp)).first()
    recent_expenses = db.query(models.Expense).filter(models.Expense.user_id == current_user.id).order_by(desc(models.Expense.date)).limit(5).all()

    dashboard_data = {
        "user_name": current_user.name,
        "recent_crop_recommendation": recent_crop_rec.predicted_crop if recent_crop_rec else None,
        "recent_income_simulation_profit": recent_income_sim.profit if recent_income_sim else None,
        "recent_disease_detected": recent_disease.disease_name if recent_disease else None,
        "recent_expenses": [{"category": exp.category, "amount": exp.amount, "date": exp.date} for exp in recent_expenses]
    }
    return translate_json(dashboard_data, x_language)
