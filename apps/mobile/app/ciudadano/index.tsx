import { Ionicons } from "@expo/vector-icons";
import {
  challengeProgress,
  ecoImpact,
  formatNumber,
  formatPoints,
  levelFromXp,
  periodBonusPoints,
  pointsBalance,
  scoreColor,
  scoreLabel,
  streakDays,
} from "@az/core";
import { amber, coral, eco, gradients, sky, teal } from "@az/ui-tokens";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { Appear } from "../../components/ui/Appear";
import { Card } from "../../components/ui/Card";
import { CountUp } from "../../components/ui/CountUp";
import { EmptyState } from "../../components/ui/EmptyState";
import { IconBadge } from "../../components/ui/IconBadge";
import { LinearFade } from "../../components/ui/LinearFade";
import { Pill } from "../../components/ui/Pill";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { QuickAction } from "../../components/ui/QuickAction";
import { Screen } from "../../components/ui/Screen";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { ScreenSkeleton } from "../../components/ui/Skeleton";
import { StatTile } from "../../components/ui/StatTile";
import { withAlpha } from "../../lib/color";
import {
  useHousehold,
  usePenalties,
  usePointsLedger,
  useRewards,
} from "../../lib/data";
import {
  demoKgYear,
  demoStreakDates,
  demoXp,
  mockChallenges,
} from "../../lib/gamedata";

const CURRENT_MONTH = new Date().toISOString().slice(0, 7);

type Activity = {
  id: string;
  date: string;
  title: string;
  meta: string;
  points: number;
};

