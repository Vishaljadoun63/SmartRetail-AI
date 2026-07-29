from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from core.security import verify_password, create_access_token
from database.mongo import get_collection
from schemas.auth import Token
from schemas.user import AdminResponse
from bson import ObjectId

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"/api/v1/auth/login")

@router.post("/login", response_model=Token)
async def login_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    admins_collection = get_collection("admins")
    admin = await admins_collection.find_one({"email": form_data.username})
    
    if not admin:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not verify_password(form_data.password, admin["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    # In production, we'd use the admin's ID or email as the subject
    access_token = create_access_token(subject=str(admin["_id"]))
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

# We will need a way to register the initial admin. Let's add a hidden or secured route for that.
from core.security import get_password_hash
from schemas.user import AdminCreate

@router.post("/register-admin", response_model=AdminResponse)
async def register_admin(admin_in: AdminCreate):
    """
    Create new admin. In production this should be secured so not anyone can create admins.
    """
    admins_collection = get_collection("admins")
    admin = await admins_collection.find_one({"email": admin_in.email})
    if admin:
        raise HTTPException(
            status_code=400,
            detail="The admin with this username already exists in the system.",
        )
    
    admin_dict = admin_in.model_dump()
    admin_dict["hashed_password"] = get_password_hash(admin_dict.pop("password"))
    
    result = await admins_collection.insert_one(admin_dict)
    admin_dict["id"] = str(result.inserted_id)
    
    return admin_dict
