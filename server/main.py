from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

from database import engine, SessionLocal, get_db, Base
from models import Project
import schemas
import crud

load_dotenv()


class AskRequest(BaseModel):
    text: str


# Seed data — mirrors the frontend's original mock projects
SEED_PROJECTS = [
    {"name": "Customer Churn Analysis", "description": "Predict customer churn using transaction history", "status": "Active"},
    {"name": "Sales Forecasting", "description": "Quarterly revenue predictions based on pipeline data", "status": "Active"},
    {"name": "Sentiment Analysis", "description": "NLP model for product review classification", "status": "Completed"},
    {"name": "Fraud Detection", "description": "Real-time anomaly detection on payment transactions", "status": "Active"},
    {"name": "Inventory Optimization", "description": "Demand forecasting for warehouse stock levels", "status": "Paused"},
    {"name": "User Segmentation", "description": "Cluster users by behavior for targeted campaigns", "status": "Completed"},
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create tables and seed initial project data if empty."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Project).count() == 0:
            for p in SEED_PROJECTS:
                db.add(Project(**p))
            db.commit()
    finally:
        db.close()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/ask")
def ask(request: AskRequest):
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite")
    response = llm.invoke(request.text)
    return {"message": "Message received", "text": response.content}


@app.get("/projects", response_model=list[schemas.ProjectRead])
def list_projects(db: Session = Depends(get_db)):
    """Return all projects from the database."""
    return crud.get_projects(db)
