from sqlalchemy import Column,String,DateTime,Integer,Float,Boolean
from sqlalchemy.sql import func
from app.database import Base

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String)
    discount_percent = Column(Float, default=0)
    used_count = Column(Integer, default=0)
    max_uses = Column(Integer, default=100)
    is_active = Column(Boolean, default=False)
    expire_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())