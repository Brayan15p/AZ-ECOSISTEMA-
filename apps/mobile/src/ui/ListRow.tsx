import { View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "./Text";

type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  bottom?: React.ReactNode;
};

export function ListRow({ title, subtitle, right, bottom }: Props) {
  const { colors, spacing, radius } = useTheme();
  return (
    <View
      style={{
        backgroundColor: colors.bgSurface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        gap: spacing.xs
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.md }}>
        <View style={{ flex: 1 }}>
          <Text variant="label">{title}</Text>
          {subtitle ? (
            <Text variant="caption" tone="muted">
              {subtitle}
            </Text>
          ) : null}
        </View>
        {right ? <View>{right}</View> : null}
      </View>
      {bottom ? <View>{bottom}</View> : null}
    </View>
  );
}
