# Product Requirements Document (PRD)
## FRIP - Financial Risk Intelligence Platform

**Version:** 1.0  
**Date:** April 22, 2026  
**Status:** Active Development  
**Target Market:** Pakistan Financial Institutions

---

## 1. Executive Summary

FRIP (Financial Risk Intelligence Platform) is a real-time fraud detection and tax risk assessment system designed for Pakistani financial institutions. The platform uses machine learning models to identify fraudulent transactions and tax evasion risks with high accuracy, enabling proactive risk mitigation and compliance monitoring.

### Key Value Propositions
- **Real-time Fraud Detection** — Instant transaction risk scoring with 88% accuracy
- **Tax Evasion Risk Assessment** — Profile-based risk analysis for compliance teams
- **Geographic Risk Mapping** — City-level fraud distribution visualization
- **Automated Alerts** — Multi-severity fraud alerts with recommended counter-measures
- **Dashboard Intelligence** — Comprehensive real-time monitoring and analytics

---

## 2. Problem Statement

### Current Challenges in Pakistani Finance
1. **Fraud Epidemic** — Rising transaction fraud impacting customer trust and profitability
2. **Compliance Gaps** — Manual tax risk assessment is slow and prone to human error
3. **Visibility Issues** — Lack of real-time insight into fraud patterns by geography and time
4. **Reactive Response** — Most systems detect fraud after transactions complete (post-facto)
5. **Operational Overhead** — Manual monitoring consumes significant compliance staff resources

### Target Users' Pain Points
- **Risk Officers** — No unified dashboard for multi-dimensional risk analysis
- **Compliance Teams** — Tedious manual profile reviews (5000+ profiles quarterly)
- **Transaction Analysts** — Cannot quickly identify emerging fraud patterns
- **Business Stakeholders** — Limited visibility into fraud impact and trends

---

## 3. Product Vision & Goals

### Vision Statement
*"Empower Pakistani financial institutions with AI-driven fraud prevention and compliance intelligence to protect customers, reduce losses, and streamline regulatory reporting."*

### Business Goals
1. **Reduce fraud losses by 60%** through early detection and prevention
2. **Improve compliance efficiency by 80%** via automated risk assessment
3. **Achieve real-time fraud visibility** across all transaction channels
4. **Support regulatory reporting** (SBP, FBR) with audit-ready data
5. **Enable geographic risk analysis** for targeted intervention strategies

### Success Metrics
- **Fraud Detection Rate** — 85%+ accuracy on unseen transactions
- **False Positive Rate** — <5% to minimize customer friction
- **Alert Response Time** — <100ms from transaction to risk score
- **System Availability** — 99.9% uptime for critical operations
- **User Adoption** — 95%+ daily active users at target institutions

---

## 4. Target Users & Personas

### Persona 1: Risk Management Director
- **Name:** Fatima Khan
- **Institution:** Tier-1 Bank, Karachi
- **Goals:** Minimize fraud losses, reduce compliance costs, demonstrate regulatory adherence
- **Pain Points:** Manual monitoring, slow pattern detection, scattered data sources
- **Usage:** Daily dashboard review, monthly trend analysis, quarterly reporting

### Persona 2: Compliance Officer
- **Name:** Ahmed Malik
- **Institution:** Microfinance Institution, Lahore
- **Goals:** Identify high-risk customers, automate profile review, streamline tax compliance
- **Pain Points:** 5000+ profiles to manually assess, unclear risk indicators, audit readiness
- **Usage:** Weekly profile reviews, alert investigation, regulatory submissions

### Persona 3: Transaction Analyst
- **Name:** Sara Ahmad
- **Institution:** Payment Gateway, Islamabad
- **Goals:** Detect fraud patterns, investigate anomalies, support fraud prevention
- **Pain Points:** High transaction volume, unclear patterns, reactive detection
- **Usage:** Real-time monitoring, pattern exploration, incident investigation

---

## 5. Product Features & Capabilities

### 5.1 Core Features

#### Dashboard Overview
- **KPI Cards** — Real-time metrics (Transactions Seen, Fraud Alerts, Tax Risk Profiles, DB Transactions)
- **Live Fraud Feed** — Top 14 recent transactions with risk scoring
- **City-Based Fraud Chart** — Purple bar chart showing fraud by geography
- **City Fraud Details Panel** — Card grid with severity badges per city
- **Counter-Measures Panel** — Actionable recommendations by city

