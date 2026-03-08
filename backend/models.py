from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("FarmerProfile", back_populates="user", uselist=False)
    # relationships to other tables can go here

class FarmerProfile(Base):
    __tablename__ = "farmer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    phone = Column(String)
    location = Column(String)
    farm_size = Column(Float) # in acres or hectares
    primary_crop = Column(String)
    soil_type = Column(String, nullable=True)

    user = relationship("User", back_populates="profile")

class EquipmentListing(Base):
    __tablename__ = "equipment_listings"
    
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, index=True)
    type = Column(String) # e.g., Tractor, Harvester
    daily_rate = Column(Float)
    location = Column(String)
    is_available = Column(Boolean, default=True)
    image_url = Column(String, nullable=True)

class MarketplaceListing(Base):
    __tablename__ = "marketplace_listings"
    
    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id"))
    crop_name = Column(String, index=True)
    quantity = Column(Float) # in kg or tons
    price_per_unit = Column(Float)
    location = Column(String)

class FarmRecord(Base):
    __tablename__ = "farm_records"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    crop_name = Column(String)
    sowing_date = Column(DateTime)
    harvest_date = Column(DateTime, nullable=True)
    area = Column(Float)
    yield_amount = Column(Float, nullable=True)

class Expense(Base):
    __tablename__ = "expenses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    category = Column(String) # e.g., Seeds, Fertilizer, Labor
    amount = Column(Float)
    date = Column(DateTime, default=datetime.utcnow)
    description = Column(String, nullable=True)

class StorageLocation(Base):
    __tablename__ = "storage_locations"
    
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String)
    capacity = Column(Float) # e.g., in tons
    type = Column(String) # e.g., Cold Storage, Warehouse
    location = Column(String)
    rate_per_ton = Column(Float)

class TransportService(Base):
    __tablename__ = "transport_services"
    
    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    vehicle_type = Column(String)
    capacity = Column(Float) # e.g., tons
    location = Column(String)
    rate_per_km = Column(Float)

class LearningContent(Base):
    __tablename__ = "learning_content"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(String)
    category = Column(String)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
class AIChatHistory(Base):
    __tablename__ = "ai_chat_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(String)
    response = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class CropPrediction(Base):
    __tablename__ = "crop_predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    nitrogen = Column(Float)
    phosphorus = Column(Float)
    potassium = Column(Float)
    temperature = Column(Float)
    humidity = Column(Float)
    rainfall = Column(Float)
    ph = Column(Float)
    predicted_crop = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class MarketPrediction(Base):
    __tablename__ = "market_predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String)
    predicted_price = Column(Float)
    prediction_date = Column(DateTime)
    timestamp = Column(DateTime, default=datetime.utcnow)

class IncomeSimulation(Base):
    __tablename__ = "income_simulations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    farm_size = Column(Float)
    crop = Column(String)
    expected_yield = Column(Float)
    predicted_price = Column(Float)
    revenue = Column(Float)
    cost = Column(Float)
    profit = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

class DiseaseDetection(Base):
    __tablename__ = "disease_detections"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    image_url = Column(String)
    disease_name = Column(String)
    confidence = Column(Float)
    treatment = Column(String)
    prevention_steps = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
