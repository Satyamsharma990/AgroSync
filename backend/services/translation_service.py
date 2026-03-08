import os
import requests
from dotenv import load_dotenv

load_dotenv()

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")

def translate_text(text: str, target_lang: str):
    # Supported: hi-IN, pa-IN, en-IN
    if target_lang == "en-IN" or not target_lang:
        return text
        
    if not SARVAM_API_KEY or SARVAM_API_KEY == "dummy_sarvam_key":
        print("SARVAM_API_KEY missing. Returning untranslated text.")
        return text
        
    url = "https://api.sarvam.ai/translate"
    payload = {
        "input": text,
        "source_language_code": "en-IN",
        "target_language_code": target_lang,
        "speaker_gender": "Male",
        "mode": "formal",
        "model": "sarvam-translate:v1"
    }
    headers = {
        "api-subscription-key": SARVAM_API_KEY,
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code == 200:
            data = response.json()
            return data.get("translated_text", text)
        else:
            print(f"Sarvam API Error: {response.status_code} - {response.text}")
            return text
    except Exception as e:
        print(f"Translation Error: {e}")
        return text

def translate_json(data, target_lang: str):
    if target_lang == "en-IN" or not target_lang:
        return data
        
    if isinstance(data, str):
        return translate_text(data, target_lang)
    elif isinstance(data, list):
        return [translate_json(item, target_lang) for item in data]
    elif isinstance(data, dict):
        return {k: translate_json(v, target_lang) for k, v in data.items()}
    else:
        return data
