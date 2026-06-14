from sqlalchemy import String,Integer,Column,Boolean,ForeignKey,DateTime,Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Order_item(Base):

    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    color = Column(String, nullable=False)
    size = Column(String, nullable=False)
    price = Column(Float)
    quantity = Column(Integer)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)


    order = relationship("Order", backref="order_item")
    product = relationship("Product", backref="order_item")