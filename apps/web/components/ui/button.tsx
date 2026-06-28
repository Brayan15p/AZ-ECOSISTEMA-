import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-navy-800 active:scale-[0.98]",
  secondary:
    "border border-border bg-surface text-text-primary hover:bg-surface-sunken",
  ghost: "text-accent hover:bg-surface-sunken",
};

/** Botón/enlace canónico. Renderiza <Link> si recibe `href`. */
export function Button({
  children,
  href,
  variant = "primary",
  className,
}: {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
}) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-callout font-medium transition-all duration-200",
    VARIANTS[variant],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return <button className={classes}>{children}</button>;
}
