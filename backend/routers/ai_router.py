import os
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Header
from pydantic import BaseModel
from sqlalchemy.orm import Session
import google.generativeai as genai

import models, schemas, auth
from database import get_db
from services import ml_services
from services.translation_service import translate_json

router = APIRouter(
    prefix="/ai",
    tags=["AI & Machine Learning"],
)



class CropRecRequest(BaseModel):
    soilType: str
    season: str
    waterAvailability: str
    additionalNotes: str = ""

@router.post("/crop-recommendation")
def crop_recommendation(data: CropRecRequest, x_language: str = Header(default="en-IN"), db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    prediction_data = ml_services.predict_crop(
        data.soilType, data.season, data.waterAvailability, data.additionalNotes
    )
    
    predicted_crop = prediction_data.get("recommended_crop", "Unknown")
    
    # We will log the textual inputs in place of the old chemical data since the schema expects floats
    pred_record = models.CropPrediction(
        user_id=current_user.id,
        nitrogen=0, phosphorus=0, potassium=0,
        temperature=0, humidity=0, rainfall=0, ph=0,
        predicted_crop=predicted_crop
    )
    db.add(pred_record)
    db.commit()
    return translate_json(prediction_data, x_language)

@router.get("/market-forecast")
def market_forecast(historical_avg_price: float = 1000.0, x_language: str = Header(default="en-IN"), current_user: models.User = Depends(auth.get_current_user)):
    prediction_data = ml_services.predict_market_price(historical_avg_price)
    
    # Extract numeric price for the frontend UI components
    future_price = prediction_data.get("numeric_price", historical_avg_price * 1.05)
    
    return translate_json({
        "forecasted_price": future_price,
        "trend": "up" if future_price > historical_avg_price else "down",
        "market_insights": prediction_data
    }, x_language)

class IncomeSimRequest(BaseModel):
    farm_size: float
    crop: str
    expected_yield: float
    predicted_price: float

@router.post("/income-simulation")
def income_simulation(data: IncomeSimRequest, x_language: str = Header(default="en-IN"), db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    prediction_data = ml_services.simulate_income(data.farm_size, data.crop, data.expected_yield, data.predicted_price)
    
    revenue = prediction_data.get("revenue", data.farm_size * data.expected_yield * data.predicted_price)
    profit = prediction_data.get("net_profit", 0.0)
    cost = prediction_data.get("estimated_costs", revenue - profit)
    
    sim_record = models.IncomeSimulation(
        user_id=current_user.id,
        farm_size=data.farm_size, crop=data.crop,
        expected_yield=data.expected_yield, predicted_price=data.predicted_price,
        revenue=revenue, cost=cost, profit=profit
    )
    db.add(sim_record)
    db.commit()
    return translate_json({"revenue": revenue, "cost": cost, "profit": profit}, x_language)

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def ai_chat(req: ChatRequest, x_language: str = Header(default="en-IN"), db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = f"You are an agricultural advisor AI. Answer this farmer's question simply and clearly in short bulleted actionable points: {req.message}"
        response = model.generate_content(prompt)
        ai_response = response.text
    except Exception as e:
        ai_response = f"Sorry, I am currently unable to process your request: {e}"

    chat_record = models.AIChatHistory(user_id=current_user.id, message=req.message, response=ai_response)
    db.add(chat_record)
    db.commit()
    return translate_json({"response": ai_response}, x_language)

@router.post("/disease-detection")
async def disease_detection(file: UploadFile = File(...), x_language: str = Header(default="en-IN"), db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        buffer.write(await file.read())
    
    analysis = ml_services.analyze_disease(temp_file_path)
    
    if os.path.exists(temp_file_path):
        os.remove(temp_file_path)
        
    record = models.DiseaseDetection(
        user_id=current_user.id, 
        image_url=file.filename,
        disease_name=analysis["disease_name"], 
        confidence=analysis["confidence"],
        treatment=analysis["treatment"], 
        prevention_steps=analysis["prevention_steps"]
    )
    db.add(record)
    db.commit()
    return translate_json(analysis, x_language)

@router.get("/weather-intelligence")
def weather_intelligence(x_language: str = Header(default="en-IN"), current_user: models.User = Depends(auth.get_current_user)):
    profile = current_user.profile
    location = profile.location if profile else "India"
    prompt = f"""
    Generate a 7-day weather intelligence report for a farmer in {location}.
    Return ONLY a JSON object exactly like this:
    {{
      "primary_alert": {{"title": "Frost Warning", "description": "Cover crops"}},
      "irrigation_recommendation": {{"title": "Irrigation Recommendation", "description": "Water heavily tonight"}},
      "forecast": [
        {{"day": "Mon", "temp": 32, "condition": "Sunny", "wind": "Normal"}},
        {{"day": "Tue", "temp": 30, "condition": "Rain", "wind": "High Wind"}}
      ] (needs 7 days total)
    }}
    """
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        text = response.text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].strip()
        import json
        data = json.loads(text)
        return translate_json(data, x_language)
    except Exception as e:
        return {{"error": str(e)}}

@router.get("/dashboard-market-pulse")
def dashboard_market_pulse(x_language: str = Header(default="en-IN"), current_user: models.User = Depends(auth.get_current_user)):
    profile = current_user.profile
    crop = profile.primary_crop if profile else "Wheat"
    prompt = f"""
    Generate a quick JSON array of exactly 2 crops (including {crop}) with their current realistic market pulse in India.
    Return ONLY a JSON array, exactly like:
    [
      {{"crop": "Onion", "trend": "down", "advice": "Wait to Sell"}},
      {{"crop": "Soybean", "trend": "up", "advice": "Sell Now"}}
    ]
    """
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        text = response.text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].strip()
        import json
        data = json.loads(text)
        return translate_json(data, x_language)
    except Exception as e:
        return []
