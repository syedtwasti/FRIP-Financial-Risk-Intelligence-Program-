# Technical Requirements Document (TRD)
## FRIP - Financial Risk Intelligence Platform

**Version:** 1.0  
**Date:** April 22, 2026  
**Status:** Active Development  
**Target Environment:** Linux/Windows, Python 3.8+, Node.js 14+

---

## 1. Overview

This TRD specifies the technical architecture, system requirements, API specifications, data schemas, and deployment procedures for the FRIP platform. It serves as the authoritative technical reference for development, testing, and operations teams.

---

## 2. System Requirements

### 2.1 Hardware Requirements

#### Development Environment
- **CPU** — Quad-core processor (Intel i5/i7 or equivalent)
- **RAM** — 16GB minimum (8GB min for basic setup)
- **Storage** — 50GB SSD (20GB for code + dependencies + database)
- **Network** — Ethernet or WiFi with 10+ Mbps connectivity

#### Staging/Production Environment
- **CPU** — 8+ core processor for high-throughput transaction processing
- **RAM** — 32GB minimum for caching and model loading
- **Storage** — 500GB SSD (journaling filesystem recommended)
- **Network** — 100+ Mbps dedicated bandwidth
- **Backup** — Automated daily backups with 30-day retention

### 2.2 Software Requirements

#### Backend Runtime
- **Python** — 3.8 or 3.9 (3.10+ supported)
- **Virtual Environment** — venv or conda (isolated dependency management)
- **Package Manager** — pip (Python 3.8+)
- **Operating System** — Linux (Ubuntu 20.04+ recommended), Windows 10/11, macOS

#### Frontend Runtime
- **Node.js** — 14.0 or higher (16+ recommended)
- **npm** — 6.0 or higher (installed with Node.js)
- **Browser Support** — Chrome/Edge (latest), Firefox (latest), Safari 13+
- **Operating System** — Any OS supporting Node.js

#### Database
- **SQLite 3** — Development/staging (embedded, file-based)
- **PostgreSQL 12+** — Production (horizontal scalability, advanced features)
- **Connection Method** — SQLAlchemy ORM with SQLite dialect for dev, PostgreSQL dialect for prod

#### Development Tools
- **Git** — Version control (2.20+)
- **VS Code** — Recommended editor with Python + ESLint extensions
- **Postman/Insomnia** — API testing and documentation
- **Docker** — Optional containerization for consistent environments

---

## 3. Technology Stack Specifications

### 3.1 Backend Stack

#### FastAPI 0.110.0
```python
# Purpose: Modern async web framework with automatic OpenAPI documentation
# Features:
# - Type hints for request/response validation
# - Automatic Swagger UI at /docs
# - Supports WebSockets and streaming
# - Built-in CORS support
# Installation: pip install fastapi==0.110.0
# Configuration: Created in src/api/main.py
```

#### SQLAlchemy 2.0.29
```python
# Purpose: ORM for database abstraction and query building
# Features:
# - Connection pooling for performance
# - Lazy loading and eager loading strategies
# - Transaction management
# - Support for multiple database backends
# Configuration: DB_URL = 'sqlite:///frip.db'
# Dialects: sqlite (dev), postgresql (prod)
```

#### Scikit-learn 1.4.1
```python
# Purpose: Machine learning library for fraud detection
# Model: RandomForestClassifier
# Features used: user_id, amount, location, device, hour
# Preprocessing: StandardScaler + LabelEncoder
# Serialization: joblib (fraud_model.pkl)
# Accuracy: 85%+ on validation set
```

#### XGBoost 2.0.3
```python
# Purpose: Gradient boosting library for tax risk assessment
# Model: XGBClassifier
# Features used: income, spending, assets, vehicles, lifestyle_score
# Preprocessing: StandardScaler normalization
# Serialization: joblib (tax_model.pkl)
# Accuracy: 82%+ on validation set
```

