import psycopg2
from psycopg2 import sql
from sqlalchemy import create_engine, text
import pandas as pd

DB_URL = 'sqlite:///frip.db'

def create_tables():
    engine = create_engine(DB_URL)
    with engine.connect() as conn:
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
    print("Tables created successfully.")

def populate_sample_data():
    engine = create_engine(DB_URL)
    # Load synthetic data
    tx_df = pd.read_csv('data/synthetic/transactions.csv')
    tax_df = pd.read_csv('data/synthetic/tax_profiles.csv')
    
    with engine.connect() as conn:
        # Insert fraud results (simulate processed transactions)
        for _, row in tx_df.sample(1000).iterrows():  # Sample 1000 for demo
            conn.execute(text("""
                INSERT INTO fraud_results (user_id, amount, location, device, hour, fraud_score, fraud_flag, risk_level)
                VALUES (:user_id, :amount, :location, :device, :hour, :fraud_score, :fraud_flag, :risk_level)
            """), {'user_id': int(row['user_id']), 'amount': float(row['amount']), 'location': row['location'], 'device': row['device'], 'hour': int(row['hour']), 
                   'fraud_score': 0.8 if row['is_fraud'] else 0.2, 'fraud_flag': int(row['is_fraud']), 'risk_level': 'HIGH' if row['is_fraud'] else 'LOW'})
        
        # Insert tax profiles
        for _, row in tax_df.iterrows():
            conn.execute(text("""
                INSERT INTO tax_risk_profiles (user_id, income, spending, assets, vehicles, lifestyle_score, tax_risk_score, tax_evasion_flag)
                VALUES (:user_id, :income, :spending, :assets, :vehicles, :lifestyle_score, :tax_risk_score, :tax_evasion_flag)
            """), {'user_id': int(row['user_id']), 'income': float(row['income']), 'spending': float(row['spending']), 'assets': int(row['assets']), 
                   'vehicles': int(row['vehicles']), 'lifestyle_score': float(row['lifestyle_score']), 'tax_risk_score': 0.7 if row['tax_evasion_risk'] else 0.3, 'tax_evasion_flag': int(row['tax_evasion_risk'])})
        
        conn.commit()
    print("Sample data populated.")

if __name__ == '__main__':
    create_tables()
    populate_sample_data()