/**
 * Modelo de dominio de AZ Ecosistema.
 * Estos tipos reflejan el esquema de la base de datos (ver supabase/migrations)
 * y son la forma canónica que comparten móvil y web.
 */

export type Role =
  | "ciudadano"
  | "reciclador"
  | "operador"
  | "admin_municipio"
  | "super_admin";

export type ScoreLevel =
  | "excelente"
  | "cumple"
  | "reentrenamiento"
  | "incumplimiento";

export type PenaltySeverity = "leve" | "moderada" | "grave";

export type WasteStream = "organic" | "recyclable" | "energy" | "reject";

/** Municipio = tenant (cliente SaaS). */
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  department: string;
  createdAt: string;
}

export interface Profile {
  id: string; // = auth.users.id
  tenantId: string;
  role: Role;
  fullName: string | null;
  phone: string | null;
  householdId: string | null;
  recyclerId: string | null;
}

export interface Household {
  id: string;
  tenantId: string;
  userId: string | null;
  owner: string;
  address: string;
  phone: string | null;
  zone: string;
  score: number; // 0–100
  points: number;
  irsuId: string | null;
  createdAt: string;
}

export interface Recycler {
  id: string;
  tenantId: string;
  userId: string | null;
  name: string;
  phone: string | null;
  zone: string;
  householdsCount: number;
  kgDay: number;
  formalized: boolean;
  active: boolean;
  // datos para liquidación (payout)
  bankName: string | null;
  bankAccount: string | null;
  bankAccountType: "ahorros" | "corriente" | null;
}

export interface Irsu {
  id: string;
  tenantId: string;
  name: string;
  zone: string;
  householdsCount: number;
  avgScore: number;
}

/** Balance de masas de un día (toneladas). */
export interface DailyData {
  id: string;
  tenantId: string;
  date: string; // YYYY-MM-DD
  organic: number;
  recyclable: number;
  energy: number;
  reject: number;
  purity: number; // 0–100
}

export interface Penalty {
  id: string;
  tenantId: string;
  householdId: string;
  date: string;
  type: string;
  description: string;
  severity: PenaltySeverity;
  resolved: boolean;
}

export interface Reward {
  id: string;
  tenantId: string;
  householdId: string;
  date: string;
  type: string;
  description: string;
  points: number;
}

export interface Publication {
  id: string;
  tenantId: string;
  authorId: string | null;
  title: string;
  body: string;
  mediaUrl: string | null;
  createdAt: string;
  reactions: Record<string, number>; // emoji -> count
  comments: PublicationComment[];
}

export interface PublicationComment {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

/** Entrada del libro mayor de puntos. */
export interface PointsEntry {
  id: string;
  tenantId: string;
  householdId: string;
  delta: number; // + ganados, - canjeados
  reason: string;
  createdAt: string;
}

export interface CatalogItem {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  costPoints: number;
  priceCop: number; // 0 si es 100% por puntos
  stock: number | null; // null = ilimitado
  active: boolean;
}

export type PayoutStatus = "pending" | "processing" | "paid" | "failed";

/** Liquidación a un reciclador por un periodo (kg recolectados → COP). */
export interface Payout {
  id: string;
  tenantId: string;
  recyclerId: string;
  periodStart: string; // YYYY-MM-DD
  periodEnd: string; // YYYY-MM-DD
  kg: number;
  amountCop: number;
  status: PayoutStatus;
  createdAt: string;
}

export type RouteStopStatus = "pending" | "collected" | "skipped";

/** Parada de la ruta de recolección de un reciclador (la vista de un hogar). */
export interface RouteStop {
  id: string; // = household id
  owner: string;
  address: string;
  zone: string;
  score: number;
  status: RouteStopStatus;
  kg: number | null; // recolectado hoy (solo demo, aún sin tabla de bitácora)
}
