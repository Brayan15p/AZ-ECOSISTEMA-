import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";
import { Card } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Chip } from "@/ui/Chip";
import { ListRow } from "@/ui/ListRow";
import { useOperatorStore } from "@/state/operatorStore";

export default function RecyclersScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const recyclers = useOperatorStore((s) => s.recyclers);
  const irsus = useOperatorStore((s) => s.irsus);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgCanvas }}>
      <ScrollView contentContainerStyle={{ padding: spacing["2xl"], gap: spacing.lg, paddingBottom: spacing["5xl"] }}>
        <Button label="← Volver" variant="ghost" size="sm" onPress={() => router.back()} />
        <Text variant="h2">Recicladores formalizados</Text>

        {recyclers.map((r) => (
          <Card key={r.id} padding={spacing.lg}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View>
                <Text variant="h3">{r.name}</Text>
                <Text variant="bodySm" tone="secondary">
                  {r.id} · {r.phone}
                </Text>
              </View>
              <Chip label={r.formalized ? "Formalizado" : "Informal"} tone={r.formalized ? "success" : "warning"} />
            </View>
            <View style={{ flexDirection: "row", gap: spacing.xl, marginTop: spacing.md }}>
              <View>
                <Text variant="overline" tone="muted">
                  Zona
                </Text>
                <Text variant="label">{r.zone}</Text>
              </View>
              <View>
                <Text variant="overline" tone="muted">
                  Viviendas
                </Text>
                <Text variant="label">{r.households}</Text>
              </View>
              <View>
                <Text variant="overline" tone="muted">
                  Carga/día
                </Text>
                <Text variant="label" style={{ color: colors.success }}>
                  {r.kgDay} kg
                </Text>
              </View>
            </View>
          </Card>
        ))}

        <Text variant="h3" style={{ marginTop: spacing.lg }}>
          Inspectores IRSU
        </Text>
        {irsus.map((ir) => (
          <ListRow
            key={ir.id}
            title={`${ir.name} · ${ir.id}`}
            subtitle={`${ir.zone} · ${ir.households} hogares`}
            right={
              <Text variant="h3" style={{ color: colors.brandPrimary }}>
                {ir.avgScore}
              </Text>
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}
