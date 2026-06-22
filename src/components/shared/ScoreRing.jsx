import { CITIZEN_COLORS as C } from "../../lib/theme.js";

export default function ScoreRing({ score, size = 120 }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? C.green : score >= 75 ? C.blue : score >= 60 ? C.gold : C.red;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#E0E0E0" strokeWidth={10} />
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={10} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
      <text x={size/2} y={size/2+2} textAnchor="middle" dominantBaseline="middle" style={{ transform: "rotate(90deg)", transformOrigin: "center", fontSize: size * 0.32, fontWeight: 900, fill: color }}>{score}</text>
    </svg>
  );
}
