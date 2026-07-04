"use client";

import { formatCop, formatDate } from "@az/core";
import { Download } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { downloadCsv } from "@/lib/csv";
import { COLLECTION_LOGS, PAYOUTS } from "@/lib/mock-data";

const TODAY = new Date().toISOString().slice(0, 10);
const WEEK_AGO = new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10);

export default function ReportesPage() {
  const [from, setFrom] = useState(WEEK_AGO);
  const [to, setTo] = useState(TODAY);

  function exportLiquidaciones() {
    downloadCsv(
      `liquidaciones_${from}_a_${to}.csv`,
      ["Reciclador", "Zona", "Periodo", "Kg", "Monto COP", "Estado"],
      PAYOUTS.map((p) => [p.recycler, p.zone, p.period, p.kg, p.amountCop, p.status]),
    );
  }

  function exportRecoleccion() {
    const filtered = COLLECTION_LOGS.filter((l) => l.date >= from && l.date <= to);
    downloadCsv(
      `recoleccion_${from}_a_${to}.csv`,
      ["Reciclador", "Zona", "Fecha", "Kg"],
      filtered.map((l) => [l.recyclerName, l.zone, l.date, l.kg]),
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-7">
        <h1 className="text-title1 font-bold tracking-tight text-text-primary">
          Reportes
        </h1>
        <p className="mt-1 text-callout text-text-secondary">
          Exporta datos para la Alcaldía, Bold o tus propios registros
        </p>
      </div>

      <Card className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <label className="flex flex-col gap-1.5 text-footnote font-medium text-text-secondary">
          Desde
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2.5 text-callout text-text-primary outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-footnote font-medium text-text-secondary">
          Hasta
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2.5 text-callout text-text-primary outline-none focus:border-accent"
          />
        </label>
        <p className="text-footnote text-text-tertiary sm:ml-2">
          El rango aplica al reporte de recolección (las liquidaciones son por periodo mensual).
        </p>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="flex flex-col gap-4">
          <div>
            <h2 className="text-title3 font-semibold text-text-primary">
              Liquidaciones
            </h2>
            <p className="mt-1 text-footnote text-text-secondary">
              {PAYOUTS.length} pagos · total {formatCop(PAYOUTS.reduce((s, p) => s + p.amountCop, 0))}
            </p>
          </div>
          <Button variant="secondary" onClick={exportLiquidaciones}>
            <Download size={16} />
            Exportar CSV
          </Button>
        </Card>

        <Card className="flex flex-col gap-4">
          <div>
            <h2 className="text-title3 font-semibold text-text-primary">
              Recolección
            </h2>
            <p className="mt-1 text-footnote text-text-secondary">
              {formatDate(from)} — {formatDate(to)}
            </p>
          </div>
          <Button variant="secondary" onClick={exportRecoleccion}>
            <Download size={16} />
            Exportar CSV
          </Button>
        </Card>
      </div>
    </div>
  );
}
