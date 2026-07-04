// ============================================================
// AZ Ecosistema — Webhook de Bold
// ------------------------------------------------------------
// Verifica la firma HMAC-SHA256 real de Bold (developers.bold.co/webhook):
//   header `x-bold-signature` = hex( HMAC-SHA256( base64(rawBody), secretKey ) )
// Payload real de Bold: { id, type, subject, source, data }
//   type ∈ SALE_APPROVED | SALE_REJECTED | VOID_APPROVED | VOID_REJECTED
//   subject = ID de transacción → lo usamos para casar con payments.bold_reference
//
// TODO(bold): hoy no existe ningún flujo en el repo que cree un payment con
// bold_reference al iniciar un cobro, así que este webhook solo ACTUALIZA
// pagos existentes; si no encuentra el `subject`, lo loguea y responde 200
// (para que Bold no reintente indefinidamente) sin inventar el registro.
// TODO(bold): eventos de suscripción SaaS (subscriptions) — hoy solo actualiza `payments`.
// ============================================================
import { createClient } from "jsr:@supabase/supabase-js@2";
import { createHmac, timingSafeEqual } from "node:crypto";
import { Buffer } from "node:buffer";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  // service_role: el webhook ignora RLS a propósito.
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const BOLD_SIGNATURE_HEADER = "x-bold-signature";

// Firma real de Bold: HMAC-SHA256(base64(rawBody), secretKey) en hex.
// Usamos Buffer (no btoa): btoa codifica cada code-unit UTF-16 como si fuera
// un byte, no los bytes UTF-8 reales — con tildes/ñ (comunes en nombres de
// comercios) produciría una firma distinta a la que calcula Bold sobre los
// bytes UTF-8 crudos, y fallaría la verificación en silencio.
function computeSignature(rawBody: string, secretKey: string): string {
  const encoded = Buffer.from(rawBody, "utf8").toString("base64");
  return createHmac("sha256", secretKey).update(encoded).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = new TextEncoder().encode(a);
  const bufB = new TextEncoder().encode(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function mapStatus(type: string): "approved" | "rejected" | "refunded" | "pending" {
  switch (type) {
    case "SALE_APPROVED":
      return "approved";
    case "SALE_REJECTED":
      return "rejected";
    case "VOID_APPROVED":
    case "VOID_REJECTED":
      return "refunded";
    default:
      return "pending";
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Fail-closed: si el secreto nunca se configuró, rechazamos todo en vez de
  // aceptar con una clave vacía (trivial de forjar si el atacante también la usa).
  const secretKey = Deno.env.get("BOLD_WEBHOOK_SECRET");
  if (secretKey === undefined) {
    console.error("[bold-webhook] BOLD_WEBHOOK_SECRET no está configurado — rechazando por defecto.");
    return new Response("Webhook not configured", { status: 500 });
  }

  const rawBody = await req.text();
  const receivedSignature = req.headers.get(BOLD_SIGNATURE_HEADER);

  if (!receivedSignature || !safeEqual(computeSignature(rawBody, secretKey), receivedSignature)) {
    console.error("[bold-webhook] firma inválida o ausente.");
    return new Response("Invalid signature", { status: 401 });
  }

  let event: { id?: string; type?: string; subject?: string; data?: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }

  const { type, subject } = event;
  if (!type || !subject) {
    return new Response("Missing type/subject", { status: 400 });
  }

  // Idempotencia: bold_reference es UNIQUE → reintentos del mismo evento
  // simplemente reescriben el mismo registro, sin duplicar pagos.
  const { data, error } = await supabase
    .from("payments")
    .update({ status: mapStatus(type), raw: event })
    .eq("bold_reference", subject)
    .select("id");

  if (error) {
    console.error("[bold-webhook] error actualizando payment:", error);
    return new Response("DB error", { status: 500 });
  }

  if (!data || data.length === 0) {
    // No hay flujo de creación de pagos todavía (ver TODO arriba). Se loguea
    // para investigar, pero se responde 200 para evitar reintentos infinitos de Bold.
    console.warn(`[bold-webhook] no se encontró payment con bold_reference=${subject}`);
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" },
  });
});
