# fastapi
from fastapi import FastAPI, Depends, HTTPException, UploadFile
import csv
import io
import json
from fastapi.middleware.cors import CORSMiddleware
# db sertup
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from database import engine, SessionLocal, get_db, Base
import schemas
import crud
#AI
from langchain_google_genai import ChatGoogleGenerativeAI
# do usunięcia/zmiany/przeniesienia - prawdopodobnie
from contextlib import asynccontextmanager
from models import Project
from pydantic import BaseModel

load_dotenv()

# Seed data — mirrors the frontend's original mock projects
SEED_PROJECTS = [
    {"title": "Customer Churn Analysis", "description": "Predict customer churn using transaction history"},
    {"title": "Sales Forecasting", "description": "Quarterly revenue predictions based on pipeline data"},
    {"title": "Sentiment Analysis", "description": "NLP model for product review classification"},
    {"title": "Fraud Detection", "description": "Real-time anomaly detection on payment transactions"},
    {"title": "Inventory Optimization", "description": "Demand forecasting for warehouse stock levels"},
    {"title": "User Segmentation", "description": "Cluster users by behavior for targeted campaigns"},
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

class AskRequest(BaseModel):
    text: str

""" LLM """
@app.post("/ask")
def ask(request: AskRequest):
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite")
    response = llm.invoke(request.text)
    return {"message": "Message received", "text": response.content}

""" PROJECTS """
@app.get("/projects", response_model=list[schemas.ProjectRead])
def list_projects(db: Session = Depends(get_db)):
    """Return all projects from the database."""
    return crud.get_projects(db)
    
@app.get("/projects/{project_id}", response_model=schemas.ProjectRead)
def get_project(project_id: int, db: Session = Depends(get_db)):
    """Return a single project by id."""
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.post("/projects", response_model=schemas.ProjectRead)
def add_project(project: schemas.ProjectBase, db: Session = Depends(get_db)):
    """Create a new project."""
    return crud.add_project(db, project.title, project.description)

@app.patch("/projects/{project_id}", response_model=schemas.ProjectRead)
def update_project(project_id: int, data: schemas.ProjectUpdate, db: Session = Depends(get_db)):
    """Update a project's title and/or description."""
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return crud.update_project(db, project, data.title, data.description)

@app.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    """Delete a project by id."""
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    crud.delete_project(db, project)
    return {"detail": "Project deleted"}


""" Dataset """
@app.post("/projects/{project_id}/datasets", response_model=schemas.DatasetRead)
async def add_dataset(project_id: int, file: UploadFile, db: Session = Depends(get_db)):
    """Upload a CSV file and store it as a dataset."""
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if not file.filename:
        raise HTTPException(status_code=400, detail="File has no filename")
    content = (await file.read()).decode()
    reader = csv.DictReader(io.StringIO(content))
    rows = list(reader)
    data_json = json.dumps(rows)
    return crud.add_dataset(db, project_id, file.filename, data_json)

@app.get("/projects/{project_id}/datasets", response_model=list[schemas.DatasetRead])
def get_datasets(project_id: int, db: Session = Depends(get_db)):
    """ Return all datasets for a given project 
        Póki co pobierze wszystkie datasety, nie ważne ile by ich nie było
        Trzeba przemyśleć 
    """
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return crud.get_datasets(db, project_id)