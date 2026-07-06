/**
 * Tipos de la base de datos AZ Ecosistema.
 *
 * Generado a partir de las migraciones:
 *   - 20260619000001_init.sql
 *   - 20260619000002_rls.sql
 *   - 20260628000001_security_p0.sql
 *   - 20260705000001_collection_log_and_payout_requests.sql
 *
 * Para regenerar contra una BD real:
 *   pnpm db:types   (supabase gen types typescript --local)
 *
 * Si editas el esquema, vuelve a regenerar para mantener este archivo en sync.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          name: string;
          slug: string;
          department: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          department?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          department?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          tenant_id: string | null;
          role: Database["public"]["Enums"]["role_t"];
          full_name: string | null;
          phone: string | null;
          household_id: string | null;
          recycler_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          tenant_id?: string | null;
          role?: Database["public"]["Enums"]["role_t"];
          full_name?: string | null;
          phone?: string | null;
          household_id?: string | null;
          recycler_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string | null;
          role?: Database["public"]["Enums"]["role_t"];
          full_name?: string | null;
          phone?: string | null;
          household_id?: string | null;
          recycler_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "profiles_tenant_id_fkey"; columns: ["tenant_id"]; referencedRelation: "tenants"; referencedColumns: ["id"] },
          { foreignKeyName: "profiles_household_fk"; columns: ["household_id"]; referencedRelation: "households"; referencedColumns: ["id"] },
          { foreignKeyName: "profiles_recycler_fk"; columns: ["recycler_id"]; referencedRelation: "recyclers"; referencedColumns: ["id"] },
        ];
      };
      irsus: {
        Row: {
          id: string;
          tenant_id: string;
          code: string | null;
          name: string;
          zone: string;
          households_count: number;
          avg_score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          code?: string | null;
          name: string;
          zone: string;
          households_count?: number;
          avg_score?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          code?: string | null;
          name?: string;
          zone?: string;
          households_count?: number;
          avg_score?: number;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "irsus_tenant_id_fkey"; columns: ["tenant_id"]; referencedRelation: "tenants"; referencedColumns: ["id"] },
        ];
      };
      households: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string | null;
          code: string | null;
          owner: string;
          address: string;
          phone: string | null;
          zone: string;
          score: number;
          points: number;
          irsu_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          user_id?: string | null;
          code?: string | null;
          owner: string;
          address: string;
          phone?: string | null;
          zone: string;
          score?: number;
          points?: number;
          irsu_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          user_id?: string | null;
          code?: string | null;
          owner?: string;
          address?: string;
          phone?: string | null;
          zone?: string;
          score?: number;
          points?: number;
          irsu_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "households_tenant_id_fkey"; columns: ["tenant_id"]; referencedRelation: "tenants"; referencedColumns: ["id"] },
          { foreignKeyName: "households_irsu_id_fkey"; columns: ["irsu_id"]; referencedRelation: "irsus"; referencedColumns: ["id"] },
        ];
      };
      recyclers: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string | null;
          code: string | null;
          name: string;
          phone: string | null;
          zone: string;
          households_count: number;
          kg_day: number;
          formalized: boolean;
          active: boolean;
          bank_name: string | null;
          bank_account: string | null;
          bank_account_type: Database["public"]["Enums"]["account_type"] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          user_id?: string | null;
          code?: string | null;
          name: string;
          phone?: string | null;
          zone: string;
          households_count?: number;
          kg_day?: number;
          formalized?: boolean;
          active?: boolean;
          bank_name?: string | null;
          bank_account?: string | null;
          bank_account_type?: Database["public"]["Enums"]["account_type"] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          user_id?: string | null;
          code?: string | null;
          name?: string;
          phone?: string | null;
          zone?: string;
          households_count?: number;
          kg_day?: number;
          formalized?: boolean;
          active?: boolean;
          bank_name?: string | null;
          bank_account?: string | null;
          bank_account_type?: Database["public"]["Enums"]["account_type"] | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "recyclers_tenant_id_fkey"; columns: ["tenant_id"]; referencedRelation: "tenants"; referencedColumns: ["id"] },
        ];
      };
      daily_data: {
        Row: {
          id: string;
          tenant_id: string;
          date: string;
          organic: number;
          recyclable: number;
          energy: number;
          reject: number;
          purity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          date: string;
          organic?: number;
          recyclable?: number;
          energy?: number;
          reject?: number;
          purity?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          date?: string;
          organic?: number;
          recyclable?: number;
          energy?: number;
          reject?: number;
          purity?: number;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "daily_data_tenant_id_fkey"; columns: ["tenant_id"]; referencedRelation: "tenants"; referencedColumns: ["id"] },
        ];
      };
      score_events: {
        Row: {
          id: string;
          tenant_id: string;
          household_id: string;
          old_score: number | null;
          new_score: number;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          household_id: string;
          old_score?: number | null;
          new_score: number;
          reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          household_id?: string;
          old_score?: number | null;
          new_score?: number;
          reason?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "score_events_household_id_fkey"; columns: ["household_id"]; referencedRelation: "households"; referencedColumns: ["id"] },
        ];
      };
      penalties: {
        Row: {
          id: string;
          tenant_id: string;
          household_id: string;
          date: string;
          type: string;
          description: string;
          severity: Database["public"]["Enums"]["penalty_severity"];
          resolved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          household_id: string;
          date?: string;
          type: string;
          description: string;
          severity: Database["public"]["Enums"]["penalty_severity"];
          resolved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          household_id?: string;
          date?: string;
          type?: string;
          description?: string;
          severity?: Database["public"]["Enums"]["penalty_severity"];
          resolved?: boolean;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "penalties_household_id_fkey"; columns: ["household_id"]; referencedRelation: "households"; referencedColumns: ["id"] },
        ];
      };
      rewards: {
        Row: {
          id: string;
          tenant_id: string;
          household_id: string;
          date: string;
          type: string;
          description: string;
          points: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          household_id: string;
          date?: string;
          type: string;
          description: string;
          points?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          household_id?: string;
          date?: string;
          type?: string;
          description?: string;
          points?: number;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "rewards_household_id_fkey"; columns: ["household_id"]; referencedRelation: "households"; referencedColumns: ["id"] },
        ];
      };
      publications: {
        Row: {
          id: string;
          tenant_id: string;
          author_id: string | null;
          title: string;
          body: string;
          media_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          author_id?: string | null;
          title: string;
          body: string;
          media_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          author_id?: string | null;
          title?: string;
          body?: string;
          media_url?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "publications_tenant_id_fkey"; columns: ["tenant_id"]; referencedRelation: "tenants"; referencedColumns: ["id"] },
        ];
      };
      reactions: {
        Row: {
          id: string;
          tenant_id: string;
          publication_id: string;
          profile_id: string;
          emoji: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          publication_id: string;
          profile_id: string;
          emoji: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          publication_id?: string;
          profile_id?: string;
          emoji?: string;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "reactions_publication_id_fkey"; columns: ["publication_id"]; referencedRelation: "publications"; referencedColumns: ["id"] },
          { foreignKeyName: "reactions_profile_id_fkey"; columns: ["profile_id"]; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      comments: {
        Row: {
          id: string;
          tenant_id: string;
          publication_id: string;
          profile_id: string | null;
          author_name: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          publication_id: string;
          profile_id?: string | null;
          author_name: string;
          body: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          publication_id?: string;
          profile_id?: string | null;
          author_name?: string;
          body?: string;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "comments_publication_id_fkey"; columns: ["publication_id"]; referencedRelation: "publications"; referencedColumns: ["id"] },
        ];
      };
      points_ledger: {
        Row: {
          id: string;
          tenant_id: string;
          household_id: string;
          delta: number;
          reason: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          household_id: string;
          delta: number;
          reason: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          household_id?: string;
          delta?: number;
          reason?: string;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "points_ledger_household_id_fkey"; columns: ["household_id"]; referencedRelation: "households"; referencedColumns: ["id"] },
        ];
      };
      catalog_items: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          description: string;
          cost_points: number;
          price_cop: number;
          stock: number | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          description?: string;
          cost_points?: number;
          price_cop?: number;
          stock?: number | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          description?: string;
          cost_points?: number;
          price_cop?: number;
          stock?: number | null;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "catalog_items_tenant_id_fkey"; columns: ["tenant_id"]; referencedRelation: "tenants"; referencedColumns: ["id"] },
        ];
      };
      redemptions: {
        Row: {
          id: string;
          tenant_id: string;
          household_id: string;
          catalog_item_id: string;
          cost_points: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          household_id: string;
          catalog_item_id: string;
          cost_points: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          household_id?: string;
          catalog_item_id?: string;
          cost_points?: number;
          status?: string;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "redemptions_household_id_fkey"; columns: ["household_id"]; referencedRelation: "households"; referencedColumns: ["id"] },
          { foreignKeyName: "redemptions_catalog_item_id_fkey"; columns: ["catalog_item_id"]; referencedRelation: "catalog_items"; referencedColumns: ["id"] },
        ];
      };
      subscriptions: {
        Row: {
          id: string;
          tenant_id: string;
          plan: string;
          status: Database["public"]["Enums"]["subscription_status"];
          bold_reference: string | null;
          current_period_end: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          plan?: string;
          status?: Database["public"]["Enums"]["subscription_status"];
          bold_reference?: string | null;
          current_period_end?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          plan?: string;
          status?: Database["public"]["Enums"]["subscription_status"];
          bold_reference?: string | null;
          current_period_end?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "subscriptions_tenant_id_fkey"; columns: ["tenant_id"]; referencedRelation: "tenants"; referencedColumns: ["id"] },
        ];
      };
      payments: {
        Row: {
          id: string;
          tenant_id: string;
          profile_id: string | null;
          kind: string;
          amount_cop: number;
          status: Database["public"]["Enums"]["payment_status"];
          bold_reference: string | null;
          raw: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          profile_id?: string | null;
          kind?: string;
          amount_cop: number;
          status?: Database["public"]["Enums"]["payment_status"];
          bold_reference?: string | null;
          raw?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          profile_id?: string | null;
          kind?: string;
          amount_cop?: number;
          status?: Database["public"]["Enums"]["payment_status"];
          bold_reference?: string | null;
          raw?: Json | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "payments_tenant_id_fkey"; columns: ["tenant_id"]; referencedRelation: "tenants"; referencedColumns: ["id"] },
          { foreignKeyName: "payments_profile_id_fkey"; columns: ["profile_id"]; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      payouts: {
        Row: {
          id: string;
          tenant_id: string;
          recycler_id: string;
          period_start: string;
          period_end: string;
          kg: number;
          amount_cop: number;
          status: Database["public"]["Enums"]["payout_status"];
          batch_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          recycler_id: string;
          period_start: string;
          period_end: string;
          kg?: number;
          amount_cop?: number;
          status?: Database["public"]["Enums"]["payout_status"];
          batch_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          recycler_id?: string;
          period_start?: string;
          period_end?: string;
          kg?: number;
          amount_cop?: number;
          status?: Database["public"]["Enums"]["payout_status"];
          batch_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "payouts_tenant_id_fkey"; columns: ["tenant_id"]; referencedRelation: "tenants"; referencedColumns: ["id"] },
          { foreignKeyName: "payouts_recycler_id_fkey"; columns: ["recycler_id"]; referencedRelation: "recyclers"; referencedColumns: ["id"] },
        ];
      };
      collection_log: {
        Row: {
          id: string;
          tenant_id: string;
          recycler_id: string;
          household_id: string;
          kg: number;
          collected_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          recycler_id: string;
          household_id: string;
          kg: number;
          collected_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          recycler_id?: string;
          household_id?: string;
          kg?: number;
          collected_at?: string;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "collection_log_recycler_id_fkey"; columns: ["recycler_id"]; referencedRelation: "recyclers"; referencedColumns: ["id"] },
          { foreignKeyName: "collection_log_household_id_fkey"; columns: ["household_id"]; referencedRelation: "households"; referencedColumns: ["id"] },
        ];
      };
    };
    Views: Record<never, never>;
    Functions: {
      redeem_catalog_item: {
        Args: { p_catalog_item_id: string };
        Returns: Database["public"]["Tables"]["redemptions"]["Row"];
      };
      log_collection: {
        Args: { p_household_id: string; p_kg: number };
        Returns: Database["public"]["Tables"]["collection_log"]["Row"];
      };
      request_payout: {
        Args: Record<string, never>;
        Returns: Database["public"]["Tables"]["payouts"]["Row"];
      };
    };
    Enums: {
      role_t: "ciudadano" | "reciclador" | "operador" | "admin_municipio" | "super_admin";
      penalty_severity: "leve" | "moderada" | "grave";
      account_type: "ahorros" | "corriente";
      subscription_status: "trialing" | "active" | "past_due" | "canceled";
      payment_status: "pending" | "approved" | "rejected" | "refunded";
      payout_status: "pending" | "processing" | "paid" | "failed";
      waste_stream: "organic" | "recyclable" | "energy" | "reject";
    };
    CompositeTypes: Record<never, never>;
  };
}

// ── Helpers de conveniencia (estilo supabase gen types) ──────────────
type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];
export type Enums<T extends keyof PublicSchema["Enums"]> =
  PublicSchema["Enums"][T];
