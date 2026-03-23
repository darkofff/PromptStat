# database.py - techniczne połącznia z bazą. Nie przetwarza danych

import os
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker, declarative_base

# Database file location: <project_root>/data/app.db
_server_dir = os.path.dirname(os.path.abspath(__file__))
_project_root = os.path.dirname(_server_dir)
_data_dir = os.path.join(_project_root, "data")
os.makedirs(_data_dir, exist_ok=True)

DATABASE_URL = f"sqlite:///{os.path.join(_data_dir, 'app.db')}"

# Synchronous engine; check_same_thread=False required for SQLite with FastAPI
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

# Session factory — one session per request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base for ORM models
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that provides a DB session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
