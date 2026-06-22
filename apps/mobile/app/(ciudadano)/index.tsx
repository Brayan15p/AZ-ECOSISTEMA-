import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";
import { Card } from "@/ui/Card";
import { Chip } from "@/ui/Chip";
import { ScoreRing } from "@/ui/ScoreRing";
import { LevelBadge } from "@/ui/LevelBadge";
import { ProgressBar } from "@/ui/ProgressBar";
import { StatTile } from "@/ui/StatTile";
import { levelForPoints, progressToNext, BADGES } from "@shared/gamification";
import { statusFromScore } from "@shared/scoring";
import { palette } from "@/theme/tokens";

// Datos demo — vendrán de Supabase en producción.
const DEMO = {
  ownerName: "María García",
  address: "Cra 19 #14-22, B. Centro",
  zone: "Centro",
  score: 92,
  points: 450,
  streakDays: 7,
  nextPickup: { recycle: "Mañana 6:00 AM", organic: "Hoy 5:30 PM" },
  unlockedBadgeIds: ["first-audit", "streak-7", "level-gold"]
};

export default function CiudadanoHome() {
  const insets = useSafeAreaInsets();
  const { colors, spacing, radius } = useTheme();

  const level = levelForPoints(DEMO.points);
  const progress = progressToNext(DEMO.points);
  const status = statusFromScore(DEMO.score);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgCanvas }}>
      {/* Header con gradiente — anclaje visual del modo ciudadano */}
      <LinearGradient
        colors={[palette.green[700], palette.green[500]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: insets.top + spacing.lg,
          paddingHorizontal: spacing["2xl"],
          paddingBottom: spacing["3xl"],
          borderBottomLeftRadius: radius["2xl"],
          borderBottomRightRadius: radius["2xl"]
        }}
      >
        <Text variant="overline" style={{ color: "rgba(255,255,255,0.85)" }}>
          AZ MI BARRIO · {DEMO.zone.toUpperCase()}
        </Text>
        <Text variant="h1" tone="onBrand" style={{ marginTop: spacing.xs }}>
          ¡Hola, {DEMO.ownerName.split(" ")[0]}!
        </Text>
        <Text variant="bodySm" style={{ color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
          {DEMO.address}
        </Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ padding: spacing["2xl"], gap: spacing.xl, paddingBottom: spacing["5xl"] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Score + nivel */}
        <Card elevation="md" padding={spacing["2xl"]}>
          <View style={{ alignItems: "center" }}>
            <ScoreRing score={DEMO.score} label="Puntaje del hogar" size={180} />
            <Chip
              label={status}
              tone={
                DEMO.score >= 90
                  ? "success"
                  : DEMO.score >= 75
                    ? "info"
                    : DEMO.score >= 60
                      ? "warning"
                      : "danger"
              }
            />
          </View>

          <View style={{ marginTop: spacing["2xl"], alignItems: "center", gap: spacing.md }}>
            <LevelBadge level={level.level} />
            {progress.next ? (
              <>
                <View style={{ width: "100%" }}>
                  <ProgressBar value={progress.ratio * 100} />
                </View>
                <Text variant="caption" tone="muted" align="center">
                  Te faltan{" "}
                  <Text variant="caption" tone="primary" style={{ fontWeight: "700" }}>
                    {progress.pointsToNext} puntos
                  </Text>{" "}
                  para alcanzar el nivel {progress.next.label}
                </Text>
              </>
            ) : (
              <Text variant="caption" tone="muted">
                ¡Nivel máximo desbloqueado!
              </Text>
            )}
          </View>
        </Card>

        {/* Quick stats — racha, puntos, próxima recolección */}
        <View style={{ flexDirection: "row", gap: spacing.md, flexWrap: "wrap" }}>
          <StatTile
            icon="🔥"
            label="Racha"
            value={`${DEMO.streakDays} días`}
            sub="Auditorías ≥ 75 seguidas"
            accent={colors.warning}
          />
          <StatTile
            icon="⭐"
            label="Puntos"
            value={DEMO.points}
            sub="Acumulados este año"
            accent={colors.brandSecondary}
          />
        </View>

        {/* Próximas recolecciones */}
        <Card padding={spacing.xl}>
          <Text variant="h3">Próximas recolecciones</Text>
          <View style={{ marginTop: spacing.md, gap: spacing.md }}>
            <PickupRow color={colors.success} label="♻️ Reciclables" time={DEMO.nextPickup.recycle} />
            <PickupRow color={colors.warning} label="🌱 Orgánicos" time={DEMO.nextPickup.organic} />
          </View>
        </Card>

        {/* Badges */}
        <View>
          <Text variant="h3" style={{ marginBottom: spacing.md }}>
            Logros
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md }}>
            {BADGES.map((b) => {
              const unlocked = DEMO.unlockedBadgeIds.includes(b.id);
              return (
                <Card
                  key={b.id}
                  padding={spacing.lg}
                  elevation={unlocked ? "md" : "sm"}
                  style={{
                    width: 140,
                    opacity: unlocked ? 1 : 0.5,
                    alignItems: "center",
                    borderWidth: unlocked ? 0 : 1,
                    borderColor: colors.borderSubtle
                  }}
                >
                  <Text variant="display" style={{ fontSize: 32 }}>
                    {b.icon}
                  </Text>
                  <Text variant="label" align="center" style={{ marginTop: spacing.xs }}>
                    {b.title}
                  </Text>
                  <Text variant="caption" tone="muted" align="center">
                    {unlocked ? b.description : b.unlockHint}
                  </Text>
                </Card>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function PickupRow({ color, label, time }: { color: string; label: string; time: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <Text variant="body">{label}</Text>
      <Text variant="label" style={{ color }}>
        {time}
      </Text>
    </View>
  );
}
