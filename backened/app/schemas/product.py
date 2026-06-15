from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    Category_id: Optional[int] = None
    sizes: Optional[List[str]] = []
    colors: Optional[List[str]] = []
    stock: int = 0
    is_featured: bool = False

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    Category_id: Optional[int] = None
    sizes: Optional[List[str]] = None
    colors: Optional[List[str]] = None
    stock: Optional[int] = None
    is_featured: Optional[bool] = None

class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    original_price: Optional[float]
    Category_id: Optional[int]
    sizes: Optional[List[str]]
    colors: Optional[List[str]]
    images: Optional[List[str]]
    stock: int
    is_featured: bool
    created_at: datetime

    class Config:
        from_attributes = True