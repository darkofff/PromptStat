from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

class AskRequest(BaseModel):
    text: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}

@app.get("/ping")
def ping():
    return {"Hello": "World"}


@app.post("/ask")
def ask(request: AskRequest):
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite")
    response = llm.invoke(request.text)
    return {"message": "Message received", "text": response.content}