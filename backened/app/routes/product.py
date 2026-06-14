from fastapi import HTTPException,Depends,status,APIRouter,UploadFile,File,Form
from sqlalchemy.orm import Session
from app.models.product import Product
from app.database import get_db
from app.schemas.product import ProductCreate,ResponseProduct
from typing import List,Optional
from app.utils.auth import get_admin,get_current_user

router = APIRouter(prefix="/products",tags=["Products"])

@router.get("/",response_model=List[ResponseProduct])
