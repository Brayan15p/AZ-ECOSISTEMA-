import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";
import { Card } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { StatTile } from "@/ui/StatTile";
import { palette } from "@/theme/tokens";
import { useOperatorStore } from "@/state/operatorStore";

const SECTIONS = [
  { key: "households", icon: "🏠", label: "Hogares", hint: "Puntajes, penalizaciones rápidas" },
  { key: "recyclers", icon: "♻️", label: "Recicladores", hint: "Formalizados + inspectores IRSU" },
  { key: "penalties", icon: "⚠️", label: "Penalizaciones", hint: "Activas e historial" },
  { key: "rewards", icon: "🏆", label: "Reconocimientos", hint: "Otorgar puntos y bonos" },
  { key: "operations", icon: "🚛", label: "Operaciones", hint: "Rutas y balance de masas" },
  { key: "publications", icon: "📢", label: "Publicaciones", hint: "Comunicados al barrio" },
  { key: "logs", icon: "📋", label: "Bitácora", hint: "Trazabilidad de acciones" }
] as const;

export default function OperadorHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, spacing, radius } = useTheme();

  const households = useOperatorStore((s) => s.households);
  const dailyData = useOperatorStore((s) => s.dailyData);
  const penalties = useOperatorStore((s) => s.penalties);
  const rewards = useOperatorStore((s) => s.rewards);

  const totalHH = households.length;
  const avgScore = totalHH ? Math.round(households.reduce((s, h) => s + h.score, 0) / totalHH) : 0;
  const avgPurity = dailyData.length ? Math.round(dailyData.reduce((s, d) => s + d.purity, 0) / dailyData.length) : 0;
  const activePenalties = penalties.filter((p) => !p.resolved).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgCanvas }}>
      <LinearGradient
        colors={[palette.navy[700], palette.navy[500]]}
        style={{
          paddingTop: insets.top + spacing.lg,
          paddingHorizontal: spacing["2xl"],
          paddingBottom: spacing["3xl"],
          borderBottomLeftRadius: radius["2xl"],
          borderBottomRightRadius: radius["2xl"]
        }}
      >
        <Text variant="overline" style={{ color: "rgba(255,255,255,0.85)" }}>
          AZ NEURAL GRID OS · OPERADOR
        </Text>
        <Text variant="h1" tone="onBrand" style={{ marginTop: spacing.xs }}>
          Panel operativo
        </Text>
        <Text variant="bodySm" style={{ color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
          IRSU · CCAR · Supervisores
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: spacing["2xl"], gap: spacing.xl, paddingBottom: spacing["5xl"] }}>
        <View style={{ flexDirection: "row", gap: spacing.md, flexWrap: "wrap" }}>
          <StatTile icon="🏠" label="Hogares" value={totalHH} sub={`Puntaje prom. ${avgScore}`} accent={colors.brandPrimary} />
          <StatTile icon="♻️" label="Pureza promedio" value={`${avgPurity}%`} sub="Últimos 7 días" accent={colors.success} />
          <StatTile icon="⚠️" label="Penalizaciones" value={activePenalties} sub="Sin resolver" accent={colors.warning} />
          <StatTile icon="🎁" label="Reconocimientos" value={rewards.length} sub="Otorgados" accent={colors.brandSecondary} />
        </View>

        <View style={{ gap: spacing.md }}>
          {SECTIONS.map((s) => (
            <Card key={s.key} padding={spacing.lg} style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
              <Text variant="h2">{s.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text variant="h3">{s.label}</Text>
                <Text variant="bodySm" tone="secondary">
                  {s.hint}
                </Text>
              </View>
              <Button label="Abrir" size="sm" variant="outline" onPress={() => router.push(`/(operador)/${s.key}`)} />
            </Card>
          ))}
        </View>

        <Button label="Volver al selector de modo" variant="ghost" onPress={() => router.replace("/")} />
      </ScrollView>
    </View>
  );
}
