"use client";

import { UserPlus } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROLE_LABELS, TEAM, type TeamMember } from "@/lib/mock-data";

const ROLE_COLOR: Record<TeamMember["role"], string> = {
  admin_municipio: "#875BF7",
  operador: "#0BA5EC",
};

/**
 * Maqueta del admin por asociación. Cuando exista Supabase real, cambiar
 * rol acá debe llamar una RPC SECURITY DEFINER (nunca UPDATE directo de
 * `profiles.role`, por la misma razón que motivó la migración de seguridad
 * P0: un admin no puede simplemente escribir el rol de otra fila).
 */
export default function EquipoPage() {
  const [team, setTeam] = useState<TeamMember[]>(TEAM);
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamMember["role"]>("operador");

  function changeRole(id: string, newRole: TeamMember["role"]) {
    setTeam((prev) => prev.map((m) => (m.id === id ? { ...m, role: newRole } : m)));
  }

  function invite() {
    if (!email.trim()) return;
    setTeam((prev) => [
      ...prev,
      { id: `t-${Date.now()}`, name: email.split("@")[0] ?? email, email: email.trim(), role },
    ]);
    setEmail("");
    setShowInvite(false);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-7 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-title1 font-bold tracking-tight text-text-primary">
            Equipo
          </h1>
          <p className="mt-1 text-callout text-text-secondary">
            Administradores y operadores de la asociación
          </p>
        </div>
        <Button onClick={() => setShowInvite((v) => !v)}>
          <UserPlus size={16} />
          Invitar miembro
        </Button>
      </div>

      {showInvite ? (
        <Card className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="flex flex-1 flex-col gap-1.5 text-footnote font-medium text-text-secondary">
            Correo
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@asociacion.com"
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-callout text-text-primary outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-footnote font-medium text-text-secondary">
            Rol
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as TeamMember["role"])}
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-callout text-text-primary outline-none focus:border-accent"
            >
              <option value="operador">Operador</option>
              <option value="admin_municipio">Administrador</option>
            </select>
          </label>
          <Button onClick={invite}>Enviar invitación</Button>
        </Card>
      ) : null}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-caption1 uppercase tracking-wide text-text-tertiary">
                <th className="pb-3 font-medium">Nombre</th>
                <th className="pb-3 font-medium">Correo</th>
                <th className="pb-3 text-right font-medium">Rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {team.map((m) => (
                <tr key={m.id} className="text-callout">
                  <td className="py-3.5 font-medium text-text-primary">{m.name}</td>
                  <td className="py-3.5 text-text-secondary">{m.email}</td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Badge label={ROLE_LABELS[m.role]} color={ROLE_COLOR[m.role]} />
                      <select
                        aria-label={`Cambiar rol de ${m.name}`}
                        value={m.role}
                        onChange={(e) => changeRole(m.id, e.target.value as TeamMember["role"])}
                        className="rounded-lg border border-border bg-background px-2 py-1 text-footnote text-text-secondary outline-none focus:border-accent"
                      >
                        <option value="operador">Operador</option>
                        <option value="admin_municipio">Administrador</option>
                      </select>
                    </div>
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
