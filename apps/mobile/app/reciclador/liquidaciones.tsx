import { Ionicons } from "@expo/vector-icons";
import {
  COP_PER_KG,
  WORKING_DAYS,
  estimateMonthlyPayout,
  formatCop,
  formatDate,
  formatNumber,
  payoutStatusColor,
  payoutStatusLabel,
  totalPaid,
} from "@az/core";
import { green } from "@az/ui-tokens";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { Loading } from "../../components/ui/Loading";
import { Screen } from "../../components/ui/Screen";
import { usePayouts, useRecycler } from "../../lib/data";

export default function Liquidaciones() {
  const { data: r, loading } = useRecycler();
  const { data: payouts } = usePayouts();
  const [requested, setRequested] = useState(false);

  if (loading) return <Loading />;
  if (!r) {
    return (
      <Screen>
        <Text className="text-body text-text-secondary">
          No encontramos tu perfil de reciclador.
        </Text>
      </Screen>
    );
  }

  const monthlyPayout = estimateMonthlyPayout(r.kgDay);
  const paid = totalPaid(payouts);

  return (
    <Screen>
      <View className="gap-1 pt-2">
        <Text className="text-title1 text-text-primary">Liquidaciones</Text>
        <Text className="text-body text-text-secondary">
          Total liquidado:{" "}
          <Text className="text-text-primary">{formatCop(paid)}</Text>
        </Text>
      </View>

      {/* Estimado del periodo en curso */}
      <Card className="gap-3">
        <View>
          <Text className="text-caption1 uppercase text-text-tertiary">
            Estimado del mes
          </Text>
          <Text className="text-largeTitle text-text-primary">
            {formatCop(monthlyPayout)}
          </Text>
          <Text className="text-footnote text-text-secondary">
            {formatNumber(r.kgDay)} kg/día · {WORKING_DAYS} días ·{" "}
            {formatCop(COP_PER_KG)}/kg
          </Text>
        </View>

        <View className="h-px bg-border" />

        <View className="flex-row items-center gap-3">
          <Ionicons name="card-outline" size={20} color={green[600]} />
          <View className="flex-1">
            <Text className="text-callout text-text-primary">
              {r.bankName ?? "Sin cuenta registrada"}
            </Text>
            <Text className="text-caption1 capitalize text-text-tertiary">
              {r.bankAccountType ?? ""} {r.bankAccount ?? ""}
            </Text>
          </View>
        </View>

        <Pressable
          disabled={requested}
          onPress={() => setRequested(true)}
          className={
            requested
              ? "flex-row items-center justify-center gap-2 rounded-xl bg-surface-sunken py-3"
              : "items-center rounded-xl bg-brand-alt py-3 active:opacity-80"
          }
        >
          {requested ? (
            <>
              <Ionicons name="checkmark-circle" size={18} color={green[600]} />
              <Text className="text-callout text-text-secondary">
                Solicitud enviada
              </Text>
            </>
          ) : (
            <Text className="text-callout text-white">Solicitar liquidación</Text>
          )}
        </Pressable>
      </Card>

      {/* Historial */}
      <Text className="mt-2 text-title3 text-text-primary">Historial</Text>
      {payouts.length === 0 ? (
        <Card>
          <Text className="text-subhead text-text-secondary">
            Aún no tienes liquidaciones registradas.
          </Text>
        </Card>
      ) : (
        payouts.map((p) => (
          <Card key={p.id} className="gap-2">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="text-headline text-text-primary">
                  {formatCop(p.amountCop)}
                </Text>
                <Text className="text-subhead text-text-secondary">
                  {formatDate(p.periodStart)} – {formatDate(p.periodEnd)}
                </Text>
              </View>
              <Badge
                label={payoutStatusLabel(p.status)}
                color={payoutStatusColor(p.status)}
              />
            </View>
            <Text className="text-caption1 text-text-tertiary">
              {formatNumber(p.kg)} kg recolectados
            </Text>
          </Card>
        ))
      )}
    </Screen>
  );
}
