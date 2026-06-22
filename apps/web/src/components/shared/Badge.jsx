export default function Badge({ text, color }) {
  return <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 12, background: color + "22", color, fontSize: 12, fontWeight: 700 }}>{text}</span>;
}
