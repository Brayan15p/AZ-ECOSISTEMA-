import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { withAlpha } from "../../lib/color";

/** Etiqueta compacta (chip) con icono opcional. Para niveles, rachas y tags. */
export function Pill({
  label,
  color,
  icon,
  variant = "soft",
}: {
  label: string;
  color: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: "soft" | "solid";
}) {
  const solid = variant === "solid";
  const fg = solid ? "#FFFFFF" : color;
  return (
    <View
      className="flex-row items-center gap-1 self-start rounded-full px-2.5 py-1"
      style={{ backgroundColor: solid ? color : withAlpha(color, 0.14) }}
    >
      {icon ? <Ionicons name={icon} size={13} color={fg} /> : null}
      <Text className="text-caption1" style={{ color: fg, fontWeight: "600" }}>
        {label}
      </Text>
    </View>
  );
}
