from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class AdminBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "admin"

class AdminCreate(AdminBase):
    password: str

class AdminInDB(AdminBase):
    id: str
    hashed_password: str

class AdminResponse(AdminBase):
    id: str

class CustomerBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

class CustomerCreate(CustomerBase):
    face_encoding: List[float]  # Typically a 128-d or 512-d array from face_recognition

class CustomerInDB(CustomerBase):
    id: str
    face_encoding: List[float]
    created_at: datetime
    last_visit: datetime
    visit_count: int

class CustomerResponse(CustomerBase):
    id: str
    created_at: datetime
    last_visit: datetime
    visit_count: int
