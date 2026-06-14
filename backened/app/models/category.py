from sqlalchemy import Column,Integer,String,DateTime
from sqlalchemy.sql import func
from app.database import Base

class Category(Base):
    __tablename__ = "categories"


    id = Column(Integer, primary_key=True, index=True)
    name = Column(String,nullable=False) # mens,womens,kids,featured
    slug = Column(String,nullable=False)
    image = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
