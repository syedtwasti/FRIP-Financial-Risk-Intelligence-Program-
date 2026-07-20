import pandas as pd, numpy as np, joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import classification_report

def train_fraud_model():
    df = pd.read_csv('data/synthetic/transactions.csv')
    le_loc = LabelEncoder()
    le_dev = LabelEncoder()
    df['location_enc'] = le_loc.fit_transform(df['location'])
    df['device_enc']   = le_dev.fit_transform(df['device'])
    features = ['amount','hour','location_enc','device_enc','user_id']
    X, y = df[features], df['is_fraud']
    X_train,X_test,y_train,y_test = train_test_split(X,y,test_size=0.2,random_state=42,stratify=y)
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test  = scaler.transform(X_test)
    model = RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)
    print(classification_report(y_test, model.predict(X_test)))
    joblib.dump({'model':model,'scaler':scaler,'le_loc':le_loc,'le_dev':le_dev}, 'src/models/fraud_model.pkl')
    print('Saved: src/models/fraud_model.pkl')

def predict_fraud(tx: dict, bundle=None):
    b = bundle or joblib.load('src/models/fraud_model.pkl')
    try: loc = b['le_loc'].transform([tx['location']])[0]
    except: loc = 0
    try: dev = b['le_dev'].transform([tx['device']])[0]
    except: dev = 0
    X = [[tx['amount'], tx['hour'], loc, dev, tx['user_id']]]
    X_sc = b['scaler'].transform(X)
    return round(float(b['model'].predict_proba(X_sc)[0][1]), 4)

if __name__ == '__main__': train_fraud_model()
