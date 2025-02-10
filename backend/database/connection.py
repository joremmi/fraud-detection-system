import psycopg2
from backend.app.config import DB_CONFIG  # Ensure this is correctly set

def get_db_connection():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except psycopg2.Error as e:
        print(f"Database connection error: {e}")
        return None
