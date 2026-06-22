import { View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "./Text";
import { Card } from "./Card";

type Props = {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  icon?: string;
};

export function StatTile({ label, value, sub, accent, icon }: Props) {
  const { colors, spacing } = useTheme();
  const accentColor = accent ?? colors.brandPrimary;
  return (
    <Card
      padding={spacing.xl}
      style={{
        flex: 1,
        minWidth: 150,
        borderLeftWidth: 4,
        borderLeftColor: accentColor
      }}
    >
      <Text variant="overline" tone="muted">
        {icon ? `${icon}  ` : ""}
        {label}
      </Text>
      <Text variant="h1" style={{ color: accentColor, marginTop: spacing.xs }}>
        {value}
      </Text>
      {sub ? (
        <Text variant="caption" tone="muted" style={{ marginTop: 2 }}>
          {sub}
        </Text>
      ) : null}
    </Card>
  );
}
