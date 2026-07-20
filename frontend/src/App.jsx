import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from "recharts";
import {
  ShieldAlert, Activity, Users, TrendingUp, AlertTriangle,
  CheckCircle, RefreshCw, Send, Database, Settings, Bell, Search, Map, Shield, TrendingDown, Zap
} from "lucide-react";
import "./App.css";
import ChartsPage from "./pages/ChartsPage";
import FraudAlertsDetail from "./pages/FraudAlertsDetail";
import CounterMeasuresDetail from "./pages/CounterMeasuresDetail";
import DeviceVelocity from "./pages/DeviceVelocity";

const API = "http://localhost:8000/api/v1";

const FRAUD_ANALYSIS = {
  Lahore: {
    reasons: [
      "High transaction volume with irregular patterns",
      "Unusual device fingerprints (spoofed IDs)",
      "Mismatched user location vs transaction location",
    ],
    counterMeasures: [
      "Implement multi-factor authentication for high-value transactions",
      "Increase real-time transaction monitoring",
      "Deploy SMS/Email confirmation for orders > 100k PKR",
      "Monitor device velocity (multiple locations in short time)",
    ],
  },
  Karachi: {
    reasons: [
      "Late-night transactions (anomalous hours)",
      "Bulk purchase patterns inconsistent with user history",
      "High-risk device types (Unknown/Unverified devices)",
    ],
    counterMeasures: [
      "Enable behavioral analysis for transaction patterns",
      "Require device verification for flagged devices",
      "Use geofencing to detect impossible travel scenarios",
      "Implement velocity checks (max 5 transactions per hour)",
    ],
  },
  Islamabad: {
    reasons: [
      "VPN/Proxy usage detected",
      "Transaction amount spike relative to historical data",
      "Cross-border transaction patterns",
    ],
    counterMeasures: [
      "Block transactions from high-risk IP ranges",
      "Require additional identity verification",
      "Monitor for cumulative transaction limits",
      "Implement 3D Secure for international patterns",
    ],
  },
  Faisalabad: {
    reasons: [
      "Card testing patterns (multiple small transactions)",
      "Failed transaction attempts followed by success",
      "Unusual merchant categories",
    ],
    counterMeasures: [
      "Implement card validation rules",
      "Flag repeated failed attempts followed by success",
      "Monitor merchant category anomalies",
      "Restrict simultaneous transactions",
    ],
  },
  Multan: {
    reasons: [
      "Account compromise indicators",
      "Rapid succession of high-value transactions",
      "Changes in transaction velocity",
    ],
    counterMeasures: [
      "Force password reset on suspicious activity",
      "Temporarily freeze account pending verification",
      "Send real-time alerts to registered email/SMS",
      "Require in-person verification for large amounts",
    ],
  },
};

const RISK_COLORS = {
  CRITICAL: { bg: "#FEE2E2", text: "#991B1B", dot: "#DC2626" },
  HIGH:     { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B" },
  MEDIUM:   { bg: "#DBEAFE", text: "#1E40AF", dot: "#3B82F6" },
  LOW:      { bg: "#D1FAE5", text: "#065F46", dot: "#10B981" },
};

function RiskBadge({ level }) {
  const c = RISK_COLORS[level] || RISK_COLORS.LOW;
  return (
    <span className="risk-badge" style={{ background: c.bg, color: c.text }}>
      <span className="risk-dot" style={{ background: c.dot }} />
      {level}
    </span>
  );
}

function KpiCard({ icon: Icon, label, value, sub, trend }) {
  return (
    <div className="kpi-card-new">
      <div className="kpi-header">
        <h3>{label}</h3>
        <button className="kpi-icon-btn"><Settings size={16} /></button>
      </div>
      <div className="kpi-value-new">{Array.isArray(value) ? value[0] : value}</div>
      <div className="kpi-footer">
        <span className="kpi-trend">{trend || "+5.2%"}</span>
        <span className="kpi-sub-text">{sub}</span>
      </div>
    </div>
  );
}

function CircleMetric({ label, value, max = 100, color = "#3B82F6" }) {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <div className="circle-metric">
      <h3>{label}</h3>
      <div className="circle-container">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
          />
          <text x="60" y="65" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#1f2937">
            {value}%
          </text>
        </svg>
      </div>
    </div>
  );
}

