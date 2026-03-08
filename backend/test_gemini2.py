import os
import sys

# Add backend to path so we can import ml_services
sys.path.append('.')
from services import ml_services

try:
    print("Testing Gemini integration...")
    result = ml_services.predict_crop("Black Soil", "Summer", "Irrigated", "None")
    print("Result:", result)
except Exception as e:
    import traceback
    with open('error_out.txt', 'w', encoding='utf-8') as f:
        f.write(str(e) + "\n\n")
        f.write(traceback.format_exc())
