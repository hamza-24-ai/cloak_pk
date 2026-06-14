from fastapi import HTTPException,Depends,APIRouter,status
from sqlalchemy.orm import Session
from app.schemas.user import UserLogin,UserRegister,Token
from app.utils.auth import password_hashed,verify_password,get_current_user,create_token
from app.database import get_db
from app.models.user import User

router = APIRouter(prefix="/auth" ,tags=["Auth"])

@router.post("/register", response_model=Token)
def register(data : UserRegister, db : Session = Depends(get_db)):

    existing = db.query(User).filter(User.email == data.email).first()
    if existing :
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User Already Exist"
        )
    
    user =  User(
        name = data.name,
        email = data.email,
        password = password_hashed(data.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_token({"sub" : str(user.id)})

    return{
        "access_token" : token,
        "token_type" : "bearer",
        "user" : user
    }



@router.post("/login", response_model=Token)
def login(data : UserLogin, db : Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if  not user or not verify_password(data.password,user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid User password or email"
        )
    
    token = create_token({"sub" : str(user.id)})
    return{
        "access_token" : token,
        "token_type" : "bearer",
        "user" : user
    }

@router.get("/me")
def me(db : Session = Depends(get_db)):
    current_user : User = Depends(get_current_user)
    return current_user