import { canRedeem, formatPoints, pointsBalance, type CatalogItem } from "@az/core";
import { Pressable, Text, View } from "react-native";

import { Card } from "../../components/ui/Card";
import { Loading } from "../../components/ui/Loading";
import { Screen } from "../../components/ui/Screen";
import { useCatalog, usePointsLedger } from "../../lib/data";

const REASONS: Record<string, string> = {
  insufficient_points: "Puntos insuficientes",
  out_of_stock: "Agotado",
  inactive: "No disponible",
};

export default function Recompensas() {
  const { data: catalog, loading } = useCatalog();
  const { data: ledger } = usePointsLedger();
  const balance = pointsBalance(ledger);

  if (loading) return <Loading />;

  return (
    <Screen>
      <View className="gap-1 pt-2">
        <Text className="text-title1 text-text-primary">Recompensas</Text>
        <Text className="text-body text-text-secondary">
          Saldo:{" "}
          <Text className="text-text-primary">{formatPoints(balance)}</Text>
        </Text>
      </View>

      {catalog.map((item) => (
        <RewardRow key={item.id} item={item} balance={balance} />
      ))}
    </Screen>
  );
}

function RewardRow({ item, balance }: { item: CatalogItem; balance: number }) {
  const check = canRedeem(item, balance);

  return (
    <Card className="gap-3">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-headline text-text-primary">{item.name}</Text>
          <Text className="text-subhead text-text-secondary">
            {item.description}
          </Text>
        </View>
        <Text className="text-callout text-accent">
          {formatPoints(item.costPoints)}
        </Text>
      </View>

      <Pressable
        disabled={!check.ok}
        className={
          check.ok
            ? "items-center rounded-xl bg-brand py-3 active:opacity-80"
            : "items-center rounded-xl bg-surface-sunken py-3"
        }
      >
        <Text
          className={
            check.ok
              ? "text-callout text-white"
              : "text-callout text-text-tertiary"
          }
        >
          {check.ok ? "Canjear" : REASONS[check.reason]}
        </Text>
      </Pressable>
    </Card>
  );
}
