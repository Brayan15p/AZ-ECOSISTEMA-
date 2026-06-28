import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { IconBadge } from "./IconBadge";
import { Card } from "./Card";

/** Métrica compacta: icono + valor grande + etiqueta + pista opcional. */
export function StatTile({
  label,
  value,
  hint,
  icon,
  color,
  valueColor,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  /** Color de acento del icono. */
  color?: string;
  /** Color del número (por defecto, texto primario). */
  valueColor?: string;
}) {
  return (
    <Card className="flex-1 gap-1">
      {icon && color ? (
        <IconBadge icon={icon} color={color} size={34} rounded={10} />
      ) : null}
      <Text
        className="mt-1 text-title2 text-text-primary"
        style={valueColor ? { color: valueColor } : undefined}
        numberOfLines={1}
      >
        {value}
      </Text>
      <Text className="text-caption1 uppercase text-text-tertiary">{label}</Text>
      {hint ? (
        <Text className="text-footnote text-text-secondary">{hint}</Text>
      ) : null}
    </Card>
  );
}
