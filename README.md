<div align="center">
  <img src="https://img.icons8.com/color/96/000000/sprout.png" alt="AgroSync Logo">
  <h1>🌱 AgroSync</h1>
  <p><strong>The Next-Generation Smart Farming & Agricultural Decision Engine</strong></p>
  <p>
    <img alt="Version" src="https://img.shields.io/badge/version-v2.0-blue.svg" />
    <img alt="React" src="https://img.shields.io/badge/React-18-blue">
    <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-0.100+-green">
    <img alt="ML" src="https://img.shields.io/badge/Machine%20Learning-Powered-orange">
  </p>
</div>

***

## 🚀 Welcome to AgroSync
AgroSync is a comprehensive, full-stack agricultural platform designed to empower farmers with data-driven insights, machine learning automation, and seamless multilingual accessibility. By analyzing real-time data and leveraging advanced predictive modeling, AgroSync bridges the raw physical world of farming with cutting-edge software engineering.

## ✨ Core Platforms & Features

### 🧠 1. Machine Learning Prediction Engine
At the heart of AgroSync lies a suite of trained and integrated Machine Learning models.
*   **Crop Recommendation System (Random Forest):** Analyzes N, P, K soil ratios, pH levels, and regional rainfall variables to classify and output the scientifically optimal crop for maximum yield.
*   **Market Price Forecasting (XGBoost):** Synthesizes historical crop pricing against current market conditions to output a strict `WAIT` or `SELL` financial directive.
*   **Income Simulation (Gradient Boosting):** Projects realistic seasonal profit margins based on chosen crop, regional expenses, and current land size.

### 📸 2. Computer Vision Disease Detection
Upload images of struggling or diseased crops directly from the field. Our integrated vision models analyze the plant's visual symptoms, immediately identify the pathogenic disease, and prescribe exact chemical/organic remedies.

### 🗣️ 3. Interactive Voice Assistant
Farming doesn't happen behind a keyboard. Our integrated Voice Assistant provides a hands-free, interactive conversational AI. Farmers can ask questions natively, get fertilization timelines, and receive spoken advice on demand.

### 🚜 4. Smart Toolkit
*   **Equipment Rentals:** A peer-to-peer marketplace tracking local available tractors, harvesters, and plows.
*   **Cold Storage Finder:** Locates local warehousing to prevent post-harvest crop rot.
*   **Expense Tracking:** An algorithmic ledger that tracks inputs, outputs, and warns of declining profit margins.
*   **Government Schemes:** Matches user demographic profiles against hundreds of state and federal subsidy programs.

## 🌍 Multilingual By Default
Farming is local. AgroSync features a deeply integrated **Native Translation Pipeline**. 
With the toggle of a switch, the entire platform—from the UI headers down to the dynamic ML model outputs and disease recipes—instantaneously translates. 
*   **🇬🇧 English**
*   **🇮🇳 Hindi (हिन्दी)**
*   **🌾 Punjabi (ਪੰਜਾਬੀ)**

***

## 🛠️ Architecture & Tech Stack

AgroSync operates on a strict separation of concerns, featuring a highly-responsive client and a heavy-lifting predictive backend.

**Frontend 💻**
*   **React 18** & **Vite:** Blazing fast dynamic rendering.
*   **Tailwind CSS:** Fully responsive, animated, and modern styling.
*   **Lucide React:** Beautiful, consistent iconography.

**Backend & ML ⚙️**
*   **Python FastAPI:** High-performance, async-first API routing.
*   **PostgreSQL:** Relational user data, farm logging, and JWT authentication management.
*   **Scikit-Learn & Pandas:** Underlying data-structures for the prediction engine.
*   **Sarvam AI:** NLP pipeline interceptors for real-time `JSON` translations.

***

## ⚙️ Local Development & Deployment

### 1. Clone the Repository
```bash
git clone https://github.com/Satyamsharma990/AgroSync.git
cd AgroSync
```

### 2. Backend Initialization
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### 3. Frontend Initialization 
```bash
cd frontend
npm install
npm run dev
```

### 4. Experience AgroSync
Navigate to `http://localhost:5173` in your browser.

***
<div align="center">
  <i>Built to empower the modern farmer.</i>
</div>
