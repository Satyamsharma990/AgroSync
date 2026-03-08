import os
from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
import google.generativeai as genai

import models, auth
from database import get_db
from services.translation_service import translate_json
from database import get_db

router = APIRouter(
    prefix="/schemes",
    tags=["Government Schemes"],
)

@router.get("/recommendations")
def get_scheme_recommendations(x_language: str = Header(default="en-IN"), db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    profile = current_user.profile
    if not profile:
        return {"schemes": [], "message": "Please complete your profile to get recommendations."}
        
    prompt = f"""
    The farmer is from {profile.location}, grows {profile.primary_crop}, and has a farm size of {profile.farm_size} acres.
    Recommend 3 relevant Indian government agricultural schemes for them.
    Format your response as a JSON array of objects, where each object has 'name', 'description', and 'eligibility' fields.
    Respond ONLY with the JSON array.
    """
    
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        return translate_json({"recommendations_from_gemini": response.text}, x_language)
    except Exception as e:
        return {
            "schemes": [],
            "message": f"Gemini AI Error: {e}"
        }
