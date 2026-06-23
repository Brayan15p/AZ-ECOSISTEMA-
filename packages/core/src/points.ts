/** Reglas de puntos y canje (marketplace de recompensas para ciudadanos). */
import type { CatalogItem, PointsEntry } from "./types";

/** Saldo de puntos a partir del libro mayor. */
export function pointsBalance(entries: PointsEntry[]): number {
  return entries.reduce((sum, e) => sum + e.delta, 0);
}

export type RedeemCheck =
  | { ok: true }
  | { ok: false; reason: "insufficient_points" | "out_of_stock" | "inactive" };

/** Valida si un hogar puede canjear un item del catálogo. */
export function canRedeem(item: CatalogItem, balance: number): RedeemCheck {
  if (!item.active) return { ok: false, reason: "inactive" };
  if (item.stock !== null && item.stock <= 0) return { ok: false, reason: "out_of_stock" };
  if (balance < item.costPoints) return { ok: false, reason: "insufficient_points" };
  return { ok: true };
}

/** Puntos que otorga un nivel de score al cierre de periodo (incentivo). */
export function periodBonusPoints(score: number): number {
  if (score >= 90) return 100;
  if (score >= 75) return 50;
  if (score >= 60) return 20;
  return 0;
}
