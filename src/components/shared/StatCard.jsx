export default function StatCard({ label, value, sub, color, icon }) {
  return (
    <div style={{ background: "#FFFFFF", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderLeft: `4px solid ${color}`, flex: "1 1 180px", minWidth: 170 }}>
      <div style={{ fontSize: 12, color: "#37474F", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{icon} {label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color, marginTop: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}
