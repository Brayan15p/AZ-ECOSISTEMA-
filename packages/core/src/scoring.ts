/**
 * Lógica de scoring de hogares.
 * Extraída y formalizada desde el prototipo (getScoreColor / getStatusLabel).
 */
import { status, navy } from "@az/ui-tokens";
import type { ScoreLevel } from "./types";

export const SCORE_THRESHOLDS = {
  excelente: 90,
  cumple: 75,
  reentrenamiento: 60,
} as const;

export function scoreLevel(score: number): ScoreLevel {
  if (score >= SCORE_THRESHOLDS.excelente) return "excelente";
  if (score >= SCORE_THRESHOLDS.cumple) return "cumple";
  if (score >= SCORE_THRESHOLDS.reentrenamiento) return "reentrenamiento";
  return "incumplimiento";
}

const LABELS: Record<ScoreLevel, string> = {
  excelente: "Excelente",
  cumple: "Cumple",
  reentrenamiento: "Reentrenamiento",
  incumplimiento: "Incumplimiento",
};

export function scoreLabel(score: number): string {
  return LABELS[scoreLevel(score)];
}

const LEVEL_COLORS: Record<ScoreLevel, string> = {
  excelente: status.success,
  cumple: navy[500],
  reentrenamiento: status.warning,
  incumplimiento: status.danger,
};

export function scoreColor(score: number): string {
  return LEVEL_COLORS[scoreLevel(score)];
}

/** Normaliza cualquier entrada a un score válido 0–100 (entero). */
export function clampScore(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}
