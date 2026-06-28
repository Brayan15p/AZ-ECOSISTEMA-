import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { withAlpha } from "../../lib/color";
import { IconBadge } from "./IconBadge";
import { PressableScale } from "./PressableScale";

/** Botón-tarjeta de acceso rápido para la cuadrícula del inicio. */
export function QuickAction({
  icon,
  label,
  color,
  onPress,
  badge,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress?: () => void;
  /** Texto opcional de notificación (p. ej. "3"). */
  badge?: string;
}) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityLabel={label}
      style={{ flex: 1 }}
      scaleTo={0.93}
    >
      <View className="items-center gap-2 rounded-2xl border border-border bg-surface py-4">
        <View>
          <IconBadge icon={icon} color={color} size={48} />
          {badge ? (
            <View
              className="absolute -right-1 -top-1 min-w-[18px] items-center justify-center rounded-full px-1"
              style={{ height: 18, backgroundColor: color }}
            >
              <Text className="text-[10px] text-white" style={{ fontWeight: "700" }}>
                {badge}
              </Text>
            </View>
          ) : null}
        </View>
        <Text
          className="text-caption1 text-text-secondary"
          style={{ fontWeight: "600" }}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </PressableScale>
  );
}
