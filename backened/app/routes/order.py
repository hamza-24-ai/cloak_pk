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
# import lab libraries for download pdf
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from io import BytesIO
# Admin dashboard 
from sqlalchemy import func
from datetime import datetime, timedelta
from dotenv import load_dotenv
load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
print("Key", stripe.api_key)

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
            "color": item.Color,
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
        userid=current_user.id,
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
        Order.userid == current_user.id
    ).order_by(Order.created_at.desc()).all()

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.userid == current_user.id
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
        Order.userid == current_user.id
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

    # Confirm Payment
@router.post("/{order_id}/confirm-payment")
def confirm_payment(
    order_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.userid == current_user.id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.status == "pending":
        order.status = "processing"
        db.commit()

    return {"message": "Payment confirmed", "status": order.status}

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
        user_id=order.userid,
        title=f"Order {status.capitalize()}!",
        message=f"Your Order #{order.id} is {status}",
        type="order"
    )
    db.add(notification)
    db.commit()

    return {"message": f"Order status updated to {status}"}


# Voucher download program

@router.get("/{order_id}/voucher")
def download_voucher(
    order_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.userid == current_user.id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.status not in ["shipped", "delivered"]:
        raise HTTPException(status_code=400, detail="Voucher not available yet")

    order_items = db.query(Order_item).filter(Order_item.order_id == order.id).all()

    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    # Header
    p.setFillColorRGB(0.094, 0.094, 0.106)  # #18181B
    p.rect(0, height - 80, width, 80, fill=True, stroke=False)
    p.setFillColorRGB(1, 1, 1)
    p.setFont("Helvetica-Bold", 22)
    p.drawString(40, height - 50, "CloakPK")
    p.setFont("Helvetica", 10)
    p.drawString(40, height - 65, "Wear Your Story")

    y = height - 110
    p.setFillColorRGB(0.094, 0.094, 0.106)
    p.setFont("Helvetica-Bold", 14)
    p.drawString(40, y, f"ORDER VOUCHER - #{order.id}")

    y -= 20
    p.setFont("Helvetica", 10)
    p.drawString(40, y, f"Date: {order.created_at.strftime('%d %B %Y')}")
    p.drawString(300, y, f"Status: {order.status.upper()}")

    y -= 30
    p.setFont("Helvetica-Bold", 11)
    p.drawString(40, y, "Delivery Address")
    y -= 15
    p.setFont("Helvetica", 10)
    addr = order.address
    p.drawString(40, y, f"{addr.get('street', '')}, {addr.get('city', '')}")
    y -= 13
    p.drawString(40, y, f"{addr.get('state', '')} {addr.get('zip_code', '')}, {addr.get('country', '')}")

    y -= 30
    p.setFont("Helvetica-Bold", 11)
    p.drawString(40, y, "Order Items")
    y -= 20

    p.setFont("Helvetica-Bold", 9)
    p.drawString(40, y, "Item")
    p.drawString(280, y, "Qty")
    p.drawString(330, y, "Price")
    p.drawString(420, y, "Subtotal")
    y -= 5
    p.line(40, y, width - 40, y)
    y -= 15

    p.setFont("Helvetica", 9)
    for item in order_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        name = product.name if product else "Product"
        if item.size or item.color:
            name += f" ({item.size or ''}{'/' if item.size and item.color else ''}{item.color or ''})"
        
        p.drawString(40, y, name[:40])
        p.drawString(280, y, str(item.quantity))
        p.drawString(330, y, f"Rs. {item.price}")
        p.drawString(420, y, f"Rs. {item.price * item.quantity}")
        y -= 18

    y -= 10
    p.line(40, y, width - 40, y)
    y -= 20

    p.setFont("Helvetica-Bold", 12)
    p.drawString(330, y, "Total:")
    p.drawString(420, y, f"Rs. {order.total}")

    y -= 50
    p.setFont("Helvetica-Oblique", 9)
    p.setFillColorRGB(0.44, 0.44, 0.45)
    p.drawString(40, y, "Thank you for shopping with CloakPK!")

    p.showPage()
    p.save()
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=CloakPK_Order_{order.id}.pdf"}
    )


# Admin dashboard stats data 
from app.models.user import User
from app.models.product import Product

@router.get("/admin/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    admin = Depends(get_admin)
):
    total_revenue = db.query(func.sum(Order.total)).filter(
        Order.status != "cancelled"
    ).scalar() or 0

    total_orders = db.query(Order).count()
    total_products = db.query(Product).count()
    total_users = db.query(User).filter(User.is_admin == False).count()

    return {
        "total_revenue": round(total_revenue, 2),
        "total_orders": total_orders,
        "total_products": total_products,
        "total_users": total_users
    }

@router.get("/admin/revenue-chart")
def get_revenue_chart(
    db: Session = Depends(get_db),
    admin = Depends(get_admin)
):
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    
    results = db.query(
        func.date(Order.created_at).label("date"),
        func.sum(Order.total).label("revenue")
    ).filter(
        Order.created_at >= seven_days_ago,
        Order.status != "cancelled"
    ).group_by(func.date(Order.created_at)).all()

    return [{"date": str(r.date), "revenue": float(r.revenue)} for r in results]

@router.get("/admin/recent")
def get_recent_orders(
    db: Session = Depends(get_db),
    admin = Depends(get_admin)
):
    orders = db.query(Order).order_by(Order.created_at.desc()).limit(5).all()
    return orders