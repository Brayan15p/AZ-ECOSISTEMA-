import { Ionicons } from "@expo/vector-icons";
import { gray, navy } from "@az/ui-tokens";
import { Tabs } from "expo-router";

export default function CiudadanoLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: navy[600],
        tabBarInactiveTintColor: gray[500],
        tabBarStyle: { borderTopColor: gray[200] },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Mi Barrio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recompensas"
        options={{
          title: "Recompensas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="gift-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
