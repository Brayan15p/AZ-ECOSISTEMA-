import { Ionicons } from "@expo/vector-icons";
import { status } from "@az/ui-tokens";
import { Pressable, Text, View } from "react-native";

/**
 * Aviso de error con reintento. Crítico para la conectividad intermitente de
 * Arauca: si una consulta falla, el usuario VE el error y puede reintentar,
 * en vez de quedarse con datos viejos sin saberlo.
 */
export function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <View
      className="flex-row items-center gap-3 rounded-xl bg-[#F7E1E1] px-4 py-3"
      accessibilityRole="alert"
    >
      <Ionicons name="cloud-offline-outline" size={20} color={status.danger} />
      <Text className="flex-1 text-footnote" style={{ color: status.danger }}>
        {message}
      </Text>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Reintentar"
          hitSlop={10}
          className="rounded-lg bg-white/60 px-3 py-1.5 active:opacity-70"
        >
          <Text className="text-footnote" style={{ color: status.danger }}>
            Reintentar
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
