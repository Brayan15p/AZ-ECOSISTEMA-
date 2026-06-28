/**
 * AZ Ecosistema — Design Tokens ("estilo Apple")
 * ------------------------------------------------
 * Fuente única de verdad para color, tipografía, espaciado, radios,
 * sombras y movimiento. Consumido por web (Tailwind) y móvil (NativeWind).
 *
 * Filosofía: marca AZ (navy + verde) refinada a un sistema premium,
 * con grises neutros fríos, mucho aire, profundidad sutil (sombras + blur)
 * y una escala tipográfica al estilo de Apple HIG.
 */

// ── Marca AZ (navy refinado) ────────────────────────────────
export const navy = {
  50: "#EEF3F8",
  100: "#D6E2EE",
  200: "#AEC5DC",
  300: "#7FA3C2",
  400: "#4E7CA1",
  500: "#2A5580", // accent principal
  600: "#1F436A",
  700: "#1B3A5C", // marca original
  800: "#152E49",
  900: "#0F2236",
  950: "#0A1824",
} as const;

// ── Marca AZ (verde economía circular) ──────────────────────
export const green = {
  50: "#EFF4EC",
  100: "#D8E6D0",
  200: "#B4CDA3",
  300: "#8AAE72",
  400: "#658D4B",
  500: "#4A6B32", // verde acción
  600: "#3A5C2E", // marca original
  700: "#2F4A25",
  800: "#26391E",
  900: "#1B2915",
  950: "#0F180C",
} as const;

// ── Grises neutros fríos (superficies y texto) ──────────────
export const gray = {
  0: "#FFFFFF",
  50: "#F7F8FA",
  100: "#EFF1F4",
  200: "#E3E6EB",
  300: "#CFD4DC",
  400: "#A8B0BD",
  500: "#7C8696",
  600: "#5A6473",
  700: "#414B59",
  800: "#2B333E",
  900: "#1A1F27",
  950: "#0E1116",
} as const;

// ════════════════════════════════════════════════════════════
//  PALETA VIBRANTE "ECO" (v2)
//  Acentos vivos para una UI alegre y amigable, manteniendo la
//  marca navy/green como base seria. Estos ramps son escalas
//  completas 50→950 para gradientes, tints e iconografía a color.
// ════════════════════════════════════════════════════════════

// Verde vivo — acción principal de la app móvil (más brillante que `green`).
export const eco = {
  50: "#ECFDF3",
  100: "#D1FADF",
  200: "#A6F4C5",
  300: "#6CE9A6",
  400: "#32D583",
  500: "#12B76A", // CTA / marca viva
  600: "#039855",
  700: "#027A48",
  800: "#05603A",
  900: "#054F31",
  950: "#053321",
} as const;

// Lima fresca — energía, “ganaste puntos”, confeti.
export const lime = {
  50: "#F3FEE7",
  100: "#E4FBCC",
  200: "#D0F8AB",
  300: "#A6EF67",
  400: "#85E13A",
  500: "#66C61C",
  600: "#4CA30D",
  700: "#3B7C0F",
  800: "#326212",
  900: "#2B5314",
  950: "#15290A",
} as const;

// Teal — agua / impacto ambiental.
export const teal = {
  50: "#F0FDF9",
  100: "#CCFBEF",
  200: "#99F6E0",
  300: "#5FE9D0",
  400: "#2ED3B7",
  500: "#15B79E",
  600: "#0E9384",
  700: "#107569",
  800: "#125D56",
  900: "#134E48",
  950: "#0A2926",
} as const;

// Ámbar — recompensas, energía, oro/logros.
export const amber = {
  50: "#FFFAEB",
  100: "#FEF0C7",
  200: "#FEDF89",
  300: "#FEC84B",
  400: "#FDB022",
  500: "#F79009",
  600: "#DC6803",
  700: "#B54708",
  800: "#93370D",
  900: "#7A2E0E",
  950: "#4E1D09",
} as const;

