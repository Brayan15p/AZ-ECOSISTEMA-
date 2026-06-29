# bold-webhook ⚠️ MOCKUP

Esqueleto del webhook de pagos **Bold**. **No es la versión de producción.**

## Estado
- ✅ Estructura del handler (POST → parse → mapear estado → update payment).
- ✅ Idempotente por `payments.bold_reference` (UNIQUE en migración `20260628000001_security_p0`).
- ❌ Verificación de firma **simulada** (`verifySignature` devuelve `true`).
- ❌ Payload/estados de Bold asumidos (ajustar a la doc real de Bold).
- ❌ Sin manejo de suscripciones SaaS (`subscriptions`) ni alta de pagos nuevos.

## Pendiente para producción (`TODO(bold)` en el código)
1. Firma real: HMAC del body con `BOLD_WEBHOOK_SECRET`.
2. Mapear el payload real de Bold (nombres de campos/estados exactos).
3. Eventos de suscripción de municipios además de pagos de ciudadanos.
4. Crear el `payment` si no existe (hoy solo actualiza por referencia).

## Probar localmente (cuando exista stack local)
```bash
supabase functions serve bold-webhook
curl -X POST http://localhost:54321/functions/v1/bold-webhook \
  -H 'content-type: application/json' \
  -d '{"reference":"TEST-123","status":"APPROVED"}'
```
