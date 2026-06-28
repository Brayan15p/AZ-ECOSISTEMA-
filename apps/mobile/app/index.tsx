import { Ionicons } from "@expo/vector-icons";
import { navy } from "@az/ui-tokens";
import { Redirect } from "expo-router";
import { Text, View } from "react-native";

import { Button } from "../components/ui/Button";
import { Loading } from "../components/ui/Loading";
import { useAuth } from "../lib/auth";

/**
 * Puerta de entrada: decide a dónde va el usuario según su sesión y rol.
 * La app móvil solo atiende a ciudadanos y recicladores; el resto de roles
 * (operador/admin) trabajan desde la web.
 */
export default function Index() {
  const { ready, profile, role, signOut } = useAuth();

  if (!ready) return <Loading />;
  if (!profile) return <Redirect href="/login" />;
  if (role === "ciudadano") return <Redirect href="/ciudadano" />;
  if (role === "reciclador") return <Redirect href="/reciclador" />;

  // Rol de staff (operador/admin/super_admin): no tiene vista móvil.
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background px-8">
      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-surface-sunken">
        <Ionicons name="desktop-outline" size={26} color={navy[500]} />
      </View>
      <Text className="text-center text-title3 text-text-primary">
        Tu rol se gestiona desde la web
      </Text>
      <Text className="text-center text-subhead text-text-secondary">
        La app móvil es para ciudadanos y recicladores. Ingresa a la consola web
        con esta misma cuenta.
      </Text>
      <View className="mt-2">
        <Button
          variant="secondary"
          icon="log-out-outline"
          title="Cerrar sesión"
          fullWidth={false}
          onPress={() => void signOut()}
        />
      </View>
    </View>
  );
}
