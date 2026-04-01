# models.py - struktura bazy danych. Po prostu tworzy się tabele

# alchemy
from sqlalchemy import ForeignKey, String, Integer, DateTime, Text, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

# types
from datetime import datetime, timezone
from typing import List, Optional

from database import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc),
        server_default=func.now() # Wysyła polecenie CURRENT_TIMESTAMP do bazy
        )

    # Relacje
    chats: Mapped[List["Chat"]] = relationship(back_populates="project", cascade="all, delete-orphan")
    datasets: Mapped[List["Dataset"]] = relationship(back_populates="project", cascade="all, delete-orphan")

class Chat(Base):
    __tablename__ = "chats"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    title: Mapped[str] = mapped_column(String(255))

    # Relacje
    project: Mapped["Project"] = relationship(back_populates="chats")
    exchanges: Mapped[List["Exchange"]] = relationship(back_populates="chat", cascade="all, delete-orphan")

class Dataset(Base):
    __tablename__ = "datasets"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[Optional[str]] = mapped_column(Text) # Of what dataset represents
    data: Mapped[Optional[str]] = mapped_column(Text) # CSV sparsowany do JSON

    # Relacje
    project: Mapped["Project"] = relationship(back_populates="datasets")

class Exchange(Base):
    __tablename__ = "exchange"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True) # Dodałem PK, bo każda tabela go potrzebuje
    chat_id: Mapped[int] = mapped_column(ForeignKey("chats.id"))
    order: Mapped[int] = mapped_column(Integer, autoincrement=True) # autoincrement nie dział
    prompt: Mapped[str] = mapped_column(Text)
    response: Mapped[str] = mapped_column(Text)

    # Relacje
    chat: Mapped["Chat"] = relationship(back_populates="exchanges")
