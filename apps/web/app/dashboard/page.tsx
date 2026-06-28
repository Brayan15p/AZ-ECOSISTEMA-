import {
  formatCop,
  formatNumber,
  payoutStatusColor,
  payoutStatusLabel,
  type PayoutStatus,
} from "@az/core";
import { Coins, Recycle, TrendingUp, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";

type Row = {
  recycler: string;
  zone: string;
  period: string;
  kg: number;
  amountCop: number;
  status: PayoutStatus;
};

const PAYOUTS: Row[] = [
  { recycler: "Carlos Mendoza", zone: "Zona 3 · Córdoba", period: "May 2026", kg: 8320, amountCop: 2912000, status: "paid" },
  { recycler: "Ana Robledo", zone: "Zona 1 · Centro", period: "May 2026", kg: 6740, amountCop: 2359000, status: "paid" },
  { recycler: "Luis Patiño", zone: "Zona 5 · Unión", period: "May 2026", kg: 5980, amountCop: 2093000, status: "pending" },
  { recycler: "Marta Vega", zone: "Zona 2 · Mártires", period: "May 2026", kg: 7120, amountCop: 2492000, status: "pending" },
];

const ZONES = [
  { name: "Zona 3 · Córdoba", rate: 74 },
  { name: "Zona 1 · Centro", rate: 61 },
  { name: "Zona 2 · Mártires", rate: 58 },
  { name: "Zona 5 · Unión", rate: 49 },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-7">
        <h1 className="text-title1 font-bold tracking-tight text-text-primary">
          Resumen
        </h1>
        <p className="mt-1 text-callout text-text-secondary">
          Municipio de Arauca · periodo en curso
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Hogares activos"
          value="1.412"
          icon={Users}
          accent="#1B3A5C"
          delta={{ value: "8.2%", positive: true }}
          hint="Clasificando este mes"
        />
        <StatCard
          label="Material recuperado"
          value="8.3 t"
          icon={Recycle}
          accent="#3A5C2E"
          delta={{ value: "5.1%", positive: true }}
          hint="Desviado del relleno"
        />
        <StatCard
          label="Tasa de desviación"
          value="62%"
          icon={TrendingUp}
          accent="#00695C"
          delta={{ value: "3 pts", positive: true }}
          hint="Sobre total recogido"
        />
        <StatCard
          label="Liquidado este mes"
          value={formatCop(9856000)}
          icon={Coins}
          accent="#B8860B"
          delta={{ value: "2.4%", positive: false }}
          hint="A recicladores"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Liquidaciones recientes */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-title3 font-semibold text-text-primary">
              Liquidaciones recientes
            </h2>
            <a href="/dashboard" className="text-footnote font-medium text-accent hover:underline">
              Ver todas
            </a>
          </div>
          <div className="overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-caption1 uppercase tracking-wide text-text-tertiary">
                  <th className="pb-3 font-medium">Reciclador</th>
                  <th className="pb-3 font-medium">Periodo</th>
                  <th className="hidden pb-3 text-right font-medium sm:table-cell">kg</th>
                  <th className="pb-3 text-right font-medium">Monto</th>
                  <th className="pb-3 text-right font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {PAYOUTS.map((p) => (
                  <tr key={p.recycler} className="text-callout">
                    <td className="py-3.5">
                      <div className="font-medium text-text-primary">
                        {p.recycler}
                      </div>
                      <div className="text-footnote text-text-tertiary">
                        {p.zone}
                      </div>
                    </td>
                    <td className="py-3.5 text-text-secondary">{p.period}</td>
                    <td className="hidden py-3.5 text-right text-text-secondary sm:table-cell">
                      {formatNumber(p.kg)}
                    </td>
                    <td className="py-3.5 text-right font-medium text-text-primary">
                      {formatCop(p.amountCop)}
                    </td>
                    <td className="py-3.5 text-right">
                      <Badge
                        label={payoutStatusLabel(p.status)}
                        color={payoutStatusColor(p.status)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Aprovechamiento por zona */}
        <Card>
          <h2 className="mb-5 text-title3 font-semibold text-text-primary">
            Aprovechamiento por zona
          </h2>
          <div className="flex flex-col gap-5">
            {ZONES.map((z) => (
              <div key={z.name}>
                <div className="mb-1.5 flex items-center justify-between text-footnote">
                  <span className="text-text-secondary">{z.name}</span>
                  <span className="font-semibold text-text-primary">
                    {z.rate}%
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
