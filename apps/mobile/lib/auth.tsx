/**
 * Estado de autenticación de la app.
 *
 * Dos modos conviven sin fricción:
 *  - **Supabase real**: cuando hay EXPO_PUBLIC_SUPABASE_* (`isSupabaseConfigured`).
 *    Se usa email/clave y se carga el `profile` del usuario.
 *  - **Demo**: cuando no hay .env. Se elige un rol y se arma un perfil ficticio
 *    apuntando a los datos mock, para poder recorrer la app sin backend.
 */
import type { Profile, Role } from "@az/core";
import type { Session } from "@az/supabase";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { mockHousehold, mockRecycler } from "./mock";
import { getSupabase, isSupabaseConfigured } from "./supabase";

const TENANT = "arauca";

export interface AuthValue {
  /** Terminó la comprobación inicial de sesión. */
  ready: boolean;
  session: Session | null;
  profile: Profile | null;
  role: Role | null;
  /** true si estamos en modo demo (sin Supabase configurado). */
  demo: boolean;
  /** true si debemos leer/escribir contra Supabase de verdad. */
  isRemote: boolean;
  signInWithPassword: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  /** Acceso de demostración: arma un perfil ficticio para el rol elegido. */
  signInAsRole: (role: Role) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

/** Perfil ficticio para el modo demo, ligado a los datos mock. */
function demoProfile(role: Role): Profile {
  return {
    id: role === "reciclador" ? mockRecycler.userId ?? "user-002" : "user-001",
    tenantId: TENANT,
    role,
    fullName: role === "reciclador" ? mockRecycler.name : mockHousehold.owner,
    phone: role === "reciclador" ? mockRecycler.phone : mockHousehold.phone,
    householdId: role === "ciudadano" ? mockHousehold.id : null,
    recyclerId: role === "reciclador" ? mockRecycler.id : null,
  };
}

function mapProfile(row: Record<string, unknown>): Profile {
  const s = (v: unknown): string | null => (v == null ? null : String(v));
  return {
    id: String(row.id),
    tenantId: String(row.tenant_id ?? ""),
    role: (row.role as Role) ?? "ciudadano",
    fullName: s(row.full_name),
    phone: s(row.phone),
    householdId: s(row.household_id),
    recyclerId: s(row.recycler_id),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Carga el perfil del usuario autenticado (solo modo remoto).
  const loadProfile = useCallback(async (userId: string) => {
    const { data, error } = await getSupabase()
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (!error && data) setProfile(mapProfile(data));
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Modo demo: no hay sesión hasta que se elija un rol.
      setReady(true);
      return;
    }
    const sb = getSupabase();
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) void loadProfile(data.session.user.id);
      setReady(true);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      if (next) void loadProfile(next.user.id);
      else setProfile(null);
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      const { error } = await getSupabase().auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      return { error: error ? error.message : null };
    },
    [],
  );

  const signInAsRole = useCallback((role: Role) => {
    setProfile(demoProfile(role));
  }, []);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) await getSupabase().auth.signOut();
    setSession(null);
    setProfile(null);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      ready,
      session,
      profile,
      role: profile?.role ?? null,
      demo: !isSupabaseConfigured,
      isRemote: isSupabaseConfigured && session != null,
      signInWithPassword,
      signInAsRole,
      signOut,
    }),
    [ready, session, profile, signInWithPassword, signInAsRole, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