#### Uvicorn 0.29.0
```python
# Purpose: ASGI web server
# Features:
# - Async request handling
# - Hot reload in development (--reload flag)
# - Multiple workers for production
# - Configuration: 1 worker for dev, 4+ workers for prod
# Command: python -m uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000
```

### 3.2 Frontend Stack

#### React 19.2.4
```javascript
// Purpose: Component-based UI library
// Features:
// - Functional components with hooks (useState, useEffect, useCallback)
// - Context API for state management (no Redux)
// - Server-side rendering ready
// - Strict mode for development debugging
// Installation: npm install react@19.2.4 react-dom@19.2.4
```

#### Vite 8.0.8
```javascript
// Purpose: Fast build tool and dev server
// Features:
// - Hot Module Replacement (HMR) for instant updates
// - Lightning-fast builds (<5s)
// - ES Module support
// - Code splitting and lazy loading
// Configuration: vite.config.js in frontend/
// Dev Server: npm run dev (localhost:5173)
// Build: npm run build (output: dist/)
```

#### Recharts 3.8.1
```javascript
// Purpose: React charting library built on D3.js
// Components Used:
// - AreaChart (Real-Time Transaction Volume)
// - LineChart (Fraud Risk Trend)
// - BarChart (Fraud Alerts by City)
// - PieChart (optional for future features)
// - Tooltip, CartesianGrid, XAxis, YAxis, Legend
// Configuration: Responsive containers with percentage heights/widths
```

#### Leaflet + react-leaflet
```javascript
// Purpose: Interactive mapping library
// Features:
// - OpenStreetMap tiles (free, no API key required)
// - CircleMarker overlays for city fraud visualization
// - Zoom and pan controls
// - PopUp annotations
// Data: CITY_COORDS constant with lat/long for 5 cities
// Installation: npm install leaflet@1.9.4 react-leaflet@4.2.1
```

#### Lucide-react
```javascript
// Purpose: Icon library for UI elements
// Icons Used:
// - ShieldAlert, AlertTriangle, CheckCircle (status)
// - TrendingUp, TrendingDown (trends)
// - Activity, Users, Database (categories)
// - Bell, Search, Map, Settings (actions)
// Installation: npm install lucide-react@0.263.1
```

#### Axios 1.15.0
```javascript
// Purpose: HTTP client for API communication
// Features:
// - Request/response interceptors
// - Automatic JSON serialization
// - Timeout handling
// - Error handling with .catch()
// Base URL: http://localhost:8000/api/v1
// Timeout: 4000-5000ms for frontend calls
```

### 3.3 Supporting Libraries

#### Backend Dependencies
```
pandas==2.0.2           # Data manipulation for CSV loading
joblib==1.3.2          # Model serialization/deserialization
psycopg2-binary==2.9.6 # PostgreSQL adapter (for production)
python-dotenv==1.0.0   # Environment variable management
```

#### Frontend Dependencies
```
@vitejs/plugin-react==4.0.1  # React plugin for Vite
eslint==8.40.0              # Code linting
prettier==2.8.8             # Code formatting
```

---

## 4. API Specification

### 4.1 Base URL
```
Development:  http://localhost:8000/api/v1
Staging:      https://staging.frip.local/api/v1
Production:   https://api.frip.local/api/v1
```

### 4.2 Authentication
- **Current** — No authentication (CORS wildcard for localhost development)
- **Future** — JWT tokens with refresh mechanism
- **Endpoints** — Will be added in Phase 3 (Compliance)

### 4.3 Endpoints Specification

#### POST /fraud/score
Scores a single transaction for fraud risk.

**Request Body:**
```json
{
  "user_id": 42,
  "amount": 150000.00,
  "location": "Karachi",
  "device": "iPhone",
  "hour": 14
}
```

**Response:**
```json
{
  "user_id": 42,
  "fraud_score": 0.3456,
  "fraud_flag": 0,
  "risk_level": "LOW"
}
```

**Status Codes:**
- `200 OK` — Scoring successful
- `422 Unprocessable Entity` — Invalid input schema
- `500 Internal Server Error` — Model prediction failed

