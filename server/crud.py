# Funkcje do operacji na bazie danych

from sqlalchemy.orm import Session
from models import Project


def get_projects(db: Session) -> list[Project]:
    """Return all projects ordered by id."""
    return db.query(Project).order_by(Project.id).all()
