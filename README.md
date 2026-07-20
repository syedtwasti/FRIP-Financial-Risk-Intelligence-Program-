# FRIP-Financial-Risk-Intelligence-Program-

Website Link: https://syedtwasti.github.io/FRIP-Financial-Risk-Intelligence-Program-/

FRIP (Financial Risk Intelligence Platform) is an advanced, AI-driven application designed to detect fraudulent financial transactions and analyze potential tax evasion risks. It provides real-time scoring and profiling through a robust machine-learning backend and presents actionable insights via an interactive, geospatial-enabled React dashboard.

## 🧠 What It Does (In Detail)

The core objective of FRIP is to identify anomalies and high-risk behavior within complex financial ecosystems. 
- **For Fraud Detection:** It evaluates individual transactions in real-time. By looking at variables such as the transaction amount, the geographic location of the request, the device used, and the time of day, it assigns a **Fraud Score**. If the score exceeds a certain threshold, the transaction is flagged and categorized into a Risk Level (Low, Medium, High).
- **For Tax Risk Profiling:** It builds user-centric profiles by comparing income streams against spending habits, asset ownership (like real estate and vehicles), and a calculated "lifestyle score". Discrepancies between reported income and actual spending/assets yield a **Tax Risk Score**, flagging potential tax evasion cases.

## ⚙️ How It Works

The platform operates through a seamless, decoupled architecture connecting data science workflows with modern web technologies:

1. **Data Processing & ML Inference (Backend):**
   - The system utilizes pre-trained machine learning models built with **Scikit-Learn** and **XGBoost**.
   - When a transaction or user profile is submitted, the **FastAPI** backend receives the payload, standardizes the numerical and categorical inputs using Pandas/NumPy, and passes it through the active models.
   - **SHAP (SHapley Additive exPlanations)** is integrated to interpret model decisions, ensuring that the risk scores are explainable (e.g., determining *why* a specific transaction was flagged).
   - The results are simultaneously persisted to a relational database (via **SQLAlchemy**) for historical tracking and returned as JSON to the frontend.

2. **Real-Time Visualization (Frontend):**
   - The **React (Vite)** dashboard polls or receives these JSON payloads from the API.
   - **Recharts** translates statistical data (like transaction volumes over time or risk distributions) into interactive charts.
   - **React-Leaflet** handles the geospatial mapping, placing visual markers on a map for high-risk transactions so analysts can visually identify geographical fraud rings or hotspots.

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
## 📜 License
This project is proprietary and confidential. All rights reserved.
