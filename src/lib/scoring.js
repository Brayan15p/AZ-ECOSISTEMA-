import { OPERATOR_COLORS as COLORS } from "./theme.js";

export function getScoreColor(score) {
  if (score >= 90) return COLORS.emerald;
  if (score >= 75) return COLORS.blue;
  if (score >= 60) return COLORS.orange;
  return COLORS.red;
}

export function getStatusLabel(score) {
  if (score >= 90) return "Excelente";
  if (score >= 75) return "Cumple";
  if (score >= 60) return "Reentrenamiento";
  return "Incumplimiento";
}
