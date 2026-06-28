import { Ionicons } from "@expo/vector-icons";
import { amber, coral, eco, gray, navy } from "@az/ui-tokens";
import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { cn } from "../../lib/cn";

type Variant = "primary" | "eco" | "success" | "accent" | "secondary" | "ghost" | "danger";
type Size = "md" | "lg";

interface VariantStyle {
  container: string;
  label: string;
  fg: string; // hex para icono / spinner
}

const VARIANTS: Record<Variant, VariantStyle> = {
  primary: { container: "bg-brand", label: "text-white", fg: gray[0] },
  eco: { container: "bg-eco-500", label: "text-white", fg: gray[0] },
  success: { container: "bg-eco-600", label: "text-white", fg: gray[0] },
  accent: { container: "bg-amber-500", label: "text-white", fg: gray[0] },
  secondary: {
    container: "border border-border bg-surface",
    label: "text-text-primary",
    fg: gray[700],
  },
  ghost: { container: "bg-transparent", label: "text-accent", fg: navy[500] },
  danger: { container: "bg-coral-50", label: "text-coral-700", fg: coral[600] },
};

const SIZES: Record<Size, { pad: string; text: string; icon: number }> = {
  md: { pad: "py-3 px-4", text: "text-callout", icon: 18 },
  lg: { pad: "py-3.5 px-5", text: "text-headline", icon: 20 },
};

const SPRING = { damping: 16, stiffness: 320, mass: 0.6 } as const;

// Color de acento usado por las sombras suaves de los botones de relleno.
const GLOW: Partial<Record<Variant, string>> = {
  primary: navy[700],
  eco: eco[500],
  success: eco[600],
  accent: amber[500],
};

/**
 * Botón canónico de la app: una sola fuente de verdad para estilo, estados
 * (loading/disabled), iconografía, accesibilidad y ahora un "rebote" táctil
 * con Reanimated + una sombra a color sutil en las variantes de relleno.
 */
export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = true,
  accessibilityHint,
  children,
}: {
  title?: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  accessibilityHint?: string;
  children?: ReactNode;
}) {
  const v = VARIANTS[variant];
  const s = SIZES[size];
  const isDisabled = disabled || loading;

  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const glow = GLOW[variant];
  const shadow =
    glow && !isDisabled
      ? {
          shadowColor: glow,
          shadowOpacity: 0.32,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 4,
        }
      : undefined;

  return (
    <Animated.View style={[aStyle, fullWidth ? undefined : { alignSelf: "flex-start" }, shadow]}>
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        onPressIn={() => {
          if (!isDisabled) scale.value = withSpring(0.96, SPRING);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, SPRING);
        }}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        hitSlop={8}
        className={cn(
          "flex-row items-center justify-center gap-2 rounded-xl",
          s.pad,
          fullWidth ? "w-full" : "self-start",
          isDisabled ? "bg-surface-sunken" : v.container,
        )}
      >
        {loading ? (
          <ActivityIndicator color={isDisabled ? gray[500] : v.fg} />
        ) : (
          <>
            {icon ? (
              <Ionicons name={icon} size={s.icon} color={isDisabled ? gray[500] : v.fg} />
            ) : null}
            {title ? (
              <Text className={cn(s.text, isDisabled ? "text-text-tertiary" : v.label)}>
                {title}
              </Text>
            ) : null}
            {children ? <View>{children}</View> : null}
            {iconRight ? (
              <Ionicons name={iconRight} size={s.icon} color={isDisabled ? gray[500] : v.fg} />
            ) : null}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}
