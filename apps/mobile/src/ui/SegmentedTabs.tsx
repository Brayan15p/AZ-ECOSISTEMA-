import { ScrollView, Pressable } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "./Text";

export type SegmentOption = { key: string; label: string; count?: number };

type Props = {
  options: SegmentOption[];
  value: string;
  onChange: (key: string) => void;
};

export function SegmentedTabs({ options, value, onChange }: Props) {
  const { colors, radius, spacing } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: spacing.sm, paddingHorizontal: spacing.lg }}
    >
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.xs,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.sm,
              borderRadius: radius.pill,
              backgroundColor: active ? colors.brandPrimary : colors.bgSurfaceAlt
            }}
          >
            <Text variant="label" style={{ color: active ? colors.textOnBrand : colors.textSecondary }}>
              {opt.label}
            </Text>
            {opt.count !== undefined ? (
              <Text variant="caption" style={{ color: active ? colors.textOnBrand : colors.textMuted }}>
                {opt.count}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
