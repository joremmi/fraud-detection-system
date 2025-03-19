# tests/test_integration.py
import sys
import os
from pathlib import Path
import time
import uuid
from unittest.mock import patch

# Add the project root directory to the Python path
project_root = Path(__file__).parent.parent.parent
sys.path.append(str(project_root))

from backend.app.main import app
from fastapi.testclient import TestClient
import pytest
from backend.database.connection import get_db_connection

client = TestClient(app)

@pytest.fixture(autouse=True)
def create_dummy_user():
    unique_email = f"test_{uuid.uuid4()}@example.com"
    
    # Insert a dummy user
    conn = get_db_connection()
    cursor = conn.cursor()
    user_id = None
    try:
        cursor.execute(
            """
            INSERT INTO fraud_schema.users (name, email, password_hash) 
            VALUES (%s, %s, %s) 
            RETURNING id
            """, 
            ('Test User', unique_email, 'dummy_password_hash')
        )
        user_id = cursor.fetchone()[0]
        conn.commit()
    finally:
        cursor.close()
        conn.close()

    yield user_id  # Provide the user_id to the test

    # Cleanup after test
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM fraud_schema.users WHERE id = %s", (user_id,))
        conn.commit()
    finally:
        cursor.close()
        conn.close()

@pytest.fixture
def auth_headers(create_dummy_user):
    # Create a mock JWT token that includes the test user_id
    mock_token = f"test_token_{create_dummy_user}"
    return {"Authorization": f"Bearer {mock_token}"}

@patch('backend.app.main.model.predict')
def test_validate_transaction_success(mock_predict, auth_headers, create_dummy_user):
    # Mock the model prediction to return [0] (not fraud)
    mock_predict.return_value = [0]
    
    transaction_data = {
        "V1": 0.1,
        "V2": -0.2,
        "V3": 0.3,
        "V4": -0.4,
        "V5": 0.5,
        "V6": -0.6,
        "V7": 0.7,
        "V8": -0.8,
        "V9": 0.9,
        "V10": -1.0,
        "V11": 1.1,
        "V12": -1.2,
        "V13": 1.3,
        "V14": -1.4,
        "V15": 1.5,
        "V16": -1.6,
        "V17": 1.7,
        "V18": -1.8,
        "V19": 1.9,
        "V20": -2.0,
        "V21": 2.1,
        "V22": -2.2,
        "V23": 2.3,
        "V24": -2.4,
        "V25": 2.5,
        "V26": -2.6,
        "V27": 2.7,
        "V28": -2.8,
        "Amount": 150.0,
    }
    
    response = client.post(
        "/validate-transaction", 
        json=transaction_data,
        headers=auth_headers
    )
    
    if response.status_code != 200:
        print("Error response:", response.json())  # Add this for debugging
    
    assert response.status_code == 200
    json_data = response.json()
    assert "transaction_id" in json_data
    assert json_data["status"] in ["approved", "flagged"]

def test_get_transactions():
    response = client.get("/transactions")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_get_fraud_metrics():
    response = client.get("/fraud-metrics")
    assert response.status_code == 200
    data = response.json()
    assert "total_transactions" in data
    assert "fraud_detected" in data
    assert "fraud_prevented" in data
    assert "amount_saved" in data
