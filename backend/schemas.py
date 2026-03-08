from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class FarmerProfileBase(BaseModel):
    phone: Optional[str] = None
    location: Optional[str] = None
    farm_size: Optional[float] = None
    primary_crop: Optional[str] = None
    soil_type: Optional[str] = None

class FarmerProfileCreate(FarmerProfileBase):
    pass

class FarmerProfileResponse(FarmerProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    profile: Optional[FarmerProfileCreate] = None

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    profile: Optional[FarmerProfileResponse] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Base Schemas for Features
class EquipmentListingBase(BaseModel):
    name: str
    type: str
    daily_rate: float
    location: str
    image_url: Optional[str] = None

class EquipmentListingCreate(EquipmentListingBase):
    pass

class EquipmentListingResponse(EquipmentListingBase):
    id: int
    owner_id: int
    is_available: bool

    class Config:
        from_attributes = True

class FarmRecordBase(BaseModel):
    crop_name: str
    sowing_date: datetime
    harvest_date: Optional[datetime] = None
    area: float
    yield_amount: Optional[float] = None

class FarmRecordCreate(FarmRecordBase):
    pass

class FarmRecordResponse(FarmRecordBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class ExpenseBase(BaseModel):
    category: str
    amount: float
    description: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseResponse(ExpenseBase):
    id: int
    user_id: int
    date: datetime

    class Config:
        from_attributes = True

class MarketplaceListingBase(BaseModel):
    crop_name: str
    quantity: float
    price_per_unit: float
    location: str

class MarketplaceListingCreate(MarketplaceListingBase):
    pass

class MarketplaceListingResponse(MarketplaceListingBase):
    id: int
    seller_id: int

    class Config:
        from_attributes = True

class StorageLocationBase(BaseModel):
    name: str
    capacity: float
    type: str
    location: str
    rate_per_ton: float

class StorageLocationCreate(StorageLocationBase):
    pass

class StorageLocationResponse(StorageLocationBase):
    id: int
    owner_id: Optional[int] = None

    class Config:
        from_attributes = True

class TransportServiceBase(BaseModel):
    vehicle_type: str
    capacity: float
    location: str
    rate_per_km: float

class TransportServiceCreate(TransportServiceBase):
    pass

class TransportServiceResponse(TransportServiceBase):
    id: int
    driver_id: Optional[int] = None

    class Config:
        from_attributes = True
