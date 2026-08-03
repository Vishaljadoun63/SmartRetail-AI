FROM python:3.12-slim

WORKDIR /app

# Install system dependencies required for OpenCV and face_recognition
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgtk-3-dev \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Download NLTK and SpaCy models if required by the scripts in production
# RUN python -m nltk.downloader punkt stopwords wordnet
# RUN python -m spacy download en_core_web_sm

COPY . .

EXPOSE 8000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
