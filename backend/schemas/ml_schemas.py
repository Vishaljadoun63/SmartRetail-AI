from pydantic import BaseModel
from typing import List, Optional

# Face Recognition
class FaceEncodingData(BaseModel):
    name: str
    face_encoding: List[float]
    email: Optional[str] = None
    phone: Optional[str] = None

class FaceMatchResult(BaseModel):
    customer_id: Optional[str]
    name: Optional[str]
    is_new: bool
    visit_count: int

class FaceImage(BaseModel):
    image_base64: str

# Product Classifier
class ProductPrediction(BaseModel):
    category: str
    confidence: float
    top_3: List[dict]

# Sentiment Analysis
class ReviewInput(BaseModel):
    review_text: str

class SentimentPrediction(BaseModel):
    sentiment: str
    confidence: float

# Chatbot
class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
