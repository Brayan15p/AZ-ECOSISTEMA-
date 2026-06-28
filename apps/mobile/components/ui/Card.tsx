import type { ReactNode } from "react";
import { View } from "react-native";

import { cn } from "../../lib/cn";
import { PressableScale } from "./PressableScale";

/**
 * Superficie elevada estilo iOS (esquinas suaves + borde sutil).
 * Si recibe `onPress`, se vuelve táctil con el rebote de `PressableScale`.
 */
export function Card({
  children,
  className,
  onPress,
  accessibilityLabel,
  accessibilityHint,
}: {
  children: ReactNode;
  className?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}) {
  const classes = cn("rounded-2xl border border-border bg-surface p-4", className);

  if (onPress) {
    return (
      <PressableScale
        onPress={onPress}
        className={classes}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        scaleTo={0.98}
      >
        {children}
      </PressableScale>
    );
  }

  return <View className={classes}>{children}</View>;
}
