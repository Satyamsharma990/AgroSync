import pickle
import os
import numpy as np

# Dummy models to satisfy the backend loading process.
class DummyCropModel:
    def predict(self, X):
        return ["Wheat"]  # Always returns Wheat for the dummy implementation

class DummyMarketModel:
    def predict(self, X):
        return [1200.50]  # Dummy price

class DummyIncomeModel:
    def predict(self, X):
        return [50000.0]  # Dummy profit

def main():
    models_dir = os.path.dirname(os.path.abspath(__file__))
    models_path = os.path.join(models_dir, 'models')
    os.makedirs(models_path, exist_ok=True)
    
    with open(os.path.join(models_path, 'crop_rf_model.pkl'), 'wb') as f:
        pickle.dump(DummyCropModel(), f)
    
    with open(os.path.join(models_path, 'market_xgb_model.pkl'), 'wb') as f:
        pickle.dump(DummyMarketModel(), f)
        
    with open(os.path.join(models_path, 'income_gb_model.pkl'), 'wb') as f:
        pickle.dump(DummyIncomeModel(), f)
        
    print(f"Successfully generated dummy ML models in {models_path}")

if __name__ == "__main__":
    main()
