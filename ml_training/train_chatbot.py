import json
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
import os

os.makedirs("../backend/ml_models", exist_ok=True)

with open("intents.json", "r") as f:
    intents = json.load(f)

X_train = []
y_train = []
tag_responses = {}

for intent in intents["intents"]:
    tag = intent["tag"]
    tag_responses[tag] = intent["responses"]
    for pattern in intent["patterns"]:
        X_train.append(pattern)
        y_train.append(tag)

print("Training Chatbot Intent Classifier...")
model = make_pipeline(TfidfVectorizer(lowercase=True), LogisticRegression(max_iter=1000))
model.fit(X_train, y_train)
print("Training Complete.")

# Save both the model and the responses
chatbot_data = {
    "model": model,
    "responses": tag_responses
}

model_path = "../backend/ml_models/chatbot_model.pkl"
with open(model_path, "wb") as f:
    pickle.dump(chatbot_data, f)

print(f"Chatbot model and responses saved to {model_path}")
