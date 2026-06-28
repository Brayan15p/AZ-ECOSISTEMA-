import {
  ArrowRight,
  BarChart3,
  Building2,
  Coins,
  Leaf,
  MapPin,
  Recycle,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const PILLARS = [
  {
    icon: Building2,
    title: "Municipios",
    text: "Consola de gestión multi-tenant: rutas, indicadores de aprovechamiento (PGIRS) y facturación del servicio.",
    color: "#1B3A5C",
  },
  {
    icon: Users,
    title: "Ciudadanos",
    text: "Clasifican sus residuos, suben su clasificación de hogar y canjean puntos por bonos y beneficios locales.",
    color: "#3A5C2E",
  },
  {
    icon: Recycle,
    title: "Recicladores",
    text: "Formalización, rutas de recolección y liquidaciones transparentes por el material recuperado.",
    color: "#B8860B",
  },
];

const STATS = [
  { value: "62%", label: "Tasa de desviación de relleno" },
  { value: "1.4k", label: "Hogares clasificando" },
  { value: "142", label: "Recicladores formalizados" },
  { value: "8.3t", label: "Material recuperado / mes" },
];

const STEPS = [
  {
    icon: Smartphone,
    title: "Clasifica en casa",
    text: "El ciudadano separa sus residuos y registra su actividad desde la app.",
  },
  {
    icon: MapPin,
    title: "El reciclador recolecta",
    text: "Rutas optimizadas por zona; el material se pesa y queda trazado.",
  },
  {
    icon: Coins,
    title: "Todos ganan",
    text: "Puntos para el ciudadano, liquidación para el reciclador, indicadores para el municipio.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-surface/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand">
              <span className="text-callout font-bold text-white">AZ</span>
            </div>
            <span className="text-headline font-semibold text-text-primary">
              Ecosistema
            </span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#plataforma" className="text-callout text-text-secondary transition-colors hover:text-text-primary">
              Plataforma
            </a>
            <a href="#como-funciona" className="text-callout text-text-secondary transition-colors hover:text-text-primary">
              Cómo funciona
            </a>
            <a href="#impacto" className="text-callout text-text-secondary transition-colors hover:text-text-primary">
              Impacto
            </a>
          </div>
          <Button href="/dashboard" variant="primary" className="px-4 py-2">
            Entrar a la consola
          </Button>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-70"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, rgba(58,92,46,0.16) 0%, rgba(27,58,92,0.10) 40%, rgba(247,248,250,0) 75%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-20 text-center md:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-footnote font-medium text-text-secondary shadow-sm">
            <Leaf size={14} className="text-brand-alt" />
            Economía circular para Arauca
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-[2.75rem] font-bold leading-[1.05] tracking-tight text-text-primary md:text-[4.25rem]">
            La gestión de residuos,{" "}
            <span className="bg-gradient-to-r from-brand to-brand-alt bg-clip-text text-transparent">
              hecha circular
            </span>
            .
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-body text-text-secondary md:text-[1.25rem]">
            Una sola plataforma que conecta municipios, ciudadanos y recicladores:
            menos residuo en el relleno, más valor para quien recicla.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/dashboard" variant="primary" className="w-full px-6 py-3.5 sm:w-auto">
              Ver la consola <ArrowRight size={18} />
            </Button>
            <Button href="#como-funciona" variant="secondary" className="w-full px-6 py-3.5 sm:w-auto">
              Cómo funciona
            </Button>
          </div>

          {/* Stats band */}
          <div
            id="impacto"
            className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-4"
          >
            {STATS.map((s) => (
              <div key={s.label} className="bg-surface px-6 py-7">
                <div className="text-title1 font-bold text-text-primary">
                  {s.value}
                </div>
                <div className="mt-1 text-footnote text-text-secondary">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pilares */}
      <section id="plataforma" className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <h2 className="text-[2rem] font-bold tracking-tight text-text-primary md:text-title1">
            Tres frentes, una plataforma
          </h2>
          <p className="mt-3 text-body text-text-secondary">
            Cada actor tiene su propia experiencia, conectada por un mismo motor
            de datos, puntos y liquidaciones.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PILLARS.map((p) => (
            <Card key={p.title} className="flex flex-col gap-4 transition-shadow hover:shadow-lg">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${p.color}1A` }}
              >
                <p.icon size={24} style={{ color: p.color }} />
              </span>
              <h3 className="text-title3 font-semibold text-text-primary">
                {p.title}
              </h3>
              <p className="text-callout leading-relaxed text-text-secondary">
                {p.text}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="border-y border-border bg-surface-sunken/50">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-center text-[2rem] font-bold tracking-tight text-text-primary md:text-title1">
            Cómo funciona
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative flex flex-col items-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface shadow-md">
                  <step.icon size={26} className="text-brand" />
                </span>
                <span className="mt-5 text-caption1 font-bold uppercase tracking-widest text-text-tertiary">
                  Paso {i + 1}
                </span>
                <h3 className="mt-2 text-headline font-semibold text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-callout text-text-secondary">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl bg-brand px-8 py-16 text-center md:px-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(50% 80% at 80% 0%, rgba(101,141,75,0.6) 0%, rgba(27,58,92,0) 70%)",
            }}
          />
          <div className="relative">
            <ShieldCheck size={36} className="mx-auto text-white/90" />
            <h2 className="mx-auto mt-5 max-w-2xl text-[2rem] font-bold leading-tight text-white md:text-title1">
              Datos verificables. Pagos transparentes.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-body text-white/75">
              Trazabilidad del material, balance de masa reconciliado e
              indicadores listos para reportar al municipio.
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                href="/dashboard"
                variant="secondary"
                className="px-6 py-3.5"
              >
                Explorar la consola <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
              <span className="text-footnote font-bold text-white">AZ</span>
            </div>
            <span className="text-callout text-text-secondary">
              AZ Ecosistema · Arauca, Colombia
            </span>
          </div>
          <div className="flex items-center gap-2 text-footnote text-text-tertiary">
            <BarChart3 size={14} />
            Economía circular · {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </main>
  );
}