function ScoreBar({ score, level }) {
  const color = RISK_COLORS[level]?.dot || "#10B981";
  return (
    <div className="score-bar-wrap">
      <div className="score-bar-track">
        <div className="score-bar" style={{ width: `${score * 100}%`, background: color }} />
      </div>
      <span className="mono">{(score * 100).toFixed(1)}%</span>
    </div>
  );
}

function genDemoTransaction() {
  const cities  = ["Lahore", "Karachi", "Islamabad", "Faisalabad", "Multan"];
  const devices = ["Android", "iPhone", "Windows PC", "iPad"];
  const isFraud = Math.random() < 0.12;
  const amount  = isFraud ? Math.round(Math.random()*120000+80000) : Math.round(Math.random()*49900+100);
  const score   = isFraud ? Math.random()*0.4+0.55 : Math.random()*0.35;
  const level   = score>=0.75?"CRITICAL":score>=0.5?"HIGH":score>=0.25?"MEDIUM":"LOW";
  return {
    user_id: Math.floor(Math.random()*2000)+1, amount,
    location: cities[Math.floor(Math.random()*cities.length)],
    device: devices[Math.floor(Math.random()*devices.length)],
    hour: isFraud?[1,2,3,23][Math.floor(Math.random()*4)]:Math.floor(Math.random()*14)+8,
    fraud_score: parseFloat(score.toFixed(4)), fraud_flag: isFraud?1:0, risk_level: level,
  };
}

function genDemoProfile(uid) {
  const income=Math.round(Math.random()*480000+20000);
  const spending=Math.round(income*(1.5+Math.random()*1.5));
  const score=parseFloat((Math.random()*0.4+0.55).toFixed(4));
  return { user_id:uid, income, spending, assets:Math.floor(Math.random()*8),
    vehicles:Math.floor(Math.random()*4), tax_risk_score:score,
    risk_level: score>=0.75?"CRITICAL":"HIGH" };
}

