export default function RackBadge({ rackNumber, large = false }) {
  return (
    <div className={`rack-badge ${large ? 'rack-badge-large' : ''}`}>
      <span className="rack-icon">📍</span>
      <span>Rack {rackNumber}</span>
    </div>
  );
}
