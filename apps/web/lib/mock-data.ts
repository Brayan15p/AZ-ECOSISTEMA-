import type { PayoutStatus } from "@az/core";

/**
 * Datos de ejemplo compartidos por las páginas del dashboard (maqueta,
 * sin conexión a Supabase todavía — ver plan de "ampliar dashboard").
 * Centralizados aquí para que Resumen/Recicladores/Rutas/Reportes usen
 * los mismos nombres y zonas y la demo se sienta como un solo sistema.
 */

export type Recycler = {
  id: string;
  name: string;
  zone: string;
  kgDay: number;
  formalized: boolean;
  active: boolean;
  bank?: string;
};

export const RECYCLERS: Recycler[] = [
  { id: "r1", name: "Carlos Mendoza", zone: "Comuna 15 · Aguablanca", kgDay: 320, formalized: true, active: true, bank: "Bancolombia" },
  { id: "r2", name: "Ana Robledo", zone: "Comuna 13 · El Vergel", kgDay: 260, formalized: true, active: true, bank: "Nequi" },
  { id: "r3", name: "Luis Patiño", zone: "Comuna 21 · Los Comuneros", kgDay: 230, formalized: false, active: true, bank: "Daviplata" },
  { id: "r4", name: "Marta Vega", zone: "Comuna 6 · Floralia", kgDay: 274, formalized: true, active: true, bank: "Bancolombia" },
  { id: "r5", name: "Jhon Ortiz", zone: "Comuna 15 · Aguablanca", kgDay: 190, formalized: false, active: false },
];

export type CollectionLog = {
  id: string;
  recyclerId: string;
  recyclerName: string;
  zone: string;
  date: string;
  kg: number;
};

export const COLLECTION_LOGS: CollectionLog[] = [
  { id: "c1", recyclerId: "r1", recyclerName: "Carlos Mendoza", zone: "Comuna 15 · Aguablanca", date: "2026-07-01", kg: 312 },
  { id: "c2", recyclerId: "r5", recyclerName: "Jhon Ortiz", zone: "Comuna 15 · Aguablanca", date: "2026-07-01", kg: 178 },
  { id: "c3", recyclerId: "r2", recyclerName: "Ana Robledo", zone: "Comuna 13 · El Vergel", date: "2026-07-01", kg: 255 },
  { id: "c4", recyclerId: "r4", recyclerName: "Marta Vega", zone: "Comuna 6 · Floralia", date: "2026-07-02", kg: 268 },
  { id: "c5", recyclerId: "r3", recyclerName: "Luis Patiño", zone: "Comuna 21 · Los Comuneros", date: "2026-07-02", kg: 221 },
  { id: "c6", recyclerId: "r1", recyclerName: "Carlos Mendoza", zone: "Comuna 15 · Aguablanca", date: "2026-07-02", kg: 305 },
  { id: "c7", recyclerId: "r2", recyclerName: "Ana Robledo", zone: "Comuna 13 · El Vergel", date: "2026-07-03", kg: 249 },
];

export type PayoutRow = {
  id: string;
  recycler: string;
  zone: string;
  period: string;
  kg: number;
  amountCop: number;
  status: PayoutStatus;
};

export const PAYOUTS: PayoutRow[] = [
  { id: "p1", recycler: "Carlos Mendoza", zone: "Comuna 15 · Aguablanca", period: "Jun 2026", kg: 8320, amountCop: 2912000, status: "paid" },
  { id: "p2", recycler: "Ana Robledo", zone: "Comuna 13 · El Vergel", period: "Jun 2026", kg: 6740, amountCop: 2359000, status: "paid" },
  { id: "p3", recycler: "Luis Patiño", zone: "Comuna 21 · Los Comuneros", period: "Jun 2026", kg: 5980, amountCop: 2093000, status: "pending" },
  { id: "p4", recycler: "Marta Vega", zone: "Comuna 6 · Floralia", period: "Jun 2026", kg: 7120, amountCop: 2492000, status: "pending" },
];

/** Agrega los registros de recolección por zona, normalizado 0-100 contra la zona con más kg. */
export function zoneAggregates(logs: CollectionLog[] = COLLECTION_LOGS) {
  const totals = new Map<string, number>();
  for (const log of logs) {
    totals.set(log.zone, (totals.get(log.zone) ?? 0) + log.kg);
  }
  const max = Math.max(1, ...totals.values());
  return [...totals.entries()]
    .map(([zone, kg]) => ({ zone, kg, rate: Math.round((kg / max) * 100) }))
    .sort((a, b) => b.kg - a.kg);
}

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", title: "Liquidación pagada", body: "Carlos Mendoza recibió $2.912.000 por junio.", createdAt: "Hace 2 h", read: false },
  { id: "n2", title: "Reciclador formalizado", body: "Ana Robledo completó su proceso de formalización.", createdAt: "Hace 5 h", read: false },
  { id: "n3", title: "Pago rechazado", body: "El pago de Luis Patiño fue rechazado por Bold — revisar referencia.", createdAt: "Ayer", read: false },
  { id: "n4", title: "Nueva recolección registrada", body: "268 kg en Comuna 6 · Floralia.", createdAt: "Ayer", read: true },
  { id: "n5", title: "Meta mensual", body: "La asociación superó los 8 t recuperadas este mes.", createdAt: "Hace 3 días", read: true },
];

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "admin_municipio" | "operador";
};

export const TEAM: TeamMember[] = [
  { id: "t1", name: "Diana Suárez", email: "diana@aire3r.example", role: "admin_municipio" },
  { id: "t2", name: "Fernando Ríos", email: "fernando@aire3r.example", role: "operador" },
  { id: "t3", name: "Paola Jiménez", email: "paola@aire3r.example", role: "operador" },
];

export const ROLE_LABELS: Record<TeamMember["role"], string> = {
  admin_municipio: "Administrador",
  operador: "Operador",
};

export type TenantSummary = {
  id: string;
  name: string;
  kind: "asociacion" | "municipio";
  location: string;
  members: number;
  kgMonth: number;
  liquidadoCop: number;
};

export const TENANTS: TenantSummary[] = [
  { id: "az-cali", name: "Asociación de recicladores · Cali", kind: "asociacion", location: "Cali, Valle del Cauca", members: 47, kgMonth: 8300, liquidadoCop: 9856000 },
  { id: "az-arauca", name: "Municipio de Arauca (futuro)", kind: "municipio", location: "Arauca, Arauca", members: 0, kgMonth: 0, liquidadoCop: 0 },
];
