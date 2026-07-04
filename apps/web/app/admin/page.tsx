"use client";

import { formatCop, formatNumber } from "@az/core";
import { Building2, Plus } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TENANTS, type TenantSummary } from "@/lib/mock-data";

export default function SuperAdminPage() {
  const [tenants, setTenants] = useState<TenantSummary[]>(TENANTS);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [kind, setKind] = useState<TenantSummary["kind"]>("asociacion");

  function addTenant() {
    if (!name.trim() || !location.trim()) return;
    setTenants((prev) => [
      ...prev,
      {
        id: `t-${Date.now()}`,
        name: name.trim(),
        kind,
        location: location.trim(),
        members: 0,
        kgMonth: 0,
        liquidadoCop: 0,
      },
    ]);
    setName("");
    setLocation("");
    setShowForm(false);
  }

  return (
    <div>
      <div className="mb-7 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-title1 font-bold tracking-tight text-text-primary">
            Asociaciones y municipios
          </h1>
          <p className="mt-1 text-callout text-text-secondary">
            {tenants.length} organizaciones usando AZ Ecosistema
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus size={16} />
          Nueva asociación
        </Button>
      </div>

      {showForm ? (
        <Card className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="flex flex-1 flex-col gap-1.5 text-footnote font-medium text-text-secondary">
            Nombre
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Asociación de recicladores · Medellín"
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-callout text-text-primary outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-1 flex-col gap-1.5 text-footnote font-medium text-text-secondary">
            Ubicación
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ciudad, Departamento"
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-callout text-text-primary outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-footnote font-medium text-text-secondary">
            Tipo
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as TenantSummary["kind"])}
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-callout text-text-primary outline-none focus:border-accent"
            >
              <option value="asociacion">Asociación</option>
              <option value="municipio">Municipio</option>
            </select>
          </label>
          <Button onClick={addTenant}>Guardar</Button>
        </Card>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        {tenants.map((t) => (
          <Card key={t.id} className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-sunken">
                  <Building2 size={18} className="text-text-secondary" />
                </span>
                <div>
                  <div className="font-semibold text-text-primary">{t.name}</div>
                  <div className="text-footnote text-text-tertiary">{t.location}</div>
                </div>
              </div>
              <Badge
                label={t.kind === "asociacion" ? "Asociación" : "Municipio"}
                color={t.kind === "asociacion" ? "#12B76A" : "#2A5580"}
              />
            </div>
            <div className="grid grid-cols-3 gap-3 border-t border-border pt-4 text-center">
              <div>
                <div className="text-title3 font-bold text-text-primary">
                  {formatNumber(t.members)}
                </div>
                <div className="text-caption1 text-text-tertiary">Miembros</div>
              </div>
              <div>
                <div className="text-title3 font-bold text-text-primary">
                  {formatNumber(t.kgMonth)}
                </div>
                <div className="text-caption1 text-text-tertiary">Kg/mes</div>
              </div>
              <div>
                <div className="text-title3 font-bold text-text-primary">
                  {formatCop(t.liquidadoCop)}
                </div>
                <div className="text-caption1 text-text-tertiary">Liquidado</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
