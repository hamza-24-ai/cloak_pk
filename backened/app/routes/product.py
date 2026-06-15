from fastapi import HTTPException,Depends,status,APIRouter,UploadFile,File,Form
from sqlalchemy.orm import Session
from app.models.product import Product
from app.database import get_db
from app.schemas.product import ProductCreate,ProductResponse,ProductUpdate
from typing import List,Optional
from app.utils.auth import get_admin,get_current_user
from app.utils.cloudinary import upload_image

router = APIRouter(prefix="/products",tags=["Products"])

@router.get("/",response_model=List[ProductResponse])
def get_products(
    category_id : Optional[int] = None,
    featured : Optional[bool] = None,
    search : Optional[str] = None,
    min_price : Optional[float] = None,
    max_price : Optional[float] = None,
    skip : int = 0,
    limit : int = 20,
    db : Session = Depends(get_db)
):
    query = db.query(Product)

    if category_id:
        query = query.filter(Product.Category_id == category_id)
    if featured:
        query = query.filter(Product.is_featured == True)
    if search:
        query = query.filter(Product.name.ilike(f"{search}"))
    if min_price:
        query = query.filter(Product.price >= min_price)
    if max_price:
        query = query.filter(Product.price <= max_price)
    
    return query.offset(skip).limit(limit).all()


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id : int, db : Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return product

#  Only Admin access this portion 
@router.post("/", response_model=ProductResponse)
async def create_product(
    name : str = Form(...),
    description : Optional[str] = Form(None),
    price : float = Form(None),
    original_price : float = Form(None),
    Category_id : Optional[int] = Form(None),
    sizes : Optional[str] = Form(None),
    colors : Optional[str] = Form(None),
    stock : int = Form(0),
    is_featured : Optional[bool] = Form(False),
    images : List[UploadFile] = File([]),
    db : Session = Depends(get_db),
    admin = Depends(get_admin)
):
    # upload image
    image_url = []
    for image in images:
        image_byte = await image.read()
        url = upload_image(image_byte)
        image_url.append(url)
    
    product = Product(
        name = name,
        description = description,
        price = price,
        original_price = original_price,
        Category_id = Category_id,
        sizes = sizes.split(",") if sizes else [],
        colors = colors.split(",") if colors else [],
        stock = stock,
        is_featured = is_featured,
        images = image_url
    )

    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}",response_model=ProductResponse)
def update_product(
    product_id : int,
    data : ProductUpdate,
    db : Session = Depends(get_db),
    admin = Depends(get_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product Not Found"
        )
    
    for key , attribute in data.dict(exclude_unset=True).items():
        setattr(product,key,attribute)
    
    db.commit()
    db.refresh(product)
    return product


# product delete
@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin = Depends(get_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND
            , detail="Product not found"
        )

    db.delete(product)
    db.commit()
    return {"message": "Product deleted"}

@router.post("/{product_id}/images")
async def add_product_images(
    product_id: int,
    images: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    admin = Depends(get_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Product not found"
        )

    new_urls = []
    for image in images:
        url = upload_image(image.file)
        image_byte = await image.read()
        new_urls.append(image_byte)

    product.images = (product.images or []) + new_urls
    db.commit()
    db.refresh(product)
    return {"images": product.images}