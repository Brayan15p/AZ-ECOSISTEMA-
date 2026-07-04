import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

// TODO(auth): esta sección debe protegerse server-side verificando
// `role = 'super_admin'` en cuanto exista sesión real para la web (hoy
// apps/web no tiene login) — ver plan "ampliar dashboard" 2026-07-04.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-surface/80 px-6 py-3.5 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-900">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <div>
            <div className="text-callout font-semibold text-text-primary">
              Super-admin
            </div>
            <div className="text-caption1 text-text-tertiary">
              AZ Ecosistema · todas las asociaciones
            </div>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="text-footnote font-medium text-accent hover:underline"
        >
          Volver a mi asociación
        </Link>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
