import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";
import { Card } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { TextField } from "@/ui/TextField";
import { useOperatorStore } from "@/state/operatorStore";

const CENTERS = [
  { id: "CCAR-1", name: "CCAR Centro", fill: 62 },
  { id: "CCAR-2", name: "CCAR El Bosque", fill: 81 },
  { id: "CCAR-3", name: "CCAR San Luis", fill: 38 }
];

const RECLASSIFICATION = [
  { label: "Fracción Energética AZ", value: 78 },
  { label: "Textiles + Maderas", value: 14 },
  { label: "Rechazo Real", value: 8 }
];

function fillColor(fill: number, colors: ReturnType<typeof useTheme>["colors"]) {
  if (fill >= 80) return colors.danger;
  if (fill >= 60) return colors.warning;
  return colors.success;
}

export default function CcarScreen() {
  const router = useRouter();
  const { colors, spacing, radius } = useTheme();
  const addDailyEntry = useOperatorStore((s) => s.addDailyEntry);

  const [organic, setOrganic] = useState("");
  const [recyclable, setRecyclable] = useState("");
  const [energy, setEnergy] = useState("");
  const [reject, setReject] = useState("");
  const [purity, setPurity] = useState("");

  const canSubmit = [organic, recyclable, energy, reject, purity].every((v) => v.trim() !== "" && !Number.isNaN(Number(v)));

  const handleSubmit = () => {
    if (!canSubmit) return;
    addDailyEntry({
      date: new Date().toISOString().split("T")[0]!,
      organic: Number(organic),
      recyclable: Number(recyclable),
      energy: Number(energy),
      reject: Number(reject),
      purity: Number(purity)
    });
    setOrganic("");
    setRecyclable("");
    setEnergy("");
    setReject("");
    setPurity("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgCanvas }}>
      <ScrollView contentContainerStyle={{ padding: spacing["2xl"], gap: spacing.lg, paddingBottom: spacing["5xl"] }}>
        <Button label="← Volver" variant="ghost" size="sm" onPress={() => router.back()} />
        <Text variant="h2">Centros Comunitarios de Acopio</Text>

        <Card padding={spacing.lg}>
          <Text variant="h3">Registro diario</Text>
          <View style={{ gap: spacing.md, marginTop: spacing.md }}>
            <TextField label="Orgánicos (ton)" keyboardType="numeric" value={organic} onChangeText={setOrganic} placeholder="0.0" />
            <TextField label="Reciclables (ton)" keyboardType="numeric" value={recyclable} onChangeText={setRecyclable} placeholder="0.0" />
            <TextField label="Energéticos (ton)" keyboardType="numeric" value={energy} onChangeText={setEnergy} placeholder="0.0" />
            <TextField label="Rechazo (ton)" keyboardType="numeric" value={reject} onChangeText={setReject} placeholder="0.0" />
            <TextField label="Pureza (%)" keyboardType="numeric" value={purity} onChangeText={setPurity} placeholder="0-100" />
          </View>
          <View style={{ marginTop: spacing.lg }}>
            <Button label="Guardar registro" onPress={handleSubmit} disabled={!canSubmit} />
          </View>
        </Card>

        <Text variant="h3">Estado de centros</Text>
        <View style={{ gap: spacing.md }}>
          {CENTERS.map((c) => (
            <Card key={c.id} padding={spacing.lg}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text variant="body">{c.name}</Text>
                <Text variant="label" style={{ color: fillColor(c.fill, colors) }}>
                  {c.fill}% lleno
                </Text>
              </View>
              <View style={{ height: 8, borderRadius: radius.pill, backgroundColor: colors.bgSurfaceAlt, marginTop: spacing.sm }}>
                <View
                  style={{
                    height: 8,
                    borderRadius: radius.pill,
                    backgroundColor: fillColor(c.fill, colors),
                    width: `${c.fill}%`
                  }}
                />
              </View>
            </Card>
          ))}
        </View>

        <Text variant="h3">Reclasificación</Text>
        <Card padding={spacing.lg}>
          <View style={{ gap: spacing.md }}>
            {RECLASSIFICATION.map((r) => (
              <View key={r.label}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text variant="bodySm" tone="secondary">
                    {r.label}
                  </Text>
                  <Text variant="label">{r.value}%</Text>
                </View>
                <View style={{ height: 6, borderRadius: radius.pill, backgroundColor: colors.bgSurfaceAlt, marginTop: spacing.xs }}>
                  <View
                    style={{ height: 6, borderRadius: radius.pill, backgroundColor: colors.brandPrimary, width: `${r.value}%` }}
                  />
                </View>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
