import { navy } from "@az/ui-tokens";
import type { ReactNode } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ErrorBanner } from "./ErrorBanner";

/** Lienzo base de cada pantalla: respeta el notch y usa el fondo del tema. */
export function Screen({
  children,
  scroll = true,
  refreshing = false,
  onRefresh,
  error,
  onRetry,
}: {
  children: ReactNode;
  scroll?: boolean;
  /** Estado del pull-to-refresh. */
  refreshing?: boolean;
  /** Si se define, habilita el gesto de "deslizar para recargar". */
  onRefresh?: () => void;
  /** Mensaje de error a mostrar como banner sobre el contenido. */
  error?: string | null;
  /** Reintento del banner de error. */
  onRetry?: () => void;
}) {
  const banner =
    error != null ? <ErrorBanner message={error} onRetry={onRetry} /> : null;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {scroll ? (
        <ScrollView
          contentContainerClassName="px-5 pb-12 pt-2 gap-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={navy[500]}
                colors={[navy[500]]}
              />
            ) : undefined
          }
        >
          {banner}
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1 gap-4 px-5 pt-2">
          {banner}
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}
