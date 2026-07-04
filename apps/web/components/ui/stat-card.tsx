import type { LucideIcon } from "lucide-react";

import { Card } from "./card";

/** Métrica de dashboard: icono + valor grande + etiqueta + delta opcional. */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "var(--az-accent)",
  gradient,
  delta,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  accent?: string;
  /** [desde, hasta] — ej. de `gradients.meadow` en @az/ui-tokens. Si se pasa, reemplaza `accent`. */
  gradient?: readonly [string, string];
  delta?: { value: string; positive: boolean };
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-caption1 font-medium uppercase tracking-wide text-text-tertiary">
          {label}
        </span>
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={
            gradient
              ? { background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }
              : { backgroundColor: `${typeof accent === "string" && accent.startsWith("#") ? accent : "#2A5580"}1A` }
          }
        >
          <Icon size={18} style={{ color: gradient ? "#FFFFFF" : accent }} />
        </span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-title1 font-bold text-text-primary">{value}</span>
        {delta ? (
          <span
            className="mb-1 text-footnote font-medium"
            style={{ color: delta.positive ? "#2E7D32" : "#B71C1C" }}
          >
            {delta.positive ? "▲" : "▼"} {delta.value}
          </span>
        ) : null}
      </div>
      {hint ? (
        <span className="text-footnote text-text-secondary">{hint}</span>
      ) : null}
    </Card>
  );
}
