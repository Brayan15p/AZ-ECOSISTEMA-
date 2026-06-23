/** Reglas y formato de liquidaciones (payouts) a recicladores. */
import { status } from "@az/ui-tokens";
import type { Payout, PayoutStatus } from "./types";

/** Tarifa demo por kg recolectado (luego viene de la config del municipio). */
export const COP_PER_KG = 350;

/** Días hábiles de recolección usados para estimar el mes. */
export const WORKING_DAYS = 26;

const LABELS: Record<PayoutStatus, string> = {
  pending: "Pendiente",
  processing: "En proceso",
  paid: "Pagada",
  failed: "Fallida",
};

export function payoutStatusLabel(s: PayoutStatus): string {
  return LABELS[s];
}

const COLORS: Record<PayoutStatus, string> = {
  pending: status.warning,
  processing: status.info,
  paid: status.success,
  failed: status.danger,
};

export function payoutStatusColor(s: PayoutStatus): string {
  return COLORS[s];
}

/** Estima la liquidación de un periodo a partir de los kg recolectados. */
export function estimatePayout(kg: number, copPerKg: number = COP_PER_KG): number {
  return Math.round(kg * copPerKg);
}

/** Estima la liquidación mensual a partir del promedio diario de kg. */
export function estimateMonthlyPayout(
  kgDay: number,
  workingDays: number = WORKING_DAYS,
  copPerKg: number = COP_PER_KG,
): number {
  return estimatePayout(kgDay * workingDays, copPerKg);
}

/** Total ya liquidado (suma de payouts en estado 'paid'). */
export function totalPaid(payouts: Payout[]): number {
  return payouts
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amountCop, 0);
}
