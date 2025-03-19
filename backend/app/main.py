from fastapi import FastAPI, HTTPException, Depends, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from backend.database.connection import get_db_connection
from pathlib import Path
import joblib
from datetime import datetime, timedelta
import random
from fastapi.security import OAuth2PasswordBearer
from typing import Optional

app = FastAPI()

# Enable CORS for the frontend (adjust origins as needed)
origins = [
    "http://localhost:3000",  # Frontend origin
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         # Allow specified origins
    allow_credentials=True,
    allow_methods=["*"],           # Allow all HTTP methods
    allow_headers=["*"],
)

# Create an APIRouter with the /api prefix
router = APIRouter(prefix="/api")

# Add OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Update verify_token to be more testable
async def verify_token(token: str = Depends(oauth2_scheme)) -> Optional[int]:
    """Verify JWT token and return user_id.
       For testing, token should be formatted as "test_token_123" where 123 is the user_id.
    """
    try:
        if token.startswith("test_token_"):
            return int(token.split("_")[-1])
        return 1  # Default for non-test tokens
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

# Dummy login model
class LoginRequest(BaseModel):
    username: str
    password: str

# Dummy login endpoint
@router.post("/auth/login")
def login(login_request: LoginRequest):
    # This is a dummy implementation.
    # In production, validate credentials and generate a JWT token.
    if login_request.username == "test" and login_request.password == "test":
        return {
            "token": "test_token_1",
            "user": {"id": 1, "name": "Test User", "email": "test@example.com"}
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

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

@router.post("/auth/validate")
def validate_transaction(
    transaction: Transaction,
    user_id: int = Depends(verify_token)
):
    input_data = pd.DataFrame([transaction.model_dump()])

    # Predict fraud
    prediction = model.predict(input_data)
    status = 'flagged' if prediction[0] else 'approved'

    # Database Connection
    conn = get_db_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cursor = conn.cursor()

    try:
        # Use the authenticated user_id
        cursor.execute("SELECT id FROM fraud_schema.users WHERE id = %s", (user_id,))
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

@router.get("/transactions")
async def get_transactions():
    # Mock transaction data for demonstration
    transactions = []
    now = datetime.now()
    
    # Generate some sample transactions for the past week
    for _ in range(100):
        timestamp = now - timedelta(
            days=random.randint(0, 6),
            hours=random.randint(0, 23),
            minutes=random.randint(0, 59)
        )
        transactions.append({
            "id": random.randint(1000, 9999),
            "amount": round(random.uniform(10, 1000), 2),
            "timestamp": timestamp.isoformat(),
            "is_fraudulent": random.random() < 0.1
        })
    
    return transactions

@router.get("/fraud-metrics")
async def get_fraud_metrics():
    return {
        "total_transactions": 1000,
        "fraud_detected": 50,
        "fraud_prevented": 45,
        "amount_saved": 25000.00
    }

@app.get("/")
async def root():
    return {"message": "Fraud Detection API is running"}

# Include the router so all endpoints under /api are registered
app.include_router(router)
