import { ArrowLeft, Shield, AlertTriangle, TrendingDown } from 'lucide-react';

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

export default function CounterMeasuresDetail({ cityGeoData, selectedCity, onSelectCity, onBack }) {
  if (!cityGeoData || cityGeoData.length === 0) {
    return (
      <div className="page-content detail-view">
        <div className="detail-header">
          <button className="back-btn" onClick={onBack}><ArrowLeft size={18} /> Back to Charts</button>
          <h2>Counter-Measures & Fraud Analysis</h2>
        </div>
        <div className="empty-state">No fraud data available yet. Wait for transactions to load.</div>
      </div>
    );
  }

  const selected = cityGeoData.find(c => c.city === selectedCity) || cityGeoData[0];
  const analysis = FRAUD_ANALYSIS[selected.city] || FRAUD_ANALYSIS.Lahore;

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
        <h2>Counter-Measures & Fraud Analysis</h2>
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
            <div>
              <h3>{selected.city}</h3>
              <p className="city-subtitle">{selected.fraudCount || 0} fraud incidents detected</p>
            </div>
            <div className="severity-indicator" style={{
              background: severity === 'CRITICAL' ? '#DC2626' : severity === 'HIGH' ? '#F59E0B' : severity === 'MEDIUM' ? '#3B82F6' : '#10B981',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '14px',
            }}>
              {severity}
            </div>
          </div>

          {/* Fraud Patterns Section */}
          <div className="detail-section">
            <h4 className="section-title"><AlertTriangle size={16} /> Common Fraud Patterns in {selected.city}</h4>
            <ul className="patterns-list">
              {analysis.reasons.map((reason, idx) => (
                <li key={idx} className="pattern-item">
                  <span className="pattern-icon">⚠</span>
                  <span className="pattern-text">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Counter-Measures Section */}
          <div className="detail-section">
            <h4 className="section-title"><Shield size={16} /> Recommended Counter-Measures</h4>
            <div className="measures-grid">
              {analysis.counterMeasures.map((measure, idx) => (
                <div key={idx} className="measure-item">
                  <div className="measure-checkbox">
                    <input type="checkbox" id={`measure-${idx}`} defaultChecked={idx < 2} />
                    <label htmlFor={`measure-${idx}`}></label>
                  </div>
                  <label htmlFor={`measure-${idx}`} className="measure-label">
                    {measure}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Implementation Priority Section */}
          <div className="detail-section">
            <h4 className="section-title"><TrendingDown size={16} /> Implementation Priority</h4>
            <div className="priority-stages">
              <div className="priority-stage immediate">
                <div className="stage-label">IMMEDIATE (Next 24h)</div>
                <ul>
                  <li>{analysis.counterMeasures[0]}</li>
                  <li>{analysis.counterMeasures[1]}</li>
                </ul>
              </div>
              <div className="priority-stage urgent">
                <div className="stage-label">URGENT (This Week)</div>
                <ul>
                  <li>{analysis.counterMeasures[2]}</li>
                </ul>
              </div>
              <div className="priority-stage standard">
                <div className="stage-label">STANDARD (This Month)</div>
                <ul>
                  <li>{analysis.counterMeasures[3]}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
