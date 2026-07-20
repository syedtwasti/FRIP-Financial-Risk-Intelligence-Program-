import random, pandas as pd, numpy as np
from datetime import datetime, timedelta

random.seed(42)
np.random.seed(42)

CITIES = ['Lahore','Karachi','Islamabad','Faisalabad','Multan']
DEVICES = ['Android','iPhone','Windows PC','iPad','Unknown']

def generate_transactions(n=100000):
    records = []
    base_time = datetime(2024, 1, 1)
    for i in range(n):
        is_fraud = random.choices([0,1], weights=[95,5])[0]
        amount = round(random.uniform(80000,200000),2) if is_fraud else round(random.uniform(100,50000),2)
        hour = random.choice([1,2,3,23]) if is_fraud else random.randint(8,22)
        records.append({'user_id': random.randint(1,2000), 'amount': amount,
            'location': random.choice(CITIES), 'device': random.choice(DEVICES),
            'hour': hour, 'timestamp': base_time + timedelta(seconds=random.randint(0,31536000)),
            'is_fraud': is_fraud})
    return pd.DataFrame(records)

def generate_tax_profiles(n=5000):
    records = []
    for uid in range(1, n+1):
        income = random.randint(20000, 500000)
        spending = random.randint(15000, 700000)
        assets = random.randint(0,10)
        vehicles = random.randint(0,4)
        lifestyle = assets*10000 + vehicles*8000 + spending*0.1
        evasion = 1 if spending > income*1.5 or lifestyle > income*2 else 0
        records.append({'user_id': uid, 'income': income, 'spending': spending,
            'assets': assets, 'vehicles': vehicles,
            'lifestyle_score': round(lifestyle,2), 'tax_evasion_risk': evasion})
    return pd.DataFrame(records)

if __name__ == '__main__':
    tx = generate_transactions(100000)
    tx.to_csv('data/synthetic/transactions.csv', index=False)
    print(f'Transactions saved. Fraud rate: {tx.is_fraud.mean():.2%}')
    tax = generate_tax_profiles(5000)
    tax.to_csv('data/synthetic/tax_profiles.csv', index=False)
    print(f'Tax profiles saved. Evasion rate: {tax.tax_evasion_risk.mean():.2%}')