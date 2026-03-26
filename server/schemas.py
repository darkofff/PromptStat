from pydantic import BaseModel

""" 
    Projects
 """
class ProjectBase(BaseModel):
    """Shared fields for project creation and reading."""
    title: str
    description: str

class ProjectUpdate(BaseModel):
    """Fields that can be updated on a project (all optional)."""
    title: str | None = None
    description: str | None = None

class ProjectRead(ProjectBase):
    """Schema for reading a project (includes id)."""
    id: int

    model_config = {"from_attributes": True}

""" 
    Dataset
"""
class DatasetBase(BaseModel):
    """Fields for creating a dataset."""
    name: str
    description: str | None = None

class DatasetRead(DatasetBase):
    """Schema for reading a dataset (includes id and project_id)."""
    id: int
    project_id: int
    data: str | None = None

    model_config = {"from_attributes": True}