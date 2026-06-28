/**
 * Capa de gamificación de AZ Ecosistema.
 * ---------------------------------------
 * Funciones PURAS (sin estado, sin I/O) que convierten la actividad de un
 * hogar en niveles, rachas, impacto ambiental e insignias. Las comparten
 * móvil y web; la UI solo pinta lo que estas funciones devuelven.
 *
 * Filosofía de producto: separar bien los residuos debe *sentirse* como
 * subir de nivel. Los puntos acumulados (XP) cuentan la historia.
 */
import { eco, lime, teal, sky, violet, amber, coral } from "@az/ui-tokens";

// ── Niveles (XP = total de puntos GANADOS en la vida, no el saldo) ──────────

export interface EcoLevel {
  index: number;
  /** Umbral de XP para alcanzar este nivel. */
  floor: number;
  title: string;
  /** Frase corta motivacional. */
  tagline: string;
  /** Color de marca del nivel (hex). */
  color: string;
  /** Icono Ionicons sugerido. */
  icon: string;
}

/** Escala de niveles con tema "de brote a guardián del bosque". */
export const ECO_LEVELS: readonly EcoLevel[] = [
  { index: 0, floor: 0, title: "Brote", tagline: "Acabas de germinar", color: lime[500], icon: "leaf-outline" },
  { index: 1, floor: 250, title: "Semilla", tagline: "Echando raíces", color: lime[600], icon: "leaf" },
  { index: 2, floor: 600, title: "Retoño", tagline: "Creces firme", color: eco[500], icon: "flower-outline" },
  { index: 3, floor: 1200, title: "Raíz", tagline: "Bien plantado", color: eco[600], icon: "git-branch-outline" },
  { index: 4, floor: 2200, title: "Árbol", tagline: "Das sombra al barrio", color: teal[600], icon: "git-network-outline" },
  { index: 5, floor: 3800, title: "Bosque", tagline: "Inspiras a otros", color: sky[600], icon: "earth" },
  { index: 6, floor: 6000, title: "Guardián", tagline: "Cuidas Arauca", color: violet[600], icon: "shield-checkmark" },
  { index: 7, floor: 9000, title: "Leyenda Verde", tagline: "Eco-leyenda viva", color: amber[600], icon: "trophy" },
] as const;

export interface LevelProgress {
  level: EcoLevel;
  next: EcoLevel | null;
  /** XP dentro del nivel actual. */
  into: number;
  /** XP que abarca el nivel actual (Infinity si es el último). */
  span: number;
  /** Progreso 0..1 hacia el siguiente nivel. */
  progress: number;
  /** XP que faltan para subir (0 si es máximo). */
  toNext: number;
  /** true si está en el nivel máximo. */
  maxed: boolean;
}

/** Calcula el nivel y el avance hacia el siguiente a partir del XP total. */
export function levelFromXp(xp: number): LevelProgress {
  const safeXp = Math.max(0, Math.floor(xp || 0));
  let level = ECO_LEVELS[0];
  for (const l of ECO_LEVELS) if (safeXp >= l.floor) level = l;
  const next = ECO_LEVELS[level.index + 1] ?? null;
  const into = safeXp - level.floor;
  const span = next ? next.floor - level.floor : Infinity;
  const progress = next ? Math.min(1, into / span) : 1;
  const toNext = next ? Math.max(0, next.floor - safeXp) : 0;
  return { level, next, into, span, progress, toNext, maxed: next === null };
}

// ── Racha (días consecutivos con actividad que suma puntos) ─────────────────

const DAY_MS = 86_400_000;
const dayKey = (iso: string): number => Math.floor(new Date(`${iso}T00:00:00`).getTime() / DAY_MS);

/**
 * Días consecutivos de actividad terminando hoy (o ayer, para no “romper” la
 * racha antes de la actividad del día). `dates` son fechas YYYY-MM-DD.
 */
