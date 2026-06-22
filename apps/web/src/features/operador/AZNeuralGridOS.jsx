import { useState, useEffect, useCallback } from "react";
import { OPERATOR_COLORS as COLORS } from "../../lib/theme.js";
import { AZ_LOGO } from "../../assets/logos.js";
import { INITIAL_DATA } from "../../data/initialData.js";
import { getScoreColor, getStatusLabel } from "../../lib/scoring.js";
import StatCard from "../../components/shared/StatCard.jsx";
import MiniBar from "../../components/shared/MiniBar.jsx";
import Badge from "../../components/shared/Badge.jsx";
import Tab from "../../components/shared/Tab.jsx";

function AZNeuralGridOS() {
  const [data, setData] = useState(INITIAL_DATA);
  const [tab, setTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({});
  const [detailHH, setDetailHH] = useState(null);
  const [filterZone, setFilterZone] = useState("Todas");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [publications, setPublications] = useState([]);
  const [pubForm, setPubForm] = useState({ type: "anuncio", title: "", body: "", media: "", fileData: "", fileName: "", fileKind: "" });
  const [uploading, setUploading] = useState(false);
  const [pubStatusMsg, setPubStatusMsg] = useState("");

  // Load data from persistent storage on mount
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get("az-neural-grid-data");
        if (result && result.value) {
          setData(JSON.parse(result.value));
        }
      } catch (e) {
        // First time or no data yet
      }
      setLoading(false);
    })();
  }, []);

  const saveData = useCallback(async (newData) => {
    setData(newData);
    try {
      await window.storage.set("az-neural-grid-data", JSON.stringify(newData));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }, []);

  const addLog = useCallback((action, detail) => {
    setData(prev => {
      const log = { id: `L${Date.now()}`, timestamp: new Date().toISOString(), action, detail };
      const newData = { ...prev, logs: [log, ...prev.logs].slice(0, 200) };
      try { window.storage.set("az-neural-grid-data", JSON.stringify(newData)); } catch (e) {}
      return newData;
    });
  }, []);

  // Load shared publications (ecosystem) — con auto-reparación si la clave está corrupta
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("az-ecosystem-publications", true);
        if (r && r.value) {
          const parsed = JSON.parse(r.value);
          if (Array.isArray(parsed)) setPublications(parsed);
          else { await window.storage.set("az-ecosystem-publications", "[]", true); setPublications([]); }
        }
      } catch (e) {
        // Clave corrupta: resetear automáticamente
        try { await window.storage.set("az-ecosystem-publications", "[]", true); } catch (e2) {}
        setPublications([]);
      }
    })();
  }, []);

  const savePublications = useCallback(async (pubs) => {
    setPublications(pubs); // UI primero
    try {
      await window.storage.set("az-ecosystem-publications", JSON.stringify(pubs), true);
      return true;
    } catch (e) {
      // Si falla, reintentar sin datos de archivo pesados
      try {
        const slim = pubs.map(p => (p.fileData && p.fileData.length > 300000) ? { ...p, fileData: "", fileKind: "" } : p);
        await window.storage.set("az-ecosystem-publications", JSON.stringify(slim), true);
        setPublications(slim);
        return true;
      } catch (e2) { return false; }
    }
  }, []);

  const clearAllPublications = useCallback(async () => {
    // Sin confirm() — acción directa porque confirm puede estar bloqueado en artifacts
    setPublications([]);
    setPubStatusMsg("Limpiando...");
    try {
      await window.storage.set("az-ecosystem-publications", "[]", true);
      setPubStatusMsg("✓ Todas las publicaciones fueron eliminadas");
    } catch (e) {
      try {
        await window.storage.delete("az-ecosystem-publications", true);
        setPubStatusMsg("✓ Publicaciones eliminadas");
      } catch (e2) {
        setPubStatusMsg("Recarga la app para completar la limpieza");
      }
    }
    setTimeout(() => setPubStatusMsg(""), 3000);
  }, []);

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const MAX = 3 * 1024 * 1024; // 3MB límite estricto
    if (file.type.startsWith("video/")) {
      alert("Para videos, usa el campo 'Enlace de video YouTube' de arriba.\n\nLos archivos de video son demasiado pesados para guardarse dentro de la app y no se reproducen. Súbelo a YouTube (gratis) y pega el enlace; así se ve perfecto.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX) {
      alert(`El archivo pesa ${(file.size/1024/1024).toFixed(1)}MB. El máximo es 3MB.\n\nComprime la imagen o PDF, o usa un enlace.`);
      e.target.value = "";
      return;
    }
    let kind = "doc";
    if (file.type.startsWith("image/")) kind = "image";
    else if (file.type === "application/pdf") kind = "pdf";
    else if (file.type.startsWith("audio/")) kind = "audio";
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setPubForm(pf => ({ ...pf, fileData: reader.result, fileName: file.name, fileKind: kind }));
      setUploading(false);
    };
    reader.onerror = () => { alert("Error al leer el archivo."); setUploading(false); };
    reader.readAsDataURL(file);
  }, []);

  const addPublication = useCallback(() => {
    if (!pubForm.title || !pubForm.body) { alert("Completa título y contenido."); return; }
    const pub = { id: `PUB${Date.now()}`, ...pubForm, date: new Date().toISOString(), author: "AZ CORPORATION" };
    const updated = [pub, ...publications].slice(0, 50);
    savePublications(updated);
    setPubForm({ type: "anuncio", title: "", body: "", media: "", fileData: "", fileName: "", fileKind: "" });
    addLog("Publicación", `${pubForm.type}: ${pubForm.title}`);
  }, [pubForm, publications, savePublications, addLog]);

  const deletePublication = useCallback(async (id) => {
    // Sin confirm() — borrado directo
    const updated = publications.filter(p => p.id !== id);
    setPublications(updated); // quitar de la UI de inmediato
    try {
      await window.storage.set("az-ecosystem-publications", JSON.stringify(updated), true);
    } catch (e) {
      // Si falla, reintentar limpiando datos de archivo
      try {
        const slim = updated.map(p => ({ ...p, fileData: "", fileKind: "" }));
        await window.storage.set("az-ecosystem-publications", JSON.stringify(slim), true);
        setPublications(slim);
      } catch (e2) {
        // Último recurso: limpiar todo
        try { await window.storage.set("az-ecosystem-publications", "[]", true); setPublications([]); } catch (e3) {}
      }
    }
  }, [publications]);

  // Save data to persistent storage on change
  const updateHouseholdScore = useCallback((id, newScore) => {
    const newData = {
      ...data,
      households: data.households.map(h => h.id === id ? { ...h, score: newScore, status: getStatusLabel(newScore), lastAudit: new Date().toISOString().split("T")[0] } : h)
    };
    saveData(newData);
    addLog("Puntuación", `${id} → ${newScore} puntos (${getStatusLabel(newScore)})`);
  }, [data, saveData, addLog]);

  const addPoints = useCallback((id, pts) => {
    const newData = {
      ...data,
      households: data.households.map(h => h.id === id ? { ...h, points: h.points + pts } : h)
    };
    saveData(newData);
    addLog("Puntos", `+${pts} puntos a ${id}`);
  }, [data, saveData, addLog]);

  const addPenalty = useCallback((householdId, type, description, severity) => {
    const penalty = { id: `P${Date.now()}`, householdId, date: new Date().toISOString().split("T")[0], type, description, severity, resolved: false };
    const hh = data.households.find(h => h.id === householdId);
    const scoreDelta = severity === "Grave" ? -15 : severity === "Moderada" ? -10 : -5;
    const newData = {
      ...data,
      penalties: [penalty, ...data.penalties],
      households: data.households.map(h => h.id === householdId ? { ...h, penalties: h.penalties + 1, score: Math.max(0, h.score + scoreDelta), status: getStatusLabel(Math.max(0, h.score + scoreDelta)) } : h)
    };
    saveData(newData);
    addLog("Penalización", `${type} (${severity}) a ${householdId} — ${hh?.owner || ""}`);
  }, [data, saveData, addLog]);

  const addReward = useCallback((householdId, type, description, pts) => {
    const reward = { id: `RW${Date.now()}`, householdId, date: new Date().toISOString().split("T")[0], type, description, points: pts };
    const newData = {
      ...data,
      rewards: [reward, ...data.rewards],
      households: data.households.map(h => h.id === householdId ? { ...h, rewards: h.rewards + 1, points: h.points + pts } : h)
    };
    saveData(newData);
    addLog("Reconocimiento", `${type} (+${pts} pts) a ${householdId}`);
  }, [data, saveData, addLog]);

  const addHousehold = useCallback((hh) => {
    const id = `H${String(data.households.length + 1).padStart(3, "0")}`;
    const newHH = { id, ...hh, score: 70, status: "Cumple", points: 0, penalties: 0, rewards: 0, lastAudit: new Date().toISOString().split("T")[0] };
    const newData = { ...data, households: [...data.households, newHH] };
    saveData(newData);
    addLog("Nuevo hogar", `${id} — ${hh.owner} — ${hh.address}`);
  }, [data, saveData, addLog]);

  const resetData = useCallback(async () => {
    if (confirm("¿Restaurar datos de demostración? Se perderán los cambios.")) {
      await saveData(INITIAL_DATA);
    }
  }, [saveData]);

  const generateHouseholdReport = useCallback((hh) => {
    const hhPenalties = data.penalties.filter(p => p.householdId === hh.id);
    const hhRewards = data.rewards.filter(r => r.householdId === hh.id);
    const irsu = data.irsus.find(i => i.id === hh.irsu);
    const win = window.open("", "_blank");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Reporte ${hh.id} - ${hh.owner}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #37474F; padding: 40px; max-width: 800px; margin: 0 auto; }
      .header { border-bottom: 3px solid #1B3A5C; padding-bottom: 16px; margin-bottom: 24px; display:flex; justify-content:space-between; align-items:flex-end; }
      .brand { font-size: 24px; font-weight: 900; color: #1B3A5C; }
      .brand span { color: #3A5C2E; }
      .sub { font-size: 12px; color: #7A8A8A; letter-spacing: 2px; }
      h1 { color: #1B3A5C; font-size: 20px; margin: 24px 0 8px; }
      .scorebox { display:flex; gap:20px; margin: 16px 0; }
      .card { flex:1; background:#F5F5F5; border-radius:8px; padding:16px; text-align:center; }
      .card .v { font-size:32px; font-weight:900; }
      .card .l { font-size:11px; color:#888; text-transform:uppercase; }
      table { width:100%; border-collapse:collapse; margin:12px 0; }
      th { background:#1B3A5C; color:#fff; padding:8px; font-size:12px; text-align:left; }
      td { padding:8px; border-bottom:1px solid #eee; font-size:12px; }
      .foot { margin-top:40px; padding-top:16px; border-top:1px solid #ccc; font-size:10px; color:#aaa; text-align:center; }
      @media print { body { padding: 20px; } button { display:none; } }
    </style></head><body>
    <div class="header">
      <div><div class="brand">AZ <span>CORPORATION</span></div><div class="sub">NEURAL GRID OS · REPORTE DE HOGAR</div></div>
      <div style="text-align:right;font-size:11px;color:#888">Generado: ${new Date().toLocaleString("es-CO")}</div>
    </div>
    <h1>Información del Hogar</h1>
    <table>
      <tr><td><b>Código</b></td><td>${hh.id}</td><td><b>Propietario</b></td><td>${hh.owner}</td></tr>
      <tr><td><b>Dirección</b></td><td>${hh.address}</td><td><b>Zona</b></td><td>${hh.zone}</td></tr>
      <tr><td><b>Teléfono</b></td><td>${hh.phone || "N/A"}</td><td><b>IRSU asignado</b></td><td>${irsu ? irsu.name : hh.irsu}</td></tr>
      <tr><td><b>Última auditoría</b></td><td>${hh.lastAudit}</td><td><b>Estado</b></td><td>${hh.status}</td></tr>
    </table>
    <div class="scorebox">
      <div class="card"><div class="v" style="color:${hh.score>=90?"#3A5C2E":hh.score>=75?"#1B3A5C":hh.score>=60?"#E65100":"#B71C1C"}">${hh.score}</div><div class="l">Puntaje actual</div></div>
      <div class="card"><div class="v" style="color:#4A6B32">${hh.points}</div><div class="l">Puntos acumulados</div></div>
      <div class="card"><div class="v" style="color:#B71C1C">${hh.penalties}</div><div class="l">Penalizaciones</div></div>
      <div class="card"><div class="v" style="color:#3A5C2E">${hh.rewards}</div><div class="l">Reconocimientos</div></div>
    </div>
    <h1>Historial de Penalizaciones (${hhPenalties.length})</h1>
    ${hhPenalties.length ? `<table><tr><th>Fecha</th><th>Tipo</th><th>Severidad</th><th>Estado</th></tr>${hhPenalties.map(p=>`<tr><td>${p.date}</td><td>${p.type}</td><td>${p.severity}</td><td>${p.resolved?"Resuelta":"Activa"}</td></tr>`).join("")}</table>` : "<p style='color:#888;font-size:12px'>Sin penalizaciones registradas.</p>"}
    <h1>Historial de Reconocimientos (${hhRewards.length})</h1>
    ${hhRewards.length ? `<table><tr><th>Fecha</th><th>Tipo</th><th>Descripción</th><th>Puntos</th></tr>${hhRewards.map(r=>`<tr><td>${r.date}</td><td>${r.type}</td><td>${r.description}</td><td>+${r.points}</td></tr>`).join("")}</table>` : "<p style='color:#888;font-size:12px'>Sin reconocimientos registrados.</p>"}
    <div class="foot">AZ CORPORATION S.A.S. · Neural Grid OS · Documento confidencial · Generado automáticamente</div>
    <button onclick="window.print()" style="margin-top:24px;padding:10px 24px;background:#1B3A5C;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer">🖨️ Imprimir / Guardar PDF</button>
    </body></html>`;
    win.document.write(html);
    win.document.close();
    addLog("Reporte PDF", `Reporte generado para ${hh.id} - ${hh.owner}`);
  }, [data, addLog]);

  const generateOperationsReport = useCallback(() => {
    const win = window.open("", "_blank");
    const totalHH2 = data.households.length;
    const avg = totalHH2 ? Math.round(data.households.reduce((s,h)=>s+h.score,0)/totalHH2) : 0;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Reporte de Operaciones AZ</title>
    <style>
      body { font-family: Arial, sans-serif; color: #37474F; padding: 40px; max-width: 800px; margin: 0 auto; }
      .header { border-bottom: 3px solid #1B3A5C; padding-bottom: 16px; margin-bottom: 24px; }
      .brand { font-size: 24px; font-weight: 900; color: #1B3A5C; } .brand span { color: #3A5C2E; }
      .sub { font-size: 12px; color: #7A8A8A; letter-spacing: 2px; }
      h1 { color: #1B3A5C; font-size: 18px; margin: 20px 0 8px; }
      table { width:100%; border-collapse:collapse; margin:12px 0; }
      th { background:#1B3A5C; color:#fff; padding:8px; font-size:12px; text-align:left; }
      td { padding:8px; border-bottom:1px solid #eee; font-size:12px; }
      .foot { margin-top:40px; padding-top:16px; border-top:1px solid #ccc; font-size:10px; color:#aaa; text-align:center; }
      @media print { button { display:none; } }
    </style></head><body>
    <div class="header"><div class="brand">AZ <span>CORPORATION</span></div><div class="sub">NEURAL GRID OS · REPORTE DE OPERACIONES</div>
    <div style="font-size:11px;color:#888;margin-top:4px">Generado: ${new Date().toLocaleString("es-CO")}</div></div>
    <h1>Resumen General</h1>
    <table>
      <tr><td><b>Hogares registrados</b></td><td>${totalHH2}</td><td><b>Puntaje promedio</b></td><td>${avg}</td></tr>
      <tr><td><b>Recicladores</b></td><td>${data.recyclers.length}</td><td><b>Inspectores IRSU</b></td><td>${data.irsus.length}</td></tr>
      <tr><td><b>Penalizaciones totales</b></td><td>${data.penalties.length}</td><td><b>Reconocimientos</b></td><td>${data.rewards.length}</td></tr>
    </table>
    <h1>Procesamiento Diario (últimos registros)</h1>
    <table><tr><th>Fecha</th><th>Orgánicos</th><th>Reciclables</th><th>Energéticos</th><th>Rechazo</th><th>Total</th><th>Pureza</th></tr>
    ${data.dailyData.slice(-10).map(d=>`<tr><td>${d.date}</td><td>${d.organic}</td><td>${d.recyclable}</td><td>${d.energy}</td><td>${d.reject}</td><td><b>${d.total}</b></td><td>${d.purity}%</td></tr>`).join("")}</table>
    <h1>Hogares por Estado</h1>
    <table><tr><th>ID</th><th>Propietario</th><th>Zona</th><th>Puntaje</th><th>Estado</th><th>Puntos</th></tr>
    ${data.households.map(h=>`<tr><td>${h.id}</td><td>${h.owner}</td><td>${h.zone}</td><td>${h.score}</td><td>${h.status}</td><td>${h.points}</td></tr>`).join("")}</table>
    <div class="foot">AZ CORPORATION S.A.S. · Neural Grid OS · Documento confidencial</div>
    <button onclick="window.print()" style="margin-top:24px;padding:10px 24px;background:#1B3A5C;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer">🖨️ Imprimir / Guardar PDF</button>
    </body></html>`;
    win.document.write(html); win.document.close();
    addLog("Reporte PDF", "Reporte general de operaciones generado");
  }, [data, addLog]);



  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "system-ui", color: COLORS.blue }}>Cargando AZ Neural Grid OS...</div>;

  // ── KPIs ──
  const totalHH = data.households.length;
  const avgScore = totalHH ? Math.round(data.households.reduce((s, h) => s + h.score, 0) / totalHH) : 0;
  const excellent = data.households.filter(h => h.score >= 90).length;
  const failing = data.households.filter(h => h.score < 60).length;
  const totalTons = data.dailyData.length ? data.dailyData[data.dailyData.length - 1].total : 0;
  const avgPurity = data.dailyData.length ? Math.round(data.dailyData.reduce((s, d) => s + d.purity, 0) / data.dailyData.length) : 0;
  const lastDay = data.dailyData.length ? data.dailyData[data.dailyData.length - 1] : null;
  const totalPoints = data.households.reduce((s, h) => s + h.points, 0);
  const activePenalties = data.penalties.filter(p => !p.resolved).length;

  const filtered = (list) => search ? list.filter(item => JSON.stringify(item).toLowerCase().includes(search.toLowerCase())) : list;

  // ── RENDER ──
  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", background: COLORS.bg, minHeight: "100vh", color: COLORS.gray }}>
      {/* HEADER */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: COLORS.white, display: "flex", alignItems: "center", justifyContent: "center", padding: 3 }}><img src={AZ_LOGO} alt="AZ" style={{ height: "100%", objectFit: "contain" }} /></div>
          <div>
            <div style={{ color: COLORS.white, fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>Neural Grid OS</div>
            <div style={{ color: "#90CAF9", fontSize: 11 }}>AZ CORPORATION · Gestión Integral RSU · Arauca</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #5C6BC0", background: "rgba(255,255,255,0.1)", color: COLORS.white, fontSize: 13, width: 180, outline: "none" }} />
          <button onClick={generateOperationsReport} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", color: COLORS.white, fontSize: 12, cursor: "pointer" }}>📄 Reporte</button>
          <button onClick={resetData} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.3)", background: "transparent", color: "#A5C4E0", fontSize: 12, cursor: "pointer" }}>↺ Reset</button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: COLORS.white, borderBottom: "1px solid #E0E0E0", display: "flex", overflowX: "auto", paddingLeft: 16 }}>
        <Tab active={tab === "dashboard"} label="📊 Dashboard" onClick={() => setTab("dashboard")} />
        <Tab active={tab === "households"} label="🏠 Hogares" onClick={() => setTab("households")} count={totalHH} />
        <Tab active={tab === "recyclers"} label="♻️ Recicladores" onClick={() => setTab("recyclers")} count={data.recyclers.length} />
        <Tab active={tab === "penalties"} label="⚠️ Penalizaciones" onClick={() => setTab("penalties")} count={activePenalties} />
        <Tab active={tab === "rewards"} label="🏆 Reconocimientos" onClick={() => setTab("rewards")} count={data.rewards.length} />
        <Tab active={tab === "operations"} label="🚛 Operaciones" onClick={() => setTab("operations")} />
        <Tab active={tab === "publications"} label="📢 Publicaciones" onClick={() => setTab("publications")} count={publications.length} />
        <Tab active={tab === "guide"} label="🔬 Clasificación" onClick={() => setTab("guide")} />
        <Tab active={tab === "ccar"} label="📦 CCAR" onClick={() => setTab("ccar")} />
        <Tab active={tab === "logs"} label="📋 Bitácora" onClick={() => setTab("logs")} />
      </div>

      <div style={{ padding: "20px 24px", maxWidth: 1200, margin: "0 auto" }}>
        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
              <StatCard label="Hogares registrados" value={totalHH} color={COLORS.blue} icon="🏠" />
              <StatCard label="Puntaje promedio" value={avgScore} sub={`${excellent} excelentes · ${failing} incumpl.`} color={getScoreColor(avgScore)} icon="📊" />
              <StatCard label="Ton/día procesadas" value={totalTons.toFixed(1)} sub={`Pureza: ${avgPurity}%`} color={COLORS.emerald} icon="⚖️" />
              <StatCard label="Puntos activos" value={totalPoints.toLocaleString()} sub={`${data.rewards.length} reconocimientos`} color={COLORS.gold} icon="🏆" />
              <StatCard label="Penalizaciones activas" value={activePenalties} sub={`${data.penalties.length} total histórico`} color={activePenalties > 0 ? COLORS.red : COLORS.emerald} icon="⚠️" />
            </div>

            {lastDay && (
              <>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, marginBottom: 12 }}>📦 Balance de Masas — Último Día ({lastDay.date})</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
                  {[
                    { label: "🟢 Orgánicos", value: lastDay.organic, color: COLORS.emerald, dest: "→ Biodigestores" },
                    { label: "⚪ Reciclables", value: lastDay.recyclable, color: COLORS.blue, dest: "→ Comercialización" },
                    { label: "⚫ Energéticos", value: lastDay.energy, color: COLORS.orange, dest: "→ Pirólisis" },
                    { label: "🔴 Rechazo real", value: lastDay.reject, color: COLORS.red, dest: "→ Gasificación / Disp." },
                  ].map(item => (
                    <div key={item.label} style={{ background: COLORS.white, borderRadius: 10, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray }}>{item.label}</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: item.color, margin: "6px 0" }}>{item.value} ton</div>
                      <MiniBar value={item.value} max={totalTons} color={item.color} />
                      <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>{item.dest}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, marginBottom: 12 }}>📈 Tendencia Semanal — Pureza de Material (%)</h3>
            <div style={{ background: COLORS.white, borderRadius: 10, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
                {data.dailyData.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: d.purity >= 90 ? COLORS.emerald : COLORS.blue, marginBottom: 4 }}>{d.purity}%</div>
                    <div style={{ width: "100%", maxWidth: 40, height: `${d.purity}%`, background: `linear-gradient(180deg, ${d.purity >= 90 ? COLORS.emerald : COLORS.blue}, ${d.purity >= 90 ? COLORS.lime : COLORS.lightBlue})`, borderRadius: "6px 6px 0 0", transition: "height 0.5s" }} />
                    <div style={{ fontSize: 10, color: "#999", marginTop: 4 }}>{d.date.slice(5)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── HOGARES ── */}
        {tab === "households" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy }}>🏠 Gestión de Hogares</h3>
              <button onClick={() => { setFormData({ owner: "", address: "", phone: "", zone: "", irsu: "IRSU-001" }); setModal("addHH"); }} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: COLORS.blue, color: COLORS.white, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>+ Nuevo Hogar</button>
            </div>
            {/* FILTROS */}
            <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray }}>Zona:</span>
                <select value={filterZone} onChange={e => setFilterZone(e.target.value)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #CCC", fontSize: 13, cursor: "pointer" }}>
                  <option value="Todas">Todas</option>
                  {[...new Set(data.households.map(h => h.zone))].map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray }}>Estado:</span>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #CCC", fontSize: 13, cursor: "pointer" }}>
                  <option value="Todos">Todos</option>
                  <option value="Excelente">Excelente (90-100)</option>
                  <option value="Cumple">Cumple (75-89)</option>
                  <option value="Reentrenamiento">Reentrenamiento (60-74)</option>
                  <option value="Incumplimiento">Incumplimiento (&lt;60)</option>
                </select>
              </div>
              {(filterZone !== "Todas" || filterStatus !== "Todos" || search) && (
                <button onClick={() => { setFilterZone("Todas"); setFilterStatus("Todos"); setSearch(""); }} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${COLORS.red}`, background: "transparent", color: COLORS.red, fontSize: 12, cursor: "pointer" }}>✕ Limpiar filtros</button>
              )}
              <span style={{ marginLeft: "auto", fontSize: 13, color: COLORS.gray, fontWeight: 600 }}>
                {(() => { const n = data.households.filter(h => (filterZone === "Todas" || h.zone === filterZone) && (filterStatus === "Todos" || h.status === filterStatus) && (!search || JSON.stringify(h).toLowerCase().includes(search.toLowerCase()))).length; return `${n} de ${data.households.length} hogares`; })()}
              </span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", background: COLORS.white, borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <thead>
                  <tr style={{ background: COLORS.navy }}>
                    {["ID", "Propietario", "Dirección", "Zona", "Puntaje", "Estado", "Puntos", "Acciones"].map(h => (
                      <th key={h} style={{ padding: "10px 12px", color: COLORS.white, fontSize: 12, fontWeight: 700, textAlign: "left" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.households.filter(h => (filterZone === "Todas" || h.zone === filterZone) && (filterStatus === "Todos" || h.status === filterStatus) && (!search || JSON.stringify(h).toLowerCase().includes(search.toLowerCase()))).map((h, i) => (
                    <tr key={h.id} style={{ background: i % 2 === 1 ? "#F8F9FA" : COLORS.white, borderBottom: "1px solid #EEE" }}>
                      <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700 }}>{h.id}</td>
                      <td style={{ padding: "10px 12px", fontSize: 13 }}>{h.owner}</td>
                      <td style={{ padding: "10px 12px", fontSize: 12, color: "#666" }}>{h.address}</td>
                      <td style={{ padding: "10px 12px", fontSize: 13 }}>{h.zone}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontWeight: 800, color: getScoreColor(h.score), fontSize: 16 }}>{h.score}</span>
                          <MiniBar value={h.score} max={100} color={getScoreColor(h.score)} />
                        </div>
                      </td>
                      <td style={{ padding: "10px 12px" }}><Badge text={h.status} color={getScoreColor(h.score)} /></td>
                      <td style={{ padding: "10px 12px", fontWeight: 700, color: COLORS.gold }}>{h.points}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => { const s = prompt(`Nuevo puntaje para ${h.owner} (0-100):`, h.score); if (s !== null) updateHouseholdScore(h.id, Math.min(100, Math.max(0, parseInt(s)))); }} style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${COLORS.blue}`, background: "transparent", color: COLORS.blue, fontSize: 11, cursor: "pointer" }}>📝 Score</button>
                          <button onClick={() => addPoints(h.id, 25)} style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${COLORS.gold}`, background: "transparent", color: COLORS.gold, fontSize: 11, cursor: "pointer" }}>+25pts</button>
                          <button onClick={() => addPenalty(h.id, "Contaminación", "Infracción registrada por IRSU", "Leve")} style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${COLORS.red}`, background: "transparent", color: COLORS.red, fontSize: 11, cursor: "pointer" }}>⚠️</button>
                          <button onClick={() => setDetailHH(h)} style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${COLORS.teal}`, background: "transparent", color: COLORS.teal, fontSize: 11, cursor: "pointer" }}>👁️ Ver</button>
                          <button onClick={() => generateHouseholdReport(h)} style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${COLORS.navy}`, background: "transparent", color: COLORS.navy, fontSize: 11, cursor: "pointer" }}>📄 PDF</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── RECICLADORES ── */}
        {tab === "recyclers" && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 16 }}>♻️ Recicladores Formalizados</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
              {data.recyclers.map(r => (
                <div key={r.id} style={{ background: COLORS.white, borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderTop: `4px solid ${COLORS.emerald}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.navy }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>{r.id} · {r.phone}</div>
                    </div>
                    <Badge text={r.formalized ? "Formalizado" : "Informal"} color={r.formalized ? COLORS.emerald : COLORS.orange} />
                  </div>
                  <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div style={{ background: "#F5F5F5", borderRadius: 8, padding: 10, textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "#888" }}>Zona</div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{r.zone}</div>
                    </div>
                    <div style={{ background: "#F5F5F5", borderRadius: 8, padding: 10, textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "#888" }}>Viviendas</div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{r.households}</div>
                    </div>
                    <div style={{ background: "#F5F5F5", borderRadius: 8, padding: 10, textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "#888" }}>Carga/día</div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.emerald }}>{r.kgDay} kg</div>
                    </div>
                    <div style={{ background: "#F5F5F5", borderRadius: 8, padding: 10, textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "#888" }}>Estado</div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: r.status === "Activo" ? COLORS.emerald : COLORS.red }}>{r.status}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, marginTop: 24, marginBottom: 12 }}>🔍 Inspectores IRSU</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", background: COLORS.white, borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <thead><tr style={{ background: COLORS.teal }}>{["ID", "Inspector", "Zona", "Hogares", "Puntaje Prom."].map(h => <th key={h} style={{ padding: "10px 12px", color: COLORS.white, fontSize: 12, fontWeight: 700, textAlign: "left" }}>{h}</th>)}</tr></thead>
              <tbody>{data.irsus.map((ir, i) => (
                <tr key={ir.id} style={{ background: i % 2 === 1 ? "#F8F9FA" : COLORS.white }}>
                  <td style={{ padding: "10px 12px", fontWeight: 700, fontSize: 13 }}>{ir.id}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13 }}>{ir.name}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13 }}>{ir.zone}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13 }}>{ir.households}</td>
                  <td style={{ padding: "10px 12px" }}><span style={{ fontWeight: 800, color: getScoreColor(ir.avgScore) }}>{ir.avgScore}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {/* ── PENALIZACIONES ── */}
        {tab === "penalties" && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 16 }}>⚠️ Registro de Penalizaciones</h3>
            {data.penalties.length === 0 ? <p style={{ color: "#999" }}>No hay penalizaciones registradas.</p> :
              <table style={{ width: "100%", borderCollapse: "collapse", background: COLORS.white, borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <thead><tr style={{ background: COLORS.red }}>{["ID", "Hogar", "Fecha", "Tipo", "Severidad", "Estado", "Acción"].map(h => <th key={h} style={{ padding: "10px 12px", color: COLORS.white, fontSize: 12, fontWeight: 700, textAlign: "left" }}>{h}</th>)}</tr></thead>
                <tbody>{filtered(data.penalties).map((p, i) => {
                  const hh = data.households.find(h => h.id === p.householdId);
                  return (
                    <tr key={p.id} style={{ background: i % 2 === 1 ? "#FFF3F3" : COLORS.white }}>
                      <td style={{ padding: "10px 12px", fontWeight: 700, fontSize: 13 }}>{p.id}</td>
                      <td style={{ padding: "10px 12px", fontSize: 13 }}>{hh?.owner || p.householdId}</td>
                      <td style={{ padding: "10px 12px", fontSize: 13 }}>{p.date}</td>
                      <td style={{ padding: "10px 12px", fontSize: 13 }}>{p.type}</td>
                      <td style={{ padding: "10px 12px" }}><Badge text={p.severity} color={p.severity === "Grave" ? COLORS.red : p.severity === "Moderada" ? COLORS.orange : COLORS.gold} /></td>
                      <td style={{ padding: "10px 12px" }}><Badge text={p.resolved ? "Resuelta" : "Activa"} color={p.resolved ? COLORS.emerald : COLORS.red} /></td>
                      <td style={{ padding: "10px 12px" }}>{!p.resolved && <button onClick={() => { const newData = { ...data, penalties: data.penalties.map(x => x.id === p.id ? { ...x, resolved: true } : x) }; saveData(newData); }} style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: COLORS.emerald, color: COLORS.white, fontSize: 11, cursor: "pointer" }}>✓ Resolver</button>}</td>
                    </tr>
                  );
                })}</tbody>
              </table>
            }
          </div>
        )}

        {/* ── RECONOCIMIENTOS ── */}
        {tab === "rewards" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy }}>🏆 Reconocimientos y Puntos</h3>
              <button onClick={() => { const hid = prompt("ID del hogar (ej: H001):"); if (hid) addReward(hid, "Bono comunidad", "Reconocimiento por excelencia en clasificación", 50); }} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: COLORS.gold, color: COLORS.navy, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>+ Nuevo Reconocimiento</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
              {data.rewards.map(r => {
                const hh = data.households.find(h => h.id === r.householdId);
                return (
                  <div key={r.id} style={{ background: COLORS.white, borderRadius: 10, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `4px solid ${COLORS.gold}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div style={{ fontWeight: 700, color: COLORS.navy }}>{hh?.owner || r.householdId}</div>
                      <div style={{ fontWeight: 800, color: COLORS.gold }}>+{r.points} pts</div>
                    </div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{r.date} · {r.type}</div>
                    <div style={{ fontSize: 13, color: COLORS.gray, marginTop: 6 }}>{r.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── OPERACIONES ── */}
        {tab === "operations" && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 16 }}>🚛 Control de Operaciones</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16, marginBottom: 24 }}>
              {[
                { route: "Ruta Verde", icon: "🟢", type: "Orgánicos", dest: "Biodigestores", tons: lastDay?.organic || 0, color: COLORS.emerald },
                { route: "Ruta Blanca", icon: "⚪", type: "Reciclables", dest: "Comercialización", tons: lastDay?.recyclable || 0, color: COLORS.blue },
                { route: "Ruta Negra Energética", icon: "⚫", type: "Fracción AZ", dest: "Pirólisis → Refinación", tons: lastDay?.energy || 0, color: COLORS.orange },
                { route: "Ruta Rechazo", icon: "🔴", type: "Rechazo real", dest: "Gasificación / Disposición", tons: lastDay?.reject || 0, color: COLORS.red },
              ].map(r => (
                <div key={r.route} style={{ background: COLORS.white, borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderTop: `4px solid ${r.color}` }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{r.icon}</div>
                  <div style={{ fontWeight: 800, color: COLORS.navy, fontSize: 15 }}>{r.route}</div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{r.type} → {r.dest}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: r.color, marginTop: 8 }}>{r.tons} ton</div>
                  <MiniBar value={r.tons} max={totalTons} color={r.color} />
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, marginBottom: 12 }}>📊 Historial de Procesamiento (7 días)</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", background: COLORS.white, borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <thead><tr style={{ background: COLORS.navy }}>{["Fecha", "Orgánicos", "Reciclables", "Energéticos", "Rechazo", "Total", "Pureza"].map(h => <th key={h} style={{ padding: "10px 12px", color: COLORS.white, fontSize: 12, fontWeight: 700, textAlign: "center" }}>{h}</th>)}</tr></thead>
              <tbody>{data.dailyData.map((d, i) => (
                <tr key={d.date} style={{ background: i % 2 === 1 ? "#F8F9FA" : COLORS.white, textAlign: "center" }}>
                  <td style={{ padding: "8px 12px", fontSize: 13 }}>{d.date}</td>
                  <td style={{ padding: "8px 12px", fontSize: 13, color: COLORS.emerald, fontWeight: 700 }}>{d.organic}</td>
                  <td style={{ padding: "8px 12px", fontSize: 13, color: COLORS.blue, fontWeight: 700 }}>{d.recyclable}</td>
                  <td style={{ padding: "8px 12px", fontSize: 13, color: COLORS.orange, fontWeight: 700 }}>{d.energy}</td>
                  <td style={{ padding: "8px 12px", fontSize: 13, color: COLORS.red, fontWeight: 700 }}>{d.reject}</td>
                  <td style={{ padding: "8px 12px", fontSize: 13, fontWeight: 800 }}>{d.total}</td>
                  <td style={{ padding: "8px 12px" }}><Badge text={`${d.purity}%`} color={d.purity >= 90 ? COLORS.emerald : COLORS.blue} /></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {/* ── PUBLICACIONES (ECOSISTEMA) ── */}
        {tab === "publications" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy }}>📢 Centro de Publicaciones</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {pubStatusMsg && <span style={{ fontSize: 12, color: COLORS.green, fontWeight: 600 }}>{pubStatusMsg}</span>}
                {publications.length > 0 && (
                  <button onClick={clearAllPublications} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${COLORS.red}`, background: COLORS.red, color: COLORS.white, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>🧹 Borrar todo ({publications.length})</button>
                )}
              </div>
            </div>
            <p style={{ fontSize: 13, color: COLORS.gray, marginBottom: 20 }}>Lo que publiques aquí se verá automáticamente en la app ciudadana <b>AZ Mi Barrio</b> de todos los hogares.</p>

            {/* Create form */}
            <div style={{ background: COLORS.white, borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: 24, borderLeft: `4px solid ${COLORS.green}` }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: COLORS.navy, marginBottom: 14 }}>✏️ Nueva Publicación</div>
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 160px" }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.gray }}>Tipo de publicación</label>
                    <select value={pubForm.type} onChange={e => setPubForm({ ...pubForm, type: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CCC", fontSize: 14, marginTop: 4 }}>
                      <option value="anuncio">📣 Anuncio</option>
                      <option value="video">🎬 Video</option>
                      <option value="campaña">📢 Campaña publicitaria</option>
                      <option value="educativo">📚 Contenido educativo</option>
                      <option value="evento">📅 Evento</option>
                    </select>
                  </div>
                  <div style={{ flex: "2 1 280px" }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.gray }}>Título</label>
                    <input value={pubForm.title} onChange={e => setPubForm({ ...pubForm, title: e.target.value })} placeholder="Ej: Nueva jornada de reciclaje" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CCC", fontSize: 14, marginTop: 4, boxSizing: "border-box" }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.gray }}>Contenido / Mensaje</label>
                  <textarea value={pubForm.body} onChange={e => setPubForm({ ...pubForm, body: e.target.value })} placeholder="Escribe el mensaje que verán los ciudadanos..." rows={3} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CCC", fontSize: 14, marginTop: 4, boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.gray }}>Enlace de video YouTube (opcional)</label>
                  <input value={pubForm.media} onChange={e => setPubForm({ ...pubForm, media: e.target.value })} placeholder="https://youtube.com/watch?v=..." style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CCC", fontSize: 14, marginTop: 4, boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.gray }}>Subir archivo: imagen, PDF, audio MP3 o video MP4 (máx 4MB)</label>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 4 }}>
                    <label style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${COLORS.teal}`, background: COLORS.white, color: COLORS.teal, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      📎 Seleccionar archivo
                      <input type="file" accept="image/*,application/pdf,audio/mpeg,audio/mp3" onChange={handleFileUpload} style={{ display: "none" }} />
                    </label>
                    {uploading && <span style={{ fontSize: 12, color: COLORS.blue }}>Cargando...</span>}
                    {pubForm.fileName && !uploading && (
                      <span style={{ fontSize: 12, color: COLORS.green, display: "flex", alignItems: "center", gap: 6 }}>
                        {pubForm.fileKind === "image" ? "🖼️" : pubForm.fileKind === "audio" ? "🎵" : pubForm.fileKind === "video" ? "🎬" : "📄"} {pubForm.fileName}
                        <button onClick={() => setPubForm({ ...pubForm, fileData: "", fileName: "", fileKind: "" })} style={{ border: "none", background: "transparent", color: COLORS.red, cursor: "pointer", fontSize: 14 }}>×</button>
                      </span>
                    )}
                  </div>
                  {pubForm.fileKind === "image" && pubForm.fileData && (
                    <img src={pubForm.fileData} alt="preview" style={{ maxHeight: 120, borderRadius: 8, marginTop: 8, border: "1px solid #eee" }} />
                  )}
                  {pubForm.fileKind === "audio" && pubForm.fileData && (
                    <audio controls src={pubForm.fileData} style={{ width: "100%", marginTop: 8 }} />
                  )}
                  {pubForm.fileKind === "video" && pubForm.fileData && (
                    <video controls src={pubForm.fileData} style={{ maxHeight: 160, borderRadius: 8, marginTop: 8, width: "100%" }} />
                  )}
                  {pubForm.fileKind === "audio" && pubForm.fileData && (
                    <audio controls src={pubForm.fileData} style={{ width: "100%", marginTop: 8 }} />
                  )}
                  {pubForm.fileKind === "video" && pubForm.fileData && (
                    <video controls src={pubForm.fileData} style={{ width: "100%", maxHeight: 200, borderRadius: 8, marginTop: 8 }} />
                  )}
                </div>
                <button onClick={addPublication} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: COLORS.green, color: COLORS.white, fontWeight: 700, cursor: "pointer", fontSize: 14, justifySelf: "start" }}>📢 Publicar a todos los ciudadanos</button>
              </div>
            </div>

            {/* Published list */}
            <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.navy, marginBottom: 12 }}>Publicaciones activas ({publications.length})</div>
            {publications.length === 0 ? (
              <p style={{ color: "#999", textAlign: "center", padding: 30 }}>Aún no hay publicaciones. Crea la primera arriba.</p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {publications.map(pub => {
                  const typeIcons = { anuncio: "📣", video: "🎬", "campaña": "📢", educativo: "📚", evento: "📅" };
                  const typeColors = { anuncio: COLORS.blue, video: COLORS.red, "campaña": COLORS.green, educativo: COLORS.teal, evento: COLORS.gold };
                  return (
                    <div key={pub.id} style={{ background: COLORS.white, borderRadius: 10, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `4px solid ${typeColors[pub.type] || COLORS.blue}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 18 }}>{typeIcons[pub.type] || "📣"}</span>
                            <span style={{ fontWeight: 800, color: COLORS.navy, fontSize: 15 }}>{pub.title}</span>
                            <Badge text={pub.type} color={typeColors[pub.type] || COLORS.blue} />
                          </div>
                          <div style={{ fontSize: 13, color: COLORS.gray, marginBottom: 6 }}>{pub.body}</div>
                          {pub.media && <a href={pub.media} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: COLORS.blue, wordBreak: "break-all", display: "block" }}>🔗 {pub.media}</a>}
                          {pub.fileKind === "image" && pub.fileData && <img src={pub.fileData} alt={pub.fileName} style={{ maxHeight: 100, borderRadius: 8, marginTop: 6 }} />}
                          {pub.fileKind === "pdf" && pub.fileData && <a href={pub.fileData} download={pub.fileName} style={{ fontSize: 12, color: COLORS.red, display: "block", marginTop: 6 }}>📄 {pub.fileName}</a>}
                          {pub.fileKind === "audio" && pub.fileData && <audio controls src={pub.fileData} style={{ width: "100%", marginTop: 6 }} />}
                          {pub.fileKind === "video" && pub.fileData && <video controls src={pub.fileData} style={{ maxHeight: 140, width: "100%", borderRadius: 8, marginTop: 6 }} />}
                          {pub.fileKind === "audio" && pub.fileData && <audio controls src={pub.fileData} style={{ width: "100%", marginTop: 6 }} />}
                          {pub.fileKind === "video" && pub.fileData && <video controls src={pub.fileData} style={{ width: "100%", maxHeight: 180, borderRadius: 8, marginTop: 6 }} />}
                          <div style={{ fontSize: 11, color: "#aaa", marginTop: 6 }}>{new Date(pub.date).toLocaleString("es-CO")} · {pub.author}</div>
                          {/* Resumen de interacción ciudadana */}
                          {(pub.reactions && Object.values(pub.reactions).some(v => v > 0)) || (pub.comments && pub.comments.length > 0) ? (
                            <div style={{ marginTop: 8, padding: "8px 10px", background: "#F5F7F5", borderRadius: 8 }}>
                              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                                {pub.reactions && Object.entries(pub.reactions).filter(([,v]) => v > 0).map(([em, v]) => (
                                  <span key={em} style={{ fontSize: 13 }}>{em} {v}</span>
                                ))}
                                {pub.comments && pub.comments.length > 0 && <span style={{ fontSize: 12, color: COLORS.blue, fontWeight: 600 }}>💬 {pub.comments.length} comentario(s)</span>}
                              </div>
                              {pub.comments && pub.comments.slice(-3).map(cm => (
                                <div key={cm.id} style={{ fontSize: 12, color: COLORS.gray, marginTop: 4 }}><b>{cm.user}:</b> {cm.text}</div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                        <button onClick={() => deletePublication(pub.id)} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${COLORS.red}`, background: "transparent", color: COLORS.red, fontSize: 11, cursor: "pointer" }}>🗑️</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── GUÍA DE CLASIFICACIÓN ── */}
        {tab === "guide" && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 16 }}>🔬 Guía de Clasificación de Residuos — Árbol de Decisión</h3>
            <p style={{ fontSize: 14, color: COLORS.gray, marginBottom: 20 }}>Herramienta para operadores del CCAR. Siga el flujo para determinar la línea de destino correcta de cada material.</p>
            
            <div style={{ background: COLORS.white, borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.navy, marginBottom: 16 }}>Paso 1: ¿El material es biodegradable? (¿Se pudre en 2 semanas?)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "#E8F5E9", borderRadius: 10, padding: 16, border: `2px solid ${COLORS.emerald}` }}>
                  <div style={{ fontWeight: 800, color: COLORS.emerald, fontSize: 14 }}>✅ SÍ → BIODIGESTOR (Línea 1)</div>
                  <div style={{ fontSize: 13, color: COLORS.gray, marginTop: 8 }}>Restos comida, frutas, verduras, cáscaras, residuos matadero, poda, lodos PTAR, estiércol</div>
                  <div style={{ marginTop: 8, padding: 8, background: COLORS.emerald, borderRadius: 6, color: COLORS.white, textAlign: "center", fontWeight: 700, fontSize: 12 }}>→ Biogás → Electricidad + Biofertilizante</div>
                </div>
                <div style={{ background: "#FFF3E0", borderRadius: 10, padding: 16, border: `2px solid ${COLORS.orange}` }}>
                  <div style={{ fontWeight: 800, color: COLORS.orange, fontSize: 14 }}>❌ NO → Ir al Paso 2</div>
                  <div style={{ fontSize: 13, color: COLORS.gray, marginTop: 8 }}>Continuar evaluación del material...</div>
                </div>
              </div>
            </div>

            <div style={{ background: COLORS.white, borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.navy, marginBottom: 16 }}>Paso 2: ¿Es plástico identificable (PE, PP, PS, caucho)?</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "#FFF8E1", borderRadius: 10, padding: 16, border: `2px solid ${COLORS.gold}` }}>
                  <div style={{ fontWeight: 800, color: COLORS.gold, fontSize: 14 }}>✅ SÍ → PIRÓLISIS (Línea 2)</div>
                  <div style={{ fontSize: 13, color: COLORS.gray, marginTop: 8 }}>PEAD, PEBD, PP, PS, icopor, cauchos, suelas, plásticos de alto poder calorífico</div>
                  <div style={{ marginTop: 8, padding: 8, background: COLORS.gold, borderRadius: 6, color: COLORS.navy, textAlign: "center", fontWeight: 700, fontSize: 12 }}>→ Piro Oil → Refinación → Diésel + Nafta + Queroseno</div>
                </div>
                <div style={{ background: "#FFF3E0", borderRadius: 10, padding: 16, border: `2px solid ${COLORS.orange}` }}>
                  <div style={{ fontWeight: 800, color: COLORS.orange, fontSize: 14 }}>❌ NO → Ir al Paso 3</div>
                </div>
              </div>
            </div>

            <div style={{ background: COLORS.white, borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.navy, marginBottom: 16 }}>Paso 3: ¿Es reciclable limpio (papel, cartón, vidrio, metal)?</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "#E3F2FD", borderRadius: 10, padding: 16, border: `2px solid ${COLORS.blue}` }}>
                  <div style={{ fontWeight: 800, color: COLORS.blue, fontSize: 14 }}>✅ SÍ → RECICLAJE (Línea 4)</div>
                  <div style={{ fontSize: 13, color: COLORS.gray, marginTop: 8 }}>Papel, cartón, vidrio, metales, Tetra Pak limpios</div>
                  <div style={{ marginTop: 8, padding: 8, background: COLORS.blue, borderRadius: 6, color: COLORS.white, textAlign: "center", fontWeight: 700, fontSize: 12 }}>→ Comercialización directa a industria</div>
                </div>
                <div style={{ background: "#FFF3E0", borderRadius: 10, padding: 16, border: `2px solid ${COLORS.orange}` }}>
                  <div style={{ fontWeight: 800, color: COLORS.orange, fontSize: 14 }}>❌ NO → Ir al Paso 4</div>
                </div>
              </div>
            </div>

            <div style={{ background: COLORS.white, borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.navy, marginBottom: 16 }}>Paso 4: ¿Arde? (¿Tiene poder calorífico {">"} 15 MJ/kg?)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "#E0F2F1", borderRadius: 10, padding: 16, border: `2px solid ${COLORS.teal}` }}>
                  <div style={{ fontWeight: 800, color: COLORS.teal, fontSize: 14 }}>✅ SÍ → GASIFICACIÓN / SYNGAS (Línea 3)</div>
                  <div style={{ fontSize: 13, color: COLORS.gray, marginTop: 8 }}>Textiles naturales, maderas, cuero, corcho, fibras secas, pañales, mezclas combustibles</div>
                  <div style={{ marginTop: 8, padding: 8, background: COLORS.teal, borderRadius: 6, color: COLORS.white, textAlign: "center", fontWeight: 700, fontSize: 12 }}>→ Syngas → Electricidad / Calor</div>
                </div>
                <div style={{ background: "#FFEBEE", borderRadius: 10, padding: 16, border: `2px solid ${COLORS.red}` }}>
                  <div style={{ fontWeight: 800, color: COLORS.red, fontSize: 14 }}>❌ NO → DISPOSICIÓN FINAL</div>
                  <div style={{ fontSize: 13, color: COLORS.gray, marginTop: 8 }}>Material inerte sin valor energético ni reciclable. Meta: {"<"} 5% del total.</div>
                </div>
              </div>
            </div>

            <div style={{ background: "#FFEBEE", borderRadius: 10, padding: 16, border: `2px solid ${COLORS.red}` }}>
              <div style={{ fontWeight: 800, color: COLORS.red, fontSize: 14, marginBottom: 8 }}>⛔ NUNCA ingresan al sistema AZ:</div>
              <div style={{ fontSize: 13, color: COLORS.gray }}>Baterías · RAEE (electrónicos) · Residuos peligrosos (químicos, hospitalarios sin tratar) · Bombillos fluorescentes · Envases de pesticidas · Material radiactivo</div>
            </div>
          </div>
        )}

        {/* ── CCAR OPERATIONS ── */}
        {tab === "ccar" && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 16 }}>📦 Centros Comunitarios de Acopio (CCAR)</h3>
            
            {/* Daily data entry form */}
            <div style={{ background: COLORS.white, borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: 20, borderLeft: `4px solid ${COLORS.emerald}` }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: COLORS.navy, marginBottom: 12 }}>📝 Registrar Datos del Día</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
                {[
                  { key: "organic", label: "🟢 Orgánicos (ton)", color: COLORS.emerald },
                  { key: "recyclable", label: "⚪ Reciclables (ton)", color: COLORS.blue },
                  { key: "energy", label: "⚫ Energéticos (ton)", color: COLORS.orange },
                  { key: "reject", label: "🔴 Rechazo (ton)", color: COLORS.red },
                  { key: "purity", label: "Pureza (%)", color: COLORS.teal },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: field.color }}>{field.label}</label>
                    <input type="number" step="0.1" id={`daily-${field.key}`} placeholder="0.0" style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid #CCC`, fontSize: 14, marginTop: 4, boxSizing: "border-box" }} />
                  </div>
                ))}
              </div>
              <button onClick={() => {
                const vals = {};
                let valid = true;
                ["organic","recyclable","energy","reject","purity"].forEach(k => {
                  const el = document.getElementById(`daily-${k}`);
                  const v = parseFloat(el?.value);
                  if (isNaN(v)) valid = false;
                  vals[k] = v || 0;
                });
                if (!valid) { alert("Complete todos los campos con valores numéricos."); return; }
                const entry = { date: new Date().toISOString().split("T")[0], organic: vals.organic, recyclable: vals.recyclable, energy: vals.energy, reject: vals.reject, total: +(vals.organic + vals.recyclable + vals.energy + vals.reject).toFixed(1), purity: vals.purity };
                const newData = { ...data, dailyData: [...data.dailyData.slice(-29), entry] };
                saveData(newData);
                addLog("Datos diarios", `Total: ${entry.total} ton | Pureza: ${entry.purity}%`);
                ["organic","recyclable","energy","reject","purity"].forEach(k => { const el = document.getElementById(`daily-${k}`); if(el) el.value = ""; });
              }} style={{ marginTop: 12, padding: "8px 20px", borderRadius: 8, border: "none", background: COLORS.emerald, color: COLORS.white, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                ✓ Registrar Día
              </button>
            </div>

            {/* CCAR Status cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 20 }}>
              {[
                { name: "CCAR Norte", zone: "Centro + El Bosque", capacity: "3.5 ton/día", fill: 78, status: "Operativo" },
                { name: "CCAR Sur", zone: "Meridiano + San Luis", capacity: "3.5 ton/día", fill: 65, status: "Operativo" },
                { name: "CCAR Oeste", zone: "Unión + Norte", capacity: "3.0 ton/día", fill: 52, status: "Operativo" },
              ].map(ccar => (
                <div key={ccar.name} style={{ background: COLORS.white, borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderTop: `4px solid ${ccar.fill > 85 ? COLORS.red : COLORS.emerald}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.navy }}>{ccar.name}</div>
                    <Badge text={ccar.status} color={COLORS.emerald} />
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{ccar.zone} · Cap: {ccar.capacity}</div>
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: COLORS.gray }}>Buffer utilizado</span>
                      <span style={{ fontWeight: 700, color: ccar.fill > 85 ? COLORS.red : COLORS.emerald }}>{ccar.fill}%</span>
                    </div>
                    <MiniBar value={ccar.fill} max={100} color={ccar.fill > 85 ? COLORS.red : COLORS.emerald} />
                  </div>
                  <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6 }}>
                    {[
                      { label: "🟢", val: (lastDay?.organic * ccar.fill / 200 || 0).toFixed(1) },
                      { label: "⚪", val: (lastDay?.recyclable * ccar.fill / 200 || 0).toFixed(1) },
                      { label: "⚫", val: (lastDay?.energy * ccar.fill / 200 || 0).toFixed(1) },
                      { label: "🔴", val: (lastDay?.reject * ccar.fill / 200 || 0).toFixed(1) },
                    ].map(f => (
                      <div key={f.label} style={{ textAlign: "center", background: "#F5F5F5", borderRadius: 6, padding: 6 }}>
                        <div style={{ fontSize: 16 }}>{f.label}</div>
                        <div style={{ fontSize: 12, fontWeight: 700 }}>{f.val}t</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Reclassification stats */}
            <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, marginBottom: 12 }}>🔬 Reclasificación Secundaria — Bolsa Negra</h3>
            <div style={{ background: COLORS.white, borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {[
                  { label: "Fracción Energética AZ", pct: "78%", dest: "→ Pirólisis", color: COLORS.gold, icon: "⚡" },
                  { label: "Textiles + Maderas", pct: "14%", dest: "→ Gasificación", color: COLORS.teal, icon: "🪵" },
                  { label: "Rechazo Real", pct: "8%", dest: "→ Disposición", color: COLORS.red, icon: "🗑️" },
                ].map(f => (
                  <div key={f.label} style={{ textAlign: "center", padding: 16, background: f.color + "11", borderRadius: 10 }}>
                    <div style={{ fontSize: 24 }}>{f.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.navy, marginTop: 6 }}>{f.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: f.color, margin: "4px 0" }}>{f.pct}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{f.dest}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


        {tab === "logs" && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 16 }}>📋 Bitácora de Actividades</h3>
            {data.logs.length === 0 ? <p style={{ color: "#999", textAlign: "center", padding: 40 }}>Sin registros. Las acciones se registrarán automáticamente.</p> :
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {data.logs.slice(0, 50).map(log => (
                  <div key={log.id} style={{ background: COLORS.white, borderRadius: 8, padding: "10px 16px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)", display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ fontSize: 11, color: "#999", minWidth: 130 }}>{new Date(log.timestamp).toLocaleString("es-CO")}</div>
                    <Badge text={log.action} color={log.action === "Penalización" ? COLORS.red : log.action === "Reconocimiento" ? COLORS.gold : COLORS.blue} />
                    <div style={{ fontSize: 13, color: COLORS.gray }}>{log.detail}</div>
                  </div>
                ))}
              </div>
            }
          </div>
        )}
      </div>

      {/* ── DETALLE DE VIVIENDA ── */}
      {detailHH && (() => {
        const hh = data.households.find(x => x.id === detailHH.id) || detailHH;
        const hhPen = data.penalties.filter(p => p.householdId === hh.id);
        const hhRew = data.rewards.filter(r => r.householdId === hh.id);
        const irsu = data.irsus.find(i => i.id === hh.irsu);
        const recycler = data.recyclers.find(r => r.zone === hh.zone);
        const activePen = hhPen.filter(p => !p.resolved).length;
        const totalRewPts = hhRew.reduce((s, r) => s + r.points, 0);
        const scoreCol = getScoreColor(hh.score);
        return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", justifyContent: "center", alignItems: "flex-start", zIndex: 1000, overflowY: "auto", padding: "40px 20px" }} onClick={() => setDetailHH(null)}>
            <div style={{ background: COLORS.white, borderRadius: 16, width: "100%", maxWidth: 720, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.green})`, borderRadius: "16px 16px 0 0", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: COLORS.white, fontSize: 20, fontWeight: 800 }}>{hh.owner}</div>
                  <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{hh.id} · {hh.address}</div>
                </div>
                <button onClick={() => setDetailHH(null)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: COLORS.white, width: 32, height: 32, borderRadius: 16, fontSize: 18, cursor: "pointer" }}>×</button>
              </div>
              <div style={{ padding: 24 }}>
                {/* Score ring + key metrics */}
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "center", marginBottom: 20 }}>
                  <div style={{ width: 110, height: 110, borderRadius: "50%", background: `conic-gradient(${scoreCol} ${hh.score * 3.6}deg, #E0E0E0 0deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 86, height: 86, borderRadius: "50%", background: COLORS.white, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ fontSize: 30, fontWeight: 900, color: scoreCol }}>{hh.score}</div>
                      <div style={{ fontSize: 9, color: "#999" }}>de 100</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div style={{ background: "#F5F5F5", borderRadius: 8, padding: "10px 14px" }}><div style={{ fontSize: 11, color: "#888" }}>Estado</div><div style={{ fontWeight: 800, color: scoreCol, fontSize: 15 }}>{hh.status}</div></div>
                    <div style={{ background: "#F5F5F5", borderRadius: 8, padding: "10px 14px" }}><div style={{ fontSize: 11, color: "#888" }}>Puntos</div><div style={{ fontWeight: 800, color: COLORS.green, fontSize: 15 }}>{hh.points}</div></div>
                    <div style={{ background: "#F5F5F5", borderRadius: 8, padding: "10px 14px" }}><div style={{ fontSize: 11, color: "#888" }}>Penaliz. activas</div><div style={{ fontWeight: 800, color: activePen > 0 ? COLORS.red : COLORS.green, fontSize: 15 }}>{activePen} / {hhPen.length}</div></div>
                    <div style={{ background: "#F5F5F5", borderRadius: 8, padding: "10px 14px" }}><div style={{ fontSize: 11, color: "#888" }}>Reconocimientos</div><div style={{ fontWeight: 800, color: COLORS.green, fontSize: 15 }}>{hh.rewards} (+{totalRewPts})</div></div>
                  </div>
                </div>

                {/* Info grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20, fontSize: 13 }}>
                  <div><span style={{ color: "#888" }}>Zona:</span> <b>{hh.zone}</b></div>
                  <div><span style={{ color: "#888" }}>Teléfono:</span> <b>{hh.phone || "N/A"}</b></div>
                  <div><span style={{ color: "#888" }}>IRSU:</span> <b>{irsu ? irsu.name : hh.irsu}</b></div>
                  <div><span style={{ color: "#888" }}>Reciclador:</span> <b>{recycler ? recycler.name : "Por asignar"}</b></div>
                  <div><span style={{ color: "#888" }}>Última auditoría:</span> <b>{hh.lastAudit}</b></div>
                  <div><span style={{ color: "#888" }}>Nivel incentivo:</span> <b>{hh.score >= 95 ? "Platino" : hh.score >= 90 ? "Oro" : hh.score >= 85 ? "Plata" : hh.score >= 75 ? "Bronce" : "Sin nivel"}</b></div>
                </div>

                {/* Penalties */}
                <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 14, marginBottom: 8 }}>⚠️ Penalizaciones ({hhPen.length})</div>
                {hhPen.length ? (
                  <div style={{ marginBottom: 16 }}>{hhPen.map(p => (
                    <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: p.resolved ? "#F5F5F5" : "#FFF3F3", borderRadius: 6, marginBottom: 4, fontSize: 12 }}>
                      <span>{p.date} · {p.type}</span>
                      <span><Badge text={p.severity} color={p.severity === "Grave" ? COLORS.red : p.severity === "Moderada" ? COLORS.orange : COLORS.gold} /> <Badge text={p.resolved ? "Resuelta" : "Activa"} color={p.resolved ? COLORS.green : COLORS.red} /></span>
                    </div>
                  ))}</div>
                ) : <div style={{ color: "#999", fontSize: 12, marginBottom: 16 }}>Sin penalizaciones.</div>}

                {/* Rewards */}
                <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 14, marginBottom: 8 }}>🏆 Reconocimientos ({hhRew.length})</div>
                {hhRew.length ? (
                  <div style={{ marginBottom: 16 }}>{hhRew.map(r => (
                    <div key={r.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: "#F1F5EC", borderRadius: 6, marginBottom: 4, fontSize: 12 }}>
                      <span>{r.date} · {r.description}</span>
                      <b style={{ color: COLORS.green }}>+{r.points} pts</b>
                    </div>
                  ))}</div>
                ) : <div style={{ color: "#999", fontSize: 12, marginBottom: 16 }}>Sin reconocimientos.</div>}

                {/* Actions */}
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <button onClick={() => { const s = prompt(`Nuevo puntaje para ${hh.owner} (0-100):`, hh.score); if (s !== null) updateHouseholdScore(hh.id, Math.min(100, Math.max(0, parseInt(s)))); }} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `1px solid ${COLORS.blue}`, background: "transparent", color: COLORS.blue, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>📝 Editar Score</button>
                  <button onClick={() => addReward(hh.id, "Bono comunidad", "Reconocimiento por desempeño", 50)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `1px solid ${COLORS.green}`, background: "transparent", color: COLORS.green, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>🏆 + Reconocimiento</button>
                  <button onClick={() => generateHouseholdReport(hh)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", background: COLORS.navy, color: COLORS.white, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>📄 Generar PDF</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── MODAL NUEVO HOGAR ── */}
      {modal === "addHH" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }} onClick={() => setModal(null)}>
          <div style={{ background: COLORS.white, borderRadius: 16, padding: 28, width: "90%", maxWidth: 460, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: COLORS.navy, marginBottom: 16 }}>🏠 Registrar Nuevo Hogar</h3>
            {["owner", "address", "phone", "zone"].map(field => (
              <div key={field} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray, textTransform: "capitalize" }}>{field === "owner" ? "Propietario" : field === "address" ? "Dirección" : field === "phone" ? "Teléfono" : "Zona / Barrio"}</label>
                <input value={formData[field] || ""} onChange={e => setFormData({ ...formData, [field]: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid #CCC`, fontSize: 14, marginTop: 4, boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray }}>IRSU Asignado</label>
              <select value={formData.irsu || "IRSU-001"} onChange={e => setFormData({ ...formData, irsu: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CCC", fontSize: 14, marginTop: 4 }}>
                {data.irsus.map(ir => <option key={ir.id} value={ir.id}>{ir.id} — {ir.name}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setModal(null)} style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid #CCC`, background: "transparent", color: COLORS.gray, cursor: "pointer" }}>Cancelar</button>
              <button onClick={() => { if (formData.owner && formData.address) { addHousehold(formData); setModal(null); } else alert("Completa propietario y dirección."); }} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: COLORS.blue, color: COLORS.white, fontWeight: 700, cursor: "pointer" }}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ textAlign: "center", padding: "20px 0", fontSize: 11, color: "#AAA", borderTop: "1px solid #EEE", marginTop: 40 }}>
        AZ Neural Grid OS v2.1 · AZ CORPORATION S.A.S. · {new Date().getFullYear()} · Paleta de marca oficial · 9 Módulos
      </div>
    </div>
  );
}

export default AZNeuralGridOS;
