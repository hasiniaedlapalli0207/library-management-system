export default function StatsCard({ icon, value, label, color }) {
  return (
    <div className="stat-card" style={{ '--stat-accent': color }}>
      <div
        className="stat-icon"
        style={{
          background: `${color}15`,
          color: color,
        }}
      >
        {icon}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
