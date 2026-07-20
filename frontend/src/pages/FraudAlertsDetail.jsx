import { ArrowLeft, AlertTriangle } from 'lucide-react';

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

export default function FraudAlertsDetail({ cityGeoData, selectedCity, onSelectCity, onBack }) {
  if (!cityGeoData || cityGeoData.length === 0) {
    return (
      <div className="page-content detail-view">
        <div className="detail-header">
          <button className="back-btn" onClick={onBack}><ArrowLeft size={18} /> Back to Charts</button>
          <h2>Fraud Alerts by City</h2>
        </div>
        <div className="empty-state">No fraud data available yet. Wait for transactions to load.</div>
      </div>
    );
  }

  const selected = cityGeoData.find(c => c.city === selectedCity) || cityGeoData[0];
  
  // Determine severity level based on fraud rate
  const getSeverity = (fraudRate) => {
    if (fraudRate > 50) return "CRITICAL";
    if (fraudRate > 30) return "HIGH";
    if (fraudRate > 10) return "MEDIUM";
    return "LOW";
  };

  const severity = getSeverity(selected.fraudRate || 0);

  return (
    <div className="page-content detail-view">
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}><ArrowLeft size={18} /> Back to Charts</button>
        <h2>Fraud Alerts by City</h2>
      </div>

      {/* City Selector */}
      <div className="city-selector-panel">
        <div className="selector-label">Select City:</div>
        <div className="city-pills">
          {cityGeoData.map(city => (
            <button
              key={city.city}
              className={`city-pill ${city.city === selectedCity ? 'active' : ''}`}
              onClick={() => onSelectCity(city.city)}
            >
              {city.city}
            </button>
          ))}
        </div>
      </div>

      {/* Selected City Details */}
      <div className="detail-content">
        <div className="panel">
          <div className="detail-city-header">
            <h3>{selected.city}</h3>
            <RiskBadge level={severity} />
          </div>

          {/* Key Metrics */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-label">Fraud Incidents</div>
              <div className="metric-value">{selected.fraudCount || 0}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Fraud Rate</div>
              <div className="metric-value">{(selected.fraudRate || 0).toFixed(1)}%</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Status</div>
              <div className="metric-value" style={{ fontSize: '14px' }}>{severity}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Last Updated</div>
              <div className="metric-value" style={{ fontSize: '12px' }}>Just now</div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="detail-section">
            <h4 className="section-title"><AlertTriangle size={16} /> Fraud Pattern Analysis</h4>
            <p className="section-description">
              {selected.city} is showing {severity === 'CRITICAL' ? 'critical' : severity === 'HIGH' ? 'high' : severity === 'MEDIUM' ? 'moderate' : 'low'} fraud activity levels. 
              The fraud rate of {(selected.fraudRate || 0).toFixed(1)}% indicates {severity === 'CRITICAL' ? 'immediate action is required' : severity === 'HIGH' ? 'urgent attention needed' : 'monitoring recommended'}.
            </p>
          </div>

          {/* Recent Incidents */}
          <div className="detail-section">
            <h4 className="section-title">Recent Fraud Incidents</h4>
            <div className="incidents-list">
              <div className="incident-item">
                <span className="incident-time">Moments ago</span>
                <span className="incident-desc">High-value transaction flagged in {selected.city}</span>
                <span className="incident-badge critical">CRITICAL</span>
              </div>
              <div className="incident-item">
                <span className="incident-time">2 min ago</span>
                <span className="incident-desc">Unusual device pattern detected</span>
                <span className="incident-badge high">HIGH</span>
              </div>
              <div className="incident-item">
                <span className="incident-time">5 min ago</span>
                <span className="incident-desc">Bulk transaction attempt blocked</span>
                <span className="incident-badge high">HIGH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
