import type { Status } from "./types";

export const SCORE_THRESHOLDS = {
  excellent: 90,
  good: 75,
  warning: 60
} as const;

export function statusFromScore(score: number): Status {
  if (score >= SCORE_THRESHOLDS.excellent) return "Excelente";
  if (score >= SCORE_THRESHOLDS.good) return "Cumple";
  if (score >= SCORE_THRESHOLDS.warning) return "Reentrenamiento";
  return "Incumplimiento";
}

export function isPassing(score: number): boolean {
  return score >= SCORE_THRESHOLDS.warning;
}
