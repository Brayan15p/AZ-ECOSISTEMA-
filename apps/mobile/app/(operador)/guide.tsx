import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";
import { Card } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Chip } from "@/ui/Chip";

const STEPS = [
  {
    line: "Línea 1",
    title: "Biodigestor",
    icon: "🟢",
    color: "success" as const,
    question: "¿Es biodegradable?",
    examples: "Restos de comida, poda de jardín, cáscaras, papel/cartón muy sucio.",
    destino: "Biodigestor → compost / biogás"
  },
  {
    line: "Línea 2",
    title: "Pirólisis",
    icon: "🟠",
    color: "warning" as const,
    question: "¿Es plástico identificable?",
    examples: "PET, PEAD, PP, PVC, PS marcados con su número de resina.",
    destino: "Pirólisis → combustible alterno"
  },
  {
    line: "Línea 4",
    title: "Reciclaje",
    icon: "🔵",
    color: "info" as const,
    question: "¿Es reciclable limpio?",
    examples: "Vidrio, metales, cartón limpio y seco, papel limpio.",
    destino: "Reciclaje → comercialización directa"
  },
  {
    line: "Línea 3",
    title: "Gasificación / Syngas",
    icon: "⚫",
    color: "neutral" as const,
    question: "¿Es combustible seco no identificable?",
    examples: "Textiles, maderas tratadas, plásticos mixtos no marcados.",
    destino: "Gasificación → syngas energético"
  }
];

const PROHIBITED = [
  "Baterías y pilas",
  "RAEE (residuos eléctricos/electrónicos)",
  "Residuos peligrosos (químicos, médicos)",
  "Bombillos fluorescentes",
  "Envases de pesticidas/agroquímicos",
  "Material radiactivo"
];

export default function GuideScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgCanvas }}>
      <ScrollView contentContainerStyle={{ padding: spacing["2xl"], gap: spacing.lg, paddingBottom: spacing["5xl"] }}>
        <Button label="← Volver" variant="ghost" size="sm" onPress={() => router.back()} />
        <Text variant="h2">Guía de clasificación</Text>
        <Text variant="bodySm" tone="secondary">
          Árbol de decisión de 4 pasos. Si un residuo no cumple ninguna condición, va a Disposición Final.
        </Text>

        <View style={{ gap: spacing.md }}>
          {STEPS.map((s, i) => (
            <Card key={s.line} padding={spacing.lg}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <Text variant="h2">{s.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text variant="label" tone="secondary">
                    Paso {i + 1} · {s.line}
                  </Text>
                  <Text variant="h3">{s.title}</Text>
                </View>
                <Chip label={s.line} tone={s.color} />
              </View>
              <Text variant="body" style={{ marginTop: spacing.sm }}>
                {s.question}
              </Text>
              <Text variant="bodySm" tone="secondary" style={{ marginTop: spacing.xs }}>
                Ejemplos: {s.examples}
              </Text>
              <Text variant="label" style={{ marginTop: spacing.sm, color: colors.brandPrimary }}>
                → {s.destino}
              </Text>
            </Card>
          ))}

          <Card padding={spacing.lg} style={{ borderWidth: 1, borderColor: colors.danger }}>
            <Text variant="h3" style={{ color: colors.danger }}>
              ⛔ Si no cumple ninguna condición
            </Text>
            <Text variant="bodySm" tone="secondary" style={{ marginTop: spacing.xs }}>
              Disposición Final.
            </Text>
          </Card>
        </View>

        <Card padding={spacing.lg} style={{ borderWidth: 1, borderColor: colors.danger, backgroundColor: colors.dangerBg }}>
          <Text variant="h3" style={{ color: colors.danger }}>
            ⚠️ Nunca deben entrar al sistema AZ
          </Text>
          <View style={{ marginTop: spacing.sm, gap: spacing.xs }}>
            {PROHIBITED.map((p) => (
              <Text key={p} variant="bodySm" style={{ color: colors.danger }}>
                • {p}
              </Text>
            ))}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