// Coral — penalizaciones / residuos peligrosos / racha (fuego).
export const coral = {
  50: "#FFF1F3",
  100: "#FFE4E8",
  200: "#FECDD6",
  300: "#FEA3B4",
  400: "#FD6F8E",
  500: "#F63D68",
  600: "#E31B54",
  700: "#C01048",
  800: "#A11043",
  900: "#89123E",
  950: "#510B24",
} as const;

// Azul cielo — reciclables / información.
export const sky = {
  50: "#F0F9FF",
  100: "#E0F2FE",
  200: "#B9E6FE",
  300: "#7CD4FD",
  400: "#36BFFA",
  500: "#0BA5EC",
  600: "#0086C9",
  700: "#026AA2",
  800: "#065986",
  900: "#0B4A6F",
  950: "#062C41",
} as const;

// Violeta — especiales / posconsumo / insignias premium.
export const violet = {
  50: "#F5F3FF",
  100: "#ECE9FE",
  200: "#DDD6FE",
  300: "#C3B5FD",
  400: "#A48AFB",
  500: "#875BF7",
  600: "#7839EE",
  700: "#6927DA",
  800: "#5720B7",
  900: "#491C96",
  950: "#2E125E",
} as const;

/**
 * Colores por flujo de residuo, alineados con la norma colombiana de
 * separación en la fuente (Res. 2184/2019: bolsa blanca/verde/negra) +
 * peligrosos y posconsumo. Cada uno trae color sólido, tint suave y
 * el nombre de un icono Ionicons sugerido.
 */
export const wasteCategory = {
  aprovechable: { color: sky[600], soft: sky[50], icon: "sync-circle", bag: "Bolsa blanca" },
  organico: { color: eco[600], soft: eco[50], icon: "leaf", bag: "Bolsa verde" },
  noAprovechable: { color: gray[700], soft: gray[100], icon: "trash-bin", bag: "Bolsa negra" },
  peligroso: { color: coral[600], soft: coral[50], icon: "warning", bag: "Punto especial" },
  especial: { color: violet[600], soft: violet[50], icon: "battery-charging", bag: "Punto posconsumo" },
} as const;

/**
 * Pares de color para gradientes (la app móvil los pinta con un
 * componente de capas, sin librería nativa). [desde, hasta].
 */
export const gradients = {
  eco: [eco[400], eco[600]],
  ecoLime: [lime[400], eco[500]],
  meadow: [eco[500], teal[600]],
  ocean: [sky[400], teal[600]],
  sunrise: [amber[400], coral[500]],
  gold: [amber[300], amber[600]],
  royal: [violet[500], sky[500]],
  flame: [amber[500], coral[600]],
  night: [navy[700], navy[950]],
} as const;

// ── Estados semánticos ──────────────────────────────────────
export const status = {
  success: "#2E7D32",
  successSoft: "#E6F2E7",
  warning: "#E65100",
  warningSoft: "#FCEBDD",
  danger: "#B71C1C",
  dangerSoft: "#F7E1E1",
  info: "#00695C",
  infoSoft: "#DCEEEB",
  gold: "#B8860B",
  goldSoft: "#F6EEDC",
} as const;

/**
 * Tokens semánticos por tema. Las apps consumen ESTOS, no los crudos,
 * para soportar modo claro/oscuro sin tocar componentes.
 */
export const semantic = {
  light: {
    background: gray[50],
    surface: gray[0],
    surfaceElevated: gray[0],
    surfaceSunken: gray[100],
    border: gray[200],
    borderStrong: gray[300],
    textPrimary: gray[900],
    textSecondary: gray[600],
    textTertiary: gray[500],
    textInverse: gray[0],
    accent: navy[500],
    accentText: gray[0],
    brand: navy[700],
    brandAlt: green[600],
    overlay: "rgba(14, 17, 22, 0.45)",
    glass: "rgba(255, 255, 255, 0.72)",
  },
  dark: {
    background: gray[950],
    surface: gray[900],
    surfaceElevated: gray[800],
    surfaceSunken: "#070A0E",
    border: "#252C36",
    borderStrong: gray[700],
    textPrimary: gray[50],
    textSecondary: gray[400],
    textTertiary: gray[500],
    textInverse: gray[900],
    accent: navy[300],
    accentText: gray[950],
    brand: navy[200],
    brandAlt: green[300],
    overlay: "rgba(0, 0, 0, 0.6)",
    glass: "rgba(26, 31, 39, 0.72)",
  },
} as const;

