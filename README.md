# AI-Powered Smart Retail & Customer Intelligence Platform

Welcome to the **Smart Retail AI** capstone project. This platform integrates cutting-edge Machine Learning and Web Technologies to provide retail businesses with automated customer insights, face recognition, product classification, sentiment analysis, and conversational AI support.

## 🚀 Features

1.  **Face Recognition Authentication**: Automatically identify returning customers as they walk in via webcam. 
2.  **Product Classification**: Upload product images to classify them using a pre-trained MobileNetV2 architecture.
3.  **Sentiment Analysis**: Analyze the sentiment of customer reviews (Positive/Negative/Neutral) using NLP.
4.  **AI FAQ Chatbot**: A hybrid rule-based/ML chatbot to automatically answer customer queries.
5.  **Analytics Dashboard**: Visual dashboard for admins using Chart.js, summarizing total visits, sentiments, and interactions.

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite), Tailwind CSS (Glassmorphism UI), Framer Motion, Axios, React Router, Chart.js
- **Backend**: FastAPI (Python 3.12), Pydantic, Uvicorn, JWT Auth
- **Database**: MongoDB (Motor Asyncio)
- **Machine Learning**: TensorFlow/Keras, `face_recognition` (dlib), Scikit-Learn, OpenCV
- **Deployment**: Docker, Docker Compose

## 📦 Project Structure

```
smart-retail-ai/
├── backend/            # FastAPI application and APIs
│   ├── api/            # API routers (auth, ml_services, dashboard)
│   ├── core/           # Security, Config, JWT
│   ├── database/       # MongoDB connection
│   ├── ml_models/      # Inference logic and saved models (.pkl, .h5)
│   ├── schemas/        # Pydantic data validation
│   └── main.py         # Entry point
├── frontend/           # React frontend (Vite)
│   ├── src/
│   │   ├── components/ # Reusable UI (Sidebar, Layout)
│   │   ├── pages/      # All route components (Login, Dashboard, ML pages)
│   │   └── services/   # Axios configuration
│   └── index.css       # Tailwind & Glassmorphism styles
├── ml_training/        # Scripts to train and generate initial ML models
└── docker-compose.yml  # Container orchestration
```

## ⚙️ Initial Setup & ML Model Generation

Because this repository contains ML features, you must first generate the dummy/initial models before starting the backend, or they will be missing during API initialization.

1.  Navigate to `ml_training/`.
2.  Ensure you have python dependencies installed locally (`pip install -r ../backend/requirements.txt`).
3.  Run the training scripts:
    ```bash
    python train_sentiment.py
    python train_chatbot.py
    python train_product_classifier.py
    ```
4.  This will populate the `backend/ml_models` folder with the required `.pkl` and `.h5` files.

## 🐳 Running with Docker (Recommended)

1. Ensure Docker and Docker Compose are installed.
2. At the root of the project (`smart-retail-ai`), run:
   ```bash
   docker-compose up --build
   ```
3. The platform is now live!
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **API Docs (Swagger)**: http://localhost:8000/api/v1/openapi.json

## 🎨 UI Design

The frontend utilizes a modern **Glassmorphism** and dark-mode aesthetic with ambient background gradients, implemented cleanly via Tailwind CSS. Micro-animations are powered by `framer-motion` for a premium user experience.

## 🔒 Security

- All API routes (except login) require JWT authentication.
- Passwords are hashed using bcrypt (`passlib`).
- MongoDB interactions use async I/O to ensure non-blocking, high-performance database querying.

## 📝 Authors
Generated as a complete B.Tech Capstone Project.
