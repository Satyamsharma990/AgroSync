import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBRegressor
from sklearn.ensemble import GradientBoostingRegressor
import joblib
import os

os.makedirs("models", exist_ok=True)

print("Training Random Forest for Crop Recommendation...")
# Dummy data for Crop Recommendation
# inputs: nitrogen, phosphorus, potassium, temperature, humidity, rainfall, ph
X_crop = pd.DataFrame(np.random.randint(0, 100, size=(100, 7)), columns=['N', 'P', 'K', 'temperature', 'humidity', 'rainfall', 'ph'])
y_crop = np.random.choice(['Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane'], size=100)

rf_model = RandomForestClassifier()
rf_model.fit(X_crop, y_crop)
joblib.dump(rf_model, 'models/crop_rf_model.pkl')
print("Saved models/crop_rf_model.pkl")

print("Training XGBoost for Market Price Forecast...")
# Dummy data for Market Price Forecast (simplification: time series or regression)
# For simplicity in this demo, predicting upcoming price based on just one feature (e.g. historical average)
X_market = pd.DataFrame(np.random.rand(100, 1) * 1000, columns=['historical_avg'])
y_market = X_market['historical_avg'] * 1.1 + np.random.randn(100) * 50

xgb_model = XGBRegressor()
xgb_model.fit(X_market, y_market)
joblib.dump(xgb_model, 'models/market_xgb_model.pkl')
print("Saved models/market_xgb_model.pkl")

print("Training Gradient Boosting for Income Simulation...")
# Dummy data for Income Simulation
# inputs: farm size (acres), expected yield (tons/acre), predicted price (per ton)
X_income = pd.DataFrame(np.random.rand(100, 3) * [50, 5, 2000], columns=['farm_size', 'expected_yield', 'predicted_price'])
# Revenue = size * yield * price. Cost = size * fixed_cost. Profit = Revenue - Cost
y_revenue = X_income['farm_size'] * X_income['expected_yield'] * X_income['predicted_price']
y_cost = X_income['farm_size'] * 15000 + np.random.randn(100)*1000
y_profit = y_revenue - y_cost

# We actually will just do math for this because models are overkill, but the prompt says 
# "Algorithm: Gradient Boosting" for income simulation, so let's humor it.
gb_model = GradientBoostingRegressor()
gb_model.fit(X_income, y_profit)
joblib.dump(gb_model, 'models/income_gb_model.pkl')
print("Saved models/income_gb_model.pkl")
print("Done.")
