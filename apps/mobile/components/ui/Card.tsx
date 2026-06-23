import type { ReactNode } from "react";
import { View } from "react-native";
import { cn } from "../../lib/cn";

/** Superficie elevada estilo iOS (esquinas suaves + borde sutil). */
export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <View
      className={cn(
        "rounded-2xl border border-border bg-surface p-4",
        className,
      )}
    >
      {children}
    </View>
  );
}
