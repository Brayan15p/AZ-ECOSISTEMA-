import { useState, useEffect } from "react";
import { CITIZEN_COLORS as C } from "../../lib/theme.js";
import { AZ_LOGO_CZ } from "../../assets/logos.js";
import { DEMO_HOUSEHOLD } from "../../data/demoHousehold.js";
import ScoreRing from "../../components/shared/ScoreRing.jsx";

function AZMiBarrio() {
  const [hh, setHH] = useState(null);
  const [tab, setTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [loginCode, setLoginCode] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [publications, setPublications] = useState([]);
  const [pubStatus, setPubStatus] = useState("");
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get("az-mi-barrio-user");
        if (result && result.value) {
          setHH(JSON.parse(result.value));
          setLoggedIn(true);
        }
      } catch (e) {}
      try {
        const pr = await window.storage.get("az-ecosystem-publications", true);
        if (pr && pr.value) {
          const parsed = JSON.parse(pr.value);
          if (Array.isArray(parsed)) setPublications(parsed);
          else { await window.storage.set("az-ecosystem-publications", "[]", true); setPublications([]); }
        }
      } catch (e) {
        try { await window.storage.set("az-ecosystem-publications", "[]", true); } catch (e2) {}
        setPublications([]);
      }
      setLoading(false);
    })();
  }, []);

  // Refresh publications when entering the news tab
  const refreshPublications = async () => {
    setPubStatus("Actualizando...");
    try {
      const pr = await window.storage.get("az-ecosystem-publications", true);
      if (pr && pr.value) {
        const parsed = JSON.parse(pr.value);
        const pubs = Array.isArray(parsed) ? parsed : [];
        setPublications(pubs);
        setPubStatus(pubs.length ? `${pubs.length} publicaci\u00f3n(es)` : "Sin publicaciones a\u00fan");
      } else {
        setPublications([]);
        setPubStatus("Sin publicaciones a\u00fan");
      }
    } catch (e) {
      try { await window.storage.set("az-ecosystem-publications", "[]", true); } catch (e2) {}
      setPublications([]);
      setPubStatus("Se limpiaron datos da\u00f1ados. Intenta de nuevo.");
    }
    setTimeout(() => setPubStatus(""), 3000);
  };

  // Guardar publicaciones actualizadas (reacciones/comentarios) en el ecosistema compartido
  const persistPublications = async (pubs) => {
    setPublications(pubs);
    try { await window.storage.set("az-ecosystem-publications", JSON.stringify(pubs), true); }
    catch (e) {
      try {
        const slim = pubs.map(p => (p.fileData && p.fileData.length > 300000) ? { ...p, fileData: "", fileKind: "" } : p);
        await window.storage.set("az-ecosystem-publications", JSON.stringify(slim), true);
        setPublications(slim);
      } catch (e2) {}
    }
  };

  const toggleReaction = async (pubId, emoji) => {
    const userId = hh ? hh.id : "anon";
    const updated = publications.map(p => {
      if (p.id !== pubId) return p;
      const reactions = { ...(p.reactions || {}) };
      const users = { ...(p.reactionUsers || {}) };
      const myReaction = users[userId];
      // Quitar reacción previa del usuario
      if (myReaction && reactions[myReaction]) reactions[myReaction] = Math.max(0, reactions[myReaction] - 1);
      if (myReaction === emoji) {
        delete users[userId]; // si toca el mismo, lo quita
      } else {
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        users[userId] = emoji;
      }
      return { ...p, reactions, reactionUsers: users };
    });
    await persistPublications(updated);
  };

  const addComment = async (pubId) => {
    const text = (commentText[pubId] || "").trim();
    if (!text) return;
    const userId = hh ? hh.id : "anon";
    const userName = hh ? (hh.owner || hh.id) : "Ciudadano";
    const updated = publications.map(p => {
      if (p.id !== pubId) return p;
      const comments = [...(p.comments || []), { id: `C${Date.now()}`, user: userName, userId, text, date: new Date().toISOString() }];
      return { ...p, comments };
    });
    await persistPublications(updated);
    setCommentText(ct => ({ ...ct, [pubId]: "" }));
  };

  const handleLogin = async () => {
    // Demo: any code starting with "H" logs in
    if (loginCode.toUpperCase().startsWith("H") || loginCode === "demo") {
      const userData = { ...DEMO_HOUSEHOLD, id: loginCode.toUpperCase() || "H001" };
      setHH(userData);
      setLoggedIn(true);
      try { await window.storage.set("az-mi-barrio-user", JSON.stringify(userData)); } catch(e) {}
    } else {
      alert("Código no válido. Use el código QR de su Kit AZ o escriba 'demo' para probar.");
    }
  };

  const handleLogout = async () => {
    setLoggedIn(false); setHH(null); setTab("home");
    try { await window.storage.delete("az-mi-barrio-user"); } catch(e) {}
  };

  const generateMyReport = () => {
    const win = window.open("", "_blank");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Mi Reporte - ${hh.owner}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #37474F; padding: 40px; max-width: 700px; margin: 0 auto; }
      .header { border-bottom: 3px solid #3A5C2E; padding-bottom: 16px; margin-bottom: 24px; }
      .brand { font-size: 22px; font-weight: 900; color: #1B3A5C; } .brand span { color: #3A5C2E; }
      .sub { font-size: 11px; color: #7A8A8A; letter-spacing: 2px; }
      h1 { color: #3A5C2E; font-size: 17px; margin: 20px 0 8px; }
      .scorebox { display:flex; gap:16px; margin:16px 0; }
      .card { flex:1; background:#EAF0E5; border-radius:8px; padding:16px; text-align:center; }
      .card .v { font-size:30px; font-weight:900; color:#3A5C2E; }
      .card .l { font-size:10px; color:#888; text-transform:uppercase; }
      table { width:100%; border-collapse:collapse; margin:12px 0; }
      th { background:#3A5C2E; color:#fff; padding:8px; font-size:12px; text-align:left; }
      td { padding:8px; border-bottom:1px solid #eee; font-size:12px; }
      .bar { display:flex; align-items:flex-end; gap:6px; height:80px; margin:12px 0; }
      .bar .col { flex:1; text-align:center; }
      .bar .fill { background:#3A5C2E; border-radius:4px 4px 0 0; margin-top:4px; }
      .foot { margin-top:40px; padding-top:16px; border-top:1px solid #ccc; font-size:10px; color:#aaa; text-align:center; }
      @media print { button { display:none; } }
    </style></head><body>
    <div class="header"><div class="brand">AZ <span>CORPORATION</span></div><div class="sub">MI BARRIO · REPORTE DE PROGRESO</div>
    <div style="font-size:11px;color:#888;margin-top:4px">Generado: ${new Date().toLocaleDateString("es-CO")}</div></div>
    <h1>Mi Hogar</h1>
    <table><tr><td><b>Propietario</b></td><td>${hh.owner}</td></tr>
    <tr><td><b>Dirección</b></td><td>${hh.address}</td></tr>
    <tr><td><b>Nivel actual</b></td><td>${hh.status} · Nivel ${hh.level}</td></tr></table>
    <div class="scorebox">
      <div class="card"><div class="v">${hh.score}</div><div class="l">Mi puntaje</div></div>
      <div class="card"><div class="v" style="color:#1B3A5C">${hh.points}</div><div class="l">Mis puntos</div></div>
    </div>
    <h1>Mi Evolución (6 meses)</h1>
    <div class="bar">${hh.history.map(h=>`<div class="col"><div style="font-size:11px;font-weight:700;color:#3A5C2E">${h.score}</div><div class="fill" style="height:${h.score*0.6}%"></div><div style="font-size:9px;color:#aaa;margin-top:2px">${h.month.slice(0,3)}</div></div>`).join("")}</div>
    <h1>Historial de Puntos</h1>
    <table><tr><th>Fecha</th><th>Concepto</th><th>Puntos</th></tr>
    ${hh.rewards.map(r=>`<tr><td>${r.date}</td><td>${r.type}</td><td style="color:${r.points>0?"#3A5C2E":"#B71C1C"}">${r.points>0?"+":""}${r.points}</td></tr>`).join("")}</table>
    <div class="foot">AZ CORPORATION S.A.S. · Gracias por cuidar tu barrio · Transformamos residuos en futuro</div>
    <button onclick="window.print()" style="margin-top:24px;padding:10px 24px;background:#3A5C2E;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer">🖨️ Imprimir / Guardar PDF</button>
    </body></html>`;
    win.document.write(html); win.document.close();
  };


  if (loading) return <div style={{ display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",fontFamily:"system-ui",color:C.green }}>Cargando...</div>;

  // ── LOGIN SCREEN ──
  if (!loggedIn) {
    return (
      <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:`linear-gradient(135deg,${C.darkGreen},${C.green})`, minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:24 }}>
        <div style={{ width:80,height:80,borderRadius:16,background:C.white,display:"flex",alignItems:"center",justifyContent:"center",padding:8,marginBottom:16 }}><img src={AZ_LOGO_CZ} alt="AZ" style={{ height:"100%",objectFit:"contain" }} /></div>
        <div style={{ color:C.white,fontWeight:800,fontSize:28,marginBottom:4 }}>AZ Mi Barrio</div>
        <div style={{ color:"#A5D6A7",fontSize:14,marginBottom:40 }}>Tu hogar, tu puntaje, tu comunidad</div>
        <div style={{ background:C.white,borderRadius:20,padding:32,width:"100%",maxWidth:360,boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
          <div style={{ fontWeight:700,fontSize:16,color:C.navy,marginBottom:16,textAlign:"center" }}>Ingresa tu código de hogar</div>
          <input value={loginCode} onChange={e => setLoginCode(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder='Ej: H001 o escribe "demo"' style={{ width:"100%",padding:"12px 16px",borderRadius:12,border:`2px solid ${C.green}`,fontSize:16,textAlign:"center",fontWeight:700,boxSizing:"border-box",outline:"none" }} />
          <button onClick={handleLogin} style={{ width:"100%",padding:"14px 0",borderRadius:12,border:"none",background:C.green,color:C.white,fontWeight:800,fontSize:16,cursor:"pointer",marginTop:12 }}>Ingresar</button>
          <div style={{ textAlign:"center",fontSize:12,color:"#999",marginTop:16 }}>Escanea el código QR de tu Kit AZ o ingresa tu código de hogar</div>
        </div>
      </div>
    );
  }

  const scoreColor = hh.score >= 90 ? C.green : hh.score >= 75 ? C.blue : hh.score >= 60 ? C.gold : C.red;
  const unread = hh.notifications.filter(n => !n.read).length;

  const NavBtn = ({ icon, label, id }) => (
    <button onClick={() => { setTab(id); if (id === "news") refreshPublications(); }} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"8px 0",border:"none",background:"transparent",cursor:"pointer",color:tab===id?C.green:"#999",fontWeight:tab===id?700:400,fontSize:11,position:"relative" }}>
      <span style={{ fontSize:20 }}>{icon}</span>
      {label}
      {id === "alerts" && unread > 0 && <span style={{ position:"absolute",top:4,right:"calc(50% - 16px)",width:16,height:16,borderRadius:8,background:C.red,color:C.white,fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center" }}>{unread}</span>}
    </button>
  );

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif",background:C.bg,minHeight:"100vh",maxWidth:480,margin:"0 auto",position:"relative" }}>
      {/* HEADER */}
      <div style={{ background:`linear-gradient(135deg,${C.darkGreen},${C.green})`,padding:"16px 20px",borderRadius:"0 0 24px 24px" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:34,height:34,borderRadius:8,background:C.white,display:"flex",alignItems:"center",justifyContent:"center",padding:3 }}><img src={AZ_LOGO_CZ} alt="AZ" style={{ height:"100%",objectFit:"contain" }} /></div>
            <div>
              <div style={{ color:C.white,fontWeight:700,fontSize:15 }}>Hola, {hh.owner.split(" ")[0]} 👋</div>
              <div style={{ color:"#A5D6A7",fontSize:11 }}>{hh.address}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ padding:"4px 10px",borderRadius:6,border:"1px solid rgba(255,255,255,0.3)",background:"transparent",color:"#A5D6A7",fontSize:11,cursor:"pointer" }}>Salir</button>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding:"16px 16px 80px" }}>

        {/* HOME */}
        {tab === "home" && (
          <div>
            {/* Score card */}
            <div style={{ background:C.white,borderRadius:20,padding:24,textAlign:"center",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",marginBottom:16 }}>
              <div style={{ fontSize:13,fontWeight:600,color:C.gray,marginBottom:8 }}>Tu Puntaje de Clasificación</div>
              <ScoreRing score={hh.score} size={130} />
              <div style={{ marginTop:8,display:"inline-block",padding:"4px 16px",borderRadius:20,background:scoreColor+"18",color:scoreColor,fontWeight:800,fontSize:14 }}>{hh.status} · Nivel {hh.level}</div>
            </div>

            {/* Quick stats */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16 }}>
              <div style={{ background:C.white,borderRadius:14,padding:16,textAlign:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize:11,color:"#888" }}>Tus Puntos</div>
                <div style={{ fontSize:28,fontWeight:900,color:C.gold }}>{hh.points}</div>
                <div style={{ fontSize:10,color:"#AAA" }}>Canjeables por descuentos</div>
              </div>
              <div style={{ background:C.white,borderRadius:14,padding:16,textAlign:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize:11,color:"#888" }}>Tu IRSU</div>
                <div style={{ fontSize:14,fontWeight:700,color:C.navy,marginTop:4 }}>{hh.irsu.name}</div>
                <div style={{ fontSize:11,color:C.green,marginTop:2 }}>📞 {hh.irsu.phone}</div>
              </div>
            </div>

            {/* Next pickup */}
            <div style={{ background:C.white,borderRadius:14,padding:16,boxShadow:"0 1px 4px rgba(0,0,0,0.04)",marginBottom:16 }}>
              <div style={{ fontWeight:700,fontSize:14,color:C.navy,marginBottom:10 }}>📅 Próximas Recolecciones</div>
              {[
                { icon:"🟢",label:"Orgánicos",time:hh.nextPickup.green,color:C.green },
                { icon:"⚪",label:"Reciclables",time:hh.nextPickup.white,color:C.blue },
                { icon:"⚫",label:"No aprovechables",time:hh.nextPickup.black,color:C.gray },
              ].map(p => (
                <div key={p.label} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #F0F0F0" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <span style={{ fontSize:18 }}>{p.icon}</span>
                    <span style={{ fontSize:13,fontWeight:600,color:C.gray }}>{p.label}</span>
                  </div>
                  <span style={{ fontSize:13,fontWeight:700,color:p.color }}>{p.time}</span>
                </div>
              ))}
            </div>

            {/* Score history mini chart */}
            <div style={{ background:C.white,borderRadius:14,padding:16,boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ fontWeight:700,fontSize:14,color:C.navy,marginBottom:10 }}>📈 Tu Evolución</div>
              <div style={{ display:"flex",alignItems:"flex-end",gap:6,height:80 }}>
                {hh.history.map((h,i) => {
                  const color = h.score >= 90 ? C.green : h.score >= 75 ? C.blue : C.gold;
                  return (
                    <div key={i} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center" }}>
                      <div style={{ fontSize:10,fontWeight:700,color,marginBottom:2 }}>{h.score}</div>
                      <div style={{ width:"100%",maxWidth:30,height:`${h.score * 0.7}%`,background:`linear-gradient(180deg,${color},${color}88)`,borderRadius:"4px 4px 0 0",minHeight:4 }} />
                      <div style={{ fontSize:9,color:"#BBB",marginTop:2 }}>{h.month.slice(0,3)}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={generateMyReport} style={{ width:"100%", marginTop:16, padding:"14px 0", borderRadius:14, border:"none", background:C.green, color:C.white, fontWeight:800, fontSize:15, cursor:"pointer" }}>📄 Descargar Mi Reporte (PDF)</button>
          </div>
        )}

        {/* GUIDE */}
        {tab === "guide" && (
          <div>
            <div style={{ fontWeight:800,fontSize:18,color:C.navy,marginBottom:16 }}>♻️ ¿Cómo clasificar tus residuos?</div>

            {[
              { icon:"🟢",title:"Bolsa VERDE — Orgánicos",color:C.green,bg:C.lightGreen,
                yes:["Restos de comida y cáscaras","Frutas y verduras","Residuos de poda (hojas, ramas)","Cáscaras de huevo","Servilletas sucias con alimentos"],
                no:["Aceites de cocina usados","Huesos grandes","Pañales","Colillas de cigarrillo","Excrementos de mascotas"] },
              { icon:"⚪",title:"Bolsa BLANCA — Reciclables",color:C.blue,bg:C.lightBlue,
                yes:["Papel y cartón limpio","Botellas PET limpias","Vidrio (botellas, frascos)","Latas de aluminio","Envases Tetra Pak limpios"],
                no:["Papel higiénico","Cartón con grasa","Envases sucios sin lavar","Vidrio roto suelto","Bombillos"] },
              { icon:"⚫",title:"Bolsa NEGRA — Todo lo demás",color:C.gray,bg:C.lightGray,
                yes:["Plásticos sucios o mezclados","Icopor y multicapas","Pañales y papel higiénico","Cauchos y suelas","Mezclas que no puedas separar"],
                no:["Baterías y pilas (punto ecológico)","Medicamentos vencidos (farmacia)","Electrónicos (punto RAEE)","Aceite de cocina (recolección especial)","Escombros (servicio especial)"] },
            ].map(bag => (
              <div key={bag.title} style={{ background:bag.bg,borderRadius:16,padding:16,marginBottom:12,border:`2px solid ${bag.color}22` }}>
                <div style={{ fontWeight:800,fontSize:15,color:bag.color,marginBottom:10 }}>{bag.icon} {bag.title}</div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                  <div>
                    <div style={{ fontSize:11,fontWeight:700,color:C.green,marginBottom:4 }}>✅ SÍ va aquí:</div>
                    {bag.yes.map(item => <div key={item} style={{ fontSize:12,color:C.gray,padding:"2px 0" }}>• {item}</div>)}
                  </div>
                  <div>
                    <div style={{ fontSize:11,fontWeight:700,color:C.red,marginBottom:4 }}>❌ NO va aquí:</div>
                    {bag.no.map(item => <div key={item} style={{ fontSize:12,color:"#999",padding:"2px 0" }}>• {item}</div>)}
                  </div>
                </div>
              </div>
            ))}

            <div style={{ background:"#FFF3E0",borderRadius:12,padding:14,border:`2px solid ${C.gold}22`,marginTop:8 }}>
              <div style={{ fontWeight:700,fontSize:13,color:C.gold }}>💡 Tip AZ</div>
              <div style={{ fontSize:12,color:C.gray,marginTop:4 }}>¿No sabes dónde va? Ponlo en la <b>bolsa negra</b>. Nuestro equipo en el CCAR lo clasificará correctamente. ¡Es mejor equivocarse en la negra que contaminar la verde o la blanca!</div>
            </div>
          </div>
        )}

        {/* POINTS */}
        {tab === "points" && (
          <div>
            <div style={{ fontWeight:800,fontSize:18,color:C.navy,marginBottom:16 }}>🏆 Mis Puntos y Reconocimientos</div>
            
            <div style={{ background:`linear-gradient(135deg,${C.gold},#FFB300)`,borderRadius:16,padding:20,color:C.white,textAlign:"center",marginBottom:16,boxShadow:"0 4px 16px rgba(249,168,37,0.3)" }}>
              <div style={{ fontSize:13,opacity:0.9 }}>Puntos Disponibles</div>
              <div style={{ fontSize:44,fontWeight:900 }}>{hh.points}</div>
              <div style={{ fontSize:12,opacity:0.8,marginTop:4 }}>Nivel {hh.level} · Siguiente nivel: {hh.level === "Oro" ? "Platino (score ≥ 95)" : "Oro (score ≥ 90)"}</div>
            </div>

            <div style={{ fontWeight:700,fontSize:14,color:C.navy,marginBottom:10 }}>Historial de Movimientos</div>
            {hh.rewards.map((r,i) => (
              <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",background:C.white,borderRadius:10,padding:"12px 14px",marginBottom:8,boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
                <div>
                  <div style={{ fontSize:13,fontWeight:600,color:C.gray }}>{r.type}</div>
                  <div style={{ fontSize:11,color:"#999" }}>{r.date}</div>
                </div>
                <div style={{ fontWeight:800,fontSize:16,color:r.points > 0 ? C.green : C.red }}>{r.points > 0 ? "+" : ""}{r.points}</div>
              </div>
            ))}

            <div style={{ fontWeight:700,fontSize:14,color:C.navy,marginBottom:10,marginTop:20 }}>Canjear Puntos</div>
            {[
              { name:"5% descuento tarifa aseo",cost:100,icon:"🏷️" },
              { name:"Bono COP $15.000 comercio local",cost:200,icon:"🛍️" },
              { name:"Bono COP $30.000 comercio local",cost:350,icon:"🎁" },
              { name:"Participar en sorteo electrodoméstico",cost:500,icon:"📺" },
            ].map(item => (
              <div key={item.name} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",background:C.white,borderRadius:10,padding:"12px 14px",marginBottom:8,boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <span style={{ fontSize:24 }}>{item.icon}</span>
                  <div style={{ fontSize:13,fontWeight:600,color:C.gray }}>{item.name}</div>
                </div>
                <button disabled={hh.points < item.cost} style={{ padding:"6px 14px",borderRadius:8,border:"none",background:hh.points >= item.cost ? C.green : "#E0E0E0",color:hh.points >= item.cost ? C.white : "#999",fontWeight:700,fontSize:12,cursor:hh.points >= item.cost ? "pointer" : "default" }}>{item.cost} pts</button>
              </div>
            ))}
          </div>
        )}

        {/* NEWS / ECOSYSTEM */}
        {tab === "news" && (
          <div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4 }}>
              <div style={{ fontWeight:800,fontSize:18,color:C.navy }}>📢 Novedades AZ CORPORATION</div>
              <button onClick={refreshPublications} style={{ padding:"6px 14px",borderRadius:20,border:`1px solid ${C.green}`,background:C.white,color:C.green,fontSize:12,fontWeight:700,cursor:"pointer" }}>🔄 Actualizar</button>
            </div>
            <div style={{ fontSize:12,color:"#888",marginBottom:8 }}>Anuncios, campañas y contenido de tu operador</div>
            {pubStatus && <div style={{ fontSize:11,color:C.green,marginBottom:12,fontStyle:"italic" }}>{pubStatus}</div>}
            {publications.length === 0 ? (
              <div style={{ textAlign:"center",padding:40,color:"#999" }}>
                <div style={{ fontSize:40,marginBottom:8 }}>📭</div>
                <div style={{ fontSize:14 }}>No hay publicaciones por ahora</div>
                <div style={{ fontSize:12,marginTop:4 }}>Vuelve pronto para ver novedades</div>
              </div>
            ) : (
              publications.map(pub => {
                const typeIcons = { anuncio:"📣", video:"🎬", "campaña":"📢", educativo:"📚", evento:"📅" };
                const typeColors = { anuncio:C.blue, video:C.red, "campaña":C.green, educativo:C.teal, evento:C.gold };
                const getYtId = (url) => {
                  if (!url) return null;
                  const patterns = [
                    /youtube\.com\/watch\?v=([^&]+)/,
                    /youtu\.be\/([^?&]+)/,
                    /youtube\.com\/embed\/([^?&]+)/,
                    /youtube\.com\/shorts\/([^?&]+)/,
                    /youtube\.com\/live\/([^?&]+)/,
                  ];
                  for (const p of patterns) { const m = url.match(p); if (m) return m[1]; }
                  return null;
                };
                const ytId = getYtId(pub.media);
                const isImage = pub.media && /\.(jpg|jpeg|png|gif|webp)$/i.test(pub.media);
                return (
                  <div key={pub.id} style={{ background:C.white,borderRadius:14,padding:16,marginBottom:12,boxShadow:"0 1px 4px rgba(0,0,0,0.06)",borderTop:`3px solid ${typeColors[pub.type]||C.blue}` }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                      <span style={{ fontSize:20 }}>{typeIcons[pub.type]||"📣"}</span>
                      <span style={{ fontWeight:800,color:C.navy,fontSize:15,flex:1 }}>{pub.title}</span>
                    </div>
                    <div style={{ fontSize:13,color:C.gray,lineHeight:1.5,marginBottom:10 }}>{pub.body}</div>
                    {ytId && (
                      <div style={{ marginBottom:8 }}>
                        <div style={{ position:"relative",paddingBottom:"56.25%",height:0,borderRadius:10,overflow:"hidden" }}>
                          <iframe src={`https://www.youtube-nocookie.com/embed/${ytId}`} title={pub.title} style={{ position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none" }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
                        </div>
                        <a href={`https://www.youtube.com/watch?v=${ytId}`} target="_blank" rel="noreferrer" style={{ display:"inline-block",marginTop:6,fontSize:12,color:C.red,fontWeight:600 }}>▶️ Ver en YouTube (si no carga arriba)</a>
                      </div>
                    )}
                    {pub.media && !ytId && (pub.media.includes("youtube") || pub.media.includes("youtu.be")) && (
                      <a href={pub.media} target="_blank" rel="noreferrer" style={{ display:"block",padding:"12px",background:"#FFF0F0",borderRadius:10,marginBottom:8,color:C.red,fontWeight:600,fontSize:13,textAlign:"center" }}>▶️ Ver video en YouTube</a>
                    )}
                    {isImage && <img src={pub.media} alt={pub.title} style={{ width:"100%",borderRadius:10,marginBottom:8 }} />}
                    {pub.fileKind === "image" && pub.fileData && <img src={pub.fileData} alt={pub.fileName} style={{ width:"100%",borderRadius:10,marginBottom:8 }} />}
                    {pub.fileKind === "pdf" && pub.fileData && (
                      <a href={pub.fileData} download={pub.fileName} style={{ display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:"#FFF0F0",borderRadius:10,marginBottom:8,textDecoration:"none",color:C.red,fontWeight:600,fontSize:13 }}>📄 Descargar: {pub.fileName}</a>
                    )}
                    {pub.fileKind === "audio" && pub.fileData && (
                      <div style={{ background:C.lightGreen,borderRadius:10,padding:"10px 12px",marginBottom:8 }}>
                        <div style={{ fontSize:12,fontWeight:600,color:C.green,marginBottom:6 }}>🎵 {pub.fileName}</div>
                        <audio controls src={pub.fileData} style={{ width:"100%" }} />
                      </div>
                    )}
                    {pub.fileKind === "video" && pub.fileData && (
                      <video controls src={pub.fileData} style={{ width:"100%",borderRadius:10,marginBottom:8 }} />
                    )}
                    {pub.fileKind === "audio" && pub.fileData && (
                      <div style={{ background:"#EAF0E5",borderRadius:10,padding:10,marginBottom:8 }}>
                        <div style={{ fontSize:12,fontWeight:600,color:C.green,marginBottom:6 }}>🎵 {pub.fileName}</div>
                        <audio controls src={pub.fileData} style={{ width:"100%" }} />
                      </div>
                    )}
                    {pub.fileKind === "video" && pub.fileData && (
                      <video controls src={pub.fileData} style={{ width:"100%",borderRadius:10,marginBottom:8 }} />
                    )}
                    {pub.media && !ytId && !isImage && (
                      <a href={pub.media} target="_blank" rel="noreferrer" style={{ display:"inline-block",fontSize:13,color:C.blue,fontWeight:600 }}>🔗 Ver más</a>
                    )}
                    <div style={{ fontSize:11,color:"#aaa",marginTop:6 }}>{new Date(pub.date).toLocaleDateString("es-CO")} · {pub.author}</div>

                    {/* Botón de descarga de pieza (imagen/PDF/audio) */}
                    {pub.fileData && pub.fileKind && (
                      <a href={pub.fileData} download={pub.fileName || "pieza-az"} style={{ display:"inline-flex",alignItems:"center",gap:6,marginTop:8,padding:"6px 12px",background:C.lightGreen,borderRadius:20,color:C.green,fontSize:12,fontWeight:700,textDecoration:"none" }}>⬇️ Descargar pieza</a>
                    )}

                    {/* Reacciones con emojis */}
                    <div style={{ display:"flex",gap:6,marginTop:12,flexWrap:"wrap",borderTop:"1px solid #F0F0F0",paddingTop:10 }}>
                      {["👍","❤️","🌱","👏","💡"].map(emoji => {
                        const count = (pub.reactions && pub.reactions[emoji]) || 0;
                        const mine = pub.reactionUsers && pub.reactionUsers[hh ? hh.id : "anon"] === emoji;
                        return (
                          <button key={emoji} onClick={() => toggleReaction(pub.id, emoji)} style={{ display:"flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:16,border:mine ? `1.5px solid ${C.green}` : "1px solid #E0E0E0",background:mine ? C.lightGreen : C.white,cursor:"pointer",fontSize:14 }}>
                            <span>{emoji}</span>
                            {count > 0 && <span style={{ fontSize:12,fontWeight:700,color:mine ? C.green : "#888" }}>{count}</span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Comentarios */}
                    <div style={{ marginTop:10 }}>
                      {(pub.comments || []).length > 0 && (
                        <div style={{ marginBottom:8 }}>
                          {(pub.comments || []).map(cm => (
                            <div key={cm.id} style={{ background:"#F7F7F7",borderRadius:10,padding:"8px 12px",marginBottom:6 }}>
                              <div style={{ fontSize:12,fontWeight:700,color:C.navy }}>{cm.user}</div>
                              <div style={{ fontSize:13,color:C.gray }}>{cm.text}</div>
                              <div style={{ fontSize:10,color:"#bbb",marginTop:2 }}>{new Date(cm.date).toLocaleDateString("es-CO")}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{ display:"flex",gap:6 }}>
                        <input value={commentText[pub.id] || ""} onChange={e => setCommentText(ct => ({ ...ct, [pub.id]: e.target.value }))} onKeyDown={e => e.key === "Enter" && addComment(pub.id)} placeholder="Escribe un comentario..." style={{ flex:1,padding:"8px 12px",borderRadius:20,border:"1px solid #E0E0E0",fontSize:13,outline:"none" }} />
                        <button onClick={() => addComment(pub.id)} style={{ padding:"8px 14px",borderRadius:20,border:"none",background:C.green,color:C.white,fontWeight:700,fontSize:13,cursor:"pointer" }}>Enviar</button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ALERTS */}
        {tab === "alerts" && (
          <div>
            <div style={{ fontWeight:800,fontSize:18,color:C.navy,marginBottom:16 }}>🔔 Notificaciones</div>
            {hh.notifications.map(n => (
              <div key={n.id} style={{ background:n.read ? C.white : C.lightGreen,borderRadius:12,padding:14,marginBottom:8,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",borderLeft:`4px solid ${n.read ? "#E0E0E0" : C.green}` }}>
                <div style={{ fontSize:13,color:C.gray,fontWeight:n.read ? 400 : 700 }}>{n.text}</div>
                <div style={{ fontSize:11,color:"#999",marginTop:4 }}>{n.time}</div>
              </div>
            ))}

            <div style={{ fontWeight:700,fontSize:14,color:C.navy,marginBottom:10,marginTop:24 }}>📞 Contacto Directo</div>
            <div style={{ background:C.white,borderRadius:12,padding:14,boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #F0F0F0" }}>
                <span style={{ fontSize:13 }}>Tu Inspector IRSU</span>
                <span style={{ fontSize:13,fontWeight:700,color:C.green }}>{hh.irsu.name} · {hh.irsu.phone}</span>
              </div>
              <div style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #F0F0F0" }}>
                <span style={{ fontSize:13 }}>Tu Reciclador</span>
                <span style={{ fontSize:13,fontWeight:700,color:C.blue }}>{hh.recycler.name} · {hh.recycler.phone}</span>
              </div>
              <div style={{ display:"flex",justifyContent:"space-between",padding:"8px 0" }}>
                <span style={{ fontSize:13 }}>Línea AZ Corporation</span>
                <span style={{ fontSize:13,fontWeight:700,color:C.navy }}>01 8000 AZ CORP</span>
              </div>
            </div>

            <button onClick={() => { const msg = prompt("Describe tu reporte o solicitud:"); if(msg) alert("Reporte enviado exitosamente. Tu IRSU lo revisará en las próximas 24 horas. Gracias."); }} style={{ width:"100%",padding:"14px 0",borderRadius:12,border:"none",background:C.green,color:C.white,fontWeight:800,fontSize:15,cursor:"pointer",marginTop:16 }}>📝 Enviar Reporte o Solicitud</button>
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:C.white,borderTop:"1px solid #E0E0E0",display:"flex",padding:"4px 0 8px",zIndex:100,boxShadow:"0 -2px 10px rgba(0,0,0,0.05)" }}>
        <NavBtn icon="🏠" label="Inicio" id="home" />
        <NavBtn icon="♻️" label="Clasificar" id="guide" />
        <NavBtn icon="🏆" label="Puntos" id="points" />
        <NavBtn icon="📢" label="Novedades" id="news" />
        <NavBtn icon="🔔" label="Alertas" id="alerts" />
      </div>
    </div>
  );
}

export default AZMiBarrio;
