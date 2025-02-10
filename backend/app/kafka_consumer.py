from kafka import KafkaConsumer, KafkaProducer
import json
import joblib
import numpy as np

consumer = KafkaConsumer(
    "transactions",
    bootstrap_servers="localhost:9092",
    value_deserializer=lambda v: json.loads(v.decode("utf-8"))
)

producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

# Load the trained fraud detection model
model = joblib.load("backend/models/fraud_detection_model.pkl")

def process_transactions():
    for message in consumer:
        transaction = message.value
        features = np.array([list(transaction.values())]).reshape(1, -1)

        prediction = model.predict(features)[0]
        if prediction == 1:  # Fraud detected
            producer.send("fraud-alerts", transaction)
            print("Fraud detected:", transaction)
