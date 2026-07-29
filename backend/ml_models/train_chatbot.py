import json
import pickle

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

with open("intents.json", "r") as f:
    intents = json.load(f)["intents"]

X = []
y = []
responses = {}

for intent in intents:
    tag = intent["tag"]
    responses[tag] = intent["responses"]

    for pattern in intent["patterns"]:
        X.append(pattern.lower())
        y.append(tag)

model = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("clf", LogisticRegression(max_iter=1000))
])

model.fit(X, y)

with open("chatbot_model.pkl", "wb") as f:
    pickle.dump(
        {
            "model": model,
            "responses": responses
        },
        f
    )

print("New chatbot model created successfully.")