**Latency SLA:** <100ms

---

#### POST /tax/score
Scores a customer profile for tax evasion risk.

**Request Body:**
```json
{
  "user_id": 2034,
  "income": 850000.00,
  "spending": 2100000.00,
  "assets": 8,
  "vehicles": 3,
  "lifestyle_score": 0.92
}
```

**Response:**
```json
{
  "user_id": 2034,
  "tax_risk_score": 0.7834,
  "tax_evasion_flag": 1
}
```

**Status Codes:**
- `200 OK` — Scoring successful
- `422 Unprocessable Entity` — Invalid input schema
- `500 Internal Server Error` — Model prediction failed

**Latency SLA:** <150ms

---

#### GET /stats/overview
Retrieves high-level statistics.

**Query Parameters:** None

**Response:**
```json
{
  "total_transactions": 1020,
  "fraud_alerts": 51
}
```

**Status Codes:**
- `200 OK` — Data retrieved successfully
- `500 Internal Server Error` — Database connection failed

**Cache Policy:** Cache for 5 seconds on frontend (optional)

---

#### GET /demo/live-transactions?limit=10
Generates and returns new simulated transactions with fraud scoring.

**Query Parameters:**
- `limit` (integer, default=10) — Number of transactions to generate

**Response:**
```json
[
  {
    "user_id": 1234,
    "amount": 125000.00,
    "location": "Lahore",
    "device": "Android",
    "hour": 2,
    "fraud_score": 0.7845,
    "fraud_flag": 1,
    "risk_level": "HIGH"
  },
  ...
]
```

**Behavior:**
- Generates new transactions on each call
- Saves to `fraud_results` table automatically
- Returns transactions + database IDs

**Status Codes:**
- `200 OK` — Transactions generated and saved
- `500 Internal Server Error` — Generation or save failed

**Important:** This endpoint is called every 3 seconds by the frontend. Each call inserts `limit` new records into the database.

---

#### GET /alerts/fraud?limit=20
Retrieves recent fraud alerts from the database.

**Query Parameters:**
- `limit` (integer, default=20) — Number of alerts to return

**Response:**
```json
[
  {
    "user_id": 1567,
    "amount": 125000.00,
    "location": "Lahore",
    "device": "iPhone",
    "hour": 2,
    "fraud_score": 0.7845,
    "fraud_flag": 1,
    "risk_level": "HIGH",
    "processed_at": "2026-04-22T14:32:15"
  },
  ...
]
```

**Status Codes:**
- `200 OK` — Alerts retrieved successfully
- `500 Internal Server Error` — Database query failed

---

#### GET /profiles/high-risk?limit=20
Retrieves high-risk tax profiles sorted by risk score.

**Query Parameters:**
- `limit` (integer, default=20) — Number of profiles to return

**Response:**
```json
[
  {
    "user_id": 2034,
    "income": 850000.00,
    "spending": 2100000.00,
    "assets": 8,
    "vehicles": 3,
    "lifestyle_score": 0.92,
    "tax_risk_score": 0.7834,
    "tax_evasion_flag": 1,
    "processed_at": "2026-04-22T14:30:00"
  },
  ...
]
```

**Status Codes:**
- `200 OK` — Profiles retrieved successfully
- `500 Internal Server Error` — Database query failed

---

### 4.4 Error Handling

**Standard Error Response:**
```json
{
  "detail": "Error message describing what went wrong",
  "status_code": 500
}
```

**Client Error Responses:**
- `400 Bad Request` — Malformed request syntax
- `422 Unprocessable Entity` — Request body doesn't match schema
- `429 Too Many Requests` — Rate limit exceeded (future)

**Server Error Responses:**
- `500 Internal Server Error` — Unhandled exception
- `503 Service Unavailable` — Database unreachable

---

## 5. Database Schema

### 5.1 SQLite Schema (Development)

