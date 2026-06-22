import { useEffect } from "react";
import { View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";
import { useTheme } from "@/theme/ThemeProvider";

type Props = {
  value: number;
  max?: number;
  color?: string;
  height?: number;
};

export function ProgressBar({ value, max = 100, color, height = 8 }: Props) {
  const { colors, radius } = useTheme();
  const pct = useSharedValue(0);

  useEffect(() => {
    const target = Math.min(Math.max(value / max, 0), 1);
    pct.value = withTiming(target, { duration: 900, easing: Easing.bezier(0.3, 0, 0, 1) });
  }, [value, max, pct]);

  const inner = useAnimatedStyle(() => ({ width: `${pct.value * 100}%` }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max, now: value }}
      style={{
        height,
        backgroundColor: colors.bgSurfaceAlt,
        borderRadius: radius.pill,
        overflow: "hidden"
      }}
    >
      <Animated.View
        style={[
          {
            height: "100%",
            backgroundColor: color ?? colors.brandSecondary,
            borderRadius: radius.pill
          },
          inner
        ]}
      />
    </View>
  );
}
