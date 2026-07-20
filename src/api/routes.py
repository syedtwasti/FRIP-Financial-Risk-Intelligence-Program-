from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import create_engine, text
from src.models.fraud_model import predict_fraud
from src.models.tax_model import predict_tax_risk
from src.models.risk_engine import compute_unified_risk
import random, pandas as pd

router = APIRouter()
DB_URL = 'sqlite:///frip.db'
engine = create_engine(DB_URL)

class Transaction(BaseModel):
    user_id: int
    amount: float
    location: str
    device: str
    hour: int

class TaxProfile(BaseModel):
    user_id: int
    income: float
    spending: float
    assets: int
    vehicles: int
    lifestyle_score: float

@router.post('/fraud/score')
def score_fraud(tx: Transaction):
    score = predict_fraud(tx.dict())
    return {'user_id':tx.user_id,'fraud_score':score,'fraud_flag':1 if score>0.5 else 0,
            'risk_level':'HIGH' if score>0.7 else 'MEDIUM' if score>0.4 else 'LOW'}

@router.post('/tax/score')
def score_tax(profile: TaxProfile):
    score = predict_tax_risk(profile.dict())
    return {'user_id':profile.user_id,'tax_risk_score':score,'tax_evasion_flag':1 if score>0.5 else 0}

@router.get('/stats/overview')
def get_overview():
    with engine.connect() as conn:
        total_tx = conn.execute(text('SELECT COUNT(*) FROM fraud_results')).scalar() or 0
        fraud_alerts = conn.execute(text('SELECT COUNT(*) FROM fraud_results WHERE fraud_flag=1')).scalar() or 0
        return {'total_transactions': total_tx, 'fraud_alerts': fraud_alerts}

@router.get('/demo/live-transactions')
def get_live_transactions(limit: int = 10):
    """Generate new simulated transactions with real-time fraud detection"""
    from datetime import datetime
    cities = ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Multan']
    devices = ['Android', 'iPhone', 'Windows PC', 'iPad']
    results = []
    
    with engine.connect() as conn:
        for _ in range(limit):
            # 12% fraud rate
            is_fraud = random.random() < 0.12
            
            # Generate transaction
            tx = {
                'user_id': random.randint(1, 2000),
                'amount': round(random.uniform(80000, 200000) if is_fraud else random.uniform(100, 50000), 2),
                'location': random.choice(cities),
                'device': random.choice(devices),
                'hour': random.choice([1, 2, 3, 23]) if is_fraud else random.randint(8, 22)
            }
            
            # Predict fraud
            score = predict_fraud(tx)
            fraud_flag = 1 if score > 0.5 else 0
            risk_level = 'CRITICAL' if score >= 0.75 else 'HIGH' if score >= 0.5 else 'MEDIUM' if score >= 0.25 else 'LOW'
            
            # Save to database
            try:
                conn.execute(text("""
                    INSERT INTO fraud_results (user_id, amount, location, device, hour, fraud_score, fraud_flag, risk_level, processed_at)
                    VALUES (:user_id, :amount, :location, :device, :hour, :fraud_score, :fraud_flag, :risk_level, :processed_at)
                """), {
                    'user_id': tx['user_id'],
                    'amount': tx['amount'],
                    'location': tx['location'],
                    'device': tx['device'],
                    'hour': tx['hour'],
                    'fraud_score': score,
                    'fraud_flag': fraud_flag,
                    'risk_level': risk_level,
                    'processed_at': datetime.now()
                })
            except Exception as e:
                print(f"Error inserting transaction: {e}")
            
            results.append({
                **tx,
                'fraud_score': round(score, 4),
                'fraud_flag': fraud_flag,
                'risk_level': risk_level
            })
        
        try:
            conn.commit()
        except Exception as e:
            print(f"Error committing: {e}")
    
    return results

@router.get('/alerts/fraud')
def get_fraud_alerts(limit: int = 20):
    """Get recent fraud alerts from database"""
    with engine.connect() as conn:
        try:
            rows = conn.execute(text(f"""
                SELECT user_id, amount, location, device, hour, fraud_score, fraud_flag, risk_level, processed_at 
                FROM fraud_results 
                WHERE fraud_flag = 1
                ORDER BY processed_at DESC 
                LIMIT {limit}
            """))
            return [dict(r._mapping) for r in rows]
        except Exception as e:
            print(f"Error fetching alerts: {e}")
            return []

@router.get('/profiles/high-risk')
def get_high_risk_profiles(limit: int = 20):
    """Get high-risk tax profiles from database"""
    with engine.connect() as conn:
        try:
            rows = conn.execute(text(f"""
                SELECT user_id, income, spending, assets, vehicles, lifestyle_score, tax_risk_score, tax_evasion_flag, processed_at
                FROM tax_risk_profiles
                ORDER BY tax_risk_score DESC
                LIMIT {limit}
            """))
            return [dict(r._mapping) for r in rows]
        except Exception as e:
            print(f"Error fetching profiles: {e}")
            return []