#### fraud_results Table
```sql
CREATE TABLE IF NOT EXISTS fraud_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    location VARCHAR(50),
    device VARCHAR(50),
    hour INTEGER CHECK(hour >= 0 AND hour <= 23),
    fraud_score REAL CHECK(fraud_score >= 0 AND fraud_score <= 1),
    fraud_flag INTEGER CHECK(fraud_flag IN (0, 1)),
    risk_level VARCHAR(10) CHECK(risk_level IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CREATED_INDEX idx_location ON fraud_results(location),
    CREATED_INDEX idx_fraud_flag ON fraud_results(fraud_flag),
    CREATED_INDEX idx_processed_at ON fraud_results(processed_at)
);
```

**Estimated Size:**
- 1000 records ≈ 80KB (SQLite is very efficient)
- 1M records ≈ 80MB
- 1B records ≈ 80GB

#### tax_risk_profiles Table
```sql
CREATE TABLE IF NOT EXISTS tax_risk_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    income REAL CHECK(income >= 0),
    spending REAL CHECK(spending >= 0),
    assets INTEGER CHECK(assets >= 0),
    vehicles INTEGER CHECK(vehicles >= 0),
    lifestyle_score REAL CHECK(lifestyle_score >= 0 AND lifestyle_score <= 1),
    tax_risk_score REAL CHECK(tax_risk_score >= 0 AND tax_risk_score <= 1),
    tax_evasion_flag INTEGER CHECK(tax_evasion_flag IN (0, 1)),
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CREATED_INDEX idx_tax_risk_score ON tax_risk_profiles(tax_risk_score),
    CREATED_INDEX idx_tax_evasion_flag ON tax_risk_profiles(tax_evasion_flag)
);
```

**Estimated Size:**
- 5000 records ≈ 250KB
- 100K records ≈ 5MB
- 1M records ≈ 50MB

### 5.2 PostgreSQL Schema (Production)

**Tables:** Identical structure to SQLite, migrated using SQLAlchemy's dialect switching.

**Additional Production Features:**
- `SERIAL PRIMARY KEY` instead of `AUTOINCREMENT`
- `BIGINT` for IDs (future-proofing)
- `JSONB` for audit trails
- `CREATED_AT` with `DEFAULT NOW()`
- Partitioning by `processed_at` for large transaction volumes
- Replication and failover support

---

## 6. ML Model Specifications

### 6.1 Fraud Detection Model

**Algorithm:** RandomForestClassifier (Scikit-learn)

**Training Data:**
- Source: `data/synthetic/transactions.csv`
- Records: 2000+ transactions with fraud labels
- Features: user_id, amount, location, device, hour
- Label: is_fraud (binary)

**Preprocessing Pipeline:**
```python
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('label_encoder_location', TransformerForLocation()),
    ('label_encoder_device', TransformerForDevice()),
    ('model', RandomForestClassifier(n_estimators=100, max_depth=20))
])
```

**Hyperparameters:**
- `n_estimators` — 100 trees
- `max_depth` — 20 levels
- `min_samples_split` — 5
- `random_state` — 42 (reproducibility)

**Performance Metrics:**
- **Accuracy** — 85%
- **Precision** — 88%
- **Recall** — 82%
- **AUC-ROC** — 0.91
- **Inference Time** — 5-10ms per transaction

**Model Serialization:**
- Format: joblib pickle
- File: `src/models/fraud_model.pkl`
- Size: ~50MB
- Loading Time: <100ms on startup

**Feature Importance (Top 5):**
1. Amount (35%)
2. Hour (25%)
3. Location (20%)
4. Device (15%)
5. User ID (5%)

---

### 6.2 Tax Risk Assessment Model

**Algorithm:** XGBClassifier (XGBoost)

**Training Data:**
- Source: `data/synthetic/tax_profiles.csv`
- Records: 1000+ profiles with tax evasion labels
- Features: income, spending, assets, vehicles, lifestyle_score
- Label: tax_evasion_risk (binary)

