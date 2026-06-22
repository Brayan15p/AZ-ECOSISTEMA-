import { useCallback } from "react";
import {
  Pressable,
  ActivityIndicator,
  View,
  type PressableProps,
  type ViewStyle
} from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "./Text";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type Props = Omit<PressableProps, "style" | "children"> & {
  variant?: Variant;
  size?: Size;
  label: string;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  hapticOnPress?: boolean;
  accessibilityHint?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  label,
  fullWidth,
  loading,
  icon,
  iconRight,
  disabled,
  onPress,
  hapticOnPress = true,
  accessibilityHint,
  ...rest
}: Props) {
  const { colors, radius, spacing } = useTheme();

  const heightBySize: Record<Size, number> = { sm: 36, md: 48, lg: 56 };
  const padBySize: Record<Size, number> = { sm: spacing.md, md: spacing.lg, lg: spacing.xl };

  const palette = {
    primary: { bg: colors.brandPrimary, fg: colors.textOnBrand, border: "transparent" },
    secondary: { bg: colors.brandSecondary, fg: colors.textOnBrand, border: "transparent" },
    outline: { bg: "transparent", fg: colors.brandPrimary, border: colors.brandPrimary },
    ghost: { bg: "transparent", fg: colors.brandPrimary, border: "transparent" },
    danger: { bg: colors.danger, fg: colors.textOnBrand, border: "transparent" }
  }[variant];

  const onPressWithHaptic = useCallback(
    (event: Parameters<NonNullable<PressableProps["onPress"]>>[0]) => {
      if (hapticOnPress) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
      onPress?.(event);
    },
    [onPress, hapticOnPress]
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled || !!loading, busy: !!loading }}
      accessibilityHint={accessibilityHint}
      disabled={disabled || loading}
      onPress={onPressWithHaptic}
      style={({ pressed }): ViewStyle => ({
        height: heightBySize[size],
        paddingHorizontal: padBySize[size],
        borderRadius: radius.lg,
        backgroundColor: palette.bg,
        borderWidth: variant === "outline" ? 1.5 : 0,
        borderColor: palette.border,
        opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        alignSelf: fullWidth ? "stretch" : "auto",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm,
        // Animación de press a través de opacidad (RN no soporta CSS transition;
        // para escalado suave usaríamos Reanimated en componentes destacados)
        transform: [{ scale: pressed ? 0.98 : 1 }]
      })}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <>
          {icon ? <View>{icon}</View> : null}
          <Text variant={size === "lg" ? "h3" : "label"} style={{ color: palette.fg }}>
            {label}
          </Text>
          {iconRight ? <View>{iconRight}</View> : null}
        </>
      )}
    </Pressable>
  );
}
