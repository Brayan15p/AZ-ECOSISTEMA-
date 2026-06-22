# AZ Ecosistema

App de AZ CORPORATION para la gestión integral de residuos sólidos en Arauca. Es un **monorepo** con dos apps que comparten lógica de negocio y un backend Supabase con seguridad por filas (RLS).

## 🗺️ Estructura del monorepo

```
AZ-ECOSISTEMA-/
├── apps/
│   ├── mobile/      # 📱 App nativa (Expo + React Native) → corre en Expo Go
│   └── web/         # 🌐 Landing pública con SEO (Vite + React)
├── packages/
│   └── shared/      # 🧩 Lógica de negocio compartida (TypeScript puro)
├── supabase/
│   ├── migrations/  # 🗄️ Esquema + RLS policies
│   ├── functions/   # ⚙️ Edge Functions (microservicios)
│   └── config.toml
└── .github/workflows/ci.yml
```

## 📱 App móvil (apps/mobile) — Expo + React Native

Esta es **la app principal**. Se ve en Expo Go y se empaqueta como nativa para iOS/Android.

### Visualizarla en Expo Go (lo más rápido)

```bash
cd apps/mobile
npm install
cp .env.example .env   # llena con las credenciales de Supabase
npm start
```

Escanea el QR con la app **Expo Go** en tu celular (descárgala del App Store o Play Store). La app se carga en segundos, sin compilar nada.

### Compilar para producción (APK / IPA)

```bash
cd apps/mobile
npx eas build --platform android   # genera APK/AAB
npx eas build --platform ios       # requiere cuenta de Apple Developer
```

### Arquitectura interna

```
apps/mobile/
├── app/                         # Rutas (Expo Router)
│   ├── _layout.tsx               # Layout raíz: theme + auth init
│   ├── index.tsx                  # Selector de modo (operador/ciudadano)
│   ├── (ciudadano)/                # Tabs ciudadano: hogar, recompensas, noticias, perfil
│   └── (operador)/                  # Stack operador: dashboard, hogares (WIP)
├── src/
│   ├── theme/                       # Design tokens + ThemeProvider (dark mode auto)
│   ├── ui/                            # Atomic components: Text, Button, Card, Chip,
│   │                                   #   ScoreRing, LevelBadge, ProgressBar, StatTile
│   ├── lib/supabase.ts                  # Cliente Supabase con SecureStore
│   └── state/sessionStore.ts            # Zustand store de sesión
└── app.json, babel/metro/tsconfig
```

### Design system (resumen)

- **Tokens** en `src/theme/tokens.ts`: paletas con 9 tonos, espaciado en grid 4pt, tipografía Major Third, sombras por nivel, motion curves de Material 3 / Apple HIG.
- **Dark mode automático** desde el sistema operativo.
- **Accesibilidad WCAG AA**: roles ARIA, contraste, tamaños táctiles ≥44pt, `accessibilityHint` en botones críticos.
- **Haptics** en `<Button />` por defecto.
- **Reanimated** para animaciones de 60fps (ScoreRing, ProgressBar).

### Gamificación (Octalysis aplicado)

| Driver | Implementación |
|---|---|
| Accomplishment | Niveles Bronce/Plata/Oro/Platino + badges desbloqueables |
| Ownership | Puntos persistentes + historial visible |
| Social Influence | Ranking del barrio (preparado en Supabase) |
| Scarcity | Recompensas con `quotaRemaining` y `expiresIn` |
| Loss Avoidance | Racha (streak) que se rompe sin auditorías buenas |
| Variable Reward | Badges sorpresa + bonos al subir de nivel |

Toda la lógica vive en `packages/shared/src/gamification.ts` para que el backend (Edge Functions) aplique las mismas reglas — single source of truth.

## 🌐 Landing pública (apps/web) — Vite + React

Página de marketing SEO-friendly. Sigue existiendo porque Expo no produce HTML indexable.

```bash
cd apps/web
npm install
npm run dev       # http://localhost:5173
npm run build
```

