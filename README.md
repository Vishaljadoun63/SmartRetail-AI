# 🛍️ SmartRetail AI – AI-Powered Retail Intelligence Platform

SmartRetail AI is a full-stack AI-powered retail management platform that helps businesses analyze customer behavior, automate product recognition, understand customer sentiment, and gain actionable insights through an interactive analytics dashboard.

The platform combines Computer Vision, Natural Language Processing, Machine Learning, and Modern Web Technologies to create a complete retail intelligence solution.

---

# 🚀 Features

### 📊 Analytics Dashboard
- Interactive business dashboard
- Customer statistics
- Sentiment overview
- Store performance insights
- Activity summaries

### 👥 Customer Management
- View and manage customer records
- Track returning customers
- Customer visit history

### ⭐ Review Management
- View customer reviews
- Analyze feedback
- Manage review database

### 😊 Sentiment Analysis
- AI-powered sentiment prediction
- Positive / Neutral / Negative classification
- NLP-based review analysis

### 🛒 Product Classification
- Upload product images
- AI classifies products using a Hugging Face Vision Transformer (ViT)
- Fast image inference

### 🤖 SmartRetail AI Assistant
- Interactive AI chatbot
- Answers retail-related queries
- Provides analytics assistance
- Business insights and recommendations

### 👤 Face Recognition
- Detect and recognize returning customers
- Customer authentication using computer vision

### 🔐 Secure Authentication
- JWT Authentication
- Protected dashboard
- Secure login system

---

# 🛠 Technology Stack

## Frontend
- React.js (Vite)
- Tailwind CSS
- Framer Motion
- Axios
- React Router DOM
- Chart.js
- Lucide React

## Backend
- FastAPI
- Python
- Uvicorn
- Pydantic
- JWT Authentication

## Database
- MongoDB

## Artificial Intelligence
- Hugging Face Transformers
- Vision Transformer (ViT)
- Scikit-learn
- OpenCV
- face_recognition (dlib)
- Natural Language Processing

---

# 📂 Project Structure

```
smart-retail-ai/
│
├── backend/
│   ├── api/
│   ├── core/
│   ├── database/
│   ├── ml_models/
│   ├── schemas/
│   ├── tests/
│   └── main.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── ml_training/
│
├── docker-compose.yml
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/SmartRetail-AI.git

cd SmartRetail-AI
```

---

## Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend runs on:

```
http://localhost:8000
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

# 🐳 Docker

```bash
docker-compose up --build
```

---

# 🔮 Future Improvements

- Real-time Analytics
- Sales Forecasting
- Inventory Prediction
- Recommendation System
- Multi-store Management
- Cloud Deployment (AWS/Azure)
- Mobile Application

---

# 👨‍💻 Author

**Vishal Jadoun**

B.Tech Electronics & Communication Engineering

VIT Bhopal University

---

# ⭐ If you like this project

Please consider giving the repository a ⭐ on GitHub.
