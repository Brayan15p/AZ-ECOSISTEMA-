import { FlatList, View } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";
import { Card } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Chip } from "@/ui/Chip";
import { useOperatorStore } from "@/state/operatorStore";
import type { PenaltySeverity } from "@shared/types";

const SEVERITY_TONE: Record<PenaltySeverity, "danger" | "warning"> = {
  Grave: "danger",
  Moderada: "warning",
  Leve: "warning"
};

export default function PenaltiesScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const penalties = useOperatorStore((s) => s.penalties);
  const households = useOperatorStore((s) => s.households);
  const resolvePenalty = useOperatorStore((s) => s.resolvePenalty);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgCanvas }}>
      <View style={{ paddingTop: spacing["5xl"], paddingHorizontal: spacing["2xl"], paddingBottom: spacing.lg }}>
        <Button label="← Volver" variant="ghost" size="sm" onPress={() => router.back()} />
        <Text variant="h2" style={{ marginTop: spacing.sm }}>
          Penalizaciones
        </Text>
      </View>

      <FlatList
        data={penalties}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: spacing["2xl"], gap: spacing.md, paddingBottom: spacing["5xl"] }}
        ListEmptyComponent={<Text tone="muted">No hay penalizaciones registradas.</Text>}
        renderItem={({ item }) => {
          const hh = households.find((h) => h.id === item.householdId);
          return (
            <Card padding={spacing.lg}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flex: 1 }}>
                  <Text variant="h3">{hh?.ownerName ?? item.householdId}</Text>
                  <Text variant="bodySm" tone="secondary">
                    {item.date} · {item.type}
                  </Text>
                  <Text variant="bodySm" style={{ marginTop: spacing.xs }}>
                    {item.description}
                  </Text>
                </View>
                <Chip label={item.severity} tone={SEVERITY_TONE[item.severity]} />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.md }}>
                <Chip label={item.resolved ? "Resuelta" : "Activa"} tone={item.resolved ? "success" : "danger"} />
                {!item.resolved ? (
                  <Button label="✓ Resolver" size="sm" variant="outline" onPress={() => resolvePenalty(item.id)} />
                ) : null}
              </View>
            </Card>
          );
        }}
      />
    </View>
  );
}
