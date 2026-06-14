import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import os

load_dotenv()

cloudinary.Config(
    name = os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key = os.getenv("CLOUDINARY_API_KEY"),
    api_secret = os.getenv("CLOUDINARY_API_SECRET")
)

def upload_image(file) -> str:
    result = cloudinary.uploader.upload(
        file,
        folder="cloakpk/products",
        transformation = [
            {"width":800, "height":800, "crop":"fill"},
            {"quality" : "auto"}
        ]
    )

    return result["secure_url"]

def delete_image(public_id : int):
    cloudinary.uploader.destroy(public_id)