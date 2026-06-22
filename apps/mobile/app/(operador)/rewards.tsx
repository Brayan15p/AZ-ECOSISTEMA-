import { useState } from "react";
import { FlatList, View } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";
import { Card } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { TextField } from "@/ui/TextField";
import { Sheet } from "@/ui/Sheet";
import { useOperatorStore } from "@/state/operatorStore";

export default function RewardsScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const rewards = useOperatorStore((s) => s.rewards);
  const households = useOperatorStore((s) => s.households);
  const addReward = useOperatorStore((s) => s.addReward);

  const [open, setOpen] = useState(false);
  const [householdId, setHouseholdId] = useState("");
  const [description, setDescription] = useState("Reconocimiento por excelencia en clasificación");
  const [points, setPoints] = useState("50");

  const submit = () => {
    if (!householdId) return;
    const pts = parseInt(points, 10) || 0;
    addReward(householdId.trim().toUpperCase(), "Bono comunidad", description, pts);
    setOpen(false);
    setHouseholdId("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgCanvas }}>
      <View style={{ paddingTop: spacing["5xl"], paddingHorizontal: spacing["2xl"], paddingBottom: spacing.lg }}>
        <Button label="← Volver" variant="ghost" size="sm" onPress={() => router.back()} />
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.sm }}>
          <Text variant="h2">Reconocimientos</Text>
          <Button label="+ Nuevo" size="sm" onPress={() => setOpen(true)} />
        </View>
      </View>

      <FlatList
        data={rewards}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ padding: spacing["2xl"], gap: spacing.md, paddingBottom: spacing["5xl"] }}
        ListEmptyComponent={<Text tone="muted">Sin reconocimientos aún.</Text>}
        renderItem={({ item }) => {
          const hh = households.find((h) => h.id === item.householdId);
          return (
            <Card padding={spacing.lg} style={{ borderLeftWidth: 4, borderLeftColor: colors.warning }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text variant="h3">{hh?.ownerName ?? item.householdId}</Text>
                <Text variant="h3" style={{ color: colors.warning }}>
                  +{item.points} pts
                </Text>
              </View>
              <Text variant="bodySm" tone="secondary" style={{ marginTop: spacing.xs }}>
                {item.date} · {item.type}
              </Text>
              <Text variant="bodySm" style={{ marginTop: spacing.xs }}>
                {item.description}
              </Text>
            </Card>
          );
        }}
      />

      <Sheet visible={open} onClose={() => setOpen(false)}>
        <Text variant="h3">Nuevo reconocimiento</Text>
        <View style={{ marginTop: spacing.lg, gap: spacing.lg }}>
          <TextField label="ID del hogar (ej: H001)" value={householdId} onChangeText={setHouseholdId} autoCapitalize="characters" />
          <TextField label="Descripción" value={description} onChangeText={setDescription} />
          <TextField label="Puntos" keyboardType="number-pad" value={points} onChangeText={setPoints} />
          <Button label="Otorgar" onPress={submit} />
        </View>
      </Sheet>
    </View>
  );
}
