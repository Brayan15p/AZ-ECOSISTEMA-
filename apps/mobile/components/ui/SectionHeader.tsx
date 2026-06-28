import { Ionicons } from "@expo/vector-icons";
import { gray } from "@az/ui-tokens";
import { Pressable, Text, View } from "react-native";

/** Encabezado de sección: título grande + acción opcional a la derecha. */
export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View className="mt-2 flex-row items-center justify-between">
      <Text className="text-title3 text-text-primary">{title}</Text>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          hitSlop={8}
          className="flex-row items-center gap-0.5 active:opacity-60"
        >
          <Text className="text-footnote text-accent">{actionLabel}</Text>
          <Ionicons name="chevron-forward" size={14} color={gray[500]} />
        </Pressable>
      ) : null}
    </View>
  );
}
