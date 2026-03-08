import sys
sys.path.append('.\backend')
from backend.services.translation_service import translate_json
print(translate_json({'crop': 'Groundnut', 'name': 'Rahul'}, 'hi-IN'))
