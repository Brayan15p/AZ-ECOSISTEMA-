import {
  formatCop,
  formatNumber,
  payoutStatusColor,
  payoutStatusLabel,
} from "@az/core";
import { gradients } from "@az/ui-tokens";
import { Coins, Recycle, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { PAYOUTS, zoneAggregates } from "@/lib/mock-data";

export default function DashboardPage() {
  const zones = zoneAggregates().slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-7">
        <h1 className="text-title1 font-bold tracking-tight text-text-primary">
          Resumen
        </h1>
        <p className="mt-1 text-callout text-text-secondary">
          Asociación de recicladores · Cali · periodo en curso
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Recicladores activos"
          value="47"
          icon={Users}
          gradient={gradients.meadow}
          delta={{ value: "3", positive: true }}
          hint="Miembros de la asociación"
        />
        <StatCard
          label="Material recuperado"
          value="8.3 t"
          icon={Recycle}
          gradient={gradients.ocean}
          delta={{ value: "5.1%", positive: true }}
          hint="Este mes"
        />
        <StatCard
          label="Formalizados"
          value="68%"
          icon={TrendingUp}
          gradient={gradients.royal}
          delta={{ value: "6 pts", positive: true }}
          hint="Del total de miembros"
        />
        <StatCard
          label="Liquidado este mes"
          value={formatCop(9856000)}
          icon={Coins}
          gradient={gradients.sunrise}
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
            <Link
              href="/dashboard/reportes"
              className="text-footnote font-medium text-accent hover:underline"
            >
              Ver todas
            </Link>
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
                  <tr key={p.id} className="text-callout">
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
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-title3 font-semibold text-text-primary">
              Aprovechamiento por zona
            </h2>
            <Link
              href="/dashboard/rutas"
              className="text-footnote font-medium text-accent hover:underline"
            >
              Ver rutas
            </Link>
          </div>
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