// ── Tipografía (escala tipo Apple HIG) ──────────────────────
export const fontFamily = {
  // SF Pro en iOS por defecto; Inter como fallback multiplataforma.
  sans: [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    "SF Pro Text",
    "Segoe UI",
    "Roboto",
    "system-ui",
    "sans-serif",
  ],
  display: ["Inter", "SF Pro Display", "-apple-system", "system-ui", "sans-serif"],
  mono: ["SF Mono", "ui-monospace", "Menlo", "monospace"],
} as const;

/** [fontSize(px), { lineHeight, letterSpacing, fontWeight }] */
export const typography = {
  largeTitle: { size: 34, lineHeight: 41, tracking: 0.4, weight: "700" },
  title1: { size: 28, lineHeight: 34, tracking: 0.36, weight: "700" },
  title2: { size: 22, lineHeight: 28, tracking: 0.35, weight: "700" },
  title3: { size: 20, lineHeight: 25, tracking: 0.38, weight: "600" },
  headline: { size: 17, lineHeight: 22, tracking: -0.43, weight: "600" },
  body: { size: 17, lineHeight: 22, tracking: -0.43, weight: "400" },
  callout: { size: 16, lineHeight: 21, tracking: -0.31, weight: "400" },
  subhead: { size: 15, lineHeight: 20, tracking: -0.23, weight: "400" },
  footnote: { size: 13, lineHeight: 18, tracking: -0.08, weight: "400" },
  caption1: { size: 12, lineHeight: 16, tracking: 0, weight: "400" },
  caption2: { size: 11, lineHeight: 13, tracking: 0.06, weight: "400" },
} as const;

// ── Espaciado (grid de 8pt, con medios pasos) ───────────────
export const spacing = {
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
} as const;

// ── Radios (esquinas suaves, premium) ───────────────────────
export const radius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  full: 9999,
} as const;

// ── Sombras (elevación suave estilo iOS) ────────────────────
export const shadow = {
  none: "none",
  xs: "0 1px 2px rgba(15, 34, 54, 0.06)",
  sm: "0 1px 3px rgba(15, 34, 54, 0.08), 0 1px 2px rgba(15, 34, 54, 0.04)",
  md: "0 4px 12px rgba(15, 34, 54, 0.08), 0 2px 4px rgba(15, 34, 54, 0.04)",
  lg: "0 12px 28px rgba(15, 34, 54, 0.12), 0 4px 8px rgba(15, 34, 54, 0.06)",
  xl: "0 24px 48px rgba(15, 34, 54, 0.16), 0 8px 16px rgba(15, 34, 54, 0.08)",
  glass: "0 8px 32px rgba(15, 34, 54, 0.14)",
} as const;

// ── Blur (glassmorphism) ────────────────────────────────────
export const blur = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
} as const;

// ── Movimiento (springs sutiles, estilo iOS) ────────────────
export const motion = {
  duration: { fast: 150, base: 250, slow: 400 },
  easing: {
    standard: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    decelerate: "cubic-bezier(0.0, 0.0, 0.2, 1)",
    accelerate: "cubic-bezier(0.4, 0.0, 1, 1)",
  },
  spring: {
    gentle: { damping: 18, stiffness: 180, mass: 1 },
    snappy: { damping: 22, stiffness: 320, mass: 1 },
    bouncy: { damping: 12, stiffness: 200, mass: 1 },
  },
} as const;

export const tokens = {
  navy,
  green,
  gray,
  eco,
  lime,
  teal,
  amber,
  coral,
  sky,
  violet,
  wasteCategory,
  gradients,
  status,
  semantic,
  fontFamily,
  typography,
  spacing,
  radius,
  shadow,
  blur,
  motion,
} as const;

export type Tokens = typeof tokens;
export type ThemeMode = keyof typeof semantic;
export type SemanticColors = typeof semantic.light;
