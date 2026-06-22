# AZ Ecosistema

App unificada de AZ CORPORATION para la gestión integral de residuos sólidos en Arauca. Incluye:

- **Landing pública** (`/`) — página de marketing indexable, con SEO (meta tags, Open Graph, Twitter Card) y acceso a la app.
- **AZ Neural Grid OS** — panel para operadores (IRSU, CCAR, supervisores), dentro de `/app`.
- **AZ Mi Barrio** — app para los ciudadanos/hogares, dentro de `/app`.

Ambos modos comparten las publicaciones (anuncios, campañas, contenido educativo) a través del mismo almacenamiento local.

## Arquitectura

```
src/
  App.jsx                 # Rutas: "/" (Landing) y "/app" (selector de modo)
  pages/
    Landing.jsx            # Página pública con SEO
    AppShell.jsx            # Selector Operador / Ciudadano (antes "AZEcosistema")
  features/
    operador/AZNeuralGridOS.jsx
    ciudadano/AZMiBarrio.jsx
  components/shared/        # StatCard, MiniBar, Badge, Tab, ScoreRing
  lib/
    theme.js                 # Paletas de color y design tokens (fuente única)
    scoring.js                 # getScoreColor / getStatusLabel
    useDocumentMeta.js          # Hook para <title>/meta por página
  data/                        # Datos demo (INITIAL_DATA, DEMO_HOUSEHOLD)
  assets/logos.js                # Logos en base64
  storage-polyfill.js              # window.storage → localStorage
```

La lógica de negocio (puntajes, penalizaciones, recompensas, publicaciones compartidas) es la misma que el componente original; solo se reorganizó en módulos por responsabilidad.

### SEO

La landing (`/`) usa meta tags estáticos en `index.html` (description, Open Graph, Twitter Card, robots) más `useDocumentMeta` para actualizar `<title>` por ruta. Es una SPA sin SSR: cuando exista un dominio público definitivo, agrega `rel="canonical"` en `index.html` y un `sitemap.xml` en `public/`. Las rutas dentro de `/app` no necesitan SEO (son la app autenticada, no contenido público).

### Despliegue web (landing pública)

La app usa `react-router-dom` con rutas reales (`/`, `/app`), por lo que el hosting necesita redirigir cualquier ruta a `index.html` (ya incluido):

- **Vercel**: `vercel.json` con rewrite a `/index.html`.
- **Netlify**: `public/_redirects` con `/* /index.html 200`.

Capacitor no necesita esto porque sirve un solo `index.html` local.

## Desarrollo web

```bash
npm install
npm run dev       # abre en http://localhost:5173
npm run build     # genera la carpeta dist/
```

## Empaquetar como app nativa (iOS / Android) con Capacitor

Las carpetas nativas `ios/` y `android/` no se versionan en el repo (son proyectos generados, con binarios). Se crean una sola vez en tu máquina:

```bash
npm install
npm run build
npx cap add android
npx cap add ios
```

A partir de ahí, cada vez que cambies el código web:

1. Compila el sitio web y sincroniza con los proyectos nativos:

   ```bash
   npm run build
   npx cap sync
   ```

2. **Android**: abre el proyecto en Android Studio y ejecuta/genera el APK o AAB.

   ```bash
   npm run cap:open:android
   ```

3. **iOS**: requiere macOS con Xcode y CocoaPods instalados.

   ```bash
   cd ios/App && pod install && cd ../..
   npm run cap:open:ios
   ```

   Desde Xcode puedes ejecutar en simulador/dispositivo o archivar para subir a App Store Connect (TestFlight / App Store).

## Notas

- El identificador de la app es `com.azcorporation.ecosistema` (`capacitor.config.json`). Cámbialo antes de publicar si se requiere otro bundle ID.
- Los datos (hogares, puntuaciones, publicaciones) se guardan en el almacenamiento local del dispositivo (`localStorage` vía `window.storage`, ver `src/storage-polyfill.js`). Para producción multi-usuario real se recomienda conectar un backend (Supabase, Firebase, etc.).
