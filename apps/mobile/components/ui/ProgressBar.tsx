import { useEffect } from "react";
import { View, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

/**
 * Barra de progreso que se "llena" al aparecer (withTiming). El relleno acepta
 * un color sólido o, si pasas dos colores, simula un degradé tomando el medio.
 */
export function ProgressBar({
  value,
  color,
  trackColor = "rgba(255,255,255,0.18)",
  height = 8,
  delay = 120,
  duration = 800,
  style,
}: {
  /** Progreso 0..1. */
  value: number;
  color: string;
  trackColor?: string;
  height?: number;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
}) {
  const p = useSharedValue(0);
  const target = Math.max(0, Math.min(1, value));

  useEffect(() => {
    p.value = withDelay(
      delay,
      withTiming(target, { duration, easing: Easing.out(Easing.cubic) }),
    );
  }, [target, delay, duration, p]);

  const fill = useAnimatedStyle(() => ({
    width: `${p.value * 100}%`,
  }));

  return (
    <View
      style={[
        { height, borderRadius: height, backgroundColor: trackColor, overflow: "hidden" },
        style,
      ]}
    >
      <Animated.View
        style={[{ height, borderRadius: height, backgroundColor: color }, fill]}
      />
    </View>
  );
}
