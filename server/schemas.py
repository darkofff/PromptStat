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

class DatasetListItem(DatasetBase):
    """Schema for listing datasets (without data field)."""
    id: int
    project_id: int

    model_config = {"from_attributes": True}

"""
    Chat
"""
class ChatBase(BaseModel):
    """Fields for creating a chat."""
    title: str

class ChatRead(ChatBase):
    """Schema for reading a chat (includes id and project_id)."""
    id: int
    project_id: int

    model_config = {"from_attributes": True}

"""
    Exchange
"""
class ExchangeBase(BaseModel):
    """Fields for creating an exchange."""
    prompt: str
    
class ExchangeRead(ExchangeBase):
    """Schema for reading an exchange (includes id, chat_id, order)."""
    id: int
    chat_id: int
    order: int
    response: str

    model_config = {"from_attributes": True}

"""
    LLM
"""
class AskRequest(BaseModel):
    """Schema for the /ask endpoint."""
    text: str