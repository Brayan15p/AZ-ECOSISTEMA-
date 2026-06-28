import { tailwindTheme } from "@az/ui-tokens";
import type { Config } from "tailwindcss";

// Mismos tokens que la app móvil (NativeWind), para una marca consistente
// entre web y móvil. Los colores semánticos llegan por CSS variables (globals.css).
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: tailwindTheme as unknown as NonNullable<Config["theme"]>["extend"],
  },
  plugins: [],
} satisfies Config;
