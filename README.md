# AZ Ecosistema

App unificada de AZ CORPORATION para la gestión integral de residuos sólidos en Arauca. Incluye dos modos:

- **AZ Neural Grid OS** — panel para operadores (IRSU, CCAR, supervisores).
- **AZ Mi Barrio** — app para los ciudadanos/hogares.

Ambos modos comparten las publicaciones (anuncios, campañas, contenido educativo) a través del mismo almacenamiento local.

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
