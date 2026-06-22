import { Link } from "react-router-dom";
import { BRAND, OPERATOR_COLORS, CITIZEN_COLORS } from "../lib/theme.js";
import { useDocumentMeta } from "../lib/useDocumentMeta.js";

const FEATURES = [
  {
    icon: "📊",
    title: "Trazabilidad por hogar",
    text: "Puntaje, historial de auditorías y estado de cumplimiento de cada vivienda, en tiempo real."
  },
  {
    icon: "♻️",
    title: "Economía circular",
    text: "Seguimiento diario de toneladas por flujo de residuo y pureza del material reciclable."
  },
  {
    icon: "🏆",
    title: "Incentivos y penalizaciones",
    text: "Puntos, recompensas y sanciones que conectan directamente con la tarifa del servicio de aseo."
  },
  {
    icon: "📣",
    title: "Comunicación compartida",
    text: "Las publicaciones del operador llegan al instante a todos los hogares en AZ Mi Barrio."
  }
];

const STEPS = [
  { n: "01", title: "El IRSU audita", text: "Inspectores y supervisores registran auditorías y clasificación por hogar desde AZ Neural Grid OS." },
  { n: "02", title: "El puntaje se actualiza", text: "Cada hogar ve su puntaje, nivel y próximas recolecciones en AZ Mi Barrio." },
  { n: "03", title: "El barrio reacciona", text: "Recompensas, descuentos y campañas educativas conectan al operador con cada ciudadano." }
];

function NavBar() {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
      <nav style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px" }}>
        <span style={{ fontSize: 18, fontWeight: 900, color: BRAND.navy, letterSpacing: 1 }}>
          AZ <span style={{ color: BRAND.green }}>ECOSISTEMA</span>
        </span>
        <Link
          to="/app"
          className="az-link-btn"
          style={{ padding: "10px 20px", borderRadius: 999, background: BRAND.navy, color: "#fff", fontWeight: 700, fontSize: 14 }}
        >
          Acceder →
        </Link>
      </nav>
    </header>
  );
}

export default function Landing() {
  useDocumentMeta(
    "AZ Ecosistema — Gestión integral de residuos sólidos en Arauca",
    "Panel para operadores y app ciudadana, en un solo ecosistema digital de AZ CORPORATION para la gestión de residuos en Arauca."
  );

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#FAFBFC", color: "#1B2430" }}>
      <NavBar />

      <main>
        {/* Hero */}
        <section
          style={{
            background: BRAND.gradient,
            color: "#fff",
            padding: "76px 24px 96px",
            textAlign: "center"
          }}
        >
          <div className="az-fade-up" style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={{ fontSize: 13, letterSpacing: 3, opacity: 0.85, fontWeight: 700, marginBottom: 14 }}>
              AZ CORPORATION · ARAUCA
            </p>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 900, lineHeight: 1.15, margin: 0 }}>
              Un solo ecosistema digital para gestionar residuos sólidos en Arauca
            </h1>
            <p style={{ fontSize: 17, opacity: 0.92, marginTop: 18, lineHeight: 1.6 }}>
              Operadores, IRSU y CCAR de un lado. Hogares y ciudadanos del otro.
              Mismos datos, mismas publicaciones, un solo lugar.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
              <Link
                to="/app"
                className="az-link-btn"
                style={{ padding: "16px 28px", borderRadius: 14, background: "#fff", color: BRAND.navy, fontWeight: 800, fontSize: 15, boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}
              >
                🖥️ Entrar como Operador
              </Link>
              <Link
                to="/app"
                className="az-link-btn"
                style={{ padding: "16px 28px", borderRadius: 14, background: "rgba(255,255,255,0.12)", color: "#fff", fontWeight: 800, fontSize: 15, border: "2px solid rgba(255,255,255,0.5)" }}
              >
                📱 Entrar como Ciudadano
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px" }}>
          <h2 style={{ textAlign: "center", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 900, color: BRAND.navy, marginBottom: 8 }}>
            Todo lo que necesita un ecosistema de residuos
          </h2>
          <p style={{ textAlign: "center", color: "#667", maxWidth: 560, margin: "0 auto 44px" }}>
            Diseñado para que IRSU, CCAR, supervisores y hogares trabajen sobre la misma información, sin fricción.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="az-fade-up"
                style={{ animationDelay: `${i * 0.08}s`, background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
              >
                <div style={{ fontSize: 28 }} aria-hidden="true">{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: BRAND.navy, margin: "12px 0 6px" }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#667", lineHeight: 1.5, margin: 0 }}>{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section style={{ background: "#fff", padding: "64px 24px", borderTop: "1px solid rgba(0,0,0,0.06)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 900, color: BRAND.navy, marginBottom: 44 }}>
              Cómo funciona
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 28 }}>
              {STEPS.map((s) => (
                <div key={s.n}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: "rgba(27,58,92,0.18)" }}>{s.n}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: BRAND.navy, margin: "4px 0 6px" }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: "#667", lineHeight: 1.5, margin: 0 }}>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Two modes */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            <Link
              to="/app"
              className="az-link-btn"
              style={{ display: "block", borderRadius: 20, padding: 32, background: OPERATOR_COLORS.navy, color: "#fff" }}
            >
              <div style={{ fontSize: 34 }} aria-hidden="true">🖥️</div>
              <h3 style={{ fontSize: 20, fontWeight: 900, margin: "14px 0 6px" }}>AZ Neural Grid OS</h3>
              <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.6, margin: 0 }}>
                Panel operativo para IRSU, CCAR y supervisores: hogares, recicladores, penalizaciones, recompensas y reportes operativos.
              </p>
            </Link>
            <Link
              to="/app"
              className="az-link-btn"
              style={{ display: "block", borderRadius: 20, padding: 32, background: CITIZEN_COLORS.green, color: "#fff" }}
            >
              <div style={{ fontSize: 34 }} aria-hidden="true">📱</div>
              <h3 style={{ fontSize: 20, fontWeight: 900, margin: "14px 0 6px" }}>AZ Mi Barrio</h3>
              <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.6, margin: 0 }}>
                App ciudadana: puntaje del hogar, próximas recolecciones, recompensas y noticias del operador en tu zona.
              </p>
            </Link>
          </div>
        </section>
      </main>

      <footer style={{ padding: "28px 24px", textAlign: "center", fontSize: 12, color: "#99a" }}>
        © {new Date().getFullYear()} AZ CORPORATION · Ecosistema digital para la gestión de residuos sólidos en Arauca
      </footer>
    </div>
  );
}
