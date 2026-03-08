import os
import google.generativeai as genai
import json

from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY", "dummy_key_if_not_set"))

def _get_model(model_name: str = 'gemini-2.5-flash'):
    return genai.GenerativeModel(model_name, generation_config={"response_mime_type": "application/json"})

MASTER_PROMPT = """
You are an AI agricultural decision engine used inside a smart farming platform.
Your task is to analyze user-provided agricultural data and return realistic, structured, and actionable insights for farmers.

IMPORTANT RULES:
1. Always return responses in structured JSON format.
2. Use realistic agricultural knowledge based on soil, weather, crop science, and farming practices.
3. If some data is missing, infer reasonable assumptions.
4. Provide practical advice suitable for real farmers.
5. Keep explanations simple but informative.
6. Do not mention AI, prompts, or internal processing.

SYSTEM FEATURES YOU SUPPORT:

MODULE 1: Crop Recommendation
Input may include: soil type, temperature, rainfall, humidity, location, season
Return:
{
 "recommended_crop": "",
 "confidence_score": "",
 "reasoning": "",
 "expected_yield": "",
 "planting_advice": ""
}

MODULE 2: Soil Health Analysis
Input may include: nitrogen, phosphorus, potassium, pH, soil type
Return:
{
 "soil_health": "Good / Moderate / Poor",
 "nutrient_status": {
   "nitrogen": "",
   "phosphorus": "",
   "potassium": ""
 },
 "recommended_fertilizers": [],
 "soil_improvement_advice": ""
}

MODULE 3: Disease Detection (text-based description)
Input may include: crop name, visible symptoms, leaf color, spots, weather
Return:
{
 "possible_disease": "",
 "confidence": "",
 "cause": "",
 "treatment": "",
 "prevention": ""
}

MODULE 4: Fertilizer Recommendation
Input may include: crop, soil nutrients, growth stage
Return:
{
 "recommended_fertilizer": "",
 "application_method": "",
 "application_quantity": "",
 "timing": "",
 "additional_notes": ""
}

MODULE 5: Irrigation Advice
Input may include: crop, soil moisture, weather, temperature
Return:
{
 "irrigation_needed": "Yes/No",
 "recommended_method": "",
 "water_quantity": "",
 "frequency": "",
 "notes": ""
}

MODULE 6: Market Price Insights
Input may include: crop name, location, season
Return:
{
 "estimated_market_price": "",
 "market_trend": "Rising/Falling/Stable",
 "best_selling_strategy": "",
 "recommendation": ""
}

If the request includes multiple inputs, intelligently combine all insights.
Always respond with realistic agricultural insights.
Do NOT return explanations outside JSON.
"""

def _parse_json(response_text: str):
    text = response_text.strip()
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0].strip()
    elif "```" in text:
        text = text.split("```")[1].strip()
        
    parsed = json.loads(text)
    
    # If Gemini returns a list of dictionaries (e.g., executing multiple modules at once), flatten it
    if isinstance(parsed, list):
        combined = {}
        for item in parsed:
            if isinstance(item, dict):
                combined.update(item)
        return combined
        
    return parsed

def predict_crop(soil_type, season, water_availability, additional_notes):
    model = _get_model()
    user_input = f"""
    Please execute MODULE 1: Crop Recommendation AND MODULE 2: Soil Health Analysis based on the following manual inputs from the farmer:
    Soil Type: {soil_type}
    Current Season: {season}
    Water Availability: {water_availability}
    Additional Notes: {additional_notes}
    """
    try:
        response = model.generate_content(MASTER_PROMPT + "\n\n" + user_input)
        return _parse_json(response.text)
    except Exception as e:
        print(f"Gemini Crop Prediction Error: {e}")
        return {"recommended_crop": "Unknown (Error)", "reasoning": str(e)}

def predict_market_price(historical_avg, crop_name="Crop"):
    model = _get_model()
    user_input = f"""
    Please execute MODULE 6: Market Price Insights.
    Crop: {crop_name}
    Historical Average: ₹{historical_avg} per unit.
    """
    try:
        response = model.generate_content(MASTER_PROMPT + "\n\n" + user_input)
        parsed = _parse_json(response.text)
        
        # We also need a flat price for the backend DB simulator if required
        price_str = str(parsed.get('estimated_market_price', historical_avg)).replace('₹', '').replace(',', '')
        try:
            price_val = [float(s) for s in price_str.split() if s.replace('.', '', 1).isdigit()][0]
        except Exception:
            price_val = historical_avg * 1.05
            
        parsed["numeric_price"] = price_val
        return parsed
    except Exception as e:
        print(f"Gemini Market Prediction Error: {e}")
        return {"estimated_market_price": f"₹{historical_avg*1.05}", "numeric_price": historical_avg*1.05}

def simulate_income(farm_size, crop, expected_yield, predicted_price):
    # Not explicitly in modules, so we just ask Gemini to return JSON
    model = _get_model()
    user_input = f"""
    Farm Size: {farm_size} acres
    Crop: {crop}
    Expected Yield: {expected_yield} units
    Predicted Market Price: ₹{predicted_price} per unit
    
    Calculate a realistic estimated net profit. Consider typical input costs (seeds, fertilizer, labor, transport).
    Return a strict JSON object:
    {{
      "revenue": 0.0,
      "estimated_costs": 0.0,
      "net_profit": 0.0,
      "cost_breakdown": "short advice"
    }}
    """
    try:
        response = model.generate_content(MASTER_PROMPT + "\n\n" + user_input)
        return _parse_json(response.text)
    except Exception as e:
        print(f"Gemini Income Simulation Error: {e}")
        revenue = (farm_size * expected_yield * predicted_price)
        return {"revenue": revenue, "estimated_costs": revenue * 0.6, "net_profit": revenue * 0.4, "cost_breakdown": "Math fallback"}

def analyze_disease(image_path: str):
    vision_model = genai.GenerativeModel('gemini-2.5-pro', generation_config={"response_mime_type": "application/json"})
    try:
        sample_file = genai.upload_file(path=image_path)
        user_input = "Please execute MODULE 3: Disease Detection for the uploaded image."
        response = vision_model.generate_content([MASTER_PROMPT + "\n\n" + user_input, sample_file])
        genai.delete_file(sample_file.name)
        
        data = _parse_json(response.text)
        return {
            "disease_name": data.get("possible_disease", "Unknown Disease"),
            "confidence": float(data.get("confidence", "0.5").replace('%','')) if isinstance(data.get("confidence"), str) else 0.5,
            "treatment": data.get("treatment", "Consult expert."),
            "prevention_steps": data.get("prevention", "Maintain hygiene.")
        }
    except Exception as e:
        print(f"Gemini Vision Error: {e}")
        return {
            "disease_name": "Unidentifiable by AI",
            "confidence": 0.0,
            "treatment": "Could not analyze image.",
            "prevention_steps": str(e)
        }