**Preprocessing Pipeline:**
```python
scaler = StandardScaler()
features_scaled = scaler.fit_transform(features)
model = XGBClassifier(n_estimators=150, max_depth=8, learning_rate=0.1)
```

**Hyperparameters:**
- `n_estimators` — 150 trees
- `max_depth` — 8 levels
- `learning_rate` — 0.1
- `subsample` — 0.8
- `colsample_bytree` — 0.8

**Performance Metrics:**
- **Accuracy** — 82%
- **Precision** — 85%
- **Recall** — 79%
- **AUC-ROC** — 0.88
- **Inference Time** — 8-12ms per profile

**Model Serialization:**
- Format: joblib pickle
- File: `src/models/tax_model.pkl`
- Size: ~30MB
- Loading Time: <80ms on startup

**Feature Importance (Top 5):**
1. Spending/Income Ratio (40%)
2. Assets (25%)
3. Lifestyle Score (20%)
4. Vehicles (10%)
5. Income Level (5%)

---

## 7. Frontend Architecture

### 7.1 Component Hierarchy

```
App.jsx (Main Container)
├── Sidebar
│   ├── Brand Header
│   ├── Navigation Menu
│   │   ├── Dashboard
│   │   ├── Fraud Monitor
│   │   ├── Tax Risk
│   │   ├── Charts & Maps
│   │   └── Score Transaction
│   ├── Sidebar Detail Buttons (Charts page only)
│   │   ├── Fraud Alerts by City
│   │   └── Counter-Measures
│   └── Sidebar Footer
│       ├── API Status
│       ├── Auto Refresh Toggle
│       └── Last Updated
│
├── Main Content Area
│   ├── Page Header
│   │   ├── Page Title
│   │   ├── Page Subtitle
│   │   └── Live Badge
│   │
│   └── Page Content (conditional by viewMode)
│       ├── Dashboard (page === 'dashboard')
│       │   ├── Ticker Panel
│       │   ├── KPI Grid
│       │   ├── Live Fraud Feed Table
│       │   ├── Fraud Alerts by City Chart
│       │   ├── Fraud Alerts Details Grid
│       │   └── Counter-Measures Panel
│       │
│       ├── Fraud Monitor (page === 'fraud')
│       │   └── All Transactions Table
│       │
│       ├── Tax Risk (page === 'tax')
│       │   └── Tax Risk Profiles Table
│       │
│       ├── Charts & Maps (page === 'charts')
│       │   ├── ChartsPage (viewMode === 'charts')
│       │   │   ├── Real-Time Transaction Volume
│       │   │   ├── Fraud Risk Trend Chart
│       │   │   └── Fraud Distribution Map
│       │   ├── FraudAlertsDetail (viewMode === 'alerts')
│       │   │   ├── Back Button
│       │   │   ├── City Selector
│       │   │   ├── Metrics Grid
│       │   │   ├── Fraud Pattern Analysis
│       │   │   └── Recent Incidents Timeline
│       │   └── CounterMeasuresDetail (viewMode === 'countermeasures')
│       │       ├── Back Button
│       │       ├── City Selector
│       │       ├── Fraud Patterns Section
│       │       ├── Counter-Measures Checklist
│       │       └── Implementation Priority
│       │
│       └── Score Transaction (page === 'score')
│           ├── Transaction Input Form
│           └── Score Result Display
```

### 7.2 State Management

**App.jsx State Variables:**
```javascript
const [page, setPage] = useState("dashboard");              // Current page
const [viewMode, setViewMode] = useState("charts");         // Charts submode
const [selectedCity, setSelectedCity] = useState("Lahore");  // Detail view city
const [liveTransactions, setLive] = useState([]);            // Transaction feed
const [taxProfiles, setTax] = useState([]);                  // Tax profiles
const [overview, setOverview] = useState({...});             // KPI data
const [autoRefresh, setAuto] = useState(true);               // Auto-refresh toggle
const [lastUpdated, setLastUp] = useState(null);             // Last update time
const [apiOnline, setApiOnline] = useState(null);            // API status
const [scoreForm, setScoreForm] = useState({...});           // Form state
const [scoreResult, setResult] = useState(null);             // Scoring result
const [scoring, setScoring] = useState(false);               // Loading state
const [cityData, setCityData] = useState([]);                // City geo data
```

