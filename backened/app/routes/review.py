from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.review import Review
from app.models.order import Order
from app.schemas.review import ReviewCreate, ReviewResponse
from app.utils.auth import get_current_user

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.post("/", response_model=ReviewResponse)
def create_review(
    data: ReviewCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Sirf woh log review de jo order kar chuke hain
    order = db.query(Order).filter(
        Order.user_id == current_user.id,
        Order.status == "delivered"
    ).first()

    if not order:
        raise HTTPException(
            status_code=400,
            detail="Only delievered Orders can review"
        )

    # Pehle se review diya?
    existing = db.query(Review).filter(
        Review.user_id == current_user.id,
        Review.product_id == data.product_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="you already gave review"
        )

    if data.rating < 1 or data.rating > 5:
        raise HTTPException(
            status_code=400,
            detail="Rating should be between 1 and 5"
        )

    review = Review(user_id=current_user.id, **data.dict())
    db.add(review)
    db.commit()
    db.refresh(review)
    return review

@router.get("/product/{product_id}", response_model=List[ReviewResponse])
def get_product_reviews(
    product_id: int,
    db: Session = Depends(get_db)
):
    return db.query(Review).filter(
        Review.product_id == product_id
    ).all()

@router.delete("/{review_id}")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    review = db.query(Review).filter(
        Review.id == review_id,
        Review.user_id == current_user.id
    ).first()

    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    db.delete(review)
    db.commit()
    return {"message": "Review deleted"}