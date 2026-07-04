"use client";

import {
  BarChart3,
  ChevronDown,
  Home,
  Map,
  Recycle,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { NotificationBell } from "@/components/ui/notification-bell";
import { cn } from "@/lib/cn";

const NAV = [
  { label: "Resumen", icon: Home, href: "/dashboard" },
  { label: "Recicladores", icon: Recycle, href: "/dashboard/recicladores" },
  { label: "Fuentes", icon: Users, href: "/dashboard" },
  { label: "Rutas", icon: Map, href: "/dashboard/rutas" },
  { label: "Liquidaciones", icon: Wallet, href: "/dashboard" },
  { label: "Reportes", icon: BarChart3, href: "/dashboard/reportes" },
  { label: "Equipo", icon: UserCog, href: "/dashboard/equipo" },
];

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-border bg-surface px-4 py-5 md:flex">
        <div>
          <Link href="/" className="mb-8 flex items-center gap-2.5 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand">
              <span className="text-callout font-bold text-white">AZ</span>
            </div>
            <span className="text-headline font-semibold text-text-primary">
              Ecosistema
            </span>
          </Link>
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => {
              const active = item.href === pathname;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-callout font-medium transition-colors",
                    active
                      ? "bg-surface-sunken text-text-primary"
                      : "text-text-secondary hover:bg-surface-sunken/60 hover:text-text-primary",
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex flex-col gap-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-callout font-medium text-text-secondary transition-colors hover:bg-surface-sunken/60 hover:text-text-primary"
          >
            <ShieldCheck size={18} />
            Super-admin
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-callout font-medium text-text-secondary transition-colors hover:bg-surface-sunken/60 hover:text-text-primary"
          >
            <Settings size={18} />
            Ajustes
          </Link>
        </div>
      </aside>

      {/* Contenido */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-surface/80 px-6 py-3.5 backdrop-blur-xl">
          <button className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-callout font-medium text-text-primary transition-colors hover:bg-surface-sunken">
            Asociación de recicladores · Cali
            <ChevronDown size={16} className="text-text-tertiary" />
          </button>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <span className="hidden text-footnote text-text-secondary sm:block">
              Coordinador
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-alt">
              <span className="text-footnote font-bold text-white">CO</span>
            </div>
          </div>
        </header>
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
