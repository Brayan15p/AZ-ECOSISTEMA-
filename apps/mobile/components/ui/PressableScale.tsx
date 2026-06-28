import type { ReactNode } from "react";
import { Pressable, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const SPRING = { damping: 16, stiffness: 320, mass: 0.6 } as const;

/**
 * Envoltura táctil con "rebote" estilo iOS: al presionar, el contenido se
 * encoge con un spring y vuelve al soltar. La `className` (NativeWind) va en
 * el Pressable interno —que NativeWind sí interpola— y la animación vive en
 * el `Animated.View` externo con estilo plano, evitando fricciones.
 */
export function PressableScale({
  children,
  onPress,
  onLongPress,
  className,
  style,
  scaleTo = 0.96,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = "button",
}: {
  children: ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  className?: string;
  style?: ViewStyle;
  scaleTo?: number;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: "button" | "link" | "none";
}) {
  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[aStyle, style]}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        disabled={disabled}
        onPressIn={() => {
          scale.value = withSpring(scaleTo, SPRING);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, SPRING);
        }}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
        hitSlop={6}
        className={className}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
