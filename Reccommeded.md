You are a senior full-stack AI engineer responsible for converting an existing React agriculture platform into a fully functional AI product.

The project already contains a React + Vite frontend with many pages and features but currently uses mock data.

Your job is to analyze the entire project folder and transform it into a fully working application by adding backend APIs, database models, AI integrations, and user-generated features.

IMPORTANT RULES

1. First scan the entire project structure automatically.
2. Identify every feature already implemented in the frontend.
3. Replace all mock data with real API calls.
4. Implement the backend logic required for every feature.
5. If a feature requires user-generated data, build the database and API endpoints to support it.
6. Ensure the system works as a real product used by farmers.
7. The system must support dynamic data, history tracking, and AI-generated insights.

Do NOT redesign the UI. Only connect it to working systems.

--------------------------------

SYSTEM ARCHITECTURE

Frontend
React
Vite
TailwindCSS
Framer Motion
Chart.js

Backend
FastAPI (Python)

Database
PostgreSQL

AI
Google Gemini API

Machine Learning
Scikit-learn
XGBoost
Pandas
NumPy

--------------------------------

STEP 1 — ANALYZE THE PROJECT

Automatically scan all folders and files.

Identify:

pages
components
features
mock data files
API calls
forms
dashboards
upload features

Then list all detected modules.

Example modules that may exist:

Dashboard
Crop Recommendation
Market Insights
Disease Detection
Smart Irrigation
Expense Tracker
Farm Records
Equipment Rentals
Storage Finder
Transport Booking
Learning Center
Government Schemes
Voice Assistant
Marketplace
Profile

If additional modules exist, include them automatically.

--------------------------------

STEP 2 — REPLACE MOCK DATA

Search the entire project for:

mock data
static JSON
dummy arrays
hardcoded values

Replace these with real API calls.

Example:

Replace

const data = [mockData]

with

fetch("/api/...")

--------------------------------

STEP 3 — AUTHENTICATION SYSTEM

Implement a full authentication system.

Users must be able to:

sign up
log in
log out
store profile data

Use:

JWT authentication
bcrypt password hashing

Signup must collect:

name
email
phone
location
farm size
crop type

Database table:

users
farmer_profiles

--------------------------------

STEP 4 — USER GENERATED FEATURES

Many modules must allow users to add data.

Implement creation features for the following:

Equipment Rentals
Farmers can list tractors, harvesters, sprayers.

Storage Finder
Users can list warehouses or cold storage.

Transport Booking
Drivers can list transport services.

Marketplace
Farmers can list crops for sale.

Learning Center
Admins or verified users can upload guides.

Farm Records
Farmers can record crop history.

Expense Tracker
Farmers can add farming expenses.

For each feature create:

CREATE endpoint
READ endpoint
UPDATE endpoint
DELETE endpoint

Example:

POST /api/equipment
GET /api/equipment
PUT /api/equipment/{id}
DELETE /api/equipment/{id}

--------------------------------

STEP 5 — CROP RECOMMENDATION AI

Build a machine learning model.

Algorithm
Random Forest

Inputs

nitrogen
phosphorus
potassium
temperature
humidity
rainfall
pH

Output

Top 3 recommended crops.

API

POST /api/crop-recommendation

--------------------------------

STEP 6 — MARKET PRICE FORECAST

Build price prediction system.

Algorithm
XGBoost regression

Inputs

historical mandi price data

Output

future crop prices

API

GET /api/market-forecast

--------------------------------

STEP 7 — INCOME SIMULATION

Predict farm profit.

Algorithm
Gradient Boosting

Inputs

farm size
crop
expected yield
predicted price

Output

revenue
cost
profit

API

POST /api/income-simulation

--------------------------------

STEP 8 — DISEASE DETECTION

Allow farmers to upload plant images.

The backend sends the image to Gemini Vision API.

Gemini analyzes the image and returns:

disease name
confidence
treatment
prevention steps

API

POST /api/disease-detection

Store results in database.

--------------------------------

STEP 9 — AI FARMING ASSISTANT

Create a chatbot using Gemini.

Farmers can ask questions such as:

Which crop should I grow next season?
How can I treat wheat rust disease?
Which mandi gives the best price?

API

POST /api/chat

Store conversation history.

--------------------------------

STEP 10 — GOVERNMENT SCHEME RECOMMENDER

Use farmer profile data to recommend government schemes.

Use Gemini to generate explanations.

API

GET /api/schemes/recommendations

--------------------------------

STEP 11 — DASHBOARD DATA

The dashboard must display real user data.

Return:

recent crop recommendations
market predictions
income simulations
disease detection results

API

GET /api/dashboard

--------------------------------

STEP 12 — DATABASE STRUCTURE

Create PostgreSQL tables for:

users
farmer_profiles
crop_predictions
market_predictions
income_simulations
disease_detections
expenses
farm_records
equipment_listings
storage_locations
transport_services
marketplace_listings
learning_content
ai_chat_history

--------------------------------

STEP 13 — IMAGE STORAGE

Store uploaded images.

Use:

Cloudinary
or local storage for now.

Save image URLs in database.

--------------------------------

STEP 14 — SELF-REVISING MODE

After implementing features:

1. Re-scan the project again.
2. Identify missing APIs.
3. Detect UI elements not connected to backend.
4. Automatically create required endpoints.
5. Refactor code for consistency.
6. Ensure every frontend component receives real data.

If inconsistencies appear, correct them.

Repeat until all components work correctly.

--------------------------------

STEP 15 — FINAL OUTPUT

Provide:

Backend folder structure
All API endpoints
Database schema
Gemini integration code
Machine learning model scripts
Instructions for running the system locally

Ensure the application behaves like a real agriculture platform used by farmers.