/**
 * Datos demo de gamificación, comunidad y mapa para la app móvil.
 * Son instancias de estado (no conocimiento de dominio), por eso viven aquí
 * y no en @az/core. Cuando exista la BD se reemplazan por queries reales.
 */
import type { Challenge, WasteCategoryId } from "@az/core";
import { amber, coral, sky, teal } from "@az/ui-tokens";

/** Devuelve los últimos `n` días en ISO (YYYY-MM-DD), terminando hoy. */
function recentDates(n: number): string[] {
  const out: string[] = [];
  const base = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

/** Racha demo: 5 días consecutivos hasta hoy (se calcula al vuelo). */
export const demoStreakDates = recentDates(5);

/** XP demo = puntos ganados en la "vida" del hogar (≈ nivel Árbol). */
export const demoXp = 2640;

/** Kg correctamente aprovechados en el año (alimenta el impacto ambiental). */
export const demoKgYear = 184;

/** Estadísticas demo para evaluar insignias. */
export const demoBadgeStats = {
  redeems: 1,
  reports: 1,
  weeksCorrect: 5,
};

export const mockChallenges: Challenge[] = [
  {
    id: "racha-7",
    title: "Racha de la semana",
    description: "Separa bien tus residuos 7 días seguidos",
    icon: "flame",
    color: coral[500],
    rewardPoints: 50,
    current: 5,
    target: 7,
  },
  {
    id: "aprende",
    title: "Aprende a separar",
    description: "Consulta 10 residuos en la guía",
    icon: "school",
    color: teal[600],
    rewardPoints: 20,
    current: 6,
    target: 10,
  },
  {
    id: "reporta",
    title: "Ojo ambiental",
    description: "Reporta un punto crítico de basuras",
    icon: "megaphone",
    color: sky[500],
    rewardPoints: 40,
    current: 0,
    target: 1,
  },
  {
    id: "canje-mes",
    title: "Primer canje del mes",
    description: "Cambia puntos por un beneficio",
    icon: "gift",
    color: amber[500],
    rewardPoints: 30,
    current: 0,
    target: 1,
  },
];

export interface LeaderboardRow {
  rank: number;
  zone: string;
  points: number;
  score: number;
  you: boolean;
}

export const mockLeaderboard: LeaderboardRow[] = [
  { rank: 1, zone: "Zona 1 · Centro", points: 3120, score: 92, you: false },
  { rank: 2, zone: "Zona 5 · La Esperanza", points: 2890, score: 90, you: false },
  { rank: 3, zone: "Zona 3 · Córdoba", points: 2640, score: 88, you: true },
  { rank: 4, zone: "Zona 2 · La Unión", points: 2410, score: 84, you: false },
  { rank: 5, zone: "Zona 4 · Meridiano", points: 2180, score: 81, you: false },
];

export interface RecyclePoint {
  id: string;
  name: string;
  category: WasteCategoryId;
  address: string;
  distanceM: number;
  openNow: boolean;
  hours: string;
}

export const mockRecyclePoints: RecyclePoint[] = [
  { id: "rp1", name: "Punto Verde Centro", category: "aprovechable", address: "Cra 20 # 19-30", distanceM: 320, openNow: true, hours: "Lun–Sáb 7am–5pm" },
  { id: "rp2", name: "Eco-Punto Córdoba", category: "aprovechable", address: "Cll 18 # 21-10", distanceM: 540, openNow: true, hours: "Lun–Dom 8am–8pm" },
  { id: "rp3", name: "Compostera Municipal", category: "organico", address: "Vía Caño Limón km 2", distanceM: 1500, openNow: true, hours: "Lun–Vie 6am–2pm" },
  { id: "rp4", name: "Posconsumo Alcaldía", category: "especial", address: "Cra 21 # 20-50 · Alcaldía", distanceM: 800, openNow: false, hours: "Lun–Vie 8am–12m" },
  { id: "rp5", name: "Punto RESPEL Hospital", category: "peligroso", address: "Hospital San Vicente", distanceM: 2100, openNow: true, hours: "24 horas" },
];

/** Formatea distancia: 320 → "320 m", 1500 → "1,5 km". */
export function formatDistance(m: number): string {
  if (m < 1000) return `${m} m`;
  return `${(m / 1000).toLocaleString("es-CO", { maximumFractionDigits: 1 })} km`;
}
