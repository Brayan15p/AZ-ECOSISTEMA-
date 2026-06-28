import { gray } from "@az/ui-tokens";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

import { cn } from "../../lib/cn";

/**
 * Bloque "esqueleto" con pulso suave. Usa la API Animated nativa de RN (no
 * Reanimated) para máxima compatibilidad vía OTA. Conserva el layout mientras
 * cargan los datos → percepción de velocidad mucho mayor que un spinner en blanco.
 */
export function Skeleton({ className }: { className?: string }) {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View className={cn("overflow-hidden rounded-lg", className)}>
      <Animated.View
        style={{ flex: 1, opacity, backgroundColor: gray[200] }}
      />
    </View>
  );
}

/** Esqueleto de pantalla: cabecera + tarjeta + métricas. Sustituye al spinner. */
export function ScreenSkeleton() {
  return (
    <View className="flex-1 gap-4 bg-background px-5 pt-6">
      <View className="gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-52" />
      </View>
      <Skeleton className="h-28 w-full rounded-2xl" />
      <View className="flex-row gap-4">
        <Skeleton className="h-24 flex-1 rounded-2xl" />
        <Skeleton className="h-24 flex-1 rounded-2xl" />
      </View>
      <Skeleton className="h-40 w-full rounded-2xl" />
    </View>
  );
}
