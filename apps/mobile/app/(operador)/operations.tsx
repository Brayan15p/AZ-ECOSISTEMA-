import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";
import { Card } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { useOperatorStore } from "@/state/operatorStore";

export default function OperationsScreen() {
  const router = useRouter();
  const { colors, spacing, radius } = useTheme();
  const dailyData = useOperatorStore((s) => s.dailyData);
  const lastDay = dailyData[dailyData.length - 1] ?? null;
  const totalTons = lastDay?.total ?? 0;

  const routes = [
    { route: "Ruta Verde", icon: "🟢", type: "Orgánicos → Biodigestores", tons: lastDay?.organic ?? 0, color: colors.success },
    { route: "Ruta Blanca", icon: "⚪", type: "Reciclables → Comercialización", tons: lastDay?.recyclable ?? 0, color: colors.info },
    { route: "Ruta Negra Energética", icon: "⚫", type: "Fracción AZ → Pirólisis", tons: lastDay?.energy ?? 0, color: colors.warning },
    { route: "Ruta Rechazo", icon: "🔴", type: "Rechazo → Gasificación", tons: lastDay?.reject ?? 0, color: colors.danger }
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgCanvas }}>
      <ScrollView contentContainerStyle={{ padding: spacing["2xl"], gap: spacing.lg, paddingBottom: spacing["5xl"] }}>
        <Button label="← Volver" variant="ghost" size="sm" onPress={() => router.back()} />
        <Text variant="h2">Control de operaciones</Text>

        <View style={{ gap: spacing.md }}>
          {routes.map((r) => (
            <Card key={r.route} padding={spacing.lg} style={{ borderTopWidth: 4, borderTopColor: r.color }}>
              <Text variant="body">{r.icon} {r.route}</Text>
              <Text variant="bodySm" tone="secondary">
                {r.type}
              </Text>
              <Text variant="h2" style={{ color: r.color, marginTop: spacing.sm }}>
                {r.tons} ton
              </Text>
              <View style={{ height: 6, borderRadius: radius.pill, backgroundColor: colors.bgSurfaceAlt, marginTop: spacing.xs }}>
                <View
                  style={{
                    height: 6,
                    borderRadius: radius.pill,
                    backgroundColor: r.color,
                    width: `${totalTons ? Math.min(100, (r.tons / totalTons) * 100) : 0}%`
                  }}
                />
              </View>
            </Card>
          ))}
        </View>

        <Text variant="h3" style={{ marginTop: spacing.lg }}>
          Historial de procesamiento
        </Text>
        {dailyData.map((d) => (
          <Card key={d.date} padding={spacing.md}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text variant="label">{d.date}</Text>
              <Text variant="label" style={{ color: d.purity >= 90 ? colors.success : colors.info }}>
                Pureza {d.purity}%
              </Text>
            </View>
            <Text variant="bodySm" tone="secondary" style={{ marginTop: spacing.xs }}>
              Org {d.organic} · Recic {d.recyclable} · Energ {d.energy} · Rechazo {d.reject} · Total {d.total} ton
            </Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
