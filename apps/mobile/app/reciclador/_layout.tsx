import { Ionicons } from "@expo/vector-icons";
import { gray, green } from "@az/ui-tokens";
import { Tabs } from "expo-router";

export default function RecicladorLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: green[600],
        tabBarInactiveTintColor: gray[500],
        tabBarStyle: { borderTopColor: gray[200] },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rutas"
        options={{
          title: "Ruta",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="navigate-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="liquidaciones"
        options={{
          title: "Liquidaciones",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
