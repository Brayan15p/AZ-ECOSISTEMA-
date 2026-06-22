import { FlatList, View } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";
import { Button } from "@/ui/Button";
import { ListRow } from "@/ui/ListRow";
import { useOperatorStore } from "@/state/operatorStore";

export default function LogsScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const logs = useOperatorStore((s) => s.logs);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgCanvas }}>
      <View style={{ paddingTop: spacing["5xl"], paddingHorizontal: spacing["2xl"], paddingBottom: spacing.lg }}>
        <Button label="← Volver" variant="ghost" size="sm" onPress={() => router.back()} />
        <Text variant="h2" style={{ marginTop: spacing.sm }}>
          Bitácora
        </Text>
        <Text variant="bodySm" tone="secondary">
          Últimos {logs.length} eventos (máx. 200)
        </Text>
      </View>

      <FlatList
        data={logs}
        keyExtractor={(l) => l.id}
        contentContainerStyle={{ padding: spacing["2xl"], gap: spacing.sm, paddingBottom: spacing["5xl"] }}
        ListEmptyComponent={<Text tone="muted">Sin actividad registrada todavía.</Text>}
        renderItem={({ item }) => (
          <ListRow
            title={item.action}
            subtitle={item.detail}
            right={
              <Text variant="caption" tone="muted">
                {new Date(item.timestamp).toLocaleString("es-CO")}
              </Text>
            }
          />
        )}
      />
    </View>
  );
}
