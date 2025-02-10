from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# Example Fraud Alert Message
fraud_message = {
    "transaction_id": "TXN123456",
    "user_id": "USER789",
    "amount": 1000.0,
    "status": "fraud_detected"
}

producer.send('fraud-alerts', fraud_message)
producer.flush()

print("Fraud alert message sent!")
