import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { syncPushToken } from "@/lib/notifications";

export type AppRole = "operador" | "ciudadano" | null;

type SessionState = {
  session: Session | null;
  user: User | null;
  role: AppRole;
  loading: boolean;
  initialize: () => Promise<void>;
  setRole: (role: AppRole) => void;
  signOut: () => Promise<void>;
};

export const useSession = create<SessionState>((set) => ({
  session: null,
  user: null,
  role: null,
  loading: true,

  initialize: async () => {
    set({ loading: true });
    const { data } = await supabase.auth.getSession();
    set({ session: data.session, user: data.session?.user ?? null, loading: false });
    if (data.session?.user) syncPushToken(data.session.user.id).catch(() => {});

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
      if (session?.user) syncPushToken(session.user.id).catch(() => {});
    });
  },

  setRole: (role) => set({ role }),

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, role: null });
  }
}));
