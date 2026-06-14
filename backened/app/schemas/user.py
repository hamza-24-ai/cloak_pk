from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    name : str
    email : EmailStr
    password : str


class UserLogin(BaseModel):
    email : EmailStr
    password : str

class UserResponse(BaseModel):
    id : int
    name : str
    email : EmailStr
    created_at : datetime
    is_admin : bool

    class Config:
        from_attributes : True


class Token(BaseModel):
    access_token : str
    token_type : str
    user : UserResponse