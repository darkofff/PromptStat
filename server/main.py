# fastapi
from fastapi import FastAPI, Depends, HTTPException, UploadFile
import csv
import io
import json
from fastapi.middleware.cors import CORSMiddleware
# db setup
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from database import engine, get_db, Base
import schemas
import crud
#AI
from langchain_google_genai import ChatGoogleGenerativeAI
from contextlib import asynccontextmanager
import time
load_dotenv()

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

# Jedna instancja LLM na poziomie modułu
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create tables on startup."""
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)



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
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted")
    raw = await file.read()
    if len(raw) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large (max 10MB)")
    try:
        content = raw.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="File is not valid UTF-8")
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

@app.delete("/datasets/{dataset_id}")
def delete_dataset(dataset_id: int, db: Session = Depends(get_db)):
    """Delete a dataset by id."""
    dataset = crud.get_dataset(db, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    crud.delete_dataset(db, dataset)
    return {"detail": "Dataset deleted"}


""" CHATS """
@app.post("/projects/{project_id}/chats", response_model=schemas.ChatRead)
def create_chat(project_id: int, chat: schemas.ChatBase, db: Session = Depends(get_db)):
    """Create a new chat for a project."""
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return crud.add_chat(db, project_id, chat.title)

@app.get("/projects/{project_id}/chats", response_model=list[schemas.ChatRead])
def list_chats(project_id: int, db: Session = Depends(get_db)):
    """Return all chats for a given project."""
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return crud.get_chats(db, project_id)

@app.get("/chats/{chat_id}", response_model=schemas.ChatRead)
def get_chat(chat_id: int, db: Session = Depends(get_db)):
    """Return a single chat by id."""
    chat = crud.get_chat(db, chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat


""" EXCHANGES """

@app.get("/chats/{chat_id}/exchanges", response_model=list[schemas.ExchangeRead])
def list_exchanges(chat_id: int, db: Session = Depends(get_db)):

    time.sleep(2)

    """Return all exchanges for a given chat."""
    chat = crud.get_chat(db, chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return crud.get_exchanges(db, chat_id)
    

@app.post("/chats/{chat_id}/exchanges", response_model=schemas.ExchangeRead) 
def create_exchange(chat_id: int, exchange: schemas.ExchangeBase, db: Session = Depends(get_db)):
    """ Add new exchange for a given chat """
    chat = crud.get_chat(db, chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    try:
        response = llm.invoke(exchange.prompt)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"LLM error: {str(e)}")
    order = crud.get_exchanges_count(db, chat_id) + 1
    return crud.add_exchange(db, chat_id, order=order, prompt=exchange.prompt, response=str(response.content) )
     



