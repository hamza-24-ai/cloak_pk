from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class OrderAddress(BaseModel):
    street : str
    city : str
    state : str 
    zip_code : str
    country : str = "Pakistan"

class OrderCreate(BaseModel):
    address : OrderAddress
    coupon_code : Optional[str] = None

class OrderItemResponse(BaseModel):
    id : int
    product_id : int
    quantity : int
    size : Optional[str]
    Color : Optional[str]
    price : float

    class Config:
        form_attribute = True

class OrderResponse(BaseModel):
    id : int
    userid : int
    total : float
    status : str 
    address : dict
    stripe_payment_id : Optional[str]
    created_at : datetime

    class Config:
        form_attribute = True

        