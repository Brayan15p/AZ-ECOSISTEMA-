import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";
import { Card } from "@/ui/Card";
import { Chip } from "@/ui/Chip";
import { LEVELS, levelForPoints } from "@shared/gamification";

const DEMO_POINTS = 450;
const REWARDS = [
  { id: "r1", title: "10% descuento en tarifa de aseo", cost: 100, quotaRemaining: 47, expiresIn: "12 días" },
  { id: "r2", title: "Bono de COP $20.000 en comercio local", cost: 150, quotaRemaining: 12, expiresIn: "5 días" },
  { id: "r3", title: "Kit de bolsas reutilizables", cost: 80, quotaRemaining: 200, expiresIn: "30 días" },
  { id: "r4", title: "Entrada al sorteo de electrodoméstico", cost: 250, quotaRemaining: 3, expiresIn: "2 días" }
];

export default function Rewards() {
  const insets = useSafeAreaInsets();
  const { colors, spacing } = useTheme();
  const level = levelForPoints(DEMO_POINTS);

  return (
    <ScrollView
      contentContainerStyle={{
        padding: spacing["2xl"],
        paddingTop: insets.top + spacing["2xl"],
        gap: spacing.xl,
        backgroundColor: colors.bgCanvas
      }}
    >
      <View>
        <Text variant="h1">Recompensas</Text>
        <Text variant="bodySm" tone="muted" style={{ marginTop: 2 }}>
          Tienes <Text variant="bodySm" tone="primary" style={{ fontWeight: "700" }}>{DEMO_POINTS} pts</Text> · Nivel {level.label}
        </Text>
      </View>

      {REWARDS.map((r) => {
        const canAfford = DEMO_POINTS >= r.cost;
        const lowStock = r.quotaRemaining <= 5;
        return (
          <Card key={r.id} padding={spacing.xl}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: spacing.md }}>
              <View style={{ flex: 1 }}>
                <Text variant="h3">{r.title}</Text>
                <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm }}>
                  <Chip label={`${r.cost} pts`} tone="info" />
                  {lowStock ? <Chip label={`¡Solo ${r.quotaRemaining} cupos!`} tone="danger" /> : null}
                  <Chip label={`Termina en ${r.expiresIn}`} tone="warning" />
                </View>
              </View>
              <View style={{ justifyContent: "center" }}>
                <Text variant="overline" tone={canAfford ? "success" : "muted"}>
                  {canAfford ? "Disponible" : "Faltan pts"}
                </Text>
              </View>
            </View>
          </Card>
        );
      })}

      <Card padding={spacing.xl} variant="alt">
        <Text variant="overline" tone="muted">Próximo nivel</Text>
        <Text variant="h3" style={{ marginTop: spacing.xs }}>
          {LEVELS[LEVELS.findIndex((l) => l.level === level.level) + 1]?.label ?? "Nivel máximo"}
        </Text>
        <Text variant="bodySm" tone="secondary" style={{ marginTop: spacing.sm }}>
          {LEVELS[LEVELS.findIndex((l) => l.level === level.level) + 1]?.perks.join(" · ") ?? "Ya tienes todos los beneficios."}
        </Text>
      </Card>
    </ScrollView>
  );
}
