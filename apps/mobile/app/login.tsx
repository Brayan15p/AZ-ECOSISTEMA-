import { Ionicons } from "@expo/vector-icons";
import { brand, gray, green, navy, status } from "@az/ui-tokens";
import type { Role } from "@az/core";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Appear } from "../components/ui/Appear";
import { Button } from "../components/ui/Button";
import { LinearFade } from "../components/ui/LinearFade";
import { PressableScale } from "../components/ui/PressableScale";
import { useAuth } from "../lib/auth";

export default function Login() {
  const { demo, signInWithPassword, signInAsRole } = useAuth();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center gap-7 px-6 py-10"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Hero de marca: gradiente firma navy→eco + la idea central ── */}
          <Appear>
            <LinearFade colors={brand.gradient.signature} style={{ borderRadius: 28 }}>
              <View className="gap-5 p-6">
                <View
                  className="h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
                >
                  <Text className="text-title2 text-white" style={{ fontWeight: "800", letterSpacing: 1 }}>
                    AZ
                  </Text>
                </View>
                <View className="gap-1">
                  <Text className="text-largeTitle text-white">{brand.name}</Text>
                  <Text className="text-callout text-white/85">{brand.tagline}</Text>
                </View>
                <View
                  className="flex-row items-center gap-2 self-start rounded-full px-3 py-1.5"
                  style={{ backgroundColor: "rgba(255,255,255,0.16)" }}
                >
                  <Ionicons name="sparkles" size={13} color="#FFFFFF" />
                  <Text className="text-caption1 text-white/95">{brand.bigIdea}</Text>
                </View>
              </View>
            </LinearFade>
          </Appear>

          {/* ── Encabezado de la acción ── */}
          <Appear delay={90}>
            <View className="gap-1 px-1">
              <Text className="text-title3 text-text-primary">
                {demo ? "¿Cómo quieres ingresar?" : "Inicia sesión"}
              </Text>
              <Text className="text-subhead text-text-secondary">
                {demo
                  ? "Elige tu rol para explorar la app."
                  : "Entra con tu cuenta para continuar."}
              </Text>
            </View>
          </Appear>

          {/* ── Formulario / selector de rol ── */}
          <Appear delay={150}>
            {demo ? (
              <DemoRolePicker
                onPick={(role) => {
                  signInAsRole(role);
                  router.replace("/");
                }}
              />
            ) : (
              <PasswordForm
                onSubmit={signInWithPassword}
                onSuccess={() => router.replace("/")}
                onDemo={() => {
                  signInAsRole("ciudadano");
                  router.replace("/");
                }}
              />
            )}
          </Appear>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function DemoRolePicker({ onPick }: { onPick: (role: Role) => void }) {
  return (
    <View className="gap-4">
      <RoleCard
        color={navy[700]}
        icon="home"
        title="Soy ciudadano"
        subtitle="Mi Barrio · revisa tu clasificación y canjea puntos"
        onPress={() => onPick("ciudadano")}
      />
      <RoleCard
        color={green[600]}
        icon="cube"
        title="Soy reciclador"
        subtitle="Tus rutas, recolección y liquidaciones"
        onPress={() => onPick("reciclador")}
      />
      <Text className="px-1 text-footnote text-text-tertiary">
        Modo demostración (sin .env). Configura EXPO_PUBLIC_SUPABASE_URL y
        ANON_KEY para entrar con cuentas reales.
      </Text>
    </View>
  );
}

function PasswordForm({
  onSubmit,
  onSuccess,
  onDemo,
}: {
  onSubmit: (email: string, password: string) => Promise<{ error: string | null }>;
  onSuccess: () => void;
  onDemo: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setLoading(true);
    const { error: err } = await onSubmit(email, password);
    setLoading(false);
    if (err) setError(err);
    else onSuccess();
  };

  const disabled = loading || email.trim().length === 0 || password.length === 0;

  return (
    <View className="gap-4">
      <View className="gap-2">
        <Text className="px-1 text-footnote uppercase text-text-tertiary">
          Correo
        </Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="tu@correo.com"
          placeholderTextColor={gray[400]}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          inputMode="email"
          className="rounded-xl border border-border bg-surface px-4 py-3 text-callout text-text-primary"
        />
      </View>

      <View className="gap-2">
        <Text className="px-1 text-footnote uppercase text-text-tertiary">
          Contraseña
        </Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor={gray[400]}
          secureTextEntry
          autoCapitalize="none"
          className="rounded-xl border border-border bg-surface px-4 py-3 text-callout text-text-primary"
        />
      </View>

      {error ? (
        <View
          className="flex-row items-center gap-2 rounded-xl bg-[#F7E1E1] px-4 py-3"
          accessibilityRole="alert"
        >
          <Ionicons name="alert-circle" size={18} color={status.danger} />
          <Text className="flex-1 text-footnote" style={{ color: status.danger }}>
            {error}
          </Text>
        </View>
      ) : null}

      <Button
        title="Iniciar sesión"
        size="lg"
        onPress={() => void submit()}
        loading={loading}
        disabled={disabled}
      />

      <Pressable
        onPress={onDemo}
        accessibilityRole="button"
        accessibilityLabel="Explorar en modo demostración"
        hitSlop={12}
        className="items-center py-2 active:opacity-60"
      >
        <Text className="text-footnote text-text-tertiary">
          Explorar en modo demostración
        </Text>
      </Pressable>
    </View>
  );
}

function RoleCard({
  color,
  icon,
  title,
  subtitle,
  onPress,
}: {
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityLabel={title}
      accessibilityHint={subtitle}
      className="flex-row items-center gap-4 rounded-2xl border border-border bg-surface p-5"
    >
      <View
        className="h-12 w-12 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${color}1A` }}
      >
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-headline text-text-primary">{title}</Text>
        <Text className="text-subhead text-text-secondary">{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={color} />
    </PressableScale>
  );
}
