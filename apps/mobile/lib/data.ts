/**
 * Capa de acceso a datos de la app móvil.
 *
 * Cada hook devuelve `{ data, loading, error, reload }`. Si hay sesión real de
 * Supabase (`isRemote`) consulta la base; si estamos en modo demo, resuelve con
 * los datos de `lib/mock`. Así las pantallas no saben (ni les importa) de dónde
 * vienen los datos: cuando conectes el .env, dejan de ser mock solas.
 */
import type {
  CatalogItem,
  Household,
  Payout,
  PayoutStatus,
  Penalty,
  PointsEntry,
  Recycler,
  Reward,
  RouteStop,
} from "@az/core";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "./auth";
import * as mock from "./mock";
import { getSupabase } from "./supabase";

export interface AsyncResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Ejecuta `fetcher` (o devuelve `fallback` si es null). El `fetcher` debe venir
 * memoizado por quien llama; cuando cambia, se vuelve a cargar.
 */
function useAsyncData<T>(
  fallback: T,
  fetcher: (() => Promise<T>) | null,
): AsyncResult<T> {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState<boolean>(fetcher != null);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!fetcher) {
      setData(fallback);
      setLoading(false);
      setError(null);
      return;
    }
    let active = true;
    setLoading(true);
    fetcher()
      .then((result) => {
        if (active) {
          setData(result);
          setError(null);
        }
      })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // `fallback` es estable (mock/módulo); solo reaccionamos a fetcher/nonce.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { data, loading, error, reload };
}

// ── Mapeadores fila (snake_case) → dominio (camelCase) ──────────
const str = (v: unknown): string => (v == null ? "" : String(v));
const strN = (v: unknown): string | null => (v == null ? null : String(v));
const num = (v: unknown): number => Number(v ?? 0);
const bool = (v: unknown): boolean => Boolean(v);

type Row = Record<string, unknown>;

function mapHousehold(r: Row): Household {
  return {
    id: str(r.id),
    tenantId: str(r.tenant_id),
    userId: strN(r.user_id),
    owner: str(r.owner),
    address: str(r.address),
    phone: strN(r.phone),
    zone: str(r.zone),
    score: num(r.score),
    points: num(r.points),
    irsuId: strN(r.irsu_id),
    createdAt: str(r.created_at),
  };
}

function mapRecycler(r: Row): Recycler {
  return {
    id: str(r.id),
    tenantId: str(r.tenant_id),
    userId: strN(r.user_id),
    name: str(r.name),
    phone: strN(r.phone),
    zone: str(r.zone),
    householdsCount: num(r.households_count),
    kgDay: num(r.kg_day),
    formalized: bool(r.formalized),
    active: bool(r.active),
    bankName: strN(r.bank_name),
    bankAccount: strN(r.bank_account),
    bankAccountType: (r.bank_account_type as Recycler["bankAccountType"]) ?? null,
  };
}

function mapPointsEntry(r: Row): PointsEntry {
  return {
    id: str(r.id),
    tenantId: str(r.tenant_id),
    householdId: str(r.household_id),
    delta: num(r.delta),
    reason: str(r.reason),
    createdAt: str(r.created_at),
  };
}

function mapReward(r: Row): Reward {
  return {
    id: str(r.id),
    tenantId: str(r.tenant_id),
    householdId: str(r.household_id),
    date: str(r.date),
    type: str(r.type),
    description: str(r.description),
    points: num(r.points),
  };
}

function mapPenalty(r: Row): Penalty {
  return {
    id: str(r.id),
    tenantId: str(r.tenant_id),
    householdId: str(r.household_id),
    date: str(r.date),
    type: str(r.type),
    description: str(r.description),
    severity: (r.severity as Penalty["severity"]) ?? "leve",
    resolved: bool(r.resolved),
  };
}

function mapCatalogItem(r: Row): CatalogItem {
  return {
    id: str(r.id),
    tenantId: str(r.tenant_id),
    name: str(r.name),
    description: str(r.description),
    costPoints: num(r.cost_points),
    priceCop: num(r.price_cop),
    stock: r.stock == null ? null : num(r.stock),
    active: bool(r.active),
  };
}

function mapPayout(r: Row): Payout {
  return {
    id: str(r.id),
    tenantId: str(r.tenant_id),
    recyclerId: str(r.recycler_id),
    periodStart: str(r.period_start),
    periodEnd: str(r.period_end),
    kg: num(r.kg),
    amountCop: num(r.amount_cop),
    status: (r.status as PayoutStatus) ?? "pending",
    createdAt: str(r.created_at),
  };
}

function mapRouteStop(r: Row): RouteStop {
  return {
    id: str(r.id),
    owner: str(r.owner),
    address: str(r.address),
    zone: str(r.zone),
    score: num(r.score),
    status: "pending", // aún no hay bitácora de recolección en BD
    kg: null,
  };
}

