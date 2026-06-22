import { View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "./Text";

type Tone = "neutral" | "success" | "warning" | "danger" | "info";

type Props = { label: string; tone?: Tone };

export function Chip({ label, tone = "neutral" }: Props) {
  const { colors, radius, spacing } = useTheme();
  const fg: Record<Tone, string> = {
    neutral: colors.textSecondary,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
    info: colors.info
  };
  const bg: Record<Tone, string> = {
    neutral: colors.bgSurfaceAlt,
    success: colors.successBg,
    warning: colors.warningBg,
    danger: colors.dangerBg,
    info: colors.infoBg
  };
  return (
    <View
      style={{
        alignSelf: "flex-start",
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        borderRadius: radius.pill,
        backgroundColor: bg[tone]
      }}
    >
      <Text variant="caption" style={{ color: fg[tone] }}>
        {label}
      </Text>
    </View>
  );
}
