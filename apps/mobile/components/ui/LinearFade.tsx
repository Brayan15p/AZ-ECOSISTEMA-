import type { ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";

/** Interpola dos colores hex (#rrggbb) en t∈[0,1] → "rgb(r,g,b)". */
export function lerpColor(a: string, b: string, t: number): string {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * t);
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * t);
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * Gradiente lineal SIN librería nativa: apila N bandas de color interpoladas
 * en `absoluteFill`. Mantiene la app publicable por OTA (no requiere build).
 * Para superficies grandes (hero) ~16 bandas se ven perfectamente suaves.
 */
export function LinearFade({
  colors,
  horizontal = false,
  steps = 16,
  style,
  children,
}: {
  colors: readonly string[];
  horizontal?: boolean;
  steps?: number;
  style?: ViewStyle | ViewStyle[];
  children?: ReactNode;
}) {
  const from = colors[0] ?? "#000000";
  const to = colors[colors.length - 1] ?? from;
  const bands = Array.from({ length: steps }, (_, i) =>
    lerpColor(from, to, steps === 1 ? 0 : i / (steps - 1)),
  );

  return (
    <View style={[{ overflow: "hidden" }, style]}>
      <View
        style={[
          StyleSheet.absoluteFill,
          { flexDirection: horizontal ? "row" : "column" },
        ]}
        pointerEvents="none"
      >
        {bands.map((c, i) => (
          <View key={i} style={{ flex: 1, backgroundColor: c }} />
        ))}
      </View>
      {children}
    </View>
  );
}
