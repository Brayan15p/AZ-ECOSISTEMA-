/**
 * Tipos de la base de datos.
 *
 * ⚠️ PLACEHOLDER — se regenera con:
 *   pnpm db:types
 *   (supabase gen types typescript --local > packages/supabase/src/database.types.ts)
 *
 * Hasta entonces queda abierto para no bloquear el desarrollo.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: Record<string, { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> }>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
