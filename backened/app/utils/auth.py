from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from passlib.context import CryptContext
import os

# JS Context
ALGORITHM=os.getenv("ALGORITHM")
SECRET=os.getenv("SECRET_KEY")
ACCESS_TOKEN_EXPIRE_MINUTES=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES",30))

pwd_context = CryptContext(schemes=["bcrypt"],deprecated=["auto"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def password_hashed(password : str):
    return pwd_context.hash(password)

def verify_password(plain,hashed):
    return pwd_context.verify(plain,hashed)

def create_token(data : dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({
        "exp" : expire
    })
    return jwt.encode(to_encode,SECRET,algorithm=ALGORITHM)

def get_current_user (
        token : str = Depends(oauth2_scheme),
        db : Session = Depends(get_db)
):
    exception_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Inavlid Token",
        headers={"WWW-Authenticate":"Bearer"}
    )

    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])

        user_id :int = payload.get("sub")
        if user_id is None:
            raise exception_error
        
    except JWTError:
        raise exception_error
    
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise exception_error
    return user

def get_admin(current_user = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code= status.HTTP_403_FORBIDDEN,
            detail="Invalid Admin User"
        )
    
    return current_user