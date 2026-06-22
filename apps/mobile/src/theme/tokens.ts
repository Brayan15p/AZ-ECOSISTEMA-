/**
 * AZ Ecosistema · Design Tokens
 *
 * Fuente única de verdad para color, espaciado, tipografía, radio,
 * sombra y motion. Cada token tiene un propósito semántico — no se
 * inventan valores nuevos en los componentes.
 *
 * Diseño guiado por Material Design 3, Apple HIG y WCAG AA:
 * - Contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande.
 * - Tamaño táctil mínimo 44pt (iOS) / 48dp (Android).
 * - Espaciado en cuadrícula de 4pt.
 */

// ── Escalas de color ─────────────────────────────────────────────
// Cada color tiene 9 tonos (50–900). Permite combinaciones con
// contraste accesible automáticamente.

const navy = {
  50: "#E8EDF3",
  100: "#C3D0E0",
  200: "#9DB1CB",
  300: "#7894B7",
  400: "#5479A3",
  500: "#2A5580",
  600: "#1B3A5C",
  700: "#142B45",
  800: "#0D1C2E",
  900: "#070E17"
} as const;

const green = {
  50: "#EDF3E8",
  100: "#D1DFC3",
  200: "#B5CC9D",
  300: "#99B978",
  400: "#7DA654",
  500: "#5C8A3A",
  600: "#3A5C2E",
  700: "#2C4423",
  800: "#1D2D17",
  900: "#0F170B"
} as const;

const gold = {
  50: "#FBF3DD",
  100: "#F4E2A9",
  200: "#EDD075",
  300: "#E5BF41",
  400: "#C9A11D",
  500: "#A88516",
  600: "#8A6D1A",
  700: "#665114",
  800: "#43360E",
  900: "#221B07"
} as const;

const red = {
  50: "#FBE9E9",
  100: "#F2BFBF",
  200: "#E89494",
  300: "#DE6A6A",
  400: "#D44040",
  500: "#B71C1C",
  600: "#891515",
  700: "#5B0E0E",
  800: "#3C0909",
  900: "#1E0505"
} as const;

const neutral = {
  0: "#FFFFFF",
  50: "#FAFBFC",
  100: "#F1F3F5",
  200: "#E0E4E8",
  300: "#C5CCD2",
  400: "#9AA5AE",
  500: "#6B7884",
  600: "#4A5560",
  700: "#37424C",
  800: "#1F262D",
  900: "#0E1216",
  1000: "#000000"
} as const;

// ── Tokens semánticos por modo (light / dark) ────────────────────
// Los componentes solo leen tokens semánticos, nunca los crudos.

type SemanticColorRecord = {
  brandPrimary: string;
  brandPrimaryHover: string;
  brandPrimaryMuted: string;
  brandSecondary: string;
  brandSecondaryHover: string;
  brandSecondaryMuted: string;
  bgCanvas: string;
  bgSurface: string;
  bgSurfaceAlt: string;
  bgOverlay: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnBrand: string;
  textOnInverse: string;
  borderSubtle: string;
  borderStrong: string;
  success: string;
  successBg: string;
  warning: string;
  warningBg: string;
  danger: string;
  dangerBg: string;
  info: string;
  infoBg: string;
  levelBronze: string;
  levelSilver: string;
  levelGold: string;
  levelPlatinum: string;
  scoreExcellent: string;
  scoreGood: string;
  scoreWarning: string;
  scoreFail: string;
};

