# Funkcje do operacji na bazie danych

from sqlalchemy.orm import Session
from models import Project, Dataset, Chat, Exchange

""" 
    PROJECTS
"""
def get_projects(db: Session) -> list[Project]:
    """Return all projects ordered by id."""
    return db.query(Project).order_by(Project.id).all()

def get_project(db: Session, project_id: int) -> Project | None:
    """Return a single project by id, or None."""
    return db.query(Project).filter(Project.id == project_id).first()

def add_project(db: Session, title: str, description: str) -> Project:
    """Create a new project and return it."""
    project = Project(title=title, description=description)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

def update_project(db: Session, project: Project, title: str | None, description: str | None) -> Project:
    """Update fields on an existing project."""
    if title is not None:
        project.title = title
    if description is not None:
        project.description = description
    db.commit()
    db.refresh(project)
    return project

def delete_project(db: Session, project: Project) -> None:
    """Delete a project."""
    db.delete(project)
    db.commit()

""" 
    DATASET
"""
def add_dataset(db: Session, project_id: int, name: str, data: str | None) -> Dataset:
    """Create a new dataset for a project and return it."""
    dataset = Dataset(project_id=project_id, name=name, data=data)
    db.add(dataset)
    db.commit()
    db.refresh(dataset)
    return dataset

def get_datasets(db: Session, project_id: int) -> list[Dataset]:
    """Return all datasets for a given project."""
    return db.query(Dataset).filter(Dataset.project_id == project_id).all()

def get_dataset(db: Session, dataset_id: int) -> Dataset | None:
    """Return a single dataset by id, or None."""
    return db.query(Dataset).filter(Dataset.id == dataset_id).first()

def delete_dataset(db: Session, dataset: Dataset) -> None:
    """Delete a dataset."""
    db.delete(dataset)
    db.commit()

"""
    CHATS
"""
def get_chats(db: Session, project_id: int) -> list[Chat]:
    """Return all chats for a given project."""
    return db.query(Chat).filter(Chat.project_id == project_id).all()

def get_chat(db: Session, chat_id: int) -> Chat | None:
    """Return a single chat by id, or None."""
    return db.query(Chat).filter(Chat.id == chat_id).first()

def add_chat(db: Session, project_id: int, title: str) -> Chat:
    """Create a new chat for a project and return it."""
    chat = Chat(project_id=project_id, title=title)
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat

"""
    EXCHANGES
"""
def get_exchanges(db: Session, chat_id: int) -> list[Exchange]:
    """Return all exchanges for a given chat, ordered by order."""
    return db.query(Exchange).filter(Exchange.chat_id == chat_id).order_by(Exchange.order).all()

def add_exchange(db: Session, chat_id: int, order: int, prompt: str, response: str) -> Exchange:
    """Create a new exchange in a chat and return it."""
    exchange = Exchange(chat_id=chat_id, order=order, prompt=prompt, response=response)
    db.add(exchange)
    db.commit()
    db.refresh(exchange)
    return exchange

def get_exchanges_count(db: Session, chat_id: int) -> int:
    return db.query(Exchange).filter(Exchange.chat_id == chat_id).count()
