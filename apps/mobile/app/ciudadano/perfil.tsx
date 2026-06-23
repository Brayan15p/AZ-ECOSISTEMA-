import { Ionicons } from "@expo/vector-icons";
import { gray } from "@az/ui-tokens";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { Card } from "../../components/ui/Card";
import { Loading } from "../../components/ui/Loading";
import { Screen } from "../../components/ui/Screen";
import { useAuth } from "../../lib/auth";
import { useHousehold } from "../../lib/data";

export default function Perfil() {
  const router = useRouter();
  const { profile, demo, isRemote, signOut } = useAuth();
  const { data: household, loading } = useHousehold();

  if (loading) return <Loading />;

  const name = profile?.fullName ?? household?.owner ?? "Ciudadano";
  const connection = isRemote
    ? "Sesión activa"
    : demo
      ? "Modo demostración"
      : "Pendiente (.env)";

  return (
    <Screen>
      <View className="items-center gap-2 pb-2 pt-4">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-brand">
          <Text className="text-title1 text-white">{name.charAt(0)}</Text>
        </View>
        <Text className="text-title2 text-text-primary">{name}</Text>
        {household ? (
          <Text className="text-subhead text-text-secondary">
            {household.zone}
          </Text>
        ) : null}
      </View>

      {household ? (
        <Card className="gap-3">
          <Row label="Dirección" value={household.address} />
          <Row label="Teléfono" value={household.phone ?? "—"} />
          <Row label="Rol" value="Ciudadano" />
        </Card>
      ) : null}

      <Card>
        <Row label="Conexión a Supabase" value={connection} />
      </Card>

      <Pressable
        onPress={() => void signOut().then(() => router.replace("/login"))}
        className="flex-row items-center justify-center gap-2 rounded-xl border border-border bg-surface py-3 active:opacity-80"
      >
        <Ionicons name="log-out-outline" size={18} color={gray[600]} />
        <Text className="text-callout text-text-secondary">Cerrar sesión</Text>
      </Pressable>
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-subhead text-text-secondary">{label}</Text>
      <Text className="text-callout text-text-primary">{value}</Text>
    </View>
  );
}
