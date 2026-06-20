from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.cart import Cart
from app.models.product import Product
from app.schemas.cart import CartAdd, CartUpdate, CartResponse
from app.utils.auth import get_current_user

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.get("/", response_model=List[CartResponse])
def get_cart(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return db.query(Cart).filter(Cart.user_id == current_user.id).all()

@router.post("/", response_model=CartResponse)
def add_to_cart(
    data: CartAdd,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Product exists?
    product = db.query(Product).filter(Product.id == data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Stock available?
    if product.stock < data.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    # Already in cart? → update quantity
    existing = db.query(Cart).filter(
        Cart.user_id == current_user.id,
        Cart.product_id == data.product_id,
        Cart.size == data.size,
        Cart.Color == data.Color
    ).first()

    if existing:
        existing.quantity += data.quantity
        db.commit()
        db.refresh(existing)
        return existing

    cart_item = Cart(
        user_id=current_user.id,
        **data.dict()
    )
    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)
    return cart_item

@router.put("/{cart_id}", response_model=CartResponse)
def update_cart(
    cart_id: int,
    data: CartUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    cart_item = db.query(Cart).filter(
        Cart.id == cart_id,
        Cart.user_id == current_user.id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    cart_item.quantity = data.quantity
    db.commit()
    db.refresh(cart_item)
    return cart_item

@router.delete("/{cart_id}")
def remove_from_cart(
    cart_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    cart_item = db.query(Cart).filter(
        Cart.id == cart_id,
        Cart.user_id == current_user.id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(cart_item)
    db.commit()
    return {"message": "Item removed from cart"}

@router.delete("/")
def clear_cart(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db.query(Cart).filter(Cart.user_id == current_user.id).delete()
    db.commit()
    return {"message": "Cart cleared"}