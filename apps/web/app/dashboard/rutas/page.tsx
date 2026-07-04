"use client";

import { formatDate, formatNumber } from "@az/core";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  COLLECTION_LOGS,
  RECYCLERS,
  zoneAggregates,
  type CollectionLog,
} from "@/lib/mock-data";

/** Maqueta: los registros de recolección viven en estado local, todavía sin Supabase. */
export default function RutasPage() {
  const [logs, setLogs] = useState<CollectionLog[]>(COLLECTION_LOGS);
  const [recyclerId, setRecyclerId] = useState(RECYCLERS[0]?.id ?? "");
  const [kg, setKg] = useState("");

  const zones = useMemo(() => zoneAggregates(logs), [logs]);
  const recentLogs = useMemo(
    () => [...logs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8),
    [logs],
  );

  function addLog() {
    const kgNum = Number(kg);
    const recycler = RECYCLERS.find((r) => r.id === recyclerId);
    if (!recycler || !kgNum || kgNum <= 0) return;
    setLogs((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        recyclerId: recycler.id,
        recyclerName: recycler.name,
        zone: recycler.zone,
        date: new Date().toISOString().slice(0, 10),
        kg: kgNum,
      },
    ]);
    setKg("");
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-7">
        <h1 className="text-title1 font-bold tracking-tight text-text-primary">
          Rutas y recolección
        </h1>
        <p className="mt-1 text-callout text-text-secondary">
          Registro diario por reciclador y zona
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-4 text-title3 font-semibold text-text-primary">
            Registrar recolección de hoy
          </h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <label className="flex flex-1 flex-col gap-1.5 text-footnote font-medium text-text-secondary">
              Reciclador
              <select
                value={recyclerId}
                onChange={(e) => setRecyclerId(e.target.value)}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-callout text-text-primary outline-none focus:border-accent"
              >
                {RECYCLERS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} · {r.zone}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-footnote font-medium text-text-secondary">
              Kg recolectados
              <input
                type="number"
                min="0"
                value={kg}
                onChange={(e) => setKg(e.target.value)}
                placeholder="0"
                className="w-32 rounded-xl border border-border bg-background px-3 py-2.5 text-callout text-text-primary outline-none focus:border-accent"
              />
            </label>
            <Button onClick={addLog}>
              <Plus size={16} />
              Registrar
            </Button>
          </div>

          <h3 className="mb-3 mt-7 text-footnote font-semibold uppercase tracking-wide text-text-tertiary">
            Últimos registros
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-caption1 uppercase tracking-wide text-text-tertiary">
                  <th className="pb-3 font-medium">Reciclador</th>
                  <th className="pb-3 font-medium">Zona</th>
                  <th className="pb-3 font-medium">Fecha</th>
                  <th className="pb-3 text-right font-medium">Kg</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentLogs.map((log) => (
                  <tr key={log.id} className="text-callout">
                    <td className="py-3 font-medium text-text-primary">
                      {log.recyclerName}
                    </td>
                    <td className="py-3 text-text-secondary">{log.zone}</td>
                    <td className="py-3 text-text-secondary">
                      {formatDate(log.date)}
                    </td>
                    <td className="py-3 text-right text-text-primary">
                      {formatNumber(log.kg)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h2 className="mb-5 text-title3 font-semibold text-text-primary">
            Aprovechamiento por zona
          </h2>
          <div className="flex flex-col gap-5">
            {zones.map((z) => (
              <div key={z.zone}>
                <div className="mb-1.5 flex items-center justify-between text-footnote">
                  <span className="text-text-secondary">{z.zone}</span>
                  <span className="font-semibold text-text-primary">
                    {formatNumber(z.kg)} kg
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-sunken">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-brand to-brand-alt"
                    style={{ width: `${z.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