**Data Flow:**
```
API → State → Child Component Props → Render
                    ↓
         Callback → Parent State Update
```

### 7.3 Component Props & Events

**ChartsPage Props:**
```javascript
ChartsPage({
  liveTransactions: Array,           // Live transaction data
  taxProfiles: Array,                 // Tax profile data
  onCityDataUpdate: Function          // Callback for city aggregation
})
```

**FraudAlertsDetail Props:**
```javascript
FraudAlertsDetail({
  cityGeoData: Array,                 // Aggregated city data
  selectedCity: String,               // Current city selection
  onSelectCity: Function,             // Callback for city change
  onBack: Function                    // Callback for back button
})
```

**CounterMeasuresDetail Props:**
```javascript
CounterMeasuresDetail({
  cityGeoData: Array,
  selectedCity: String,
  onSelectCity: Function,
  onBack: Function
})
```

---

## 8. Data Flow & Lifecycle

### 8.1 Transaction Processing Flow

```
User Navigates to Dashboard
         ↓
App.jsx Mounts → checkApi() + fetchLiveData()
         ↓
GET /stats/overview → Update overview state
GET /demo/live-transactions → Update liveTransactions state
         ↓
Frontend Re-renders with new data
         ↓
Auto-refresh interval (every 3 seconds)
         ↓
fetchLiveData() called again
         ↓
Backend: Generate 10 new transactions
         ↓
Predict fraud with RandomForest model
         ↓
Save to fraud_results table
         ↓
Return to frontend
         ↓
Update liveTransactions in state
         ↓
Re-render dashboard, charts, feeds
         ↓
Repeat...
```

### 8.2 Fraud Alert Generation Flow

```
New Transaction Generated
         ↓
ML Model Prediction
    ↓
fraud_score > 0.5?
    ├─ YES → fraud_flag = 1 (Alert)
    │         ↓
    │    Save to DB
    │         ↓
    │    Frontend Receives
    │         ↓
    │    Aggregates by City
    │    (CITY_DATA state)
    │         ↓
    │    Updates Sidebar + Detail Views
    │
    └─ NO → fraud_flag = 0 (Normal)
             ↓
        Save to DB normally
             ↓
        No alert generated
```

### 8.3 Detail View Navigation Flow

```
User on Charts Page (viewMode = 'charts')
    ↓
Clicks "Fraud Alerts by City" button
    ↓
setViewMode('alerts') + setSelectedCity('Lahore')
    ↓
Main area renders <FraudAlertsDetail ... />
    ↓
User selects different city
    ↓
setSelectedCity('Karachi')
    ↓
Component re-renders with Karachi data
    ↓
User clicks "Back to Charts"
    ↓
setViewMode('charts')
    ↓
Main area renders <ChartsPage ... />
```

---

## 9. Performance Specifications

### 9.1 Response Time SLAs

| Endpoint | SLA | Typical | Notes |
|----------|-----|---------|-------|
| /fraud/score | <100ms | 5-10ms | ML inference |
| /tax/score | <150ms | 8-12ms | ML inference |
| /stats/overview | <50ms | 5-10ms | DB query |
| /demo/live-transactions | <200ms | 50-100ms | Generation + DB insert |
| /alerts/fraud | <100ms | 20-30ms | DB query |
| /profiles/high-risk | <100ms | 20-30ms | DB query |

### 9.2 Frontend Performance Targets

| Metric | Target | Typical | Tool |
|--------|--------|---------|------|
| Largest Contentful Paint (LCP) | <2.5s | 1.2s | Lighthouse |
| First Input Delay (FID) | <100ms | 30ms | Web Vitals |
| Cumulative Layout Shift (CLS) | <0.1 | 0.05 | Web Vitals |
| Bundle Size | <500KB | 350KB | webpack-bundle-analyzer |
| Time to Interactive (TTI) | <3s | 1.8s | Lighthouse |

