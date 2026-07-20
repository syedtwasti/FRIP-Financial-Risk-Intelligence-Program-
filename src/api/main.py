from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import router
from sqlalchemy import create_engine, text
import os

app = FastAPI(title='FRIP API', version='1.0.0')
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['*'], allow_headers=['*'])
app.include_router(router, prefix='/api/v1')

# Initialize database tables on startup
def init_db():
    """Initialize database tables if they don't exist"""
    DB_URL = 'sqlite:///frip.db'
    engine = create_engine(DB_URL)
    try:
        with engine.connect() as conn:
            # Create fraud_results table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS fraud_results (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    amount REAL,
                    location VARCHAR(50),
                    device VARCHAR(50),
                    hour INTEGER,
                    fraud_score REAL,
                    fraud_flag INTEGER,
                    risk_level VARCHAR(10),
                    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            
            # Create tax_risk_profiles table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS tax_risk_profiles (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    income REAL,
                    spending REAL,
                    assets INTEGER,
                    vehicles INTEGER,
                    lifestyle_score REAL,
                    tax_risk_score REAL,
                    tax_evasion_flag INTEGER,
                    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            conn.commit()
        print("✓ Database tables initialized successfully")
    except Exception as e:
        print(f"⚠ Database initialization error: {e}")

# Initialize database on startup
init_db()

@app.get('/')
def root(): return {'status': 'FRIP API running', 'docs': '/docs'}