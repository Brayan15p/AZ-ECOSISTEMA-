// ============================================================
// AZ Ecosistema — Webhook de Bold  ⚠️ MOCKUP / STUB
// ------------------------------------------------------------
// Esto es el ESQUELETO del webhook, NO la implementación final.
// Sirve para fijar el contrato y conectar la UI/infra; antes de ir a
// producción hay que completar lo marcado con TODO(bold).
//
// Lo que YA hace (mock):
//   - Recibe POST, parsea el evento y mapea estado Bold -> payment_status.
//   - Actualiza payments por bold_reference (idempotente gracias al UNIQUE
//     de la migración 20260628000001_security_p0).
// Lo que FALTA para producción:
//   - TODO(bold): verificación REAL de firma (HMAC con el secreto de Bold).
//   - TODO(bold): payload real de Bold (nombres de campos/estados exactos).
//   - TODO(bold): eventos de suscripción SaaS (subscriptions) además de pagos.
//   - TODO(bold): crear el pago si no existe (hoy solo actualiza).
// ============================================================
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  // service_role: el webhook ignora RLS a propósito.
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// TODO(bold): firma real. Bold firma el cuerpo; validar HMAC con BOLD_WEBHOOK_SECRET.
function verifySignature(_req: Request, _rawBody: string): boolean {
  // MOCKUP: en desarrollo aceptamos todo. NO dejar así en producción.
  return true;
}

// MOCKUP: mapea el estado que mande Bold a nuestro enum payment_status.
function mapStatus(raw: string): "approved" | "rejected" | "refunded" | "pending" {
  switch (raw?.toUpperCase()) {
    case "APPROVED":
    case "PAID":
      return "approved";
    case "REJECTED":
    case "FAILED":
      return "rejected";
    case "REFUNDED":
      return "refunded";
    default:
      return "pending";
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const rawBody = await req.text();

  if (!verifySignature(req, rawBody)) {
    return new Response("Invalid signature", { status: 401 });
  }

  let event: Record<string, any>;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }

  // MOCKUP: forma supuesta del evento. Ajustar al payload real de Bold.
  const reference: string | undefined = event?.data?.reference ?? event?.reference;
  const status: string = event?.data?.status ?? event?.status ?? "pending";

  if (!reference) {
    return new Response("Missing reference", { status: 400 });
  }

  // Idempotencia: bold_reference es UNIQUE → reintentos del mismo evento
  // simplemente reescriben el mismo registro, sin duplicar pagos.
  const { error } = await supabase
    .from("payments")
    .update({ status: mapStatus(status), raw: event })
    .eq("bold_reference", reference);

  if (error) {
    console.error("[bold-webhook][mock] error actualizando payment:", error);
    return new Response("DB error", { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true, mock: true }), {
    headers: { "content-type": "application/json" },
  });
});