export const lightColors: SemanticColorRecord = {
  // Brand
  brandPrimary: navy[600],
  brandPrimaryHover: navy[700],
  brandPrimaryMuted: navy[100],
  brandSecondary: green[600],
  brandSecondaryHover: green[700],
  brandSecondaryMuted: green[100],

  // Backgrounds
  bgCanvas: neutral[50],
  bgSurface: neutral[0],
  bgSurfaceAlt: neutral[100],
  bgOverlay: "rgba(14, 18, 22, 0.55)",

  // Text
  textPrimary: neutral[900],
  textSecondary: neutral[600],
  textMuted: neutral[500],
  textOnBrand: neutral[0],
  textOnInverse: neutral[0],

  // Borders
  borderSubtle: neutral[200],
  borderStrong: neutral[300],

  // Feedback
  success: green[600],
  successBg: green[50],
  warning: gold[600],
  warningBg: gold[50],
  danger: red[500],
  dangerBg: red[50],
  info: navy[500],
  infoBg: navy[50],

  // Gamification levels
  levelBronze: "#A0683A",
  levelSilver: "#9AA5AE",
  levelGold: gold[400],
  levelPlatinum: "#7BAEC0",

  // Score ring states
  scoreExcellent: green[600],
  scoreGood: navy[500],
  scoreWarning: gold[500],
  scoreFail: red[500]
};

export const darkColors: SemanticColorRecord = {
  brandPrimary: navy[400],
  brandPrimaryHover: navy[300],
  brandPrimaryMuted: navy[800],
  brandSecondary: green[400],
  brandSecondaryHover: green[300],
  brandSecondaryMuted: green[800],

  bgCanvas: neutral[900],
  bgSurface: neutral[800],
  bgSurfaceAlt: neutral[700],
  bgOverlay: "rgba(0, 0, 0, 0.65)",

  textPrimary: neutral[50],
  textSecondary: neutral[300],
  textMuted: neutral[400],
  textOnBrand: neutral[0],
  textOnInverse: neutral[900],

  borderSubtle: neutral[700],
  borderStrong: neutral[600],

  success: green[400],
  successBg: green[800],
  warning: gold[300],
  warningBg: gold[800],
  danger: red[400],
  dangerBg: red[800],
  info: navy[300],
  infoBg: navy[800],

  levelBronze: "#C28556",
  levelSilver: "#C5CCD2",
  levelGold: gold[300],
  levelPlatinum: "#A6D0DC",

  scoreExcellent: green[400],
  scoreGood: navy[400],
  scoreWarning: gold[400],
  scoreFail: red[400]
};

export const palette = { navy, green, gold, red, neutral } as const;

// ── Espaciado (4pt grid) ─────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 56,
  "6xl": 72
} as const;

// ── Radio ────────────────────────────────────────────────────────
export const radius = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  "2xl": 28,
  pill: 999
} as const;

// ── Tipografía ───────────────────────────────────────────────────
// Escala "Major Third" (1.250). Ajustada para móvil.
export const typography = {
  display: { fontSize: 36, lineHeight: 42, fontWeight: "900" as const, letterSpacing: -0.5 },
  h1: { fontSize: 28, lineHeight: 34, fontWeight: "800" as const, letterSpacing: -0.3 },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: "800" as const, letterSpacing: -0.2 },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: "700" as const },
  bodyLg: { fontSize: 17, lineHeight: 26, fontWeight: "400" as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: "400" as const },
  bodySm: { fontSize: 13, lineHeight: 20, fontWeight: "400" as const },
  label: { fontSize: 13, lineHeight: 18, fontWeight: "600" as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "500" as const },
  overline: { fontSize: 11, lineHeight: 14, fontWeight: "700" as const, letterSpacing: 1.5 }
} as const;

// ── Sombra (elevación) ───────────────────────────────────────────
// Para iOS usamos shadow*, Android usa elevation. RN combina ambos.
export const shadow = {
  none: { shadowColor: "transparent", shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 6
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 12
  }
} as const;

// ── Motion ───────────────────────────────────────────────────────
// Curvas y duraciones siguiendo Material Motion + Apple HIG.
export const motion = {
  duration: { instant: 100, fast: 180, base: 250, slow: 400, gentle: 600 },
  easing: {
    standard: [0.2, 0, 0, 1] as const,
    emphasized: [0.3, 0, 0, 1] as const,
    decelerate: [0, 0, 0, 1] as const
  }
} as const;

// ── Tipos compartidos ────────────────────────────────────────────
export type SemanticColors = SemanticColorRecord;
export type Spacing = keyof typeof spacing;
export type Radius = keyof typeof radius;
export type TypographyVariant = keyof typeof typography;
export type ShadowLevel = keyof typeof shadow;
