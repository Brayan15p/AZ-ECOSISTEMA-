// ============================================================
// AZ ECOSISTEMA — Design tokens
// Fuente única de verdad para colores, radios, sombras y
// tipografía. AZNeuralGridOS (operador) y AZMiBarrio (ciudadano)
// usan paletas con identidad propia pero comparten estos tokens
// estructurales para mantener consistencia visual.
// ============================================================

export const OPERATOR_COLORS = {
  navy: "#1B3A5C", blue: "#2A5580", lightBlue: "#3A6B9C", green: "#3A5C2E",
  emerald: "#3A5C2E", lime: "#4A6B32", gold: "#4A6B32", orange: "#E65100",
  red: "#B71C1C", teal: "#00695C", gray: "#37474F", lightGray: "#F5F5F5",
  white: "#FFFFFF", bg: "#FAFBFC"
};

export const CITIZEN_COLORS = {
  green: "#3A5C2E", darkGreen: "#27401F", lightGreen: "#E8F0E4",
  blue: "#2A5580", lightBlue: "#E8EEF4", gold: "#8A6D1A", lightGold: "#FBF3DD",
  red: "#B71C1C", lightRed: "#FBE9E9", teal: "#00695C", gray: "#37474F",
  lightGray: "#F5F5F5", white: "#FFFFFF", bg: "#FAFBFC", navy: "#1B3A5C"
};

export const BRAND = {
  navy: "#1B3A5C",
  green: "#3A5C2E",
  gradient: "linear-gradient(135deg, #1B3A5C, #3A5C2E)"
};

export const RADIUS = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 };

export const SHADOW = {
  sm: "0 1px 4px rgba(0,0,0,0.08)",
  md: "0 4px 16px rgba(0,0,0,0.12)",
  lg: "0 20px 60px rgba(0,0,0,0.3)"
};

export const FONT_STACK = "'Inter', 'Segoe UI', system-ui, sans-serif";
