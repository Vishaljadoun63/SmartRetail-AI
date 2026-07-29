from transformers import pipeline
import pickle
import os
import numpy as np
import base64
from io import BytesIO
from PIL import Image
import random # fallback
import logging

logger = logging.getLogger(__name__)

# Load Models
base_dir = os.path.dirname(os.path.abspath(__file__))

# Hugging Face Sentiment Model
try:
    sentiment_model = pipeline(
        task="sentiment-analysis",
        model="distilbert-base-uncased-finetuned-sst-2-english"
    )
    print("Hugging Face sentiment model loaded successfully!")
except Exception as e:
    sentiment_model = None
    print("Failed to load Hugging Face model:", e)

# 2. Chatbot Model
chatbot_data = None
try:
    with open(os.path.join(base_dir, "chatbot_model.pkl"), "rb") as f:
        chatbot_data = pickle.load(f)
    logger.info("Chatbot model loaded.")
except Exception as e:
    logger.error(f"Could not load chatbot model: {e}")

# 3. Product Classifier
try:
    image_classifier = pipeline(
        "image-classification",
        model="google/vit-base-patch16-224"
    )
    logger.info("Hugging Face image classifier loaded.")
except Exception as e:
    image_classifier = None
    logger.error(f"Failed to load image classifier: {e}")

# Inference Functions

def analyze_sentiment(text: str) -> dict:
    if sentiment_model is None:
        return {
            "sentiment": "Unknown",
            "confidence": 0.0
        }

    result = sentiment_model(text)[0]

    label = result["label"].lower()
    confidence = float(result["score"])

    if label == "positive":
        sentiment = "Positive"
    elif label == "negative":
        sentiment = "Negative"
    else:
        sentiment = "Neutral"

    return {
        "sentiment": sentiment,
        "confidence": confidence
    }

def get_chatbot_response(message: str) -> str:
    if chatbot_data is None:
        return "Chatbot model not available."

    try:
        model = chatbot_data["model"]
        responses = chatbot_data["responses"]

        pred_tag = model.predict([message])[0]

        if pred_tag in responses:
            return random.choice(responses[pred_tag])

        return "I'm sorry, I don't understand that."

    except Exception as e:
        logger.error(f"Chatbot prediction failed: {e}")

        # fallback replies
        msg = message.lower()

        if any(word in msg for word in ["hello", "hi", "hey"]):
            return "Hello! Welcome to SmartRetail AI. How can I help you today?"

        if "product" in msg:
            return "You can classify products using the Product Classification page."

        if "review" in msg:
            return "You can analyze customer reviews from the Sentiment Analysis page."

        return "Sorry, the AI chatbot model is currently unavailable."

def classify_product(image_base64: str) -> dict:

    if image_classifier is None:
        return {
            "category": "Unknown",
            "confidence": 0.0,
            "top_3": []
        }

    # Remove base64 header if present
    if "," in image_base64:
        image_base64 = image_base64.split(",")[1]

    image_data = base64.b64decode(image_base64)

    image = Image.open(BytesIO(image_data)).convert("RGB")

    results = image_classifier(image)

    top_3 = [
        {
            "category": r["label"],
            "confidence": float(r["score"])
        }
        for r in results[:3]
    ]

    return {
        "category": results[0]["label"],
        "confidence": float(results[0]["score"]),
        "top_3": top_3
    }
