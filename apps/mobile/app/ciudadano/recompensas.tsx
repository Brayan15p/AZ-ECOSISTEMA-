import { canRedeem, formatPoints, pointsBalance, type CatalogItem } from "@az/core";
import { Alert, Text, View } from "react-native";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { Screen } from "../../components/ui/Screen";
import { ScreenSkeleton } from "../../components/ui/Skeleton";
import { useCatalog, usePointsLedger } from "../../lib/data";

const REASONS: Record<string, string> = {
  insufficient_points: "Puntos insuficientes",
  out_of_stock: "Agotado",
  inactive: "No disponible",
};

export default function Recompensas() {
  const { data: catalog, loading, error, reload } = useCatalog();
  const { data: ledger } = usePointsLedger();
  const balance = pointsBalance(ledger);

  if (loading) return <ScreenSkeleton />;

  return (
    <Screen onRefresh={reload} refreshing={loading} error={error} onRetry={reload}>
      <View className="gap-1 pt-2">
        <Text className="text-title1 text-text-primary">Recompensas</Text>
        <Text className="text-body text-text-secondary">
          Saldo:{" "}
          <Text className="text-text-primary">{formatPoints(balance)}</Text>
        </Text>
      </View>

      {catalog.length === 0 ? (
        <EmptyState
          icon="gift-outline"
          title="Aún no hay recompensas"
          subtitle="Pronto tu municipio publicará bonos y beneficios para canjear con tus puntos."
        />
      ) : (
        catalog.map((item) => (
          <RewardRow key={item.id} item={item} balance={balance} />
        ))
      )}
    </Screen>
  );
}

function RewardRow({ item, balance }: { item: CatalogItem; balance: number }) {
  const check = canRedeem(item, balance);

  const confirmRedeem = () => {
    Alert.alert(
      `Canjear ${item.name}`,
      `Vas a usar ${formatPoints(item.costPoints)} de tu saldo. ¿Confirmas el canje?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, canjear",
          onPress: () => {
            // TODO: llamar al RPC transaccional `redeem(item.id)` (descuento
            // atómico de puntos + stock). Por ahora confirmamos en modo demo.
            Alert.alert(
              "¡Canje registrado!",
              `Te llegará una notificación con el código de "${item.name}".`,
            );
          },
        },
      ],
    );
  };

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

      <Button
        variant="primary"
        icon={check.ok ? "gift" : "lock-closed"}
        title={check.ok ? "Canjear" : REASONS[check.reason]}
        disabled={!check.ok}
        onPress={confirmRedeem}
        accessibilityHint={
          check.ok ? `Canjea ${item.name} por ${item.costPoints} puntos` : undefined
        }
      />
    </Card>
  );
}
