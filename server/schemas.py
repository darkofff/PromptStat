from pydantic import BaseModel


class ProjectBase(BaseModel):
    """Shared fields for project creation and reading."""
    name: str
    description: str
    status: str


class ProjectRead(ProjectBase):
    """Schema for reading a project (includes id)."""
    id: int

    model_config = {"from_attributes": True}
