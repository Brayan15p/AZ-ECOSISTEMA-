export type Zone =
  | "Centro"
  | "Meridiano"
  | "El Bosque"
  | "Unión"
  | "San Luis"
  | "Norte";

export type Status = "Excelente" | "Cumple" | "Reentrenamiento" | "Incumplimiento";

export type Household = {
  id: string;
  ownerName: string;
  address: string;
  phone: string | null;
  zone: Zone;
  score: number;
  status: Status;
  points: number;
  penaltiesCount: number;
  rewardsCount: number;
  lastAuditAt: string | null;
  irsuId: string | null;
};

export type Publication = {
  id: string;
  title: string;
  body: string;
  category: "anuncio" | "campaña" | "educativo" | "alerta";
  authorId: string;
  imageUrl: string | null;
  videoUrl: string | null;
  publishedAt: string;
};

export type Reaction = {
  publicationId: string;
  userId: string;
  emoji: string;
};

export type Comment = {
  id: string;
  publicationId: string;
  userId: string;
  body: string;
  createdAt: string;
};

export type PenaltySeverity = "Leve" | "Moderada" | "Grave";

export type Recycler = {
  id: string;
  name: string;
  phone: string;
  zone: Zone;
  households: number;
  kgDay: number;
  status: "Activo" | "Inactivo";
  formalized: boolean;
};

export type Irsu = {
  id: string;
  name: string;
  zone: string;
  households: number;
  avgScore: number;
};

export type DailyProcessing = {
  date: string;
  organic: number;
  recyclable: number;
  energy: number;
  reject: number;
  total: number;
  purity: number;
};

export type Penalty = {
  id: string;
  householdId: string;
  date: string;
  type: string;
  description: string;
  severity: PenaltySeverity;
  resolved: boolean;
};

export type Reward = {
  id: string;
  householdId: string;
  date: string;
  type: string;
  description: string;
  points: number;
};

export type LogEntry = {
  id: string;
  timestamp: string;
  action: string;
  detail: string;
};

// ── Penalización → variación de puntaje ─────────────────────────
// Regla de negocio compartida (operador móvil + futuros Edge Functions).
export const PENALTY_SCORE_DELTA: Record<PenaltySeverity, number> = {
  Leve: -5,
  Moderada: -10,
  Grave: -15
};

export function scoreDeltaForPenalty(severity: PenaltySeverity): number {
  return PENALTY_SCORE_DELTA[severity];
}