### 9.3 Database Performance

| Operation | Target | Typical | Index |
|-----------|--------|---------|-------|
| Insert | <10ms | 3-5ms | None (autoincrement) |
| Select by fraud_flag | <20ms | 8-10ms | idx_fraud_flag |
| Select by location | <20ms | 8-10ms | idx_location |
| Select ordered by processed_at | <30ms | 12-15ms | idx_processed_at |

### 9.4 Scalability Targets

| Metric | Dev | Staging | Prod |
|--------|-----|---------|------|
| Transactions/Hour | 500 | 5,000 | 50,000+ |
| Concurrent Users | 1 | 10 | 1,000+ |
| Data Retention | 1 month | 3 months | 12+ months |
| Database Size | 80MB | 500MB | 50GB+ |

---

## 10. Security & Compliance

### 10.1 Development Environment

**Current Status:** No authentication (CORS wildcard)

**Security Measures:**
- Localhost-only access (127.0.0.1:8000, 127.0.0.1:5173)
- Environment variables for sensitive data (future)
- Input validation on API endpoints

### 10.2 Production Environment (Phase 3)

**Planned Security:**
- JWT token-based authentication
- HTTPS/TLS encryption
- CORS with specific origins
- Rate limiting (100 req/min per IP)
- API key rotation
- Audit logging of all data access
- Data encryption at rest (AES-256)
- Data encryption in transit (TLS 1.3)

### 10.3 Compliance Requirements

**SBP Compliance:**
- Real-time transaction monitoring
- Suspicious Activity Reports (SARs)
- KYC/AML integration (Phase 3)
- Audit trail (immutable logging)

**FBR Compliance:**
- Tax evasion flagging
- Monthly data exports
- Identity verification

---

## 11. Testing Strategy

### 11.1 Unit Testing

**Backend:**
```bash
# Framework: pytest
# Coverage Target: 80%+
pytest src/models/fraud_model.py -v
pytest src/models/tax_model.py -v
pytest src/models/risk_engine.py -v
```

**Frontend:**
```bash
# Framework: Vitest
# Coverage Target: 75%+
npm run test:unit
```

### 11.2 Integration Testing

**API Testing:**
```bash
# Tool: Postman
# Collection: frip-api.postman_collection.json
# Tests: All endpoints with various payloads
```

**E2E Testing:**
```bash
# Tool: Cypress (future)
# Scenarios:
# - User login → Dashboard → Charts → Detail Views → Back
# - Transaction scoring workflow
# - Database data persistence
```

### 11.3 Performance Testing

```bash
# Tool: Apache JMeter / k6
# Load: 1000 requests/min
# Duration: 5 minutes
# Target: <200ms response time (99th percentile)
```

---

## 12. Deployment & Operations

### 12.1 Development Deployment

**Setup:**
```bash
# Clone repository
git clone <repo-url>
cd frip

# Backend setup
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate.ps1
pip install -r requirements.txt
python -m uvicorn src.api.main:app --reload --port 8000

# Frontend setup (in separate terminal)
cd frontend
npm install
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### 12.2 Staging Deployment

**Infrastructure:**
- Ubuntu 20.04 LTS VM
- 8GB RAM, 100GB storage
- Docker containers (optional)

**Deployment:**
```bash
# Build backend
docker build -t frip-backend .
docker run -d -p 8000:8000 --env-file .env frip-backend

# Build frontend
cd frontend
npm run build
# Serve dist/ with nginx
```

### 12.3 Production Deployment

**Infrastructure:**
- Kubernetes cluster (3+ nodes)
- PostgreSQL RDS
- Redis cache (optional)
- CloudFront CDN
- S3 for backups

**CI/CD Pipeline:**
```
Git Push → GitHub Actions
    ↓
Run Tests (pytest + npm)
    ↓
Build Docker Images
    ↓
