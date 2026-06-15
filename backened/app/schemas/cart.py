from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CartAdd(BaseModel):
    product_id: int
    quantity: int = 1
    size: Optional[str] = None
    color: Optional[str] = None

class CartUpdate(BaseModel):
    quantity: int

class CartResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    quantity: int
    size: Optional[str]
    color: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True