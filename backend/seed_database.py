from pymongo import MongoClient
from datetime import datetime, timedelta
import random

client = MongoClient("mongodb://localhost:27017")
db = client["smart_retail_db"]

customers = db["customers"]
reviews = db["reviews"]
visit_logs = db["visit_logs"]
chat_logs = db["chat_logs"]

# Clear old demo data (optional)
customers.delete_many({})
visit_logs.delete_many({})
chat_logs.delete_many({})

demo_customers = [
    {"name": "Vishal Jadoun", "visit_count": 12},
    {"name": "Rahul Sharma", "visit_count": 8},
    {"name": "Priya Singh", "visit_count": 5},
    {"name": "Amit Verma", "visit_count": 15},
    {"name": "Neha Gupta", "visit_count": 9},
    {"name": "Rohan Patel", "visit_count": 4},
    {"name": "Sneha Kapoor", "visit_count": 11},
    {"name": "Arjun Mehta", "visit_count": 6},
    {"name": "Karan Singh", "visit_count": 3},
    {"name": "Anjali Sharma", "visit_count": 10},
]

for customer in demo_customers:
    created = datetime.now() - timedelta(days=random.randint(10, 60))
    last_visit = datetime.now() - timedelta(days=random.randint(0, 5))

    customer_doc = {
        "name": customer["name"],
        "visit_count": customer["visit_count"],
        "created_at": created,
        "last_visit": last_visit,
        "face_encoding": []   # placeholder
    }

    result = customers.insert_one(customer_doc)

    for i in range(customer["visit_count"]):
        visit_logs.insert_one({
            "customer_id": result.inserted_id,
            "timestamp": created + timedelta(days=i),
            "type": "returning" if i > 0 else "new"
        })

print("Demo customers inserted successfully!")