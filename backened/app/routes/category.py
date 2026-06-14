from fastapi import HTTPException,Depends,status,APIRouter
from sqlalchemy.orm import Session
from app.models.category import Category
from app.database import get_db
from app.schemas.category import CategoryCreate,ResponseCategory
from typing import List
from app.utils.auth import get_admin

router = APIRouter(prefix="/categories", tags=["Catgories"])

@router.get('/',response_model=List[ResponseCategory])
def get_all(db : Session = Depends(get_db)):
    return db.query(Category).all()

# Only admin  can add categories
@router.post('/', response_model=ResponseCategory)
def create_category(data : CategoryCreate ,db : Session = Depends(get_db), admin = Depends(get_admin)):

    existing = db.query(Category).filter(data.slug == Category.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Catgeory already exist"
        )
    
    category = Category(
        name = data.name,
        slug = data.slug
    )

    db.add(category)
    db.commit()
    db.refresh(category)

    return category

@router.delete("/{category_id}")
def delete_category(category_id : int, db : Session = Depends(get_db), admin = Depends(get_admin)):
    existing = db.query(Category).filter(Category.id == category_id).first()
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Category not found"
        )
    db.delete(existing)
    db.commit()
    return {"message" : "Category delete successfully "}