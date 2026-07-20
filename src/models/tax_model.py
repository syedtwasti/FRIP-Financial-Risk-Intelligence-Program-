import pandas as pd, joblib, xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.preprocessing import StandardScaler

def train_tax_model():
    df = pd.read_csv('data/synthetic/tax_profiles.csv')
    features = ['income','spending','assets','vehicles','lifestyle_score']
    X, y = df[features], df['tax_evasion_risk']
    X_train,X_test,y_train,y_test = train_test_split(X,y,test_size=0.2,random_state=42,stratify=y)
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test  = scaler.transform(X_test)
    model = xgb.XGBClassifier(n_estimators=200, max_depth=6, learning_rate=0.05,
        scale_pos_weight=2, random_state=42, eval_metric='logloss')
    model.fit(X_train, y_train)
    print(classification_report(y_test, model.predict(X_test)))
    joblib.dump({'model':model,'scaler':scaler,'features':features}, 'src/models/tax_model.pkl')
    print('Saved: src/models/tax_model.pkl')

def predict_tax_risk(profile: dict, bundle=None):
    b = bundle or joblib.load('src/models/tax_model.pkl')
    X = [[profile.get(f,0) for f in b['features']]]
    X_sc = b['scaler'].transform(X)
    return round(float(b['model'].predict_proba(X_sc)[0][1]), 4)

if __name__ == '__main__': train_tax_model()
