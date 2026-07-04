"use client";

import { status } from "@az/ui-tokens";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RECYCLERS, type Recycler } from "@/lib/mock-data";

/** Maqueta: el alta se guarda en estado local, todavía sin Supabase. */
export default function RecicladoresPage() {
  const [recyclers, setRecyclers] = useState<Recycler[]>(RECYCLERS);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [zone, setZone] = useState("");

  function addRecycler() {
    if (!name.trim() || !zone.trim()) return;
    setRecyclers((prev) => [
      ...prev,
      {
        id: `r${prev.length + 1}-${Date.now()}`,
        name: name.trim(),
        zone: zone.trim(),
        kgDay: 0,
        formalized: false,
        active: true,
      },
    ]);
    setName("");
    setZone("");
    setShowForm(false);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-7 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-title1 font-bold tracking-tight text-text-primary">
            Recicladores
          </h1>
          <p className="mt-1 text-callout text-text-secondary">
            {recyclers.length} miembros de la asociación
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus size={16} />
          Agregar reciclador
        </Button>
      </div>

      {showForm ? (
        <Card className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="flex flex-1 flex-col gap-1.5 text-footnote font-medium text-text-secondary">
            Nombre
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Jhon Ortiz"
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-callout text-text-primary outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-1 flex-col gap-1.5 text-footnote font-medium text-text-secondary">
            Zona
            <input
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              placeholder="Ej. Comuna 15 · Aguablanca"
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-callout text-text-primary outline-none focus:border-accent"
            />
          </label>
          <Button onClick={addRecycler}>Guardar</Button>
        </Card>
      ) : null}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-caption1 uppercase tracking-wide text-text-tertiary">
                <th className="pb-3 font-medium">Nombre</th>
                <th className="pb-3 font-medium">Zona</th>
                <th className="pb-3 text-right font-medium">Kg/día</th>
                <th className="pb-3 text-right font-medium">Formalizado</th>
                <th className="pb-3 text-right font-medium">Estado</th>
                <th className="pb-3 text-right font-medium">Banco</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recyclers.map((r) => (
                <tr key={r.id} className="text-callout">
                  <td className="py-3.5 font-medium text-text-primary">{r.name}</td>
                  <td className="py-3.5 text-text-secondary">{r.zone}</td>
                  <td className="py-3.5 text-right text-text-secondary">{r.kgDay}</td>
                  <td className="py-3.5 text-right">
                    <Badge
                      label={r.formalized ? "Formalizado" : "En proceso"}
                      color={r.formalized ? status.success : status.warning}
                    />
                  </td>
                  <td className="py-3.5 text-right">
                    <Badge
                      label={r.active ? "Activo" : "Inactivo"}
                      color={r.active ? status.info : status.danger}
                    />
                  </td>
                  <td className="py-3.5 text-right text-text-secondary">
                    {r.bank ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