Detalles SEO ya configurados: meta description, Open Graph, Twitter Card, robots.txt, semántica HTML.

## 🧩 Shared (packages/shared)

TypeScript puro, sin React, sin RN. Importable desde mobile, web y Edge Functions:

- `gamification.ts` — niveles, badges, cálculo de puntos por auditoría, racha.
- `scoring.ts` — `statusFromScore`, umbrales.
- `types.ts` — `Household`, `Publication`, `Reaction`, `Comment`.

## 🗄️ Backend (Supabase)

### Esquema y RLS

Migración inicial en `supabase/migrations/20260101000000_init_schema.sql`. Resumen:

- Tablas: `profiles`, `households`, `audits`, `penalties`, `rewards`, `publications`, `publication_reactions`, `publication_comments`, `audit_log`.
- **RLS habilitado en todas las tablas**. Cada política está declarada explícitamente — sin defaults permisivos.
- **Roles** vía `app_role` enum: `admin`, `operador`, `irsu`, `ciudadano`.
- **Helpers `SECURITY DEFINER`** (`current_role()`, `current_household_id()`) para evitar bypass por recursión RLS.
- **Audit log inmutable** con triggers `SECURITY DEFINER`: cada cambio en `households`, `audits`, `penalties`, `rewards` queda registrado con actor + before/after en `audit_log` (solo `admin` puede leerlo).

### Edge Functions (microservicios)

`supabase/functions/record-audit` — ejemplo: un IRSU registra una auditoría → calcula puntos → actualiza puntaje del hogar con media móvil → (TODO: notifica push). Lógica sensible NUNCA en el cliente: el cliente solo ve el resultado.

### Despliegue del backend

```bash
npx supabase login
npx supabase link --project-ref TU-PROYECTO
npx supabase db push                       # aplica migraciones
npx supabase functions deploy record-audit
```

## 🔐 Seguridad

- **JWT corto (15 min)** + refresh rotativo (configurado en `supabase/config.toml`).
- **Tokens en Keychain/KeyStore** vía `expo-secure-store` (nunca en AsyncStorage).
- **RLS estricto** + helpers `SECURITY DEFINER` + audit log inmutable.
- **Edge Functions** validan rol desde la DB (no del JWT) antes de operar.
- **CI con `gitleaks`** para detectar secrets en commits.
- **MFA habilitable** (Supabase auth, hasta 5 factores).
- **CSP estricta** y headers de seguridad: pendientes en el wrapper Capacitor/Expo cuando se publique a producción.

> ⚠️ Esto es la base correcta. Una **auditoría de seguridad humana** profesional sigue siendo obligatoria antes de un lanzamiento real (especialmente porque hay efectos reales sobre la tarifa de aseo del ciudadano).

## 🛠️ CI/CD

`.github/workflows/ci.yml` ejecuta en cada push:
- `apps/mobile`: typecheck con TS estricto.
- `apps/web`: build de producción.
- `security`: gitleaks + `npm audit`.

## 🚧 Estado actual / próximas iteraciones

| Área | Estado |
|---|---|
| Monorepo + shared package | ✅ Listo |
| Design system + atomic components (mobile) | ✅ Listo |
| Pantalla ciudadano (home con gamificación, recompensas, noticias, perfil) | ✅ Listo |
| Pantalla operador completa (hogares, recicladores, penalizaciones, recompensas) | 🚧 En migración desde la app web |
| Supabase: schema + RLS + Edge Function ejemplo | ✅ Listo |
| Push notifications | 🚧 Próximo (Expo Notifications + Supabase trigger) |
| Tests E2E con Maestro | 🚧 Próximo |
| Tests unitarios (`packages/shared`) | 🚧 Próximo |
| Sentry + PostHog | 🚧 Próximo |

## 📦 Identificadores

- `appId` (iOS bundle / Android package): `com.azcorporation.ecosistema`
- Scheme deep-link: `azecosistema://`
