/**
 * Construye el bloque `theme.extend` de Tailwind a partir de los tokens.
 * Lo importan tanto `apps/web` (Tailwind) como `apps/mobile` (NativeWind):
 *
 *   // tailwind.config.ts
 *   import { tailwindTheme } from "@az/ui-tokens";
 *   export default { theme: { extend: tailwindTheme }, ... }
 */
import {
  navy,
  green,
  gray,
  status,
  spacing,
  radius,
  shadow,
  fontFamily,
  typography,
} from "./tokens";

const fontSize = Object.fromEntries(
  Object.entries(typography).map(([name, t]) => [
    name,
    [
      `${t.size}px`,
      { lineHeight: `${t.lineHeight}px`, letterSpacing: `${t.tracking}px`, fontWeight: t.weight },
    ],
  ]),
);

const px = (obj: Record<string | number, number>) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, `${v}px`]));

export const tailwindTheme = {
  colors: {
    navy,
    green,
    gray,
    // tokens semánticos vía CSS variables (definidas por cada app en :root / .dark)
    background: "var(--az-background)",
    surface: "var(--az-surface)",
    "surface-elevated": "var(--az-surface-elevated)",
    "surface-sunken": "var(--az-surface-sunken)",
    border: "var(--az-border)",
    "border-strong": "var(--az-border-strong)",
    "text-primary": "var(--az-text-primary)",
    "text-secondary": "var(--az-text-secondary)",
    "text-tertiary": "var(--az-text-tertiary)",
    accent: "var(--az-accent)",
    brand: navy[700],
    "brand-alt": green[600],
    success: status.success,
    warning: status.warning,
    danger: status.danger,
    info: status.info,
    gold: status.gold,
  },
  spacing: px(spacing),
  borderRadius: px(radius),
  fontFamily,
  fontSize: fontSize as Record<string, [string, Record<string, string>]>,
  boxShadow: shadow,
} as const;
