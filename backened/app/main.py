from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base,engine
from app.routes import auth,category,product,cart,order, review, coupon, notification
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv

load_dotenv()


from app.models.cart import Cart
from app.models.category import Category
from app.models.coupon import Coupon
from app.models.notification import Notification
from app.models.order import Order
from app.models.order_item import Order_item
from app.models.product import Product
from app.models.review import Review
from app.models.user import User

app = FastAPI(title='CloakPK')

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")




app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
    
)

app.include_router(auth.router)
app.include_router(category.router)
app.include_router(product.router)
app.include_router(cart.router)
app.include_router(order.router)
app.include_router(review.router)
app.include_router(coupon.router)
app.include_router(notification.router)

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message : Cloak API Runing"}