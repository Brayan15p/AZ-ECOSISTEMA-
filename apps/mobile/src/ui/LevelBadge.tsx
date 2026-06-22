import { View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "./Text";
import type { Level } from "@shared/gamification";

const ICONS: Record<Level, string> = {
  bronze: "🥉",
  silver: "🥈",
  gold: "🥇",
  platinum: "💎"
};

const LABELS: Record<Level, string> = {
  bronze: "Bronce",
  silver: "Plata",
  gold: "Oro",
  platinum: "Platino"
};

export function LevelBadge({ level, compact }: { level: Level; compact?: boolean }) {
  const { colors, radius, spacing } = useTheme();
  const colorByLevel: Record<Level, string> = {
    bronze: colors.levelBronze,
    silver: colors.levelSilver,
    gold: colors.levelGold,
    platinum: colors.levelPlatinum
  };
  const ring = colorByLevel[level];
  return (
    <View
      accessibilityLabel={`Nivel ${LABELS[level]}`}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        paddingHorizontal: compact ? spacing.md : spacing.lg,
        paddingVertical: compact ? spacing.xs : spacing.sm,
        borderRadius: radius.pill,
        borderWidth: 1.5,
        borderColor: ring,
        backgroundColor: colors.bgSurface
      }}
    >
      <Text variant={compact ? "body" : "h3"}>{ICONS[level]}</Text>
      <Text variant={compact ? "label" : "h3"} style={{ color: ring }}>
        Nivel {LABELS[level]}
      </Text>
    </View>
  );
}
