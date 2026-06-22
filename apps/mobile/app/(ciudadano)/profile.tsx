import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";
import { Card } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { useSession } from "@/state/sessionStore";

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, spacing } = useTheme();
  const { user, signOut, setRole } = useSession();

  const handleSignOut = async () => {
    await signOut();
    setRole(null);
    router.replace("/");
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: spacing["2xl"],
        paddingTop: insets.top + spacing["2xl"],
        gap: spacing.xl,
        backgroundColor: colors.bgCanvas
      }}
    >
      <Text variant="h1">Perfil</Text>

      <Card padding={spacing.xl}>
        <Text variant="overline" tone="muted">Hogar</Text>
        <Text variant="h3" style={{ marginTop: spacing.xs }}>H001 · María García</Text>
        <Text variant="bodySm" tone="secondary" style={{ marginTop: 2 }}>Cra 19 #14-22, B. Centro</Text>
      </Card>

      <Card padding={spacing.xl}>
        <Text variant="overline" tone="muted">Sesión</Text>
        <Text variant="body" tone="secondary" style={{ marginTop: spacing.xs }}>
          {user?.email ?? "Sesión demo (sin Supabase configurado)"}
        </Text>
      </Card>

      <Button label="Cambiar de modo" variant="outline" onPress={() => { setRole(null); router.replace("/"); }} />
      <Button label="Cerrar sesión" variant="danger" onPress={handleSignOut} />
    </ScrollView>
  );
}