export default function MiBarrio() {
  const router = useRouter();
  const { data: household, loading, error, reload } = useHousehold();
  const { data: ledger } = usePointsLedger();
  const { data: rewards } = useRewards();
  const { data: penalties } = usePenalties();

  if (loading) return <ScreenSkeleton />;
  if (!household) {
    return (
      <Screen error={error} onRetry={reload} onRefresh={reload}>
        <EmptyState
          icon="home-outline"
          title="No encontramos tu hogar"
          subtitle="Tu hogar aún no está vinculado. Contacta a tu operador del municipio."
        />
      </Screen>
    );
  }

  const balance = pointsBalance(ledger);
  const score = household.score;
  const bonus = periodBonusPoints(score);
  const lvl = levelFromXp(demoXp);
  const streak = streakDays(demoStreakDates);
  const impact = ecoImpact(demoKgYear);
  const firstName = household.owner.split(" ").slice(-1)[0] ?? household.owner;
  const earnedThisMonth = rewards
    .filter((r) => r.date.startsWith(CURRENT_MONTH))
    .reduce((s, r) => s + r.points, 0);

  const activity: Activity[] = [
    ...rewards.map((r) => ({ id: r.id, date: r.date, title: r.description, meta: r.date, points: r.points })),
    ...penalties.map((p) => ({
      id: p.id,
      date: p.date,
      title: p.description,
      meta: `${p.date} · ${p.resolved ? "Resuelto" : "Pendiente"}`,
      points: -1,
    })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  const topChallenges = mockChallenges.slice(0, 2);

  return (
    <Screen onRefresh={reload} refreshing={loading} error={error} onRetry={reload}>
      {/* ── HERO: saludo + nivel + XP + puntos ── */}
      <Appear>
        <LinearFade colors={gradients.meadow} style={{ borderRadius: 28 }}>
          <View className="gap-4 p-5">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-footnote text-white/80">{household.zone}</Text>
                <Text className="text-title1 text-white">Hola, {firstName} 👋</Text>
              </View>
              <View
                className="flex-row items-center gap-1 rounded-full px-3 py-1.5"
                style={{ backgroundColor: withAlpha("#000000", 0.18) }}
                accessibilityLabel={`Racha de ${streak} días`}
              >
                <Ionicons name="flame" size={15} color={amber[300]} />
                <Text className="text-footnote text-white" style={{ fontWeight: "700" }}>
                  {streak}
                </Text>
              </View>
            </View>

            {/* Nivel */}
            <View className="flex-row items-center gap-3">
              <View
                className="h-11 w-11 items-center justify-center rounded-2xl"
                style={{ backgroundColor: withAlpha("#FFFFFF", 0.2) }}
              >
                <Ionicons name={lvl.level.icon as never} size={22} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-headline text-white">
                  Nivel {lvl.level.index + 1} · {lvl.level.title}
                </Text>
                <Text className="text-caption1 text-white/80">{lvl.level.tagline}</Text>
              </View>
            </View>

            <View className="gap-1.5">
              <ProgressBar value={lvl.progress} color="#FFFFFF" trackColor={withAlpha("#FFFFFF", 0.25)} />
              <Text className="text-caption1 text-white/85">
                {lvl.maxed
                  ? "¡Nivel máximo alcanzado! 🌳"
                  : `${formatNumber(lvl.toNext)} pts para ${lvl.next?.title}`}
              </Text>
            </View>

            {/* Saldo */}
            <View className="flex-row items-end justify-between border-t border-white/15 pt-3">
              <View>
                <Text className="text-caption1 uppercase text-white/70">Tus puntos</Text>
                <View className="flex-row items-baseline gap-1">
                  <CountUp
                    value={balance}
                    format={(n) => formatNumber(Math.round(n))}
                    className="text-largeTitle text-white"
                    accessibilityLabel={`${balance} puntos disponibles`}
                  />
                  <Text className="text-headline text-white/80">pts</Text>
                </View>
              </View>
              {earnedThisMonth > 0 ? (
                <View className="items-end">
                  <Text className="text-title3 text-white" style={{ fontWeight: "700" }}>
                    +{earnedThisMonth}
                  </Text>
                  <Text className="text-caption1 text-white/70">este mes</Text>
                </View>
              ) : null}
            </View>
          </View>
        </LinearFade>
      </Appear>

      {/* ── Accesos rápidos ── */}
      <Appear delay={60}>
        <View className="flex-row gap-3">
          <QuickAction icon="search" label="Clasificar" color={teal[600]} onPress={() => router.push("/ciudadano/clasificar")} />
          <QuickAction icon="gift" label="Canjear" color={amber[500]} onPress={() => router.push("/ciudadano/recompensas")} />
          <QuickAction icon="trophy" label="Retos" color={coral[500]} badge="2" onPress={() => router.push("/ciudadano/retos")} />
          <QuickAction icon="map" label="Mapa" color={sky[600]} onPress={() => router.push("/ciudadano/mapa")} />
        </View>
      </Appear>

      {/* ── Impacto ambiental ── */}
      <Appear delay={120}>
        <Card className="gap-3">
          <View className="flex-row items-center gap-2">
            <IconBadge icon="earth" color={eco[600]} size={34} rounded={10} />
            <View>
              <Text className="text-headline text-text-primary">Tu impacto este año</Text>
              <Text className="text-caption1 text-text-tertiary">
                {formatNumber(impact.kg)} kg aprovechados
              </Text>
            </View>
          </View>
          <View className="flex-row gap-3">
            <ImpactCol icon="cloud-outline" color={teal[600]} value={Math.round(impact.co2Kg)} unit="kg CO₂" label="evitados" />
            <ImpactCol icon="water-outline" color={sky[600]} value={Math.round(impact.waterL)} unit="L" label="agua ahorrada" />
            <ImpactCol icon="flash-outline" color={amber[600]} value={Math.round(impact.energyKwh)} unit="kWh" label="energía" />
          </View>
        </Card>
      </Appear>

      {/* ── Clasificación del hogar ── */}
      <Appear delay={180}>
        <Card className="gap-3">
          <View className="flex-row items-end justify-between">
            <View>
              <Text className="text-caption1 uppercase text-text-tertiary">
                Clasificación del hogar
              </Text>
              <Text className="text-largeTitle" style={{ color: scoreColor(score) }}>
                {score}
                <Text className="text-title3 text-text-tertiary"> / 100</Text>
              </Text>
            </View>
            <Pill label={scoreLabel(score)} color={scoreColor(score)} icon="ribbon" />
          </View>
          <ProgressBar value={score / 100} color={scoreColor(score)} trackColor={withAlpha(scoreColor(score), 0.14)} />
          {bonus > 0 ? (
            <View className="flex-row items-center gap-2">
              <Ionicons name="gift" size={16} color={amber[500]} />
              <Text className="flex-1 text-footnote text-text-secondary">
                Mantén este nivel y al cierre del periodo ganas{" "}
                <Text className="text-text-primary">{formatPoints(bonus)}</Text>.
              </Text>
            </View>
          ) : null}
        </Card>
      </Appear>

      {/* ── Métricas rápidas ── */}
      <Appear delay={220}>
        <View className="flex-row gap-3">
          <StatTile icon="wallet" color={eco[600]} label="Disponibles" value={formatPoints(balance)} />
          <StatTile icon="flame" color={coral[500]} label="Racha" value={`${streak} días`} />
        </View>
      </Appear>

      {/* ── Retos activos ── */}
      <Appear delay={260}>
        <View className="gap-3">
          <SectionHeader title="Retos activos" actionLabel="Ver todos" onAction={() => router.push("/ciudadano/retos")} />
          {topChallenges.map((c) => (
            <Card key={c.id} onPress={() => router.push("/ciudadano/retos")} className="gap-2">
              <View className="flex-row items-center gap-3">
                <IconBadge icon={c.icon as never} color={c.color} />
                <View className="flex-1">
                  <Text className="text-callout text-text-primary">{c.title}</Text>
                  <Text className="text-caption1 text-text-tertiary">{c.description}</Text>
                </View>
                <Pill label={`+${c.rewardPoints}`} color={c.color} icon="add-circle" />
              </View>
              <View className="flex-row items-center gap-2">
                <ProgressBar value={challengeProgress(c)} color={c.color} trackColor={withAlpha(c.color, 0.14)} style={{ flex: 1 }} />
                <Text className="text-caption1 text-text-tertiary">
                  {c.current}/{c.target}
                </Text>
              </View>
            </Card>
          ))}
        </View>
      </Appear>

      {/* ── Actividad reciente ── */}
      <Appear delay={300}>
        <View className="gap-3">
          <SectionHeader title="Actividad reciente" />
          {activity.length === 0 ? (
            <EmptyState icon="leaf-outline" title="Aún no tienes actividad" subtitle="Separa bien tus residuos para empezar a ganar puntos." />
          ) : (
            <Card className="gap-3">
              {activity.map((a, i) => {
                const positive = a.points >= 0;
                const c = positive ? eco[600] : coral[500];
                return (
                  <View
                    key={a.id}
                    className={`flex-row items-center gap-3 ${i > 0 ? "border-t border-border pt-3" : ""}`}
                  >
                    <IconBadge icon={positive ? "add-circle" : "alert-circle"} color={c} size={36} rounded={10} />
                    <View className="flex-1">
                      <Text className="text-callout text-text-primary">{a.title}</Text>
                      <Text className="text-caption1 text-text-tertiary">{a.meta}</Text>
                    </View>
                    <Text className="text-callout" style={{ color: c, fontWeight: "600" }}>
                      {positive ? `+${a.points}` : "Penalización"}
                    </Text>
                  </View>
                );
              })}
            </Card>
          )}
        </View>
      </Appear>
    </Screen>
  );
}

function ImpactCol({
  icon,
  color,
  value,
  unit,
  label,
}: {
  icon: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
  color: string;
  value: number;
  unit: string;
  label: string;
}) {
  return (
    <View className="flex-1 items-center gap-1 rounded-2xl py-3" style={{ backgroundColor: withAlpha(color, 0.08) }}>
      <Ionicons name={icon} size={20} color={color} />
      <View className="flex-row items-baseline gap-0.5">
        <CountUp value={value} className="text-title3 text-text-primary" style={{ fontWeight: "700" }} />
        <Text className="text-caption2 text-text-tertiary">{unit}</Text>
      </View>
      <Text className="text-caption2 text-text-tertiary" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}