#### Fraud Monitor Page
- **All Transactions Table** — Complete transaction history with risk details
- **Filtering & Sorting** — By amount, location, device, risk level, time
- **Risk Score Visualization** — Color-coded severity (CRITICAL, HIGH, MEDIUM, LOW)
- **Real-time Updates** — Data refreshes every 3 seconds

#### Charts & Geo-Location Page
- **Real-Time Transaction Volume Chart** — Hourly transaction count trends
- **Fraud Risk Trend Chart** — Risk percentage over time
- **Geographic Map** — Leaflet-based city marker visualization with fraud counts
- **Selectable Detail Panels**:
  - **Fraud Alerts by City** — City selector + metrics grid + incident timeline
  - **Counter-Measures & Fraud Analysis** — Fraud patterns + recommended measures + implementation priority

#### Tax Risk Profiles Page
- **High-Risk Profile Table** — Income, spending, assets, vehicles, tax risk score
- **Risk Level Indicators** — Gradient visualization of evasion likelihood
- **Filter Capabilities** — By risk level, income range, asset class

#### Score Transaction Page
- **Transaction Input Form** — User ID, amount, location, device, hour
- **Real-time Scoring** — Immediate fraud risk calculation
- **Result Display** — Fraud score, flag, risk level, confidence
- **Fraud/Tax Risk Toggle** — Switch between fraud and tax risk assessment

#### Data Visualization Suite
- **Recharts Integration** — AreaChart, LineChart, BarChart, PieChart
- **Leaflet Geo-Mapping** — Interactive map with CircleMarker overlays
- **Color-Coded Risk Levels** — CRITICAL (red), HIGH (orange), MEDIUM (blue), LOW (green)
- **Responsive Layouts** — Mobile-first responsive design at all breakpoints

### 5.2 AI/ML Features

#### Fraud Detection Model
- **Algorithm** — RandomForestClassifier (Scikit-learn)
- **Features** — Transaction amount, hour, location, device, user ID
- **Preprocessing** — StandardScaler, LabelEncoder for categorical features
- **Output** — Fraud probability score (0-1) + risk level classification

#### Tax Risk Assessment Model
- **Algorithm** — XGBClassifier (XGBoost)
- **Features** — Income, spending, assets, vehicles, lifestyle score
- **Preprocessing** — StandardScaler normalization
- **Output** — Tax evasion probability + risk flag

#### Risk Engine
- **Unified Risk Scoring** — Combines fraud + tax risk + contextual factors
- **City-Level Aggregation** — Fraud counts and rates per geographic location
- **Time-Series Analysis** — Trend detection and anomaly flagging
- **Real-time Processing** — Sub-100ms scoring latency

### 5.3 Data Management

#### Live Transaction Ingestion
- **Source** — API endpoint `/demo/live-transactions` (generates 10 new transactions per call)
- **Frequency** — Every 3 seconds (frontend auto-refresh interval)
- **Persistence** — SQLite database auto-insert with timestamp
- **Data Schema** — user_id, amount, location, device, hour, fraud_score, fraud_flag, risk_level, processed_at

#### Database Capabilities
- **SQLite Storage** — Lightweight, serverless, file-based persistence
- **Automatic Table Creation** — Tables auto-initialize on API startup
- **Transaction Logging** — Full audit trail with timestamps
- **Tax Profile Management** — Separate table for high-risk profile storage
- **Scalability Path** — Migration to PostgreSQL supported with minimal changes

### 5.4 Alert & Notification System

#### Alert Types
- **Critical Fraud Alerts** — Fraud score ≥0.75, immediate notification
- **High-Risk Alerts** — Fraud score 0.5-0.75, elevated monitoring
- **Pattern Alerts** — Emerging fraud patterns by city or time
- **Tax Evasion Flags** — Profile-based high-risk indicators

#### Alert Features
- **Multi-Severity Levels** — Color-coded (CRITICAL, HIGH, MEDIUM, LOW)
- **City-Based Grouping** — Aggregated by location for geographic analysis
- **Recommended Actions** — Counter-measures from fraud analysis database
- **Real-time Updates** — Sidebar panels update every 3 seconds

