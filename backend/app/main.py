# backend/app/main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
from backend.database.connection import get_db_connection
from pathlib import Path
import joblib

app = FastAPI()

# Get the absolute path to the model
MODEL_PATH = Path(__file__).parent.parent / "models" / "fraud_detection_model.pkl"

# Load the trained model
model = joblib.load(MODEL_PATH)

class Transaction(BaseModel):
    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float
    V21: float
    V22: float
    V23: float
    V24: float
    V25: float
    V26: float
    V27: float
    V28: float
    Amount: float

@app.post("/validate-transaction")
def validate_transaction(transaction: Transaction):
    input_data = pd.DataFrame([transaction.dict()])

    # Predict fraud
    prediction = model.predict(input_data)
    status = 'flagged' if prediction[0] else 'approved'

    # Database Connection
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cursor = conn.cursor()

    try:
        # Ensure user exists (For now, assuming user_id=1)
        cursor.execute("SELECT id FROM fraud_schema.users WHERE id = %s", (1,))
        user = cursor.fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Insert transaction
        cursor.execute("""
            INSERT INTO fraud_schema.transactions (user_id, amount, location, status)
            VALUES (%s, %s, %s, %s) RETURNING id
        """, (user[0], transaction.Amount, 'Unknown', status))
        transaction_id = cursor.fetchone()[0]

        # Log fraud detection (if flagged)
        if status == 'flagged':
            cursor.execute("""
                INSERT INTO fraud_schema.fraud_logs (transaction_id, reason)
                VALUES (%s, %s)
            """, (transaction_id, 'Fraud predicted by model'))

        conn.commit()
        return {"transaction_id": transaction_id, "status": status}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cursor.close()
        conn.close()
 

@app.get("/")
async def root():
    return {"message": "Fraud Detection API is running"}
