import { useState, useEffect } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { AlertTriangle, Shield, MapPin, TrendingDown } from "lucide-react";
import "leaflet/dist/leaflet.css";

const CITY_COORDS = {
  Lahore: [31.5204, 74.3587],
  Karachi: [24.8607, 67.0011],
  Islamabad: [33.6844, 73.0479],
  Faisalabad: [31.4181, 72.7975],
  Multan: [30.1575, 71.4410],
};

// Counter-measures and fraud analysis by city and transaction pattern
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

const RISK_SEVERITY = {
  CRITICAL: { color: "#DC2626", bg: "#FEE2E2" },
  HIGH: { color: "#F59E0B", bg: "#FEF3C7" },
  MEDIUM: { color: "#3B82F6", bg: "#DBEAFE" },
  LOW: { color: "#10B981", bg: "#D1FAE5" },
};

export default function ChartsPage({ liveTransactions, taxProfiles, onCityDataUpdate }) {
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [cityGeoData, setCityGeoData] = useState([]);
  const [riskTimeData, setRiskTimeData] = useState([]);

  // Process real-time transaction data for time series chart
  useEffect(() => {
    if (liveTransactions.length === 0) return;

    const grouped = {};
    liveTransactions.slice(0, 30).forEach((tx, idx) => {
      const time = `${String(idx % 24).padStart(2, "0")}:00`;
      if (!grouped[time]) {
        grouped[time] = { time, count: 0, fraudCount: 0, totalAmount: 0 };
      }
      grouped[time].count += 1;
      if (tx.fraud_flag) grouped[time].fraudCount += 1;
      grouped[time].totalAmount += tx.amount;
    });

    const data = Object.values(grouped).sort((a, b) => a.time.localeCompare(b.time));
    setTimeSeriesData(data);
  }, [liveTransactions]);

  // Process geo-location data by city
  useEffect(() => {
    const cityMap = {};
    liveTransactions.forEach((tx) => {
      if (!cityMap[tx.location]) {
        cityMap[tx.location] = { city: tx.location, fraudCount: 0, totalCount: 0, amount: 0 };
      }
      cityMap[tx.location].totalCount += 1;
      if (tx.fraud_flag) cityMap[tx.location].fraudCount += 1;
      cityMap[tx.location].amount += tx.amount;
    });

    const data = Object.values(cityMap);
    setCityGeoData(data);
    if (onCityDataUpdate) onCityDataUpdate(data);
  }, [liveTransactions, onCityDataUpdate]);

  // Process risk trend over time
  useEffect(() => {
    if (liveTransactions.length === 0) return;

    const trend = [];
    liveTransactions.slice(0, 20).forEach((tx, idx) => {
      trend.push({
        time: idx,
        fraudScore: (tx.fraud_score * 100).toFixed(1),
        riskLevel: tx.risk_level === "CRITICAL" ? 4 : tx.risk_level === "HIGH" ? 3 : tx.risk_level === "MEDIUM" ? 2 : 1,
      });
    });

    setRiskTimeData(trend);
  }, [liveTransactions]);

  return (
    <div className="page-content">
      {/* Real-time Transaction Volume Chart - Full Width */}
      <div className="panel">
        <h2 className="panel-title">Real-Time Transaction Volume</h2>
        {timeSeriesData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={timeSeriesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#64748B" }} />
              <YAxis tick={{ fontSize: 12, fill: "#64748B" }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13 }} />
              <Area type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" name="Total Transactions" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state">No transaction data available.</div>
        )}
      </div>

      {/* Full-width layout: Risk Trend + Geo Map */}
      <div className="charts-grid">
        {/* Risk Score Trend */}
        <div className="panel">
          <h2 className="panel-title">Fraud Risk Trend</h2>
          {riskTimeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={riskTimeData} margin={{ top: 5, right: 20, left: -10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#64748B" }} label={{ value: "Transaction Index", position: "insideBottomRight", offset: -30 }} />
                <YAxis tick={{ fontSize: 12, fill: "#64748B" }} label={{ value: "Risk Level", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13 }}
                  formatter={(value) => {
                    if (typeof value === "number") return value > 3 ? "CRITICAL" : value > 2 ? "HIGH" : value > 1 ? "MEDIUM" : "LOW";
                    return value;
                  }}
                />
                <Line type="monotone" dataKey="riskLevel" stroke="#EF4444" strokeWidth={3} dot={false} name="Risk Level" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">No risk data available.</div>
          )}
        </div>

        {/* Geo-Location Map */}
        <div className="panel">
          <h2 className="panel-title">Fraud Distribution by City</h2>
          {cityGeoData.length > 0 ? (
            <MapContainer center={[30.3753, 69.3451]} zoom={5} style={{ height: 300, borderRadius: 12 }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
              {cityGeoData.map((city) => {
                const coords = CITY_COORDS[city.city];
                if (!coords) return null;
                const radius = Math.max(10, Math.min(50, city.fraudCount * 5));
                const color = city.fraudCount > 5 ? "#EF4444" : city.fraudCount > 2 ? "#F59E0B" : "#10B981";
                return (
                  <CircleMarker
                    key={city.city}
                    center={coords}
                    radius={radius}
                    fillColor={color}
                    color={color}
                    weight={2}
                    opacity={0.8}
                    fillOpacity={0.6}
                  >
                    <Popup>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>
                        <strong>{city.city}</strong>
                        <br />
                        Fraud: {city.fraudCount}/{city.totalCount}
                        <br />
                        Amount: {(city.amount / 1000).toFixed(0)}k PKR
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          ) : (
            <div className="empty-state">No city data available.</div>
          )}
        </div>
      </div>
    </div>
  );
}
