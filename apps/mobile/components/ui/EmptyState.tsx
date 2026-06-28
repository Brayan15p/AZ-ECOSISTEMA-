import { Ionicons } from "@expo/vector-icons";
import { gray } from "@az/ui-tokens";
import { Text, View } from "react-native";

/**
 * Estado vacío amable: icono suave + título + subtítulo. Evita las "cajas en
 * blanco" cuando una lista no tiene datos. Pensado para usuarios con baja
 * alfabetización digital: el icono ancla el significado del mensaje.
 */
export function EmptyState({
  icon = "sparkles-outline",
  title,
  subtitle,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}) {
  return (
    <View
      className="items-center gap-2 px-6 py-10"
      accessibilityRole="text"
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
    >
      <View className="h-16 w-16 items-center justify-center rounded-full bg-surface-sunken">
        <Ionicons name={icon} size={28} color={gray[500]} />
      </View>
      <Text className="text-center text-headline text-text-primary">{title}</Text>
      {subtitle ? (
        <Text className="max-w-[260px] text-center text-subhead text-text-secondary">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
