from src.models.fraud_model import predict_fraud
from src.models.tax_model import predict_tax_risk

def compute_unified_risk(tx: dict, tax_profile: dict) -> dict:
    fraud = predict_fraud(tx)
    tax   = predict_tax_risk(tax_profile)
    composite = round((0.6 * fraud + 0.4 * tax) * 100, 2)
    level = 'CRITICAL' if composite>=75 else 'HIGH' if composite>=50 else 'MEDIUM' if composite>=25 else 'LOW'
    return {'fraud_score':fraud,'tax_risk_score':tax,'composite_score':composite,'risk_level':level}
