/** Formateadores compartidos (Colombia / es-CO). */

const COP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

/** Formatea pesos colombianos: 20000 -> "$20.000". */
export function formatCop(amount: number): string {
  return COP.format(amount);
}

const NUM = new Intl.NumberFormat("es-CO");

/** Miles con separador local: 1234 -> "1.234". */
export function formatNumber(n: number): string {
  return NUM.format(n);
}

/** Puntos: 1500 -> "1.500 pts". */
export function formatPoints(points: number): string {
  return `${NUM.format(points)} pts`;
}

const DATE = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** "2026-06-16" -> "16 jun 2026". */
export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : DATE.format(d);
}
