from sqlalchemy import Column,Integer,String,DateTime,ARRAY,Float,Boolean,ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer,primary_key=True,index=True)
    name = Column(String,nullable=False)
    description = Column(String,nullable=True)
    price = Column(Float,nullable=False)
    original_price = Column(Float,nullable=False)
    Category_id = Column(Integer,ForeignKey("categories.id"),nullable=True)
    sizes = Column(ARRAY(String),default=[])
    colors = Column(ARRAY(String),default=[])
    images = Column(ARRAY(String),default=[])
    stock = Column(Integer,default=0)
    is_featured = Column(Boolean,default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    category = relationship("Category", backref="products")