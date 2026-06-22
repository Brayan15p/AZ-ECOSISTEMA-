import { View, type ViewProps, type ViewStyle } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import type { ShadowLevel } from "@/theme/tokens";

type Props = ViewProps & {
  padding?: number;
  elevation?: ShadowLevel;
  variant?: "surface" | "alt" | "transparent";
};

export function Card({ children, padding, elevation = "sm", variant = "surface", style, ...rest }: Props) {
  const { colors, radius, spacing, shadow } = useTheme();
  const bg: Record<NonNullable<Props["variant"]>, string> = {
    surface: colors.bgSurface,
    alt: colors.bgSurfaceAlt,
    transparent: "transparent"
  };
  const composed: ViewStyle = {
    backgroundColor: bg[variant],
    borderRadius: radius.xl,
    padding: padding ?? spacing["2xl"],
    ...shadow[elevation]
  };
  return (
    <View style={[composed, style]} {...rest}>
      {children}
    </View>
  );
}