---

## 6. Technical Architecture

### 6.1 Technology Stack

**Frontend**
- React 19.2.4 — Component-based UI with hooks
- Vite 8.0.8 — Fast build tool and dev server
- Recharts 3.8.1 — Chart library for data visualization
- Leaflet + react-leaflet — Geo-mapping capabilities
- Lucide-react — Icon library for UI
- Axios 1.15.0 — HTTP client for API communication
- CSS Grid/Flexbox — Responsive layout system

**Backend**
- FastAPI 0.110.0 — Modern Python web framework
- SQLAlchemy 2.0.29 — ORM for database operations
- SQLite 3 — Lightweight database
- Scikit-learn 1.4.1 — Machine learning models
- XGBoost 2.0.3 — Advanced ML model
- Joblib 1.3.2 — Model serialization/deserialization
- Uvicorn 0.29.0 — ASGI server

**DevOps**
- Python 3.x with virtual environment
- Node.js + npm — JavaScript package management
- Git — Version control
- npm scripts — Build and dev workflows

### 6.2 System Architecture

```
┌─────────────────────────────────────────────────────┐
│              FRIP Platform Architecture             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────┐          ┌─────────────────┐ │
│  │  React Frontend  │◄────────►│  Vite Dev Server│ │
│  │  (Port 5173)     │          │  (HMR enabled)  │ │
│  └────────┬─────────┘          └─────────────────┘ │
│           │                                        │
│           │ HTTP/REST                             │
│           │ (Axios)                               │
│           ▼                                        │
│  ┌──────────────────────────────────────────────┐ │
│  │      FastAPI Backend (Port 8000)             │ │
│  │  ┌────────────────────────────────────────┐ │ │
│  │  │  Routes:                               │ │ │
│  │  │  • /api/v1/fraud/score                │ │ │
│  │  │  • /api/v1/tax/score                  │ │ │
│  │  │  • /api/v1/stats/overview             │ │ │
│  │  │  • /api/v1/demo/live-transactions     │ │ │
│  │  │  • /api/v1/alerts/fraud               │ │ │
│  │  │  • /api/v1/profiles/high-risk         │ │ │
│  │  └────────────────────────────────────────┘ │ │
│  │                    ▼                        │ │
│  │  ┌────────────────────────────────────────┐ │ │
│  │  │  ML Models & Risk Engine               │ │ │
│  │  │  • RandomForest (Fraud Detection)      │ │ │
│  │  │  • XGBoost (Tax Risk Assessment)       │ │ │
│  │  │  • Risk Scoring Engine                 │ │ │
│  │  └────────────────────────────────────────┘ │ │
│  │                    ▼                        │ │
│  │  ┌────────────────────────────────────────┐ │ │
│  │  │  SQLAlchemy ORM & SQLite Database      │ │ │
│  │  │  Tables:                               │ │ │
│  │  │  • fraud_results (1000+ records)       │ │ │
│  │  │  • tax_risk_profiles (5000+ records)   │ │ │
│  │  └────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 7. User Flows & Interactions

### 7.1 Fraud Detection Flow
1. User logs into FRIP Dashboard
2. Frontend auto-refreshes every 3 seconds
3. Calls `GET /api/v1/demo/live-transactions`
4. Backend generates 10 new simulated transactions
5. Each transaction processed through RandomForest model
6. Fraud score + risk level computed
7. Results saved to `fraud_results` table
8. Frontend receives updated transactions
9. Charts, feeds, and alerts update in real-time
10. User reviews fraud alerts by city and implements counter-measures

### 7.2 Fraud Alert Investigation Flow
1. User navigates to "Charts & Maps" page (default: Charts view)
2. Sees 3 visualizations:
   - Real-Time Transaction Volume (area chart)
   - Fraud Risk Trend (line chart)
   - Fraud Distribution by City (Leaflet map)
3. Sidebar shows two clickable buttons:
   - "Fraud Alerts by City"
   - "Counter-Measures"
4. Clicks "Fraud Alerts by City" button
5. Main area switches to Fraud Alerts Detail View
6. City selector pills appear (Lahore, Karachi, Islamabad, Faisalabad, Multan)
7. Selects "Lahore" to see:
   - Fraud incidents count
   - Fraud rate percentage
   - Risk level (CRITICAL/HIGH/MEDIUM/LOW)
   - Recent incidents timeline with severity
8. Clicks "Counter-Measures" button
9. Switches to Counter-Measures View for same city
10. Sees:
    - Common fraud patterns in that city
    - Recommended counter-measures (checklist)
    - Implementation priority (Immediate/Urgent/Standard)
11. Clicks back to return to charts

### 7.3 Tax Risk Assessment Flow
1. User navigates to "Tax Risk Profiles" page
2. Sees table of 20+ high-risk profiles
3. Profiles sorted by tax_risk_score (descending)
4. Columns: User ID, Income, Spending, Assets, Vehicles, Tax Risk Score, Risk Level
5. Can filter/sort by risk level or income range
6. Clicks on high-risk profile to investigate
7. Reviews spending-to-income ratio
8. Assesses assets vs. reported income alignment
9. Notes vehicle ownership for lifestyle assessment
10. Flags profile for additional compliance review if needed

### 7.4 Manual Transaction Scoring Flow
1. User navigates to "Score Transaction" page
2. Fills in form:
   - User ID (e.g., 42)
   - Amount (e.g., 150,000 PKR)
   - Location (dropdown: Lahore, Karachi, etc.)
   - Device (dropdown: Android, iPhone, etc.)
   - Hour (0-23)
3. Selects "Fraud Risk" or "Tax Risk" toggle
4. Clicks "Score" button
5. Backend immediately calls ML model
6. Returns:
   - Risk score (0-1)
   - Risk level (CRITICAL/HIGH/MEDIUM/LOW)
   - Confidence metrics
7. User reviews result and makes transaction decision

---

## 8. Data Model

### 8.1 Fraud Results Table
```
fraud_results
├── id (INTEGER, PRIMARY KEY)
├── user_id (INTEGER)
├── amount (REAL)
├── location (VARCHAR)
├── device (VARCHAR)
├── hour (INTEGER)
├── fraud_score (REAL)
├── fraud_flag (INTEGER)
├── risk_level (VARCHAR)
└── processed_at (TIMESTAMP)
```

**Sample Record:**
```json
{
  "id": 1234,
  "user_id": 1567,
  "amount": 125000.00,
  "location": "Lahore",
  "device": "iPhone",
  "hour": 2,
  "fraud_score": 0.7845,
  "fraud_flag": 1,
  "risk_level": "HIGH",
  "processed_at": "2026-04-22 14:32:15"
}
```

### 8.2 Tax Risk Profiles Table
```
tax_risk_profiles
├── id (INTEGER, PRIMARY KEY)
├── user_id (INTEGER)
├── income (REAL)
├── spending (REAL)
├── assets (INTEGER)
├── vehicles (INTEGER)
├── lifestyle_score (REAL)
├── tax_risk_score (REAL)
├── tax_evasion_flag (INTEGER)
└── processed_at (TIMESTAMP)
```

**Sample Record:**
```json
{
  "id": 456,
  "user_id": 2034,
  "income": 850000.00,
  "spending": 2100000.00,
  "assets": 8,
  "vehicles": 3,
  "lifestyle_score": 0.92,
  "tax_risk_score": 0.78,
  "tax_evasion_flag": 1,
  "processed_at": "2026-04-22 14:30:00"
}
```

### 8.3 Fraud Analysis Reference Data
```
FRAUD_ANALYSIS = {
  "Lahore": {
    "reasons": ["High volume irregular patterns", "Spoofed device IDs", ...],
    "counterMeasures": ["Implement MFA", "Real-time monitoring", ...]
  },
  "Karachi": {
    "reasons": ["Late-night anomalies", "Bulk purchase inconsistencies", ...],
    "counterMeasures": ["Behavioral analysis", "Device verification", ...]
  },
  ...
}
```

---

## 9. Release Plan & Roadmap

### Phase 1: MVP (Current - April 2026)
- ✅ Real-time fraud detection dashboard
- ✅ Tax risk profile assessment
- ✅ Geographic visualization with Leaflet
- ✅ Live transaction feed with auto-refresh
- ✅ Fraud alert categorization by city
- ✅ Counter-measures recommendation system

### Phase 2: Enhanced Analytics (Q2 2026)
- Advanced filtering and search
- Custom date-range analysis
- Fraud trend forecasting
- Watchlist management
- User/customer risk profiles
- Export capabilities (CSV, PDF)

### Phase 3: Integration & Compliance (Q3 2026)
- SBP compliance reporting
- FBR tax evasion flagging
- API integration with bank core systems
- Multi-institutional support
- Role-based access control
- Audit logging and trail

### Phase 4: AI Enhancements (Q4 2026)
- Deep learning models (LSTM for time-series)
- Anomaly detection clustering
- Network fraud ring detection
- Behavioral biometrics
- Recommendation engine optimization

---

## 10. Success Metrics & KPIs

### Product Metrics
- **Fraud Detection Accuracy** — Target: 85%+
- **False Positive Rate** — Target: <5%
- **System Response Time** — Target: <100ms for scoring
- **Data Freshness** — Target: Real-time (every 3 seconds)
- **Feature Adoption** — Target: 95%+ of available features used

### Business Metrics
- **Fraud Loss Reduction** — Target: 60% reduction year-over-year
- **Compliance Cost Reduction** — Target: 80% efficiency gain
- **Customer Satisfaction** — Target: 4.5/5 star rating
- **User Adoption Rate** — Target: 95% daily active users
- **System Uptime** — Target: 99.9%

### Operational Metrics
- **Alert Response Time** — Target: <5 minutes to investigate
- **False Alert Investigation Time** — Target: <2 minutes
- **Counter-Measure Implementation Rate** — Target: 90%
- **Regulatory Reporting Accuracy** — Target: 100%

---

## 11. Acceptance Criteria

### Must-Have Features
- [x] Real-time fraud detection with <100ms latency
- [x] Geographic risk visualization by city
- [x] Live transaction feed with 3-second refresh
- [x] Tax risk profile assessment
- [x] Fraud alert categorization and counter-measures
- [x] Dashboard with KPI overview
- [x] Multiple fraud/tax risk scoring pages

### Should-Have Features
- [x] Responsive design for tablet/desktop
- [x] Dark theme UI with glassmorphism
- [x] Interactive detail views for city-based analysis
- [x] Real-time chart updates
- [x] Icon-based navigation and visual hierarchy

### Nice-to-Have Features
- [ ] Mobile-optimized views
- [ ] Export to CSV/PDF
- [ ] Custom alert rules
- [ ] Machine learning model explainability (SHAP values)
- [ ] Predictive fraud trend forecasting

---

## 12. Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| Model Accuracy Drift | High fraud miss rate | Medium | Quarterly model retraining, continuous monitoring |
| False Positive Storm | Customer frustration | Medium | Threshold tuning, alert deduplication |
| Database Scalability | Performance degradation | Low | SQLite→PostgreSQL migration plan ready |
| API Rate Limiting | Frontend data stalling | Low | Backend caching, request batching |
| Data Privacy Breach | Regulatory violation | Low | Encryption at rest/transit, access controls |

---

## 13. Timeline & Deliverables

| Phase | Timeline | Deliverables |
|-------|----------|--------------|
| MVP Launch | April 2026 | Dashboard, fraud detection, geo-visualization |
| Beta Testing | May 2026 | User feedback incorporation, bug fixes |
| Phase 2 Analytics | June-July 2026 | Advanced filtering, forecasting, exports |
| Phase 3 Integration | Aug-Sept 2026 | SBP/FBR compliance, bank core API integration |
| Production Release | October 2026 | Full production deployment, documentation |

---

## 14. Appendix: Glossary

- **Fraud Score** — Probability (0-1) that a transaction is fraudulent
- **Risk Level** — Categorical classification (CRITICAL, HIGH, MEDIUM, LOW)
- **Geo-Location** — City-level geographic analysis (Lahore, Karachi, Islamabad, Faisalabad, Multan)
- **Counter-Measures** — Recommended actions to prevent/mitigate fraud by city
- **Tax Evasion Flag** — Binary indicator of high tax evasion risk profile
- **SBP** — State Bank of Pakistan (regulatory body)
- **FBR** — Federal Board of Revenue (tax authority)

---

**Document Owner:** Product Management Team  
**Last Updated:** April 22, 2026  
**Next Review Date:** May 30, 2026
