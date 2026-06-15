from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.order import Order
from app.models.order_item import Order_item
from app.models.cart import Cart
from app.models.product import Product
from app.models.coupon import Coupon
from app.models.notification import Notification
from app.schemas.order import OrderCreate, OrderResponse
from app.utils.auth import get_current_user, get_admin
import stripe
import os

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

router = APIRouter(prefix="/orders", tags=["Orders"])

# ─── Customer Routes ─────────────────────────────────

@router.post("/", response_model=OrderResponse)
def place_order(
    data: OrderCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Cart items lo
    cart_items = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).all()

    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Total calculate karo
    total = 0
    order_items_data = []

    for item in cart_items:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {item.product_id} not found"
            )
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"{product.name} ka stock kam hai"
            )

        total += product.price * item.quantity
        order_items_data.append({
            "product_id": item.product_id,
            "quantity": item.quantity,
            "size": item.size,
            "color": item.color,
            "price": product.price
        })

    # Coupon apply karo
    if data.coupon_code:
        coupon = db.query(Coupon).filter(
            Coupon.code == data.coupon_code,
            Coupon.is_active == True
        ).first()

        if not coupon:
            raise HTTPException(
                status_code=400,
                detail="Invalid or expired coupon"
            )
        if coupon.used_count >= coupon.max_uses:
            raise HTTPException(
                status_code=400,
                detail="Coupon limit reached"
            )

        discount = (coupon.discount_percent / 100) * total
        total -= discount
        coupon.used_count += 1

    # Order banao
    order = Order(
        user_id=current_user.id,
        total=round(total, 2),
        status="pending",
        address=data.address.dict()
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    # OrderItems banao + stock update karo
    for item_data in order_items_data:
        order_item = Order_item(
            order_id=order.id,
            **item_data
        )
        db.add(order_item)

        # Stock kam karo
        product = db.query(Product).filter(
            Product.id == item_data["product_id"]
        ).first()
        product.stock -= item_data["quantity"]

    # Cart clear karo
    db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).delete()

    # Notification banao
    notification = Notification(
        user_id=current_user.id,
        title="Order Placed! 🎉",
        message=f"Tumhara order #{order.id} place ho gaya!",
        type="order"
    )
    db.add(notification)
    db.commit()

    return order

@router.get("/", response_model=List[OrderResponse])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return db.query(Order).filter(
        Order.user_id == current_user.id
    ).order_by(Order.created_at.desc()).all()

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

# ─── Stripe Payment ───────────────────────────────────

@router.post("/{order_id}/payment")
def create_payment(
    order_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Stripe checkout session banao
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{
            "price_data": {
                "currency": "pkr",
                "product_data": {
                    "name": f"CloakPK Order #{order.id}"
                },
                "unit_amount": int(order.total * 100)
            },
            "quantity": 1
        }],
        mode="payment",
        success_url="http://localhost:5173/order-success",
        cancel_url="http://localhost:5173/cart",
        metadata={"order_id": order.id}
    )

    return {"payment_url": session.url}

# ─── Admin Routes ─────────────────────────────────────

@router.get("/admin/all", response_model=List[OrderResponse])
def get_all_orders(
    db: Session = Depends(get_db),
    admin = Depends(get_admin)
):
    return db.query(Order).order_by(
        Order.created_at.desc()
    ).all()

@router.put("/admin/{order_id}/status")
def update_order_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db),
    admin = Depends(get_admin)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    valid_statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")

    order.status = status

    # Customer ko notification bhejo
    notification = Notification(
        user_id=order.user_id,
        title=f"Order {status.capitalize()}!",
        message=f"Your Order #{order.id} is {status}",
        type="order"
    )
    db.add(notification)
    db.commit()

    return {"message": f"Order status updated to {status}"}