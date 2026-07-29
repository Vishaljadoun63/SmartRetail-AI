import pickle
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

X = [
    # Positive
    "good product",
    "excellent product",
    "excellent quality",
    "very nice",
    "nice product",
    "the product is nice",
    "awesome",
    "amazing",
    "fantastic",
    "love this",
    "happy with purchase",
    "worth buying",
    "best product",
    "works perfectly",

    # Negative
    "bad product",
    "poor quality",
    "terrible",
    "worst product",
    "hate this",
    "very bad",
    "waste of money",
    "not good",
    "doesn't work",
    "broken product",
    "disappointed",

    # Neutral
    "average product",
    "okay",
    "fine",
    "normal",
    "acceptable",
    "not bad",
    "it's okay",
    "average quality"
]

y = [
    # Positive (14)
    "positive",
    "positive",
    "positive",
    "positive",
    "positive",
    "positive",
    "positive",
    "positive",
    "positive",
    "positive",
    "positive",
    "positive",
    "positive",
    "positive",

    # Negative (11)
    "negative",
    "negative",
    "negative",
    "negative",
    "negative",
    "negative",
    "negative",
    "negative",
    "negative",
    "negative",
    "negative",

    # Neutral (8)
    "neutral",
    "neutral",
    "neutral",
    "neutral",
    "neutral",
    "neutral",
    "neutral",
    "neutral"
]

pipeline = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("classifier", LogisticRegression(max_iter=1000))
])

pipeline.fit(X, y)

print("Training Accuracy:", pipeline.score(X, y))

with open("sentiment_model.pkl", "wb") as f:
    pickle.dump(pipeline, f)

print("Model saved successfully!")