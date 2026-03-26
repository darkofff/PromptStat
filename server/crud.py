# Funkcje do operacji na bazie danych

from sqlalchemy.orm import Session
from models import Project, Dataset

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