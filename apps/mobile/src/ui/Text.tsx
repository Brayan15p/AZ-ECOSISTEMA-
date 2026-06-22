import { Text as RNText, type TextProps, type TextStyle } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import type { TypographyVariant } from "@/theme/tokens";

type Variant = TypographyVariant;
type Tone = "primary" | "secondary" | "muted" | "onBrand" | "danger" | "success";

type Props = TextProps & {
  variant?: Variant;
  tone?: Tone;
  align?: TextStyle["textAlign"];
};

export function Text({
  variant = "body",
  tone = "primary",
  align,
  style,
  children,
  ...rest
}: Props) {
  const { colors, typography } = useTheme();
  const toneColor: Record<Tone, string> = {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    muted: colors.textMuted,
    onBrand: colors.textOnBrand,
    danger: colors.danger,
    success: colors.success
  };
  return (
    <RNText
      // Limita el escalado del usuario para evitar layouts rotos
      // sin perder accesibilidad por completo.
      maxFontSizeMultiplier={1.4}
      style={[typography[variant], { color: toneColor[tone], textAlign: align }, style]}
      {...rest}
    >
      {children}
    </RNText>
  );
}
