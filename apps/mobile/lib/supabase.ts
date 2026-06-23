/**
 * Cliente Supabase para la app móvil.
 * Reutiliza la fábrica agnóstica de @az/supabase, inyectando AsyncStorage
 * (persistencia de sesión nativa) y las variables EXPO_PUBLIC_*.
 *
 * Mientras no haya .env configurado, las pantallas usan datos mock (lib/mock.ts);
 * por eso el cliente se construye perezosamente y exponemos `isSupabaseConfigured`.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAzClient, type AzClient } from "@az/supabase";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(url && anonKey);

let client: AzClient | null = null;

export function getSupabase(): AzClient {
  if (!client) {
    client = createAzClient({
      url,
      anonKey,
      storage: AsyncStorage,
      persistSession: true,
      detectSessionInUrl: false,
    });
  }
  return client;
}
