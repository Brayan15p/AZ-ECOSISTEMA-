/**
 * Capa de gamificación — diseñada con Octalysis en mente:
 *   - Accomplishment: niveles y badges desbloqueables.
 *   - Ownership: puntos persistentes + historial de logros.
 *   - Social Influence: ranking por barrio (lo provee el backend).
 *   - Scarcity: recompensas con cupo limitado por mes (campo `quotaRemaining`).
 *   - Loss Avoidance: racha que se rompe si pasa >36 h sin auditoría buena.
 *
 * Toda la lógica está en TypeScript puro, sin dependencias de RN ni web,
 * para que el frontend Y los Edge Functions de Supabase puedan llamarla.
 */

export type Level = "bronze" | "silver" | "gold" | "platinum";

export type LevelDef = {
  level: Level;
  label: string;
  minPoints: number;
  perks: string[];
};

export const LEVELS: readonly LevelDef[] = [
  { level: "bronze", label: "Bronce", minPoints: 0, perks: ["Recolección puntual"] },
  { level: "silver", label: "Plata", minPoints: 200, perks: ["5% descuento tarifa", "Bonos sorpresa"] },
  { level: "gold", label: "Oro", minPoints: 450, perks: ["10% descuento tarifa", "Acceso prioritario a campañas"] },
  { level: "platinum", label: "Platino", minPoints: 800, perks: ["15% descuento tarifa", "Sorteos exclusivos"] }
] as const;

export function levelForPoints(points: number): LevelDef {
  // LEVELS está ordenado asc; recorre al revés para encontrar el último alcanzado.
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    const def = LEVELS[i]!;
    if (points >= def.minPoints) return def;
  }
  return LEVELS[0]!;
}

export function nextLevel(points: number): LevelDef | null {
  const current = levelForPoints(points);
  const idx = LEVELS.findIndex((l) => l.level === current.level);
  return LEVELS[idx + 1] ?? null;
}

export function progressToNext(points: number): {
  current: LevelDef;
  next: LevelDef | null;
  pointsToNext: number;
  ratio: number;
} {
  const current = levelForPoints(points);
  const next = nextLevel(points);
  if (!next) {
    return { current, next: null, pointsToNext: 0, ratio: 1 };
  }
  const span = next.minPoints - current.minPoints;
  const earned = points - current.minPoints;
  const ratio = Math.max(0, Math.min(1, earned / span));
  return { current, next, pointsToNext: Math.max(0, next.minPoints - points), ratio };
}

// ── Badges ─────────────────────────────────────────────────────────
export type Badge = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockHint: string;
};

export const BADGES: readonly Badge[] = [
  {
    id: "first-audit",
    title: "Primera auditoría",
    description: "Tu hogar fue auditado por primera vez.",
    icon: "🌱",
    unlockHint: "Recibe tu primera visita del IRSU"
  },
  {
    id: "streak-7",
    title: "Racha de 7 días",
    description: "Siete auditorías consecutivas con puntaje ≥ 75.",
    icon: "🔥",
    unlockHint: "Mantén el cumplimiento una semana seguida"
  },
  {
    id: "zero-penalties-30",
    title: "Mes impecable",
    description: "Treinta días sin penalizaciones.",
    icon: "✨",
    unlockHint: "Cero penalizaciones por 30 días"
  },
  {
    id: "level-gold",
    title: "Nivel Oro",
    description: "Alcanzaste el nivel Oro.",
    icon: "🥇",
    unlockHint: "Acumula 450 puntos"
  },
  {
    id: "neighborhood-top-10",
    title: "Top 10 del barrio",
    description: "Tu hogar está en el top 10 de tu zona.",
    icon: "🏆",
    unlockHint: "Sube en el ranking semanal"
  }
] as const;

// ── Streak (racha) ─────────────────────────────────────────────────
// Una racha viva exige al menos una auditoría buena en las últimas 36 h.
const STREAK_GRACE_HOURS = 36;

export function isStreakAlive(lastGoodAuditAt: string | null, now: Date = new Date()): boolean {
  if (!lastGoodAuditAt) return false;
  const last = new Date(lastGoodAuditAt).getTime();
  return now.getTime() - last <= STREAK_GRACE_HOURS * 3600 * 1000;
}

// ── Cálculo de puntos por auditoría ────────────────────────────────
// La regla de negocio vive aquí (no en el componente UI) para que se
// pueda probar con jest y compartir con el backend.
export function pointsForAuditScore(score: number): number {
  if (score >= 95) return 25;
  if (score >= 90) return 18;
  if (score >= 80) return 12;
  if (score >= 70) return 6;
  if (score >= 60) return 2;
  return 0;
}
