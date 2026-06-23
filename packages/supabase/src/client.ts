/**
 * Fábrica de cliente Supabase, agnóstica de plataforma.
 * Cada app inyecta su URL/clave y su storage (AsyncStorage en Expo,
 * cookies en Next.js) para no acoplar este paquete a un runtime.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export type AzClient = SupabaseClient<Database>;

export interface CreateAzClientOptions {
  url: string;
  anonKey: string;
  /** Implementación de storage para la sesión (opcional en server). */
  storage?: {
    getItem: (key: string) => string | null | Promise<string | null>;
    setItem: (key: string, value: string) => void | Promise<void>;
    removeItem: (key: string) => void | Promise<void>;
  };
  /** false en server-side rendering. */
  persistSession?: boolean;
  detectSessionInUrl?: boolean;
}

export function createAzClient(opts: CreateAzClientOptions): AzClient {
  if (!opts.url || !opts.anonKey) {
    throw new Error(
      "createAzClient: faltan url/anonKey de Supabase. Revisa tus variables de entorno.",
    );
  }
  return createClient<Database>(opts.url, opts.anonKey, {
    auth: {
      storage: opts.storage,
      persistSession: opts.persistSession ?? true,
      autoRefreshToken: true,
      detectSessionInUrl: opts.detectSessionInUrl ?? false,
    },
  });
}
