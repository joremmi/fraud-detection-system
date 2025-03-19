# populate_transactions.py

from database.connection import get_db_connection
import random
from datetime import datetime, timedelta

def populate_sample_transactions():
    conn = get_db_connection()
    if conn is None:
        print("Failed to connect to the database.")
        return
    
    cursor = conn.cursor()
    
    # Sample transactions data
    # Assuming your transactions table has columns:
    # id (serial primary key), user_id, amount, location, status, and timestamp (defaulted to NOW() or similar)
    sample_transactions = [
        (1, 100.00, 'New York', 'approved'),
        (1, 250.50, 'Los Angeles', 'flagged'),
        (1, 75.00, 'Chicago', 'approved'),
        (1, 500.00, 'Houston', 'flagged'),
        (1, 90.25, 'Miami', 'approved'),
    ]
    
    insert_query = """
    INSERT INTO fraud_schema.transactions (user_id, amount, location, status, timestamp)
    VALUES (%s, %s, %s, %s, %s);
    """
    
    try:
        # Optionally, generate some randomized timestamps within the past week
        now = datetime.now()
        for txn in sample_transactions:
            # Randomize the timestamp over the past 7 days
            random_days = timedelta(days=random.randint(0, 6),
                                      hours=random.randint(0, 23),
                                      minutes=random.randint(0, 59))
            txn_timestamp = now - random_days
            cursor.execute(insert_query, (txn[0], txn[1], txn[2], txn[3], txn_timestamp))
        conn.commit()
        print("Sample transactions inserted successfully.")
    except Exception as e:
        conn.rollback()
        print(f"Error inserting sample transactions: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    populate_sample_transactions()
