import { useState, useEffect } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell
} from "recharts";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import {
  AlertTriangle, TrendingUp, TrendingDown, Zap, MapPin, AlertCircle,
  Eye, Lock, Trash2, Settings, Clock, Smartphone, Globe, Filter, ChevronDown, ChevronUp
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import "./DeviceVelocity.css";

const GEO_COORDS = {
  "New York": [40.7128, -74.006],
  "Los Angeles": [34.0522, -118.2437],
  "London": [51.5074, -0.1278],
  "Dubai": [25.2048, 55.2708],
  "Singapore": [1.3521, 103.8198],
  "Tokyo": [35.6762, 139.6503],
  "Sydney": [33.8688, 151.2093],
  "Toronto": [43.6532, -79.3832],
};

// Generate mock device velocity data
function generateDeviceData() {
  const devices = [];
  for (let i = 0; i < 15; i++) {
    const locations = Object.keys(GEO_COORDS);
    const isHighRisk = Math.random() < 0.3;
    devices.push({
      id: `DEV-${String(i + 1).padStart(4, "0")}`,
      fingerprint: `FP${Math.random().toString(36).substr(2, 12).toUpperCase()}`,
      transactionCount: Math.floor(Math.random() * 200 + 10),
      avgInterval: Math.floor(Math.random() * 300 + 30),
      lastLocations: locations
        .sort(() => 0.5 - Math.random())
        .slice(0, 3),
      linkedAccounts: Math.floor(Math.random() * 5 + 1),
      riskScore: Math.random() * 100,
      status: isHighRisk ? "Suspicious" : "Normal",
      lastTransaction: new Date(Date.now() - Math.random() * 3600000),
      velocitySpike: Math.random() * 50,
    });
  }
  return devices;
}

// Generate velocity trend data
function generateVelocityTrend() {
  const trend = [];
  for (let i = 0; i < 24; i++) {
    trend.push({
      hour: `${String(i).padStart(2, "0")}:00`,
      transactions: Math.floor(Math.random() * 150 + 20),
      baseline: 80,
      anomalies: Math.random() < 0.2 ? Math.floor(Math.random() * 10) : 0,
    });
  }
  return trend;
}

export default function DeviceVelocity({ liveTransactions = [] }) {
  const [timeFilter, setTimeFilter] = useState("24h");
  const [devices, setDevices] = useState(generateDeviceData());
  const [velocityTrend, setVelocityTrend] = useState(generateVelocityTrend());
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showRuleConfig, setShowRuleConfig] = useState(false);
  const [rules, setRules] = useState({
    transPerMin: 10,
    minInterval: 30,
    geoVelocity: 500,
  });
  const [sortField, setSortField] = useState("riskScore");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate KPI metrics
  const avgTransPerDevice =
    devices.length > 0
      ? Math.round(devices.reduce((sum, d) => sum + d.transactionCount, 0) / devices.length)
      : 0;

  const highVelocityDevices = devices.filter(d => d.transactionCount > 100).length;

  const avgTimeInterval =
    devices.length > 0
      ? Math.round(devices.reduce((sum, d) => sum + d.avgInterval, 0) / devices.length)
      : 0;

  const flaggedDevices = devices.filter(d => d.status === "Suspicious").length;

  const velocitySpikeEvents = velocityTrend.reduce((sum, t) => sum + t.anomalies, 0);

  // Filter and sort devices
  const filteredDevices = devices
    .filter(d =>
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.fingerprint.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

  const getRiskColor = (score) => {
    if (score >= 80) return "#DC2626";
    if (score >= 60) return "#F59E0B";
    if (score >= 40) return "#3B82F6";
    return "#10B981";
  };

  const getRiskLabel = (score) => {
    if (score >= 80) return "CRITICAL";
    if (score >= 60) return "HIGH";
    if (score >= 40) return "MEDIUM";
    return "LOW";
  };

  const getTrendValue = (current, baseline) => {
    const trend = ((current - baseline) / baseline) * 100;
    return trend > 0 ? `+${trend.toFixed(1)}%` : `${trend.toFixed(1)}%`;
  };

  const getTrendIcon = (current, baseline) => {
    return current > baseline ? (
      <TrendingUp size={16} className="trend-up" />
    ) : (
      <TrendingDown size={16} className="trend-down" />
    );
  };

  return (
    <div className="page-content">
      {/* Top KPI Cards */}
      <div className="kpi-grid velocity-kpi">
        <div className="kpi-velocity-card">
          <div className="kpi-header-velocity">
            <h3>Avg Transactions/Device</h3>
            <Smartphone size={20} />
          </div>
          <div className="kpi-value">{avgTransPerDevice}</div>
          <div className="kpi-meta">
            {getTrendIcon(avgTransPerDevice, 80)}
            <span>{getTrendValue(avgTransPerDevice, 80)}</span>
          </div>
        </div>

        <div className="kpi-velocity-card">
          <div className="kpi-header-velocity">
            <h3>High Velocity Devices</h3>
            <Zap size={20} />
          </div>
          <div className="kpi-value">{highVelocityDevices}</div>
          <div className="kpi-meta">
            <span>{((highVelocityDevices / devices.length) * 100).toFixed(1)}% of total</span>
          </div>
        </div>

        <div className="kpi-velocity-card">
          <div className="kpi-header-velocity">
            <h3>Avg Time Between Tx</h3>
            <Clock size={20} />
          </div>
          <div className="kpi-value">{avgTimeInterval}s</div>
          <div className="kpi-meta">
            {getTrendIcon(avgTimeInterval, 150)}
            <span>Target: 150s</span>
          </div>
        </div>

        <div className="kpi-velocity-card">
          <div className="kpi-header-velocity">
            <h3>Flagged Devices (24h)</h3>
            <AlertTriangle size={20} />
          </div>
          <div className="kpi-value">{flaggedDevices}</div>
          <div className="kpi-meta">
            <span>{((flaggedDevices / devices.length) * 100).toFixed(1)}% suspicious</span>
          </div>
        </div>

        <div className="kpi-velocity-card">
          <div className="kpi-header-velocity">
            <h3>Velocity Spike Events</h3>
            <Zap size={20} />
          </div>
          <div className="kpi-value">{velocitySpikeEvents}</div>
          <div className="kpi-meta">
            <span className="anomaly-alert">Anomalies detected</span>
          </div>
        </div>
      </div>

      {/* Time Filter Controls */}
      <div className="filter-controls">
        <div className="filter-group">
          <label>Time Range:</label>
          <div className="filter-buttons">
            {["1h", "24h", "7d"].map(f => (
              <button
                key={f}
                className={`filter-btn ${timeFilter === f ? "active" : ""}`}
                onClick={() => setTimeFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <button
          className="rule-config-btn"
          onClick={() => setShowRuleConfig(!showRuleConfig)}
        >
          <Settings size={16} /> Rules & Config
        </button>
      </div>

      {/* Velocity Trend Chart */}
      <div className="panel">
        <h2 className="panel-title">Velocity Trend Chart</h2>
        {velocityTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={velocityTrend} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="hour" tick={{ fontSize: 12, fill: "#64748B" }} />
              <YAxis tick={{ fontSize: 12, fill: "#64748B" }} label={{ value: "Transactions per Hour", angle: -90, position: "insideLeft" }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13 }}
                formatter={(value, name) => {
                  if (name === "anomalies") return [value, "Anomalies"];
                  if (name === "baseline") return [value, "Baseline"];
                  return [value, "Actual"];
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="transactions" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorTx)" name="Actual Transactions" />
              <Area type="monotone" dataKey="baseline" stroke="#10B981" strokeWidth={2} fillOpacity={0} name="Baseline" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state">No velocity data available.</div>
        )}
      </div>

      {/* Two Column Layout: Table + Geo Map */}
      <div className="charts-grid">
        {/* High-Risk Devices Table */}
        <div className="panel" style={{ gridColumn: "1 / -1" }}>
          <div className="table-header">
            <h2 className="panel-title">High-Risk Devices</h2>
            <input
              type="text"
              className="search-input"
              placeholder="Search Device ID or Fingerprint..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="table-wrap">
            <table className="data-table device-table">
              <thead>
                <tr>
                  <th onClick={() => { setSortField("id"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>
                    Device ID {sortField === "id" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th>Fingerprint</th>
                  <th onClick={() => { setSortField("transactionCount"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>
                    Tx Count {sortField === "transactionCount" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th>Avg Interval</th>
                  <th>Recent Locations</th>
                  <th>Linked Accts</th>
                  <th onClick={() => { setSortField("riskScore"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }}>
                    Risk Score {sortField === "riskScore" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.slice(0, 8).map((device, idx) => (
                  <tr key={idx} className={device.status === "Suspicious" ? "row-alert" : ""}>
                    <td className="mono bold">{device.id}</td>
                    <td className="mono small">{device.fingerprint}</td>
                    <td className="center">{device.transactionCount}</td>
                    <td className="center">{device.avgInterval}s</td>
                    <td className="small">
                      {device.lastLocations.map(loc => (
                        <span key={loc} className="location-badge">{loc}</span>
                      ))}
                    </td>
                    <td className="center">{device.linkedAccounts}</td>
                    <td>
                      <div
                        className="risk-score-bar"
                        style={{
                          background: getRiskColor(device.riskScore),
                          width: `${device.riskScore}%`,
                        }}
                        title={`${device.riskScore.toFixed(1)}%`}
                      />
                      <span className="mono small">{device.riskScore.toFixed(1)}%</span>
                    </td>
                    <td>
                      <span className={`status-badge status-${device.status.toLowerCase()}`}>
                        {device.status}
                      </span>
                    </td>
                    <td className="actions">
                      <button className="action-btn" onClick={() => setSelectedDevice(device)} title="View Details">
                        <Eye size={14} />
                      </button>
                      <button className="action-btn" title="Flag">
                        <AlertTriangle size={14} />
                      </button>
                      <button className="action-btn danger" title="Block">
                        <Lock size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Geo Velocity Map */}
      <div className="panel">
        <h2 className="panel-title">Geo Velocity Map</h2>
        <MapContainer center={[20, 0]} zoom={2} style={{ height: 500, borderRadius: 12 }} className="dark-map-container">
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CartoDB' />
          {devices.map((device, idx) => {
            const locations = device.lastLocations.slice(0, 2);
            return locations.map((loc, locIdx) => {
              const coords = GEO_COORDS[loc];
              if (!coords) return null;
              return (
                <CircleMarker
                  key={`${device.id}-${locIdx}`}
                  center={coords}
                  radius={12}
                  fillColor="#FBBF24"
                  color="#F59E0B"
                  weight={2}
                  opacity={0.9}
                  fillOpacity={0.85}
                  className="ping-marker"
                >
                  <Popup>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>
                      <strong>{device.id}</strong>
                      <br />
                      Location: {loc}
                      <br />
                      Risk: {device.riskScore.toFixed(1)}%
                      <br />
                      Status: {device.status}
                    </div>
                  </Popup>
                </CircleMarker>
              );
            });
          })}
        </MapContainer>
      </div>

      {/* Rule Configuration Panel */}
      {showRuleConfig && (
        <div className="panel rule-config-panel">
          <div className="rule-header">
            <h2 className="panel-title">Rule Configuration</h2>
            <button className="close-btn" onClick={() => setShowRuleConfig(false)}>✕</button>
          </div>
          <div className="rule-grid">
            <div className="rule-item">
              <label>Transactions per Minute</label>
              <div className="rule-input-group">
                <input
                  type="number"
                  value={rules.transPerMin}
                  onChange={e => setRules({ ...rules, transPerMin: parseInt(e.target.value) })}
                />
                <span className="unit">max/min</span>
              </div>
              <p className="rule-desc">Threshold for transaction velocity spikes</p>
            </div>

            <div className="rule-item">
              <label>Minimum Time Interval</label>
              <div className="rule-input-group">
                <input
                  type="number"
                  value={rules.minInterval}
                  onChange={e => setRules({ ...rules, minInterval: parseInt(e.target.value) })}
                />
                <span className="unit">seconds</span>
              </div>
              <p className="rule-desc">Minimum allowed time between transactions</p>
            </div>

            <div className="rule-item">
              <label>Geo Velocity Limit</label>
              <div className="rule-input-group">
                <input
                  type="number"
                  value={rules.geoVelocity}
                  onChange={e => setRules({ ...rules, geoVelocity: parseInt(e.target.value) })}
                />
                <span className="unit">km/h</span>
              </div>
              <p className="rule-desc">Maximum allowed travel speed between locations</p>
            </div>
          </div>
          <button className="save-rules-btn">Save Rules</button>
        </div>
      )}

      {/* Device Detail Panel */}
      {selectedDevice && (
        <div className="panel device-detail-panel">
          <div className="detail-header">
            <h2 className="panel-title">Device Details: {selectedDevice.id}</h2>
            <button className="close-btn" onClick={() => setSelectedDevice(null)}>✕</button>
          </div>

          <div className="detail-grid">
            <div className="detail-section">
              <h3>Transaction Timeline</h3>
              <div className="timeline">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-marker" />
                    <div className="timeline-content">
                      <p className="time">
                        {new Date(Date.now() - i * 600000).toLocaleTimeString()}
                      </p>
                      <p className="amount">PKR {Math.floor(Math.random() * 100000 + 10000).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>Velocity Stats</h3>
              <div className="stats-grid">
                <div className="stat">
                  <span className="label">Current Velocity</span>
                  <span className="value">{selectedDevice.velocitySpike.toFixed(1)} tx/h</span>
                </div>
                <div className="stat">
                  <span className="label">Baseline</span>
                  <span className="value">35 tx/h</span>
                </div>
                <div className="stat">
                  <span className="label">Spike Factor</span>
                  <span className="value">{(selectedDevice.velocitySpike / 35).toFixed(2)}x</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Linked Accounts</h3>
              <div className="account-list">
                {Array.from({ length: selectedDevice.linkedAccounts }).map((_, i) => (
                  <div key={i} className="account-item">
                    <span className="account-id">ACC-{String(Math.floor(Math.random() * 9000 + 1000)).padStart(4, "0")}</span>
                    <span className="account-status">Active</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>Payment Methods</h3>
              <div className="payment-list">
                {["Credit Card", "Debit Card", "Mobile Wallet"].map((method, i) => (
                  <div key={i} className="payment-item">
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="behavior-summary">
            <h3>Behavior Summary</h3>
            <p>
              Device {selectedDevice.id} shows {selectedDevice.status === "Suspicious" ? "suspicious " : "normal "}
              activity patterns with {selectedDevice.transactionCount} transactions in recent period. 
              Average interval between transactions is {selectedDevice.avgInterval} seconds. 
              Device is linked to {selectedDevice.linkedAccounts} account(s) and shows activity across
              {selectedDevice.lastLocations.length} locations.
            </p>
          </div>
        </div>
      )}

      {/* AI Risk Insights Panel */}
      <div className="panel ai-insights-panel">
        <h2 className="panel-title">
          <AlertCircle size={20} /> AI Risk Insights
        </h2>
        <div className="insights-grid">
          <div className="insight-card insight-spike">
            <div className="insight-icon">⚡</div>
            <h4>Sudden Velocity Spike</h4>
            <p>{velocitySpikeEvents} devices showing unusual transaction velocity in last 24h</p>
            <span className="insight-severity">HIGH</span>
          </div>

          <div className="insight-card insight-multidev">
            <div className="insight-icon">🔗</div>
            <h4>Multi-Account Usage</h4>
            <p>
              {devices.filter(d => d.linkedAccounts > 2).length} devices linked to 3+ accounts —
              possible account takeover
            </p>
            <span className="insight-severity">HIGH</span>
          </div>

          <div className="insight-card insight-bot">
            <div className="insight-icon">🤖</div>
            <h4>Bot-Like Patterns</h4>
            <p>
              {devices.filter(d => d.avgInterval < 60).length} devices show mechanical transaction patterns
              with consistent time intervals
            </p>
            <span className="insight-severity">MEDIUM</span>
          </div>

          <div className="insight-card insight-geo">
            <div className="insight-icon">🌍</div>
            <h4>Impossible Travel</h4>
            <p>
              {devices.filter(d => d.lastLocations.length > 2).length} devices show geographically impossible
              transaction sequences
            </p>
            <span className="insight-severity">CRITICAL</span>
          </div>

          <div className="insight-card insight-timing">
            <div className="insight-icon">⏱️</div>
            <h4>Off-Hour Activity</h4>
            <p>18% transactions occurring outside user's normal activity window (9 PM - 6 AM)</p>
            <span className="insight-severity">MEDIUM</span>
          </div>

          <div className="insight-card insight-anomaly">
            <div className="insight-icon">🚨</div>
            <h4>Anomaly Detection</h4>
            <p>
              {devices.filter(d => d.riskScore > 70).length} devices flagged by anomaly detection model
              with confidence &gt; 95%
            </p>
            <span className="insight-severity">HIGH</span>
          </div>
        </div>
      </div>
    </div>
  );
}
