FROM python:3.9-slim

WORKDIR /app

# Install only essential build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copy and install only required packages
COPY ml_service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy only necessary files
COPY ml_service/app.py .
COPY models/fraud_detection_model.pkl ./models/

EXPOSE 5000
CMD ["python", "app.py"] 