import { Ionicons } from "@expo/vector-icons";
import {
  estimateMonthlyPayout,
  formatCop,
  formatNumber,
} from "@az/core";
import { green, status } from "@az/ui-tokens";
import { Link, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { Loading } from "../../components/ui/Loading";
import { Screen } from "../../components/ui/Screen";
import { StatTile } from "../../components/ui/StatTile";
import { useAuth } from "../../lib/auth";
import { useRecycler, useRoute } from "../../lib/data";

export default function RecicladorHome() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { data: r, loading } = useRecycler();
  const { data: route } = useRoute(r?.zone ?? null);

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

  const collected = route.filter((s) => s.status === "collected");
  const kgToday = collected.reduce((sum, s) => sum + (s.kg ?? 0), 0);
  const monthlyPayout = estimateMonthlyPayout(r.kgDay);

  return (
    <Screen>
      <View className="flex-row items-center justify-between pt-2">
        <View className="flex-1">
          <Text className="text-footnote uppercase text-text-tertiary">
            {r.zone}
          </Text>
          <Text className="text-title1 text-text-primary">{r.name}</Text>
        </View>
        <Badge
          label={r.formalized ? "Formalizado" : "En proceso"}
          color={r.formalized ? status.success : status.warning}
        />
      </View>

      <View className="flex-row gap-4">
        <StatTile
          label="Hogares"
          value={formatNumber(r.householdsCount)}
          hint="En tu ruta"
        />
        <StatTile
          label="Recolección"
          value={`${formatNumber(r.kgDay)} kg`}
          hint="Promedio diario"
          valueColor={green[600]}
        />
      </View>

      {/* Resumen de la ruta de hoy */}
      <Link href="/reciclador/rutas" asChild>
        <Pressable className="active:opacity-80">
          <Card className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-caption1 uppercase text-text-tertiary">
                Ruta de hoy
              </Text>
              <Ionicons name="chevron-forward" size={16} color={green[600]} />
            </View>
            <View className="flex-row items-end justify-between">
              <Text className="text-largeTitle text-text-primary">
                {collected.length}
                <Text className="text-title3 text-text-tertiary">
                  {" "}
                  / {route.length}
                </Text>
              </Text>
              <Text className="text-callout text-text-secondary">
                {formatNumber(kgToday)} kg recolectados
              </Text>
            </View>
            <View className="h-2 overflow-hidden rounded-full bg-surface-sunken">
              <View
                className="h-2 rounded-full bg-brand-alt"
                style={{
                  width: `${route.length ? (collected.length / route.length) * 100 : 0}%` as `${number}%`,
                }}
              />
            </View>
          </Card>
        </Pressable>
      </Link>

      {/* Estimado del mes -> Liquidaciones */}
      <Link href="/reciclador/liquidaciones" asChild>
        <Pressable className="active:opacity-80">
          <Card className="flex-row items-center justify-between">
            <View>
              <Text className="text-caption1 uppercase text-text-tertiary">
                Estimado del mes
              </Text>
              <Text className="text-title2 text-text-primary">
                {formatCop(monthlyPayout)}
              </Text>
            </View>
            <Ionicons name="cash-outline" size={22} color={green[600]} />
          </Card>
        </Pressable>
      </Link>

      <Pressable
        onPress={() => void signOut().then(() => router.replace("/login"))}
        className="mt-2 flex-row items-center justify-center gap-2 rounded-xl border border-border bg-surface py-3 active:opacity-80"
      >
        <Ionicons name="log-out-outline" size={18} color={green[600]} />
        <Text className="text-callout text-text-secondary">Cerrar sesión</Text>
      </Pressable>
    </Screen>
  );
}
