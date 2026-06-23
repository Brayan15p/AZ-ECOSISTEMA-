import { navy } from "@az/ui-tokens";
import { ActivityIndicator, View } from "react-native";

/** Indicador de carga centrado, sobre el fondo del tema. */
export function Loading() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator color={navy[500]} />
    </View>
  );
}
