# Correos transaccionales — AZ Ecosistema

Plantillas HTML de marca para los correos de **Supabase Auth**. Mismas
identidad, voz y colores que la app (navy `#1B3A5C` → eco `#039855`), pensadas
para verse bien en Gmail, Outlook y Apple Mail (layout con tablas + CSS inline,
sin imágenes externas).

| Archivo | Tipo de correo (Supabase) | Variables usadas |
|---|---|---|
| `confirmation.html` | Confirm signup | `{{ .ConfirmationURL }}` |
| `magic_link.html` | Magic Link | `{{ .ConfirmationURL }}` |
| `recovery.html` | Reset Password | `{{ .ConfirmationURL }}` |
| `invite.html` | Invite user | `{{ .ConfirmationURL }}` |
| `email_change.html` | Change Email Address | `{{ .ConfirmationURL }}`, `{{ .NewEmail }}` |
| `reauthentication.html` | Reauthentication (OTP) | `{{ .Token }}` |

## Cómo instalarlas

### Opción A — Dashboard (producción)
1. Supabase → **Authentication → Emails → Templates**.
2. Por cada tipo, pega el HTML del archivo correspondiente y guarda.
3. Asunto sugerido:
   - Confirm signup: `Confirma tu correo y empieza a sumar 🌱`
   - Magic Link: `Tu enlace para entrar a AZ Ecosistema`
   - Reset Password: `Restablece tu contraseña`
   - Invite: `Te invitaron a AZ Ecosistema`
   - Change Email: `Confirma tu nuevo correo`
   - Reauthentication: `Tu código de verificación`

### Opción B — `config.toml` (local / como código)
Agrega a `supabase/config.toml` para que el stack local use estas plantillas:

```toml
[auth.email.template.confirmation]
subject = "Confirma tu correo y empieza a sumar 🌱"
content_path = "./supabase/templates/confirmation.html"

[auth.email.template.magic_link]
subject = "Tu enlace para entrar a AZ Ecosistema"
content_path = "./supabase/templates/magic_link.html"

[auth.email.template.recovery]
subject = "Restablece tu contraseña"
content_path = "./supabase/templates/recovery.html"

[auth.email.template.invite]
subject = "Te invitaron a AZ Ecosistema"
content_path = "./supabase/templates/invite.html"

[auth.email.template.email_change]
subject = "Confirma tu nuevo correo"
content_path = "./supabase/templates/email_change.html"

[auth.email.template.reauthentication]
subject = "Tu código de verificación"
content_path = "./supabase/templates/reauthentication.html"
```

## Notas
- Sin imágenes externas: el logo es un sello "AZ" en CSS (mejor entregabilidad,
  no lo bloquean los clientes de correo).
- Colores y voz salen de `@az/ui-tokens` (`brand`) para no desincronizar marca.
- Probadas para clientes que ignoran `<style>`: todo el CSS crítico va inline.