export function streakDays(dates: string[], today = new Date()): number {
  if (dates.length === 0) return 0;
  const set = new Set(dates.map(dayKey).filter((n) => !Number.isNaN(n)));
  const todayKey = Math.floor(today.getTime() / DAY_MS);
  // La racha vale si el último día activo es hoy o ayer.
  let cursor = set.has(todayKey) ? todayKey : set.has(todayKey - 1) ? todayKey - 1 : null;
  if (cursor === null) return 0;
  let count = 0;
  while (set.has(cursor)) {
    count++;
    cursor--;
  }
  return count;
}

// ── Impacto ambiental (factores aproximados, divulgativos) ──────────────────

export interface EcoImpact {
  kg: number;
  co2Kg: number; // CO₂e evitado
  waterL: number; // agua ahorrada
  energyKwh: number; // energía ahorrada
  treesEq: number; // árboles equivalentes/año
}

/** Factores por kg correctamente aprovechado (promedio mezcla de materiales). */
const IMPACT = { co2: 1.5, water: 13, energy: 0.85, treePerYearKgCo2: 21 } as const;

export function ecoImpact(kg: number): EcoImpact {
  const k = Math.max(0, kg || 0);
  const co2Kg = k * IMPACT.co2;
  return {
    kg: k,
    co2Kg,
    waterL: k * IMPACT.water,
    energyKwh: k * IMPACT.energy,
    treesEq: co2Kg / IMPACT.treePerYearKgCo2,
  };
}

/** Estimación divulgativa: ~40 puntos ≈ 1 kg aprovechado. */
export function kgFromPoints(points: number): number {
  return Math.max(0, Math.round((points || 0) / 40));
}

// ── Insignias / logros ──────────────────────────────────────────────────────

export interface BadgeStats {
  level: number; // índice de nivel
  streak: number; // días de racha
  redeems: number; // canjes realizados
  reports: number; // reportes de puntos críticos
  weeksCorrect: number; // semanas con separación correcta
  co2Kg: number; // CO₂ evitado acumulado
}

export interface BadgeDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  /** Predicado de obtención sobre las estadísticas del hogar. */
  earned: (s: BadgeStats) => boolean;
}

export interface BadgeState extends Omit<BadgeDef, "earned"> {
  earned: boolean;
}

export const BADGES: readonly BadgeDef[] = [
  { id: "primer-paso", title: "Primer paso", description: "Empezaste a separar tus residuos", icon: "footsteps", color: lime[500], earned: (s) => s.weeksCorrect >= 1 },
  { id: "racha-7", title: "Racha de fuego", description: "7 días seguidos separando bien", icon: "flame", color: coral[500], earned: (s) => s.streak >= 7 },
  { id: "primer-canje", title: "Primer canje", description: "Cambiaste tus puntos por un beneficio", icon: "gift", color: amber[500], earned: (s) => s.redeems >= 1 },
  { id: "reportero", title: "Reportero ambiental", description: "Reportaste un punto crítico de basuras", icon: "megaphone", color: sky[500], earned: (s) => s.reports >= 1 },
  { id: "separador", title: "Separador experto", description: "4 semanas de separación correcta", icon: "funnel", color: teal[600], earned: (s) => s.weeksCorrect >= 4 },
  { id: "nivel-arbol", title: "Sombra del barrio", description: "Llegaste al nivel Árbol", icon: "git-network", color: eco[600], earned: (s) => s.level >= 4 },
  { id: "eco-heroe", title: "Eco-héroe", description: "Evitaste 100 kg de CO₂", icon: "shield-checkmark", color: violet[600], earned: (s) => s.co2Kg >= 100 },
] as const;

/** Devuelve cada insignia con su estado de obtención para el hogar. */
export function evaluateBadges(stats: BadgeStats): BadgeState[] {
  return BADGES.map(({ earned, ...rest }) => ({ ...rest, earned: earned(stats) }));
}

// ── Retos (la UI provee el progreso; aquí solo el modelo + ayudas) ──────────

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  rewardPoints: number;
  current: number;
  target: number;
}

export const challengeProgress = (c: Challenge): number =>
  c.target <= 0 ? 0 : Math.min(1, c.current / c.target);

export const challengeDone = (c: Challenge): boolean => c.current >= c.target;
