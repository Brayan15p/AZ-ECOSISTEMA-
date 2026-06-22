import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";
import { Card } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Chip } from "@/ui/Chip";
import { TextField } from "@/ui/TextField";
import { Sheet } from "@/ui/Sheet";
import { SegmentedTabs } from "@/ui/SegmentedTabs";
import { useOperatorStore } from "@/state/operatorStore";
import type { Household, Status } from "@shared/types";

const STATUS_TONE: Record<Status, "success" | "info" | "warning" | "danger"> = {
  Excelente: "success",
  Cumple: "info",
  Reentrenamiento: "warning",
  Incumplimiento: "danger"
};

export default function HouseholdsScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const households = useOperatorStore((s) => s.households);
  const changeHouseholdScore = useOperatorStore((s) => s.changeHouseholdScore);
  const addPoints = useOperatorStore((s) => s.addPoints);
  const addPenalty = useOperatorStore((s) => s.addPenalty);

  const [zoneFilter, setZoneFilter] = useState("Todas");
  const [editing, setEditing] = useState<Household | null>(null);
  const [scoreInput, setScoreInput] = useState("");

  const zones = useMemo(() => ["Todas", ...new Set(households.map((h) => h.zone))], [households]);
  const filtered = useMemo(
    () => (zoneFilter === "Todas" ? households : households.filter((h) => h.zone === zoneFilter)),
    [households, zoneFilter]
  );

  const openEdit = (hh: Household) => {
    setEditing(hh);
    setScoreInput(String(hh.score));
  };

  const saveScore = () => {
    if (!editing) return;
    const parsed = parseInt(scoreInput, 10);
    if (!Number.isNaN(parsed)) changeHouseholdScore(editing.id, parsed);
    setEditing(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgCanvas }}>
      <View style={{ paddingTop: spacing["5xl"], paddingHorizontal: spacing["2xl"], paddingBottom: spacing.lg }}>
        <Button label="← Volver" variant="ghost" size="sm" onPress={() => router.back()} />
        <Text variant="h2" style={{ marginTop: spacing.sm }}>
          Hogares
        </Text>
        <Text variant="bodySm" tone="secondary">
          {filtered.length} de {households.length} hogares
        </Text>
      </View>

      <SegmentedTabs options={zones.map((z) => ({ key: z, label: z }))} value={zoneFilter} onChange={setZoneFilter} />

      <FlatList
        data={filtered}
        keyExtractor={(h) => h.id}
        contentContainerStyle={{ padding: spacing["2xl"], gap: spacing.md, paddingBottom: spacing["5xl"] }}
        renderItem={({ item }) => (
          <Card padding={spacing.lg}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View style={{ flex: 1 }}>
                <Text variant="h3">{item.ownerName}</Text>
                <Text variant="bodySm" tone="secondary">
                  {item.id} · {item.address}
                </Text>
              </View>
              <Chip label={item.status} tone={STATUS_TONE[item.status]} />
            </View>

            <View style={{ flexDirection: "row", gap: spacing.lg, marginTop: spacing.md }}>
              <View>
                <Text variant="overline" tone="muted">
                  Puntaje
                </Text>
                <Text variant="h2" style={{ color: colors.brandPrimary }}>
                  {item.score}
                </Text>
              </View>
              <View>
                <Text variant="overline" tone="muted">
                  Puntos
                </Text>
                <Text variant="h2">{item.points}</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.md, flexWrap: "wrap" }}>
              <Button label="📝 Score" variant="outline" size="sm" onPress={() => openEdit(item)} />
              <Button label="+25 pts" variant="outline" size="sm" onPress={() => addPoints(item.id, 25)} />
              <Button
                label="⚠️ Penalizar"
                variant="outline"
                size="sm"
                onPress={() => addPenalty(item.id, "Contaminación", "Infracción registrada por IRSU", "Leve")}
              />
            </View>
          </Card>
        )}
      />

      <Sheet visible={!!editing} onClose={() => setEditing(null)}>
        <Text variant="h3">Nuevo puntaje · {editing?.ownerName}</Text>
        <View style={{ marginTop: spacing.lg, gap: spacing.lg }}>
          <TextField
            label="Puntaje (0–100)"
            keyboardType="number-pad"
            value={scoreInput}
            onChangeText={setScoreInput}
          />
          <Button label="Guardar" onPress={saveScore} />
        </View>
      </Sheet>
    </View>
  );
}
