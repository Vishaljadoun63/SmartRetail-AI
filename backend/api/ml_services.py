from fastapi import APIRouter, Depends, HTTPException, status
from ml_models.inference import analyze_sentiment, get_chatbot_response, classify_product
from schemas.ml_schemas import ReviewInput, SentimentPrediction, ChatMessage, ChatResponse, FaceImage, ProductPrediction
from database.mongo import get_collection
from core.security import get_password_hash # reusing for demo if needed
from datetime import datetime
try:
    import face_recognition
except Exception as e:
    face_recognition = None
    print(f"Face recognition unavailable: {e}")
import numpy as np
import base64
from io import BytesIO
from PIL import Image

router = APIRouter()

@router.post("/analyze-sentiment", response_model=SentimentPrediction)
async def api_analyze_sentiment(review: ReviewInput):
    result = analyze_sentiment(review.review_text)
    
    # Log to database
    reviews_collection = get_collection("reviews")
    await reviews_collection.insert_one({
        "text": review.review_text,
        "sentiment": result["sentiment"],
        "confidence": result["confidence"],
        "timestamp": datetime.now()
    })
    
    return result

@router.post("/chatbot", response_model=ChatResponse)
async def api_chatbot(chat: ChatMessage):
    reply = get_chatbot_response(chat.message)
    
    # Log to database
    chat_logs = get_collection("chat_logs")
    await chat_logs.insert_one({
        "user_message": chat.message,
        "bot_reply": reply,
        "timestamp": datetime.now()
    })
    
    return {"reply": reply}

@router.post("/classify-product", response_model=ProductPrediction)
async def api_classify_product(image: FaceImage):
    result = classify_product(image.image_base64)
    return result

@router.post("/recognize-face")
async def api_recognize_face(image: FaceImage):

    if face_recognition is None:
        raise HTTPException(
            status_code=503,
            detail="Face recognition is not available on this system."
        )

    try:
        # Decode base64
        img_data = image.image_base64
        if "," in img_data:
            img_data = img_data.split(",")[1]

        decoded = base64.b64decode(img_data)
        img = Image.open(BytesIO(decoded)).convert("RGB")
        img_array = np.array(img)
        
        # Get face encodings
        face_locations = face_recognition.face_locations(img_array)
        if not face_locations:
            raise HTTPException(status_code=400, detail="No face detected in the image.")
            
        encodings = face_recognition.face_encodings(img_array, face_locations)
        if not encodings:
             raise HTTPException(status_code=400, detail="Could not extract face encodings.")
             
        unknown_encoding = encodings[0]
        
        # Fetch all customers
        customers_col = get_collection("customers")
        customers = await customers_col.find().to_list(1000)

        valid_customers = []
        known_encodings = []

        # Only keep customers with valid 128-dimensional face encodings
        for customer in customers:
            encoding = customer.get("face_encoding", [])

            if isinstance(encoding, list) and len(encoding) == 128:
                known_encodings.append(np.array(encoding))
                valid_customers.append(customer)

        if not known_encodings:
            return {
                "status": "new_customer",
                "message": "No registered faces found. Please register a customer."
            }

        # Compare
        results = face_recognition.compare_faces(
            known_encodings,
            unknown_encoding,
            tolerance=0.6
        )
        
        if True in results:
            match_index = results.index(True)
            matched_customer = valid_customers[match_index]
            
            # Update visit logs
            visit_logs = get_collection("visit_logs")
            await visit_logs.insert_one({
                "customer_id": matched_customer["_id"],
                "timestamp": datetime.now(),
                "type": "returning"
            })
            
            # Update customer visit count
            await customers_col.update_one(
                {"_id": matched_customer["_id"]},
                {"$inc": {"visit_count": 1}, "$set": {"last_visit": datetime.now()}}
            )
            
            return {
                "status": "returning_customer",
                "customer": {
                    "id": str(matched_customer["_id"]),
                    "name": matched_customer["name"],
                    "visit_count": matched_customer.get("visit_count", 0) + 1
                }
            }
        else:
            return {"status": "new_customer", "message": "Face not recognized. Please register."}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/register-face")
async def api_register_face(data: dict):

    if face_recognition is None:
        raise HTTPException(
            status_code=503,
            detail="Face recognition is not available on this system."
        )

    try:
        name = data.get("name")
        img_data = data.get("image_base64")
        
        if not name or not img_data:
            raise HTTPException(status_code=400, detail="Name and image_base64 are required")
            
        if "," in img_data:
            img_data = img_data.split(",")[1]
            
        decoded = base64.b64decode(img_data)
        img = Image.open(BytesIO(decoded)).convert("RGB")
        img_array = np.array(img)
        
        face_locations = face_recognition.face_locations(img_array)
        if not face_locations:
            raise HTTPException(status_code=400, detail="No face detected in the image.")
            
        encodings = face_recognition.face_encodings(img_array, face_locations)
        if not encodings:
             raise HTTPException(status_code=400, detail="Could not extract face encodings.")
             
        encoding = encodings[0].tolist()
        
        customers_col = get_collection("customers")

        # Check if the customer name already exists
        existing = await customers_col.find_one({"name": name})

        if existing:
            raise HTTPException(
                status_code=400,
                detail=f"Customer '{name}' is already registered."
            )

        # Check if the same face is already registered
        customers = await customers_col.find(
            {"face_encoding": {"$exists": True}}
        ).to_list(1000)

        for customer in customers:
            if customer.get("face_encoding"):
                known_encoding = np.array(customer["face_encoding"])

                match = face_recognition.compare_faces(
                    [known_encoding],
                    np.array(encoding),
                    tolerance=0.6
                )

                if match[0]:
                    raise HTTPException(
                        status_code=400,
                        detail=f"This face is already registered as '{customer['name']}'."
                    )

        # Insert new customer
        await customers_col.insert_one({
            "name": name,
            "face_encoding": encoding,
            "created_at": datetime.now(),
            "last_visit": datetime.now(),
            "visit_count": 1
        })

        return {
            "status": "success",
            "message": f"Customer {name} registered successfully."
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