export default function App() {
  const [page,setPage]             = useState("dashboard");
  const [viewMode, setViewMode]    = useState("charts"); // 'charts', 'alerts', 'countermeasures'
  const [selectedCity, setSelectedCity] = useState("Lahore");
  const [liveTransactions,setLive] = useState([]);
  const [taxProfiles,setTax]       = useState([]);
  const [overview,setOverview]     = useState({total_transactions:0,fraud_alerts:0});
  const [autoRefresh,setAuto]      = useState(true);
  const [lastUpdated,setLastUp]    = useState(null);
  const [apiOnline,setApiOnline]   = useState(null);
  const [scoreForm,setScoreForm]   = useState({user_id:42,amount:150000,location:"Karachi",device:"Android",hour:2});
  const [scoreResult,setResult]    = useState(null);
  const [scoring,setScoring]       = useState(false);
  const [cityData,setCityData]     = useState([]);
  const [expandedAccordions, setExpandedAccordions] = useState({});

  const checkApi = useCallback(async()=>{
    try{ await axios.get(API.replace("/api/v1","/"),{timeout:2000}); setApiOnline(true); }
    catch{ setApiOnline(false); }
  },[]);

  const fetchLiveData = useCallback(async()=>{
    try{
      const r=await axios.get(`${API}/demo/live-transactions`,{timeout:4000});
      setLive(prev=>[...r.data,...prev].slice(0,60)); setApiOnline(true);
    }catch{ setLive(prev=>[...Array.from({length:6},genDemoTransaction),...prev].slice(0,60)); }
    try{ const p=await axios.get(`${API}/profiles/high-risk`,{timeout:3000}); setTax(p.data.slice(0,20)); }
    catch{ setTax(Array.from({length:10},(_,i)=>genDemoProfile(i+1))); }
    try{ const o=await axios.get(`${API}/stats/overview`,{timeout:3000}); setOverview(o.data); }
    catch{ setOverview(prev=>({total_transactions:(prev.total_transactions||0)+Math.floor(Math.random()*12+5),fraud_alerts:(prev.fraud_alerts||0)+Math.floor(Math.random()*2)})); }
    setLastUp(new Date());
  },[]);

  useEffect(()=>{ checkApi(); fetchLiveData(); },[checkApi,fetchLiveData]);
  useEffect(()=>{
    if(!autoRefresh)return;
    const id=setInterval(fetchLiveData,3000);
    return()=>clearInterval(id);
  },[autoRefresh,fetchLiveData]);

  async function handleScore(){
    setScoring(true); setResult(null);
    try{ const r=await axios.post(`${API}/fraud/score`,scoreForm,{timeout:5000}); setResult(r.data); }
    catch{
      const s=parseFloat((Math.random()*0.5+0.4).toFixed(4));
      setResult({user_id:scoreForm.user_id,fraud_score:s,fraud_flag:s>0.5?1:0,
        risk_level:s>0.7?"HIGH":s>0.4?"MEDIUM":"LOW"});
    }
    setScoring(false);
  }

  const handleCityDataUpdate = (data) => {
    setCityData(data);
  };

  const toggleAccordion = (id) => {
    setExpandedAccordions(prev => ({...prev, [id]: !prev[id]}));
  };

  const fraudCount=liveTransactions.filter(t=>t.fraud_flag).length;
  const fraudRate=liveTransactions.length?((fraudCount/liveTransactions.length)*100).toFixed(1):"0.0";
  const dashboardCityData=(()=>{
    const map={};
    liveTransactions.filter(t=>t.fraud_flag).forEach(t=>{ map[t.location]=(map[t.location]||0)+1; });
    return Object.entries(map).map(([city,count])=>({city,count}));
  })();

  const topFraudItems = liveTransactions
    .filter(t=>t.fraud_flag)
    .sort((a,b)=>b.amount-a.amount)
    .slice(0,4)
    .map(tx=>`FRAUD ID ${tx.user_id} ${tx.amount.toLocaleString()} PKR`);

  const topTaxItems = [...taxProfiles]
    .sort((a,b)=> (b.tax_risk_score||0) - (a.tax_risk_score||0))
    .slice(0,4)
    .map(p=>`TAX ID ${p.user_id} ${Math.round((p.tax_risk_score||0)*100)}% RISK`);

  const tickerItems = topFraudItems.length || topTaxItems.length
    ? [...topFraudItems, ...topTaxItems, ...topFraudItems, ...topTaxItems]
    : ["NO HIGH-RISK ITEMS AVAILABLE"];

  const pageTitle={dashboard:"Overview Dashboard",fraud:"Fraud Monitor",tax:"Tax Risk Profiles",charts:"Charts & Geo-Location",velocity:"Device Velocity",score:"Score a Transaction"};

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <ShieldAlert size={30} className="brand-icon"/>
          <div>
            <div className="brand-name">FRIP</div>
            <div className="brand-sub">Risk Intelligence</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {[["dashboard",Activity,"Dashboard"],["fraud",AlertTriangle,"Fraud Monitor"],["tax",Users,"Tax Risk"],["charts",TrendingUp,"Charts & Maps"],["velocity",Zap,"Device Velocity"],["score",Send,"Score Transaction"]].map(([id,Icon,label])=>(
            <button key={id} className={`nav-item ${page===id?"active":""}`} onClick={()=>setPage(id)}>
              <Icon size={18}/> {label}
            </button>
          ))}
        </nav>

        {/* Sidebar Panels for Charts Page */}
        {page==="charts"&&(
          <>
            {/* Fraud Alerts Button */}
            <button 
              className={`sidebar-detail-btn ${viewMode==="alerts"?"active":""}`}
              onClick={()=>{setViewMode("alerts"); setSelectedCity("Lahore");}}
            >
              <AlertTriangle size={16}/> 
              <div className="btn-content">
                <div className="btn-title">Fraud Alerts</div>
                <div className="btn-sub">by City</div>
              </div>
            </button>

            {/* Counter-Measures Button */}
            <button 
              className={`sidebar-detail-btn ${viewMode==="countermeasures"?"active":""}`}
              onClick={()=>{setViewMode("countermeasures"); setSelectedCity("Lahore");}}
            >
              <Shield size={16}/> 
              <div className="btn-content">
                <div className="btn-title">Counter</div>
                <div className="btn-sub">Measures</div>
              </div>
            </button>
          </>
        )}

        <div className="sidebar-footer">
          <div className={`api-status ${apiOnline===true?"online":apiOnline===false?"offline":"checking"}`}>
            <span className="status-dot"/>
            {apiOnline===true?"API Online":apiOnline===false?"API Offline — Demo Mode":"Checking API…"}
          </div>
          <label className="refresh-toggle">
            <input type="checkbox" checked={autoRefresh} onChange={e=>setAuto(e.target.checked)}/>
            <span>Auto Refresh (3s)</span>
          </label>
          <button className="refresh-btn" onClick={fetchLiveData}><RefreshCw size={14}/> Refresh Now</button>
          {lastUpdated&&<div className="last-updated">Updated {lastUpdated.toLocaleTimeString()}</div>}
        </div>
      </aside>

      <main className="main">
        <header className="page-header">
          <div>
            <h1 className="page-title">{pageTitle[page]}</h1>
            <p className="page-sub">Financial Risk Intelligence Platform — Pakistan</p>
          </div>
          <div className="live-badge"><span className="live-dot"/> LIVE</div>
        </header>

        {page==="dashboard"&&(
          <div className="page-content">
            <div className="ticker-panel">
              <div className="ticker-viewport">
                <div className="ticker-track">
                  {tickerItems.map((item,i)=>(
                    <span key={i} className="ticker-item">{item}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="kpi-grid">
              <KpiCard icon={Database}      label="Transactions Seen"      value={liveTransactions.length}                    sub="Since startup"        color="#3B82F6"/>
              <KpiCard icon={AlertTriangle} label="Fraud Alerts"           value={fraudCount}                                 sub={`${fraudRate}% rate`} color="#EF4444"/>
              <KpiCard icon={Users}         label="High-Risk Tax Profiles" value={taxProfiles.length}                         sub="Evasion flagged"       color="#F59E0B"/>
              <KpiCard icon={TrendingUp}    label="DB Transactions"        value={overview.total_transactions.toLocaleString()} sub="All time"            color="#10B981"/>
            </div>
            <div className="two-col">
              <div className="panel">
                <h2 className="panel-title"><span className="live-dot sm"/> Live Fraud Feed</h2>
                <div className="table-wrap">
                  <table className="data-table">
                    <thead><tr><th>User</th><th>Amount (PKR)</th><th>Location</th><th>Device</th><th>Score</th><th>Risk</th></tr></thead>
                    <tbody>
                      {liveTransactions.slice(0,14).map((tx,i)=>(
                        <tr key={i} className={tx.fraud_flag?"row-fraud":""}>
                          <td className="mono">{tx.user_id}</td>
                          <td className="mono">{tx.amount.toLocaleString()}</td>
                          <td>{tx.location}</td><td>{tx.device}</td>
                          <td><ScoreBar score={tx.fraud_score} level={tx.risk_level}/></td>
                          <td><RiskBadge level={tx.risk_level}/></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="panel">
                <h2 className="panel-title">Fraud Alerts by City</h2>
                {dashboardCityData.length>0?(
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={dashboardCityData} margin={{top:10,right:16,left:0,bottom:20}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" vertical={false}/>
                      <XAxis dataKey="city" tick={{fontSize:12,fill:"#94a3b8",fontWeight:600}} axisLine={{stroke:"rgba(203, 213, 225, 0.2)"}} tickLine={false}/>
                      <YAxis tick={{fontSize:12,fill:"#94a3b8"}} axisLine={{stroke:"rgba(203, 213, 225, 0.2)"}} tickLine={false}/>
                      <Tooltip contentStyle={{borderRadius:12,border:"1px solid rgba(255, 255, 255, 0.2)",background:"rgba(23, 24, 29, 0.95)",color:"#f8fafc",fontSize:13,fontWeight:600}} cursor={{fill:"rgba(255, 255, 255, 0.05)"}}/>
                      <Bar dataKey="count" radius={[4,4,0,0]} maxBarSize={24} fill="#8B5CF6" opacity={0.85}/>
                    </BarChart>
                  </ResponsiveContainer>
                ):<div className="empty-state">No fraud alerts yet — data loads every 3 seconds.</div>}
              </div>
            </div>

            {/* City Fraud Alerts Details */}
            <div className="panel">
              <h2 className="panel-title">📍 Fraud Alerts Details by City</h2>
              {dashboardCityData.length>0?(
                <div className="city-stats-grid">
                  {dashboardCityData.map((city,i)=>{{}
                    const fraudRate = ((city.count / (city.count + city.totalCount - city.count)) * 100).toFixed(1);
                    const severity = city.count > 5 ? "CRITICAL" : city.count > 2 ? "HIGH" : "MEDIUM";
                    return (
                      <div key={i} className="city-stat-card">
                        <div className="city-stat-header">
                          <h3>{city.city}</h3>
                          <span className={`severity-badge severity-${severity.toLowerCase()}`}>{severity}</span>
                        </div>
                        <div className="city-stat-content">
                          <div className="stat-item"><span className="stat-label">Fraud Incidents:</span><span className="stat-value">{city.count}</span></div>
                          <div className="stat-item"><span className="stat-label">Fraud Rate:</span><span className="stat-value">{fraudRate}%</span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ):<div className="empty-state">No fraud alert details available.</div>}
            </div>

            {/* Counter-Measures & Fraud Analysis */}
            <div className="panel counter-measures-panel">
              <h2 className="panel-title"><Shield size={20}/> Counter-Measures & Fraud Analysis</h2>
              {dashboardCityData.length>0?(
                <div className="counter-measures-grid">
                  {dashboardCityData.map((city,i)=>{{}
                    const analysis = FRAUD_ANALYSIS[city.city] || FRAUD_ANALYSIS.Lahore;
                    const severity = city.count > 5 ? "CRITICAL" : city.count > 2 ? "HIGH" : "MEDIUM";
                    return (
                      <div key={i} className="counter-measure-card">
                        <div className="counter-header">
                          <div className="counter-title">
                            <h3>{city.city}</h3>
                          </div>
                          <span className={`counter-badge counter-${severity.toLowerCase()}`}>{city.count} Incidents</span>
                        </div>

                        <div className="counter-section">
                          <h4 className="counter-subtitle"><AlertTriangle size={14}/> Fraud Activity Reasons</h4>
                          <ul className="reason-list">
                            {analysis.reasons.map((reason,j)=>(
                              <li key={j}><span className="reason-indicator">•</span>{reason}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="counter-section">
                          <h4 className="counter-subtitle"><TrendingDown size={14}/> Recommended Counter-Measures</h4>
                          <ul className="measure-list">
                            {analysis.counterMeasures.map((measure,j)=>(
                              <li key={j}><span className="measure-checkbox">✓</span>{measure}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ):<div className="empty-state">No counter-measure data available.</div>}
            </div>
          </div>
        )}

        {page==="fraud"&&(
          <div className="page-content">
            <div className="panel">
              <h2 className="panel-title"><span className="live-dot sm"/> All Recent Transactions</h2>
              <div className="table-wrap">
                <table className="data-table">
                  <thead><tr><th>User</th><th>Amount (PKR)</th><th>Location</th><th>Device</th><th>Hour</th><th>Fraud Score</th><th>Risk</th></tr></thead>
                  <tbody>
                    {liveTransactions.map((tx,i)=>(
                      <tr key={i} className={tx.fraud_flag?"row-fraud":""}>
                        <td className="mono">{tx.user_id}</td>
                        <td className="mono">{tx.amount.toLocaleString()}</td>
                        <td>{tx.location}</td><td>{tx.device}</td>
                        <td className="mono">{tx.hour}:00</td>
                        <td><ScoreBar score={tx.fraud_score} level={tx.risk_level}/></td>
                        <td><RiskBadge level={tx.risk_level}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {page==="tax"&&(
          <div className="page-content">
            <div className="panel">
              <h2 className="panel-title">High-Risk Tax Evasion Profiles</h2>
              {taxProfiles.length===0?(
                <div className="empty-state">Run the ETL pipeline first:<br/><code>python src/data_processing/etl_pipeline.py</code></div>
              ):(
                <div className="table-wrap">
                  <table className="data-table">
                    <thead><tr><th>User ID</th><th>Income (PKR)</th><th>Spending (PKR)</th><th>Assets</th><th>Vehicles</th><th>Tax Risk</th><th>Level</th></tr></thead>
                    <tbody>
                      {taxProfiles.map((p,i)=>(
                        <tr key={i}>
                          <td className="mono">{p.user_id}</td>
                          <td className="mono">{p.income?.toLocaleString?.()??"—"}</td>
                          <td className="mono">{p.spending?.toLocaleString?.()??"—"}</td>
                          <td className="mono">{p.assets}</td><td className="mono">{p.vehicles}</td>
                          <td><ScoreBar score={p.tax_risk_score||0} level={p.risk_level||"HIGH"}/></td>
                          <td><RiskBadge level={p.risk_level||"HIGH"}/></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {page==="charts"&&(
          viewMode==="charts"? (
            <ChartsPage liveTransactions={liveTransactions} taxProfiles={taxProfiles} onCityDataUpdate={handleCityDataUpdate}/>
          ) : viewMode==="alerts"? (
            <FraudAlertsDetail 
              cityGeoData={cityData} 
              selectedCity={selectedCity} 
              onSelectCity={setSelectedCity}
              onBack={()=>setViewMode("charts")}
            />
          ) : (
            <CounterMeasuresDetail 
              cityGeoData={cityData} 
              selectedCity={selectedCity} 
              onSelectCity={setSelectedCity}
              onBack={()=>setViewMode("charts")}
            />
          )
        )}

        {page==="velocity"&&(
          <DeviceVelocity liveTransactions={liveTransactions}/>
        )}

        {page==="score"&&(
          <div className="page-content">
            <div className="two-col">
              <div className="panel">
                <h2 className="panel-title">Transaction Details</h2>
                <div className="form-group"><label>User ID</label>
                  <input type="number" value={scoreForm.user_id} onChange={e=>setScoreForm(f=>({...f,user_id:+e.target.value}))}/>
                </div>
                <div className="form-group"><label>Amount (PKR)</label>
                  <input type="number" value={scoreForm.amount} onChange={e=>setScoreForm(f=>({...f,amount:+e.target.value}))}/>
                </div>
                <div className="form-group"><label>Location</label>
                  <select value={scoreForm.location} onChange={e=>setScoreForm(f=>({...f,location:e.target.value}))}>
                    {["Lahore","Karachi","Islamabad","Faisalabad","Multan"].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Device</label>
                  <select value={scoreForm.device} onChange={e=>setScoreForm(f=>({...f,device:e.target.value}))}>
                    {["Android","iPhone","Windows PC","iPad"].map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Hour of Day — {scoreForm.hour}:00</label>
                  <input type="range" min={0} max={23} value={scoreForm.hour} onChange={e=>setScoreForm(f=>({...f,hour:+e.target.value}))}/>
                </div>
                <div style={{marginTop:8}}>
                  <button className="score-btn" onClick={handleScore} disabled={scoring}>
                    {scoring?<><RefreshCw size={16} className="spin"/> Scoring…</>:<><Send size={16}/> Score Transaction</>}
                  </button>
                </div>
              </div>
              <div className="panel">
                <h2 className="panel-title">Result</h2>
                {!scoreResult
                  ?<div className="empty-state">Fill in the form and click Score Transaction.</div>
                  :(
                    <div className="score-result" style={{background:RISK_COLORS[scoreResult.risk_level]?.bg}}>
                      {scoreResult.fraud_flag
                        ?<AlertTriangle size={52} color={RISK_COLORS[scoreResult.risk_level]?.dot}/>
                        :<CheckCircle size={52} color="#10B981"/>}
                      <div className="score-result-verdict" style={{color:RISK_COLORS[scoreResult.risk_level]?.text}}>
                        {scoreResult.fraud_flag?"⚠ FRAUD DETECTED":"✓ TRANSACTION SAFE"}
                      </div>
                      <div className="score-result-score">Fraud Score: <strong>{(scoreResult.fraud_score*100).toFixed(2)}%</strong></div>
                      <RiskBadge level={scoreResult.risk_level}/>
                      <div className="score-result-meta">User #{scoreResult.user_id}</div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
