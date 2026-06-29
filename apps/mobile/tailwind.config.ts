import type { Config } from "tailwindcss";
// NativeWind v4 carga este config con jiti, que transpila el TS de @az/ui-tokens.
import { tailwindTheme } from "@az/ui-tokens";
// nativewind/preset publica un index.d.ts vacío en v4.2.5 (TS2306: "is not a
// module"). Se usa solo como objeto de preset de Tailwind; ignoramos el tipo
// roto del paquete. Si una versión futura trae tipos, este directivo fallará y
// recordará quitarlo.
// @ts-expect-error -- preset sin tipos válidos en nativewind@4.2.5
import nativewindPreset from "nativewind/preset";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [nativewindPreset],
  // Los tokens semánticos cambian solos vía media query en global.css.
  darkMode: "media",
  theme: {
    extend: tailwindTheme,
  },
  plugins: [],
} satisfies Config;
