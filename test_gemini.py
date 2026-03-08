import os
import sys

# Add backend to path so we can import ml_services
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
os.chdir('backend')

from services import ml_services

try:
    print("Testing Gemini integration...")
    result = ml_services.predict_crop("Black Soil", "Summer", "Irrigated", "None")
    print("Result:", result)
except Exception as e:
    print("Fatal exception:", e)
