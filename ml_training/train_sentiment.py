import json
import numpy as np
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
import os

# Create model directory if it doesn't exist
os.makedirs("../backend/ml_models", exist_ok=True)

# Sample mock dataset for training sentiment analysis
data = [
    ("I love this product, it's amazing!", "positive"),
    ("Great quality and fast delivery.", "positive"),
    ("Highly recommended, will buy again.", "positive"),
    ("The customer service was excellent.", "positive"),
    ("Terrible experience, the item was broken.", "negative"),
    ("I hate this, complete waste of money.", "negative"),
    ("Do not buy this, it's a scam.", "negative"),
    ("Delivery was super late, very disappointed.", "negative"),
    ("It's okay, not the best but fine.", "neutral"),
    ("Average product, does the job.", "neutral"),
    ("Nothing special, just a regular item.", "neutral")
]

X_train = [text for text, label in data]
y_train = [label for text, label in data]

print("Training Sentiment Analysis Model...")
model = make_pipeline(TfidfVectorizer(stop_words='english'), LogisticRegression(max_iter=1000))
model.fit(X_train, y_train)
print("Training Complete.")

# Evaluate on a sample
test_text = ["This is the worst thing I have ever bought."]
print(f"Test '{test_text[0]}': {model.predict(test_text)[0]}")

# Save the model
model_path = "../backend/ml_models/sentiment_model.pkl"
with open(model_path, "wb") as f:
    pickle.dump(model, f)
print(f"Model saved to {model_path}")