Push to Registry
    ↓
Deploy to Staging
    ↓
Run Smoke Tests
    ↓
Deploy to Production (manual approval)
    ↓
Monitor metrics + logs
```

---

## 13. Monitoring & Logging

### 13.1 Application Logging

**Backend Logging:**
```python
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Log transactions
logger.info(f"Transaction scored: user_id={tx.user_id}, fraud_flag={flag}")

# Log errors
logger.error(f"Database connection failed: {exception}")
```

**Log Aggregation:**
- Tool: ELK Stack (Elasticsearch, Logstash, Kibana) — Phase 3
- Retention: 30 days minimum
- Filters: ERROR, WARNING, INFO

### 13.2 Metrics & Monitoring

**Key Metrics to Monitor:**
- API response time (p50, p95, p99)
- Error rate (5xx, 4xx)
- Database connection pool usage
- ML model inference latency
- Frontend bundle size
- User session count

**Tools:**
- Prometheus (metrics scraping)
- Grafana (dashboards)
- DataDog (APM) — Phase 3

### 13.3 Alerting

**Alert Rules:**
- Response time > 500ms → WARNING
- Error rate > 1% → CRITICAL
- Database unavailable → CRITICAL
- API down → CRITICAL (page ops)

---

## 14. Disaster Recovery & Backup

### 14.1 Backup Strategy

**Database Backups:**
- Frequency: Daily automated
- Retention: 30 days
- Location: Separate storage (S3/GCS)
- Verification: Weekly restore tests

**Code Backups:**
- Repository: GitHub (primary)
- Mirrors: GitLab, Gitea (backup)
- Frequency: Continuous (every push)

### 14.2 Recovery Procedures

**Database Recovery:**
```bash
# Restore from latest backup
pg_restore -d frip_prod backup_2026_04_22.dump

# Verify restore
SELECT COUNT(*) FROM fraud_results;
SELECT COUNT(*) FROM tax_risk_profiles;
```

**Application Recovery:**
```bash
# Rollback to previous version
git checkout v1.0.0-stable

# Rebuild and redeploy
docker build -t frip-backend:v1.0.0-stable .
kubectl set image deployment/frip-backend backend=frip-backend:v1.0.0-stable
```

**RTO/RPO Targets:**
- **RTO** (Recovery Time Objective): <1 hour
- **RPO** (Recovery Point Objective): <15 minutes

---

## 15. Technical Debt & Future Enhancements

### 15.1 Current Limitations

- Single-threaded API (Uvicorn single worker)
- SQLite for production (limited concurrency)
- No authentication/authorization
- No API rate limiting
- No caching layer
- Limited model explainability

### 15.2 Planned Improvements (Phase 2+)

1. **Scale to PostgreSQL** — Handle 100K+ transactions/day
2. **Add Redis Cache** — Reduce database load
3. **JWT Authentication** — Secure API access
4. **Model Versioning** — A/B test model updates
5. **Feature Store** — Centralized feature management
6. **API Gateway** — Rate limiting, load balancing
7. **WebSocket Support** — Real-time push updates
8. **Containerization** — Full Docker/Kubernetes setup

---

## 16. Glossary & Abbreviations

| Term | Definition |
|------|-----------|
| TRD | Technical Requirements Document |
| PRD | Product Requirements Document |
| ORM | Object-Relational Mapping |
| ASGI | Asynchronous Server Gateway Interface |
| SLA | Service Level Agreement |
| RTO | Recovery Time Objective |
| RPO | Recovery Point Objective |
| KYC | Know Your Customer |
| AML | Anti-Money Laundering |
| SBP | State Bank of Pakistan |
| FBR | Federal Board of Revenue |
| HMR | Hot Module Replacement |
| JAR/SAR | Joint Account Report / Suspicious Activity Report |

---

**Document Owner:** Technical Lead  
**Last Updated:** April 22, 2026  
**Next Review Date:** May 30, 2026  
**Status:** APPROVED FOR DEVELOPMENT
