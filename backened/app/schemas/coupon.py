from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CouponCreate(BaseModel):
    code: str
    discount_percent: float
    max_uses: int = 100
    expires_at: Optional[datetime] = None

class CouponVerify(BaseModel):
    code: str
    total: float

class CouponResponse(BaseModel):
    id: int
    code: str
    discount_percent: float
    max_uses: int
    used_count: int
    is_active: bool
    expires_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True