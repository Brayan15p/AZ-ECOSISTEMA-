import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Superficie elevada, esquinas suaves estilo iOS. */
export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-6 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
