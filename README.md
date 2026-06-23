# AZ Ecosistema

Plataforma de **economía circular / gestión de residuos** para Arauca (Colombia).
Producto real construido a partir del prototipo `_legacy/AZ_Ecosistema_Unificado.jsx`.

> Visión: una sola plataforma para que **municipios** gestionen el ecosistema, los **ciudadanos**
> mejoren su clasificación y canjeen puntos, y los **recicladores** se formalicen y reciban liquidaciones.

## Monorepo

| Paquete | Qué es |
|---|---|
| `apps/mobile` | App **Expo (React Native)** — Ciudadano "Mi Barrio" + Reciclador. Estilo Apple. |
| `apps/web` | **Next.js 15** — Operador "Neural Grid OS" + Admin municipio + Landing. |
| `packages/core` | Tipos de dominio + lógica de negocio (scoring, balance de masas) + esquemas zod. |
| `packages/ui-tokens` | Design tokens "estilo Apple" + preset de Tailwind/NativeWind. |
| `packages/supabase` | Cliente Supabase + tipos TS generados de la BD. |
| `packages/config` | tsconfig / configs compartidas. |
| `supabase/` | Migraciones SQL + RLS + seed + Edge Functions (webhook Bold). |

## Stack

- **Móvil:** Expo Router · NativeWind · Reanimated
- **Web:** Next.js (App Router) · Tailwind · shadcn/ui
- **Backend:** Supabase (Postgres + Auth + RLS + Storage + Edge Functions) — multi-tenant por municipio
- **Pagos:** Bold (SaaS municipios · canje ciudadanos · ledger de liquidaciones a recicladores)
- **Tooling:** pnpm workspaces + Turborepo · TypeScript estricto

## Empezar

```bash
corepack enable && corepack prepare pnpm@9.15.0 --activate
pnpm install
cp .env.example .env   # rellena tus claves

pnpm web      # Next.js  -> http://localhost:3000
pnpm mobile   # Expo (en WSL2 usa EAS build/APK, el túnel ngrok falla)
```

## Roles

`ciudadano` · `reciclador` · `operador` · `admin_municipio` · `super_admin`
