import {
  formatPoints,
  periodBonusPoints,
  pointsBalance,
  scoreColor,
  scoreLabel,
} from "@az/core";
import { Text, View } from "react-native";

import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { Loading } from "../../components/ui/Loading";
import { Screen } from "../../components/ui/Screen";
import { StatTile } from "../../components/ui/StatTile";
import {
  useHousehold,
  usePenalties,
  usePointsLedger,
  useRewards,
} from "../../lib/data";

export default function MiBarrio() {
  const { data: household, loading } = useHousehold();
  const { data: ledger } = usePointsLedger();
  const { data: rewards } = useRewards();
  const { data: penalties } = usePenalties();

  if (loading) return <Loading />;
  if (!household) {
    return (
      <Screen>
        <Text className="text-body text-text-secondary">
          No encontramos tu hogar registrado.
        </Text>
      </Screen>
    );
  }

  const balance = pointsBalance(ledger);
  const score = household.score;
  const bonus = periodBonusPoints(score);
  const earnedThisMonth = rewards.reduce((s, r) => s + r.points, 0);

  return (
    <Screen>
      {/* Encabezado */}
      <View className="gap-1 pt-2">
        <Text className="text-footnote uppercase text-text-tertiary">
          {household.zone}
        </Text>
        <Text className="text-title1 text-text-primary">
          Hola, {household.owner}
        </Text>
      </View>

      {/* Score del hogar */}
      <Card className="gap-3">
        <View className="flex-row items-end justify-between">
          <View>
            <Text className="text-caption1 uppercase text-text-tertiary">
              Clasificación del hogar
            </Text>
            <Text
              className="text-largeTitle"
              style={{ color: scoreColor(score) }}
            >
              {score}
              <Text className="text-title3 text-text-tertiary"> / 100</Text>
            </Text>
          </View>
          <Badge label={scoreLabel(score)} color={scoreColor(score)} />
        </View>
        <View className="h-2 overflow-hidden rounded-full bg-surface-sunken">
          <View
            className="h-2 rounded-full"
            style={{
              width: `${score}%` as `${number}%`,
              backgroundColor: scoreColor(score),
            }}
          />
        </View>
        {bonus > 0 ? (
          <Text className="text-footnote text-text-secondary">
            🎁 Mantén este nivel y al cierre del periodo ganas{" "}
            <Text className="text-text-primary">{formatPoints(bonus)}</Text>.
          </Text>
        ) : null}
      </Card>

      {/* Métricas */}
      <View className="flex-row gap-4">
        <StatTile
          label="Puntos"
          value={formatPoints(balance)}
          hint="Disponibles para canjear"
        />
        <StatTile
          label="Este mes"
          value={`+${earnedThisMonth}`}
          hint="Puntos ganados"
        />
      </View>

      {/* Actividad reciente */}
      <Text className="mt-2 text-title3 text-text-primary">Actividad reciente</Text>
      <Card className="gap-3">
        {rewards.map((r) => (
          <View key={r.id} className="flex-row items-center gap-3">
            <View className="h-2 w-2 rounded-full bg-success" />
            <View className="flex-1">
              <Text className="text-callout text-text-primary">
                {r.description}
              </Text>
              <Text className="text-caption1 text-text-tertiary">{r.date}</Text>
            </View>
            <Text className="text-callout text-success">+{r.points}</Text>
          </View>
        ))}
        {penalties.map((p) => (
          <View key={p.id} className="flex-row items-center gap-3">
            <View className="h-2 w-2 rounded-full bg-warning" />
            <View className="flex-1">
              <Text className="text-callout text-text-primary">
                {p.description}
              </Text>
              <Text className="text-caption1 text-text-tertiary">
                {p.date} · {p.resolved ? "Resuelto" : "Pendiente"}
              </Text>
            </View>
            <Text className="text-callout capitalize text-warning">
              {p.severity}
            </Text>
          </View>
        ))}
      </Card>
    </Screen>
  );
}
