import { canRedeem, formatPoints, pointsBalance, type CatalogItem } from "@az/core";
import { useState } from "react";
import { Alert, Text, View } from "react-native";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { Screen } from "../../components/ui/Screen";
import { ScreenSkeleton } from "../../components/ui/Skeleton";
import { useAuth } from "../../lib/auth";
import { useCatalog, usePointsLedger } from "../../lib/data";
import { getSupabase } from "../../lib/supabase";

const REASONS: Record<string, string> = {
  insufficient_points: "Puntos insuficientes",
  out_of_stock: "Agotado",
  inactive: "No disponible",
};

// Errcodes que lanza el RPC `redeem_catalog_item` (security_p0.sql).
const RPC_ERRORS: Record<string, string> = {
  P0001: "Tu perfil no tiene un hogar asociado. Contacta a tu operador.",
  P0002: "Este artículo ya no está disponible.",
  P0003: "Se agotó el stock justo antes de tu canje.",
  P0004: "No tienes suficientes puntos para este canje.",
};

export default function Recompensas() {
  const { isRemote } = useAuth();
  const { data: catalog, loading, error, reload } = useCatalog();
  const { data: ledger, reload: reloadLedger } = usePointsLedger();
  const balance = pointsBalance(ledger);

  if (loading) return <ScreenSkeleton />;

  const reloadAll = () => {
    reload();
    reloadLedger();
  };

  return (
    <Screen onRefresh={reloadAll} refreshing={loading} error={error} onRetry={reloadAll}>
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
          <RewardRow
            key={item.id}
            item={item}
            balance={balance}
            isRemote={isRemote}
            onRedeemed={reloadAll}
          />
        ))
      )}
    </Screen>
  );
}

function RewardRow({
  item,
  balance,
  isRemote,
  onRedeemed,
}: {
  item: CatalogItem;
  balance: number;
  isRemote: boolean;
  onRedeemed: () => void;
}) {
  const check = canRedeem(item, balance);
  const [redeeming, setRedeeming] = useState(false);

  const doRedeem = async () => {
    if (!isRemote) {
      // Modo demo (sin Supabase configurado): no hay sesión real contra la
      // que descontar puntos, así que solo confirmamos la intención.
      Alert.alert(
        "¡Canje registrado!",
        `Te llegará una notificación con el código de "${item.name}".`,
      );
      return;
    }
    setRedeeming(true);
    const { error } = await getSupabase().rpc("redeem_catalog_item", {
      p_catalog_item_id: item.id,
    });
    setRedeeming(false);
    if (error) {
      Alert.alert(
        "No se pudo canjear",
        RPC_ERRORS[error.code ?? ""] ?? error.message,
      );
      return;
    }
    onRedeemed();
    Alert.alert(
      "¡Canje registrado!",
      `Te llegará una notificación con el código de "${item.name}".`,
    );
  };

  const confirmRedeem = () => {
    Alert.alert(
      `Canjear ${item.name}`,
      `Vas a usar ${formatPoints(item.costPoints)} de tu saldo. ¿Confirmas el canje?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí, canjear", onPress: () => void doRedeem() },
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
        disabled={!check.ok || redeeming}
        loading={redeeming}
        onPress={confirmRedeem}
        accessibilityHint={
          check.ok ? `Canjea ${item.name} por ${item.costPoints} puntos` : undefined
        }
      />
    </Card>
  );
}
