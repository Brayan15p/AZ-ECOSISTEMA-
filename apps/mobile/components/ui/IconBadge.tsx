import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { withAlpha } from "../../lib/color";

/** Contenedor redondeado con un icono a color. La pieza visual más reutilizada. */
export function IconBadge({
  icon,
  color,
  size = 44,
  variant = "soft",
  rounded = 14,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  size?: number;
  variant?: "soft" | "solid";
  rounded?: number;
}) {
  const solid = variant === "solid";
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: rounded,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: solid ? color : withAlpha(color, 0.14),
      }}
    >
      <Ionicons name={icon} size={size * 0.5} color={solid ? "#FFFFFF" : color} />
    </View>
  );
}
