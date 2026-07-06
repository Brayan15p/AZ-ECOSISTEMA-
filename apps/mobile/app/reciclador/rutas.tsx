import { Ionicons } from "@expo/vector-icons";
import { formatNumber, scoreColor, type RouteStop, type RouteStopStatus } from "@az/core";
import { gray, green, status } from "@az/ui-tokens";
import { useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";

import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { Screen } from "../../components/ui/Screen";
import { useAuth } from "../../lib/auth";
import { logCollection, useRecycler, useRoute } from "../../lib/data";

const STATUS_META: Record<RouteStopStatus, { label: string; color: string }> = {
  collected: { label: "Recolectado", color: status.success },
  pending: { label: "Pendiente", color: status.warning },
  skipped: { label: "Omitido", color: gray[500] },
};

/** kg asignados en modo demo (sin Supabase configurado). */
const DEMO_KG = 10;

export default function Rutas() {
  const { isRemote } = useAuth();
  const { data: recycler } = useRecycler();
  const { data: route, loading, error, reload } = useRoute(recycler?.zone ?? null);

  // Marcado local de paradas (solo en modo demo; en remoto la fuente de
  // verdad es `collection_log`, refrescada vía `reload()`).
  const [overrides, setOverrides] = useState<
    Record<string, { status: RouteStopStatus; kg: number | null }>
  >({});
  // Parada que está capturando el kg ahora mismo (input inline).
  const [capturingId, setCapturingId] = useState<string | null>(null);
  const [kgInput, setKgInput] = useState("");
  const [saving, setSaving] = useState(false);

  const stops: RouteStop[] = route.map((s) => {
    const ov = overrides[s.id];
    return ov ? { ...s, ...ov } : s;
  });

  const collected = stops.filter((s) => s.status === "collected");
  const kgTotal = collected.reduce((sum, s) => sum + (s.kg ?? 0), 0);
  const progress = stops.length ? (collected.length / stops.length) * 100 : 0;

  const startCapture = (id: string) => {
    setCapturingId(id);
    setKgInput("");
  };

  const confirmCollected = async (id: string) => {
    if (!isRemote) {
      const kg = Number(kgInput.replace(",", ".")) || DEMO_KG;
      setOverrides((o) => ({ ...o, [id]: { status: "collected", kg } }));
      setCapturingId(null);
      return;
    }
    const kg = Number(kgInput.replace(",", "."));
    if (!kg || kg <= 0) {
      Alert.alert("Peso inválido", "Ingresa el kg recolectado (mayor a 0).");
      return;
    }
    setSaving(true);
    const { error: err } = await logCollection(id, kg);
    setSaving(false);
    if (err) {
      Alert.alert("No se pudo registrar", err);
      return;
    }
    setCapturingId(null);
    reload();
  };

  return (
    <Screen onRefresh={reload} refreshing={loading} error={error} onRetry={reload}>
      <View className="gap-1 pt-2">
        <Text className="text-footnote uppercase text-text-tertiary">
          {recycler?.zone ?? "Tu ruta"}
        </Text>
        <Text className="text-title1 text-text-primary">Ruta de hoy</Text>
      </View>

      {/* Progreso */}
      <Card className="gap-3">
        <View className="flex-row items-end justify-between">
          <Text className="text-largeTitle text-text-primary">
            {collected.length}
            <Text className="text-title3 text-text-tertiary">
              {" "}
              / {stops.length}
            </Text>
          </Text>
          <Text className="text-callout text-text-secondary">
            {formatNumber(kgTotal)} kg
          </Text>
        </View>
        <View className="h-2 overflow-hidden rounded-full bg-surface-sunken">
          <View
            className="h-2 rounded-full bg-brand-alt"
            style={{ width: `${progress}%` as `${number}%` }}
          />
        </View>
      </Card>

      {/* Paradas */}
      {stops.length === 0 ? (
        <EmptyState
          icon="navigate-outline"
          title="Sin paradas hoy"
          subtitle="Cuando tu municipio asigne hogares a tu zona, aparecerán aquí."
        />
      ) : (
        stops.map((s) => {
          const meta = STATUS_META[s.status];
          return (
          <Card key={s.id} className="gap-3">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="text-headline text-text-primary">{s.owner}</Text>
                <Text className="text-subhead text-text-secondary">
                  {s.address}
                </Text>
              </View>
              <Badge label={meta.label} color={meta.color} />
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: scoreColor(s.score) }}
                />
                <Text className="text-caption1 text-text-tertiary">
                  Clasificación {s.score}
                </Text>
              </View>

              {s.status === "pending" && capturingId !== s.id ? (
                <Button
                  variant="success"
                  size="md"
                  icon="checkmark"
                  title="Recolectado"
                  fullWidth={false}
                  onPress={() => startCapture(s.id)}
                  accessibilityHint={`Marca a ${s.owner} como recolectado`}
                />
              ) : s.status === "collected" ? (
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="checkmark-circle" size={16} color={green[600]} />
                  <Text className="text-footnote text-text-secondary">
                    {s.kg != null ? `${formatNumber(s.kg)} kg` : "Listo"}
                  </Text>
                </View>
              ) : null}
            </View>

            {capturingId === s.id ? (
              <View className="flex-row items-center gap-2 rounded-xl bg-surface-sunken p-2">
                <TextInput
                  value={kgInput}
                  onChangeText={setKgInput}
                  placeholder="kg recolectados"
                  placeholderTextColor={gray[400]}
                  keyboardType="decimal-pad"
                  autoFocus
                  className="flex-1 px-2 text-callout text-text-primary"
                />
                <Button
                  variant="ghost"
                  size="md"
                  title="Cancelar"
                  fullWidth={false}
                  onPress={() => setCapturingId(null)}
                  disabled={saving}
                />
                <Button
                  variant="success"
                  size="md"
                  icon="checkmark"
                  title="Confirmar"
                  fullWidth={false}
                  loading={saving}
                  disabled={saving}
                  onPress={() => void confirmCollected(s.id)}
                  accessibilityHint={`Confirma el kg recolectado en ${s.owner}`}
                />
              </View>
            ) : null}
          </Card>
          );
        })
      )}
    </Screen>
  );
}
