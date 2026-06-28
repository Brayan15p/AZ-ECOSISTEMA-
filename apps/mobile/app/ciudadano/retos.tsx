import { Ionicons } from "@expo/vector-icons";
import {
  challengeDone,
  challengeProgress,
  ecoImpact,
  evaluateBadges,
  formatNumber,
  levelFromXp,
  streakDays,
} from "@az/core";
import { amber, eco, gradients, gray } from "@az/ui-tokens";
import { Text, View } from "react-native";

import { Appear } from "../../components/ui/Appear";
import { Card } from "../../components/ui/Card";
import { IconBadge } from "../../components/ui/IconBadge";
import { LinearFade } from "../../components/ui/LinearFade";
import { Pill } from "../../components/ui/Pill";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Screen } from "../../components/ui/Screen";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { withAlpha } from "../../lib/color";
import {
  demoBadgeStats,
  demoKgYear,
  demoStreakDates,
  demoXp,
  mockChallenges,
  mockLeaderboard,
} from "../../lib/gamedata";

export default function Retos() {
  const lvl = levelFromXp(demoXp);
  const streak = streakDays(demoStreakDates);
  const impact = ecoImpact(demoKgYear);

  const badges = evaluateBadges({
    level: lvl.level.index,
    streak,
    co2Kg: impact.co2Kg,
    ...demoBadgeStats,
  });
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <Screen>
      <Appear>
        <View className="pt-2">
          <Text className="text-title1 text-text-primary">Retos</Text>
          <Text className="text-subhead text-text-secondary">
            Sube de nivel cuidando a Arauca.
          </Text>
        </View>
      </Appear>

      {/* Nivel actual */}
      <Appear delay={40}>
        <LinearFade colors={gradients.royal} style={{ borderRadius: 24 }}>
          <View className="gap-3 p-5">
            <View className="flex-row items-center gap-3">
              <View
                className="h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: withAlpha("#FFFFFF", 0.2) }}
              >
                <Ionicons name={lvl.level.icon as never} size={24} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-caption1 uppercase text-white/70">
                  Nivel {lvl.level.index + 1}
                </Text>
                <Text className="text-title2 text-white">{lvl.level.title}</Text>
              </View>
              <View className="items-end">
                <Text className="text-title3 text-white" style={{ fontWeight: "700" }}>
                  {formatNumber(demoXp)}
                </Text>
                <Text className="text-caption2 text-white/70">XP total</Text>
              </View>
            </View>
            <ProgressBar value={lvl.progress} color="#FFFFFF" trackColor={withAlpha("#FFFFFF", 0.25)} />
            <Text className="text-caption1 text-white/85">
              {lvl.maxed
                ? "¡Máximo nivel alcanzado! 🌳"
                : `Faltan ${formatNumber(lvl.toNext)} XP para ${lvl.next?.title}`}
            </Text>
          </View>
        </LinearFade>
      </Appear>

      {/* Retos */}
      <Appear delay={80}>
        <View className="gap-3">
          <SectionHeader title="Misiones de la semana" />
          {mockChallenges.map((c) => {
            const done = challengeDone(c);
            return (
              <Card key={c.id} className="gap-2">
                <View className="flex-row items-center gap-3">
                  <IconBadge icon={c.icon as never} color={c.color} variant={done ? "solid" : "soft"} />
                  <View className="flex-1">
                    <Text className="text-callout text-text-primary">{c.title}</Text>
                    <Text className="text-caption1 text-text-tertiary">{c.description}</Text>
                  </View>
                  {done ? (
                    <Pill label="¡Listo!" color={eco[600]} icon="checkmark-circle" variant="solid" />
                  ) : (
                    <Pill label={`+${c.rewardPoints}`} color={c.color} icon="add-circle" />
                  )}
                </View>
                <View className="flex-row items-center gap-2">
                  <ProgressBar value={challengeProgress(c)} color={c.color} trackColor={withAlpha(c.color, 0.14)} style={{ flex: 1 }} />
                  <Text className="text-caption1 text-text-tertiary">
                    {c.current}/{c.target}
                  </Text>
                </View>
              </Card>
            );
          })}
        </View>
      </Appear>

      {/* Insignias */}
      <Appear delay={120}>
        <View className="gap-3">
          <SectionHeader title={`Insignias · ${earnedCount}/${badges.length}`} />
          <Card>
            <View className="flex-row flex-wrap">
              {badges.map((b) => (
                <View key={b.id} className="w-1/3 items-center gap-1 py-2">
                  <View style={{ opacity: b.earned ? 1 : 0.35 }}>
                    <IconBadge
                      icon={b.icon as never}
                      color={b.earned ? b.color : gray[400]}
                      size={52}
                      rounded={18}
                      variant={b.earned ? "solid" : "soft"}
                    />
                  </View>
                  <Text
                    className="px-1 text-center text-caption2 text-text-secondary"
                    numberOfLines={2}
                  >
                    {b.title}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View>
      </Appear>

      {/* Ranking de barrios */}
      <Appear delay={160}>
        <View className="gap-3">
          <SectionHeader title="Ranking de barrios" />
          <Card className="gap-1">
            {mockLeaderboard.map((row, i) => {
              const medal = row.rank <= 3;
              const medalColor = [amber[400], gray[400], "#CD7F32"][row.rank - 1] ?? gray[400];
              return (
                <View
                  key={row.zone}
                  className={`flex-row items-center gap-3 rounded-xl px-2 py-2.5 ${i > 0 ? "border-t border-border" : ""}`}
                  style={row.you ? { backgroundColor: withAlpha(eco[500], 0.1) } : undefined}
                >
                  <View className="w-7 items-center">
                    {medal ? (
                      <Ionicons name="medal" size={20} color={medalColor} />
                    ) : (
                      <Text className="text-callout text-text-tertiary">{row.rank}</Text>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-callout text-text-primary">
                      {row.zone}
                      {row.you ? "  · Tú" : ""}
                    </Text>
                    <Text className="text-caption2 text-text-tertiary">
                      Clasificación {row.score}/100
                    </Text>
                  </View>
                  <Text className="text-callout text-text-primary" style={{ fontWeight: "700" }}>
                    {formatNumber(row.points)}
                  </Text>
                </View>
              );
            })}
          </Card>
        </View>
      </Appear>
    </Screen>
  );
}
