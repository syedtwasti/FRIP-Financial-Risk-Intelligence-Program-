# FRIP-Financial-Risk-Intelligence-Program-


FRIP (Financial Risk Intelligence Platform) is an advanced, AI-driven application designed to detect fraudulent financial transactions and analyze potential tax evasion risks. It provides real-time scoring and profiling through a robust machine-learning backend and presents actionable insights via an interactive, geospatial-enabled React dashboard.

## 🌟 Key Features

- **Real-Time Fraud Detection:** Analyzes transactions based on multiple parameters (amount, location, device, time) to generate instant fraud probability scores and risk levels.
- **Tax Evasion Profiling:** Evaluates user income, spending habits, asset ownership, and lifestyle indicators to assign comprehensive tax risk scores.
- **Interactive Monitoring Dashboard:** A responsive React UI that visualizes risk metrics, transaction volumes, and geographic anomalies.
- **Geospatial Intelligence:** Integrates mapping capabilities to track high-risk transactions by location.
- **Machine Learning Powered:** Utilizes industry-standard models like XGBoost and Scikit-Learn, with SHAP for model interpretability.

## 🛠️ Technology Stack

### Backend
- **Framework:** FastAPI (Python)
- **Machine Learning:** Scikit-Learn, XGBoost, SHAP
- **Data Processing:** Pandas, NumPy
- **Database ORM:** SQLAlchemy (SQLite default, PostgreSQL supported)
- **Server:** Uvicorn

### Frontend
- **Framework:** React 19 with Vite
- **Data Visualization:** Recharts
- **Mapping:** Leaflet & React-Leaflet
- **Icons:** Lucide React
- **HTTP Client:** Axios

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+ & npm

### Quick Start (Windows)
You can launch the entire stack using the provided batch script:
```cmd
start.bat
```

### Manual Installation & Setup

#### 1. Start the Backend API
Open a terminal and run the following commands:
```bash
# Navigate to the project root
cd FRIP-Financial-Risk-Intelligence-Program-

# Create and activate a virtual environment (Windows)
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn src.api.main:app --reload --port 8000
```
*The API documentation (Swagger UI) will be available at [http://localhost:8000/docs](http://localhost:8000/docs).*

#### 2. Start the Frontend Dashboard
Open a second terminal and run:
```bash
# Navigate to the frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the Vite development server
npm run dev
```
*The interactive dashboard will be accessible at [http://localhost:5173](http://localhost:5173) (or the port specified by Vite).*

## 🗄️ Project Structure
```text
.
├── frontend/               # React (Vite) dashboard application
├── src/                    # Backend source code
│   ├── api/                # FastAPI routes and main application
│   ├── models/             # Machine Learning models and pipelines
│   └── utils/              # Helper functions
├── data/                   # Datasets and processed data
├── requirements.txt        # Python dependencies
├── start.bat               # Windows quick-start script
└── frip.db                 # SQLite database (auto-generated)
```

## 📜 License
This project is proprietary and confidential. All rights reserved.