// ── Hooks de dominio ────────────────────────────────────────────

export function useHousehold(): AsyncResult<Household | null> {
  const { isRemote, profile } = useAuth();
  const householdId = profile?.householdId ?? null;
  const fetcher = useMemo(() => {
    if (!isRemote || !householdId) return null;
    return async () => {
      const { data, error } = await getSupabase()
        .from("households")
        .select("*")
        .eq("id", householdId)
        .single();
      if (error) throw error;
      return data ? mapHousehold(data) : null;
    };
  }, [isRemote, householdId]);
  return useAsyncData<Household | null>(mock.mockHousehold, fetcher);
}

export function usePointsLedger(): AsyncResult<PointsEntry[]> {
  const { isRemote, profile } = useAuth();
  const householdId = profile?.householdId ?? null;
  const fetcher = useMemo(() => {
    if (!isRemote || !householdId) return null;
    return async () => {
      const { data, error } = await getSupabase()
        .from("points_ledger")
        .select("*")
        .eq("household_id", householdId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapPointsEntry);
    };
  }, [isRemote, householdId]);
  return useAsyncData<PointsEntry[]>(mock.mockPointsLedger, fetcher);
}

export function useRewards(): AsyncResult<Reward[]> {
  const { isRemote, profile } = useAuth();
  const householdId = profile?.householdId ?? null;
  const fetcher = useMemo(() => {
    if (!isRemote || !householdId) return null;
    return async () => {
      const { data, error } = await getSupabase()
        .from("rewards")
        .select("*")
        .eq("household_id", householdId)
        .order("date", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapReward);
    };
  }, [isRemote, householdId]);
  return useAsyncData<Reward[]>(mock.mockRewards, fetcher);
}

export function usePenalties(): AsyncResult<Penalty[]> {
  const { isRemote, profile } = useAuth();
  const householdId = profile?.householdId ?? null;
  const fetcher = useMemo(() => {
    if (!isRemote || !householdId) return null;
    return async () => {
      const { data, error } = await getSupabase()
        .from("penalties")
        .select("*")
        .eq("household_id", householdId)
        .order("date", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapPenalty);
    };
  }, [isRemote, householdId]);
  return useAsyncData<Penalty[]>(mock.mockPenalties, fetcher);
}

export function useCatalog(): AsyncResult<CatalogItem[]> {
  const { isRemote, profile } = useAuth();
  const tenantId = profile?.tenantId ?? null;
  const fetcher = useMemo(() => {
    if (!isRemote || !tenantId) return null;
    return async () => {
      const { data, error } = await getSupabase()
        .from("catalog_items")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("cost_points", { ascending: true });
      if (error) throw error;
      return (data ?? []).map(mapCatalogItem);
    };
  }, [isRemote, tenantId]);
  return useAsyncData<CatalogItem[]>(mock.mockCatalog, fetcher);
}

export function useRecycler(): AsyncResult<Recycler | null> {
  const { isRemote, profile } = useAuth();
  const recyclerId = profile?.recyclerId ?? null;
  const fetcher = useMemo(() => {
    if (!isRemote || !recyclerId) return null;
    return async () => {
      const { data, error } = await getSupabase()
        .from("recyclers")
        .select("*")
        .eq("id", recyclerId)
        .single();
      if (error) throw error;
      return data ? mapRecycler(data) : null;
    };
  }, [isRemote, recyclerId]);
  return useAsyncData<Recycler | null>(mock.mockRecycler, fetcher);
}

export function useRoute(zone: string | null): AsyncResult<RouteStop[]> {
  const { isRemote, profile } = useAuth();
  const tenantId = profile?.tenantId ?? null;
  const fetcher = useMemo(() => {
    if (!isRemote || !tenantId || !zone) return null;
    return async () => {
      const { data, error } = await getSupabase()
        .from("households")
        .select("*")
        .eq("tenant_id", tenantId)
        .eq("zone", zone)
        .order("owner", { ascending: true });
      if (error) throw error;
      return (data ?? []).map(mapRouteStop);
    };
  }, [isRemote, tenantId, zone]);
  return useAsyncData<RouteStop[]>(mock.mockRoute, fetcher);
}

export function usePayouts(): AsyncResult<Payout[]> {
  const { isRemote, profile } = useAuth();
  const recyclerId = profile?.recyclerId ?? null;
  const fetcher = useMemo(() => {
    if (!isRemote || !recyclerId) return null;
    return async () => {
      const { data, error } = await getSupabase()
        .from("payouts")
        .select("*")
        .eq("recycler_id", recyclerId)
        .order("period_end", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapPayout);
    };
  }, [isRemote, recyclerId]);
  return useAsyncData<Payout[]>(mock.mockPayouts, fetcher);
}
