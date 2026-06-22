import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing
} from "react-native-reanimated";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "./Text";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  score: number;
  size?: number;
  label?: string;
};

/**
 * Anillo de puntaje animado.
 * - Color cambia según el rango (excelente/bien/aviso/falla) para
 *   feedback inmediato (principio: variable reward + clear progress).
 * - Animación 1.2s con easing emphasized para entrar suave al puntaje.
 * - Gradiente lineal para diferenciarse de un simple ring sólido.
 */
export function ScoreRing({ score, size = 160, label }: Props) {
  const { colors } = useTheme();
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(Math.min(Math.max(score, 0), 100) / 100, {
      duration: 1200,
      easing: Easing.bezier(0.3, 0, 0, 1)
    });
  }, [score, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - circumference * progress.value
  }));

  const color =
    score >= 90
      ? colors.scoreExcellent
      : score >= 75
        ? colors.scoreGood
        : score >= 60
          ? colors.scoreWarning
          : colors.scoreFail;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
        <Defs>
          <LinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.9" />
            <Stop offset="1" stopColor={color} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.borderSubtle}
          strokeWidth={stroke}
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
        />
      </Svg>
      <View style={{ position: "absolute", alignItems: "center" }}>
        <Text variant="display" style={{ color }}>
          {Math.round(score)}
        </Text>
        {label ? (
          <Text variant="overline" tone="muted">
            {label}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
