from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth
from database import get_db

router = APIRouter(
    prefix="/features",
    tags=["Features"],
)

# --- Equipment Listings ---
@router.post("/equipment", response_model=schemas.EquipmentListingResponse)
def create_equipment(item: schemas.EquipmentListingCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_item = models.EquipmentListing(**item.dict(), owner_id=current_user.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/equipment", response_model=List[schemas.EquipmentListingResponse])
def get_equipment(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.EquipmentListing).all()

# --- Farm Records ---
@router.post("/farm-records", response_model=schemas.FarmRecordResponse)
def create_farm_record(item: schemas.FarmRecordCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_item = models.FarmRecord(**item.dict(), user_id=current_user.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/farm-records", response_model=List[schemas.FarmRecordResponse])
def get_farm_records(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.FarmRecord).filter(models.FarmRecord.user_id == current_user.id).all()

# --- Expenses ---
@router.post("/expenses", response_model=schemas.ExpenseResponse)
def create_expense(item: schemas.ExpenseCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_item = models.Expense(**item.dict(), user_id=current_user.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/expenses", response_model=List[schemas.ExpenseResponse])
def get_expenses(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Expense).filter(models.Expense.user_id == current_user.id).all()

# --- Marketplace ---
@router.post("/marketplace", response_model=schemas.MarketplaceListingResponse)
def create_marketplace_listing(item: schemas.MarketplaceListingCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_item = models.MarketplaceListing(**item.dict(), seller_id=current_user.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/marketplace", response_model=List[schemas.MarketplaceListingResponse])
def get_marketplace_listings(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.MarketplaceListing).all()

# --- Storage Locations ---
@router.post("/storage", response_model=schemas.StorageLocationResponse)
def create_storage_location(item: schemas.StorageLocationCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_item = models.StorageLocation(**item.dict(), owner_id=current_user.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/storage", response_model=List[schemas.StorageLocationResponse])
def get_storage_locations(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.StorageLocation).all()

# --- Transport Services ---
@router.post("/transport", response_model=schemas.TransportServiceResponse)
def create_transport_service(item: schemas.TransportServiceCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_item = models.TransportService(**item.dict(), driver_id=current_user.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/transport", response_model=List[schemas.TransportServiceResponse])
def get_transport_services(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.TransportService).all()
