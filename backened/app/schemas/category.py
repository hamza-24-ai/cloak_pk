from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CategoryCreate(BaseModel):
    name : str
    slug : str 
    image : Optional[str] = None


class ResponseCategory(BaseModel):
    id : int
    name : str
    slug : str
    image : Optional[str]
    created_at : datetime

    class Config:
        from_attributes : True