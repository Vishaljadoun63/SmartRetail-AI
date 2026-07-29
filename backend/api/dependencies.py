from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from core.config import settings
from schemas.auth import TokenPayload
from schemas.user import AdminResponse
from database.mongo import get_collection
from bson import ObjectId

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

async def get_current_admin(token: str = Depends(oauth2_scheme)) -> AdminResponse:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    
    admins_collection = get_collection("admins")
    admin = await admins_collection.find_one({"_id": ObjectId(token_data.sub)})
    
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
        
    admin["id"] = str(admin.pop("_id"))
    return AdminResponse(**admin)
