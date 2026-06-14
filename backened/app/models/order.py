from sqlalchemy import Column,Integer,String,ForeignKey,Boolean,DateTime,JSON,Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer,primary_key=True,index=True)
    userid = Column(Integer, ForeignKey("users.id"))
    total = Column(Float,default=0.00)
    status = Column(String, default="pending")
    items = Column(JSON)
    address = Column(JSON)
    created_at = Column(DateTime(timezone=True),server_default=func.now())
    stripe_payment_id = Column(String)

    user = relationship("User", backref="orders")