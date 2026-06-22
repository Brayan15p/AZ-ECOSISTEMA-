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

/**
 * Dashboard del operador (versión inicial).
 * Las pantallas de hogares/recicladores/penalizaciones/recompensas
 * se migrarán en la siguiente iteración.
 */
export default function OperadorHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, spacing, radius } = useTheme();

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
          <StatTile icon="🏠" label="Hogares" value={5} sub="Activos en demo" accent={colors.brandPrimary} />
          <StatTile icon="♻️" label="Pureza promedio" value="89%" sub="Últimos 7 días" accent={colors.success} />
          <StatTile icon="⚠️" label="Penalizaciones" value={2} sub="Sin resolver" accent={colors.warning} />
          <StatTile icon="🎁" label="Recompensas" value={2} sub="Otorgadas este mes" accent={colors.brandSecondary} />
        </View>

        <Card padding={spacing.xl}>
          <Text variant="h3">Hogares · gestión</Text>
          <Text variant="bodySm" tone="secondary" style={{ marginTop: spacing.xs }}>
            La tabla completa de hogares, recicladores, penalizaciones y recompensas
            está siendo migrada desde la app web a esta app nativa con el mismo
            sistema de diseño. Próxima entrega.
          </Text>
        </Card>

        <Button
          label="Volver al selector de modo"
          variant="outline"
          onPress={() => router.replace("/")}
        />
      </ScrollView>
    </View>
  );
}
