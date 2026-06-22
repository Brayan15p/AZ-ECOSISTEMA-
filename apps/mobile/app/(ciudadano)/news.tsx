import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";
import { Card } from "@/ui/Card";
import { Chip } from "@/ui/Chip";

// TODO: cargar desde Supabase `publications` con RLS (lectura para todos los autenticados).
const NEWS = [
  {
    id: "n1",
    category: "campaña" as const,
    title: "Semana del reciclaje · 20–26 junio",
    body: "Doble puntaje en clasificación de plásticos. ¡Aprovecha y sube de nivel!",
    when: "Hace 2 horas",
    reactions: { "👍": 84, "🎉": 22, "♻️": 145 }
  },
  {
    id: "n2",
    category: "educativo" as const,
    title: "¿Sabías qué? El vidrio se recicla infinitas veces",
    body: "Sin perder calidad. Sepáralo en bolsa transparente y evita contaminarlo con residuos orgánicos.",
    when: "Ayer",
    reactions: { "👍": 56, "💡": 31 }
  },
  {
    id: "n3",
    category: "anuncio" as const,
    title: "Cambio temporal de horario en B. Meridiano",
    body: "La ruta de orgánicos del miércoles pasa a martes 6:30 AM por mantenimiento vial.",
    when: "Hace 3 días",
    reactions: { "👍": 19 }
  }
];

const CATEGORY_TONE = {
  anuncio: "info" as const,
  campaña: "success" as const,
  educativo: "warning" as const,
  alerta: "danger" as const
};

export default function News() {
  const insets = useSafeAreaInsets();
  const { colors, spacing } = useTheme();
  return (
    <ScrollView
      contentContainerStyle={{
        padding: spacing["2xl"],
        paddingTop: insets.top + spacing["2xl"],
        gap: spacing.lg,
        backgroundColor: colors.bgCanvas
      }}
    >
      <Text variant="h1">Noticias del barrio</Text>
      {NEWS.map((n) => (
        <Card key={n.id} padding={spacing.xl}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Chip label={n.category} tone={CATEGORY_TONE[n.category]} />
            <Text variant="caption" tone="muted">{n.when}</Text>
          </View>
          <Text variant="h3" style={{ marginTop: spacing.md }}>{n.title}</Text>
          <Text variant="body" tone="secondary" style={{ marginTop: spacing.sm }}>{n.body}</Text>
          <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.lg }}>
            {Object.entries(n.reactions).map(([emoji, count]) => (
              <View key={emoji} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Text>{emoji}</Text>
                <Text variant="caption" tone="muted">{count}</Text>
              </View>
            ))}
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}
