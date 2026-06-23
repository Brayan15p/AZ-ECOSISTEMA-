/**
 * Balance de masas del ecosistema de residuos.
 * Formaliza el cálculo que el prototipo hacía inline en el dashboard.
 */
import { status } from "@az/ui-tokens";
import type { DailyData, WasteStream } from "./types";

export interface StreamMeta {
  key: WasteStream;
  label: string;
  emoji: string;
  color: string;
  destination: string;
}

export const WASTE_STREAMS: StreamMeta[] = [
  { key: "organic", label: "Orgánicos", emoji: "🟢", color: status.success, destination: "Biodigestores" },
  { key: "recyclable", label: "Reciclables", emoji: "🔵", color: status.info, destination: "Centro de acopio (CCAR)" },
  { key: "energy", label: "Aprovechables energéticos", emoji: "🟠", color: status.warning, destination: "Valorización energética" },
  { key: "reject", label: "Rechazo", emoji: "⚫", color: status.danger, destination: "Disposición final" },
];

export interface DayBalance {
  date: string;
  total: number;
  purity: number;
  streams: Array<StreamMeta & { value: number; share: number }>;
}

/** Tonelaje total de un día (suma de los 4 flujos). */
export function dayTotal(day: DailyData): number {
  return round1(day.organic + day.recyclable + day.energy + day.reject);
}

/** Desglose de un día con porcentajes por flujo. */
export function dayBalance(day: DailyData): DayBalance {
  const total = dayTotal(day);
  const streams = WASTE_STREAMS.map((s) => {
    const value = day[s.key];
    return { ...s, value, share: total > 0 ? round1((value / total) * 100) : 0 };
  });
  return { date: day.date, total, purity: day.purity, streams };
}

export interface PeriodBalance {
  days: number;
  totalTons: number;
  avgPurity: number;
  byStream: Record<WasteStream, number>;
  diversionRate: number; // % desviado de disposición final (todo menos rechazo)
}

/** Agrega un rango de días (p. ej. la última semana). */
export function periodBalance(data: DailyData[]): PeriodBalance {
  const byStream: Record<WasteStream, number> = {
    organic: 0,
    recyclable: 0,
    energy: 0,
    reject: 0,
  };
  let purity = 0;
  for (const d of data) {
    byStream.organic += d.organic;
    byStream.recyclable += d.recyclable;
    byStream.energy += d.energy;
    byStream.reject += d.reject;
    purity += d.purity;
  }
  const totalTons = round1(
    byStream.organic + byStream.recyclable + byStream.energy + byStream.reject,
  );
  const diverted = totalTons - byStream.reject;
  return {
    days: data.length,
    totalTons,
    avgPurity: data.length ? Math.round(purity / data.length) : 0,
    byStream: {
      organic: round1(byStream.organic),
      recyclable: round1(byStream.recyclable),
      energy: round1(byStream.energy),
      reject: round1(byStream.reject),
    },
    diversionRate: totalTons > 0 ? round1((diverted / totalTons) * 100) : 0,
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
