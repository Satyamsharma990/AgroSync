from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import auth_router, features_router, ai_router, government_router, dashboard_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AgroSync API", version="1.0.0")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(features_router.router)
app.include_router(ai_router.router)
app.include_router(government_router.router)
app.include_router(dashboard_router.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to AgroSync API"}
