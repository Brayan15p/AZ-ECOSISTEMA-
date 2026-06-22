export default function Tab({ active, label, onClick, count }) {
  return (
    <button onClick={onClick} style={{ padding: "10px 18px", border: "none", borderBottom: active ? `3px solid #2A5580` : "3px solid transparent", background: "transparent", color: active ? "#2A5580" : "#37474F", fontWeight: active ? 700 : 500, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}>
      {label}
      {count !== undefined && <span style={{ background: active ? "#2A5580" : "#CCC", color: "#FFF", borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{count}</span>}
    </button>
  );
}
