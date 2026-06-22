import { useState } from "react";
import AZNeuralGridOS from "../features/operador/AZNeuralGridOS.jsx";
import AZMiBarrio from "../features/ciudadano/AZMiBarrio.jsx";

export default function AZEcosistema() {
  const [mode, setMode] = useState(null);

  // Barra superior de cambio de modo (clara y siempre visible)
  const ModeBar = ({ color, label, otherLabel, otherMode }) => (
    <div style={{ position: "sticky", top: 0, zIndex: 9999, background: color, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px", borderBottom: "2px solid rgba(255,255,255,0.2)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => setMode(null)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>← Menú</button>
        <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>Modo: {label}</span>
      </div>
      <button onClick={() => setMode(otherMode)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "#fff", color: color, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>⇄ Ir a {otherLabel}</button>
    </div>
  );

  if (mode === "operador") {
    return (
      <div>
        <ModeBar color="#1B3A5C" label="Operador (AZ CORP)" otherLabel="Ciudadano" otherMode="ciudadano" />
        <AZNeuralGridOS />
      </div>
    );
  }
  if (mode === "ciudadano") {
    return (
      <div>
        <ModeBar color="#3A5C2E" label="Ciudadano (Mi Barrio)" otherLabel="Operador" otherMode="operador" />
        <AZMiBarrio />
      </div>
    );
  }

  // Mode selector screen
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #1B3A5C, #3A5C2E)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 24 }}>
      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "40px 32px", maxWidth: 440, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", textAlign: "center" }}>
        <div style={{ fontSize: 30, fontWeight: 900, color: "#1B3A5C", letterSpacing: 2 }}>AZ <span style={{ color: "#3A5C2E" }}>CORPORATION</span></div>
        <div style={{ fontSize: 12, color: "#7A8A8A", letterSpacing: 3, marginBottom: 8 }}>ECOSISTEMA DIGITAL</div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 32 }}>Selecciona el modo de acceso</div>

        <button onClick={() => setMode("operador")} style={{ width: "100%", padding: "20px", borderRadius: 16, border: "2px solid #1B3A5C", background: "#1B3A5C", color: "#fff", cursor: "pointer", marginBottom: 16, textAlign: "left", display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 32 }}>🖥️</span>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800 }}>AZ Neural Grid OS</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>Operador · IRSU, CCAR, supervisores</div>
          </div>
        </button>

        <button onClick={() => setMode("ciudadano")} style={{ width: "100%", padding: "20px", borderRadius: 16, border: "2px solid #3A5C2E", background: "#3A5C2E", color: "#fff", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 32 }}>📱</span>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800 }}>AZ Mi Barrio</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>Ciudadano · Hogares de Arauca</div>
          </div>
        </button>

        <div style={{ fontSize: 11, color: "#aaa", marginTop: 24 }}>Las publicaciones creadas en modo Operador aparecen en modo Ciudadano · Ecosistema compartido</div>
      </div>
    </div>
  );
}
