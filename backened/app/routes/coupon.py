from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models.coupon import Coupon
from app.schemas.coupon import CouponCreate, CouponVerify, CouponResponse
from app.utils.auth import get_current_user, get_admin

router = APIRouter(prefix="/coupons", tags=["Coupons"])

# Public — coupon verify karo
@router.post("/verify")
def verify_coupon(
    data: CouponVerify,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    coupon = db.query(Coupon).filter(
        Coupon.code == data.code,
        Coupon.is_active == True
    ).first()

    if not coupon:
        raise HTTPException(status_code=400, detail="Invalid coupon code")

    if coupon.used_count >= coupon.max_uses:
        raise HTTPException(status_code=400, detail="Coupon limit reached")

    if coupon.expire_at and coupon.expire_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Coupon expired")

    discount = (coupon.discount_percent / 100) * data.total
    new_total = data.total - discount

    return {
        "valid": True,
        "discount_percent": coupon.discount_percent,
        "discount_amount": round(discount, 2),
        "new_total": round(new_total, 2)
    }

# Admin Routes
@router.post("/", response_model=CouponResponse)
def create_coupon(
    data: CouponCreate,
    db: Session = Depends(get_db),
    admin = Depends(get_admin)
):
    existing = db.query(Coupon).filter(Coupon.code == data.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Coupon already exists")

    coupon = Coupon(**data.dict())
    db.add(coupon)
    db.commit()
    db.refresh(coupon)
    return coupon

@router.get("/", response_model=List[CouponResponse])
def get_all_coupons(
    db: Session = Depends(get_db),
    admin = Depends(get_admin)
):
    return db.query(Coupon).all()

@router.delete("/{coupon_id}")
def delete_coupon(
    coupon_id: int,
    db: Session = Depends(get_db),
    admin = Depends(get_admin)
):
    coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")

    db.delete(coupon)
    db.commit()
    return {"message": "Coupon deleted"}