import type { Config } from "tailwindcss";
// NativeWind v4 carga este config con jiti, que transpila el TS de @az/ui-tokens.
import { tailwindTheme } from "@az/ui-tokens";
// eslint-disable-next-line @typescript-eslint/no-var-requires
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
