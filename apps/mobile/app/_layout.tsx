import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { useSession } from "@/state/sessionStore";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const initialize = useSession((s) => s.initialize);
  const loading = useSession((s) => s.loading);

  useEffect(() => {
    initialize().finally(() => SplashScreen.hideAsync().catch(() => {}));
  }, [initialize]);

  if (loading) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade_from_bottom",
            contentStyle: { backgroundColor: "transparent" }
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(ciudadano)" />
          <Stack.Screen name="(operador)" />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
