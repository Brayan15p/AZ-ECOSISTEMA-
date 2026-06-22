// ============================================================
// Edge Function: record-audit
//
// Microservicio que registra una auditoría hecha por un IRSU,
// recalcula puntos/puntaje del hogar y dispara notificación push.
// Vive cerca de la base de datos (Deno + PostgREST) y NUNCA expone
// la service-role key al cliente — es la forma correcta de aplicar
// reglas de negocio sensibles en Supabase.
// ============================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Payload = { householdId: string; score: number; notes?: string };

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function pointsForScore(score: number): number {
  if (score >= 95) return 25;
  if (score >= 90) return 18;
  if (score >= 80) return 12;
  if (score >= 70) return 6;
  if (score >= 60) return 2;
  return 0;
}

// Best-effort: una falla aquí nunca debe tumbar el registro de la auditoría.
async function notifyHouseholdCitizens(
  adminClient: ReturnType<typeof createClient>,
  householdId: string,
  newScore: number
): Promise<void> {
  try {
    const { data: profiles } = await adminClient
      .from("profiles")
      .select("id")
      .eq("household_id", householdId);
    if (!profiles || profiles.length === 0) return;

    const userIds = profiles.map((p: { id: string }) => p.id);
    const { data: tokens } = await adminClient
      .from("push_tokens")
      .select("expo_push_token")
      .in("user_id", userIds);
    if (!tokens || tokens.length === 0) return;

    const messages = tokens.map((t: { expo_push_token: string }) => ({
      to: t.expo_push_token,
      sound: "default",
      title: "Tu hogar fue auditado",
      body: `Nuevo puntaje: ${newScore}`
    }));

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(messages)
    });
  } catch {
    // No-op: la notificación es best-effort.
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  // El cliente envía su JWT; usamos un cliente "as user" para que RLS aplique.
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } }
  });
  const adminClient = createClient(supabaseUrl, serviceKey);

  const { data: { user }, error: userErr } = await userClient.auth.getUser();
  if (userErr || !user) {
    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  }

  // El rol se obtiene del perfil, no del JWT (que el cliente podría falsificar
  // si no estuviera firmado por Supabase).
  const { data: profile } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["irsu", "operador", "admin"].includes(profile.role)) {
    return new Response("Forbidden", { status: 403, headers: corsHeaders });
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400, headers: corsHeaders });
  }

  if (
    !body.householdId ||
    typeof body.score !== "number" ||
    body.score < 0 ||
    body.score > 100
  ) {
    return new Response("Bad payload", { status: 400, headers: corsHeaders });
  }

  const pointsAwarded = pointsForScore(body.score);

  // Insert auditoría (usa RLS — fallará si el IRSU no tiene permisos).
  const { error: auditErr } = await userClient.from("audits").insert({
    household_id: body.householdId,
    irsu_id: user.id,
    score: body.score,
    notes: body.notes ?? null
  });
  if (auditErr) return new Response(auditErr.message, { status: 400, headers: corsHeaders });

  // Actualiza puntaje + puntos del hogar (admin client porque agrega).
  const { data: hh, error: hhErr } = await adminClient
    .from("households")
    .select("score, points")
    .eq("id", body.householdId)
    .single();
  if (hhErr || !hh) return new Response("Household not found", { status: 404, headers: corsHeaders });

  // Score nuevo: media móvil simple 70/30 para suavizar.
  const newScore = Math.round(hh.score * 0.7 + body.score * 0.3);
  const newPoints = hh.points + pointsAwarded;

  await adminClient
    .from("households")
    .update({ score: newScore, points: newPoints, last_audit_at: new Date().toISOString() })
    .eq("id", body.householdId);

  await notifyHouseholdCitizens(adminClient, body.householdId, newScore);

  return new Response(
    JSON.stringify({ ok: true, newScore, newPoints, pointsAwarded }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
