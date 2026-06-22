import { useRouter } from "expo-router";
import { View, ScrollView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";
import { useSession } from "@/state/sessionStore";
import { palette } from "@/theme/tokens";

/**
 * Pantalla de selección de modo (operador / ciudadano).
 *
 * Diseño:
 * - Fondo con gradiente brand para anclar identidad visual desde el primer instante.
 * - Card glass-morphism para jerarquía sobre el gradiente.
 * - Dos opciones grandes (≥88pt cada una) con metadata clara para evitar fricción.
 * - Microcopy en la base que explica el ecosistema compartido (transparencia).
 */
export default function ModeSelector() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, spacing, radius, shadow, typography } = useTheme();
  const setRole = useSession((s) => s.setRole);

  const onChoose = (role: "operador" | "ciudadano") => {
    setRole(role);
    if (role === "operador") {
      router.push("/(operador)");
    } else {
      router.push("/(ciudadano)");
    }
  };

  return (
    <LinearGradient
      colors={[palette.navy[600], palette.green[600]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: spacing["2xl"],
          paddingTop: insets.top + spacing["2xl"],
          paddingBottom: insets.bottom + spacing["2xl"]
        }}
      >
        <View
          style={[
            {
              backgroundColor: "rgba(255,255,255,0.96)",
              borderRadius: radius["2xl"],
              padding: spacing["3xl"],
              maxWidth: 440,
              width: "100%",
              alignSelf: "center"
            },
            shadow.xl
          ]}
        >
          <Text variant="overline" tone="muted" align="center">
            AZ CORPORATION · ARAUCA
          </Text>
          <Text
            variant="h1"
            align="center"
            style={{ marginTop: spacing.sm, color: palette.navy[600] }}
          >
            AZ <Text variant="h1" style={{ color: palette.green[600] }}>Ecosistema</Text>
          </Text>
          <Text variant="bodySm" tone="muted" align="center" style={{ marginTop: spacing.sm }}>
            Selecciona el modo de acceso
          </Text>

          <View style={{ marginTop: spacing["3xl"], gap: spacing.lg }}>
            <ModeCard
              accent={palette.navy[600]}
              icon="🖥️"
              title="AZ Neural Grid OS"
              subtitle="Operador · IRSU, CCAR, supervisores"
              onPress={() => onChoose("operador")}
              accessibilityHint="Abre el panel de operaciones para personal autorizado"
            />
            <ModeCard
              accent={palette.green[600]}
              icon="📱"
              title="AZ Mi Barrio"
              subtitle="Ciudadano · Hogares de Arauca"
              onPress={() => onChoose("ciudadano")}
              accessibilityHint="Abre la app ciudadana para revisar tu puntaje y recompensas"
            />
          </View>

          <Text
            variant="caption"
            tone="muted"
            align="center"
            style={{ marginTop: spacing["2xl"], paddingHorizontal: spacing.md, color: colors.textMuted }}
          >
            Las publicaciones del operador se reflejan en el modo ciudadano. Ecosistema compartido.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function ModeCard({
  accent,
  icon,
  title,
  subtitle,
  onPress,
  accessibilityHint
}: {
  accent: string;
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  accessibilityHint?: string;
}) {
  const { spacing, radius } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => ({
        padding: spacing.xl,
        borderRadius: radius.xl,
        backgroundColor: accent,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.lg,
        opacity: pressed ? 0.88 : 1,
        transform: [{ scale: pressed ? 0.985 : 1 }],
        minHeight: 88
      })}
    >
      <Text variant="display" style={{ fontSize: 32 }}>
        {icon}
      </Text>
      <View style={{ flex: 1 }}>
        <Text variant="h3" tone="onBrand">
          {title}
        </Text>
        <Text variant="caption" style={{ color: "rgba(255,255,255,0.85)" }}>
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}
