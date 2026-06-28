import { useEffect, useRef, useState } from "react";
import { Text, type TextStyle } from "react-native";

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/**
 * Número que "cuenta" de su valor anterior al nuevo con una curva suave.
 * Implementado con requestAnimationFrame (sin worklets) para ser 100% fiable.
 * El detalle de Apple: los datos importantes aterrizan, no aparecen.
 */
export function CountUp({
  value,
  duration = 900,
  format = (n) => String(Math.round(n)),
  className,
  style,
  accessibilityLabel,
}: {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
  style?: TextStyle;
  accessibilityLabel?: string;
}) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const delta = value - from;
    if (delta === 0) return;
    const start = Date.now();

    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      const current = from + delta * easeOutCubic(t);
      setDisplay(current);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = value;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      fromRef.current = value;
    };
  }, [value, duration]);

  return (
    <Text
      className={className}
      style={style}
      accessibilityLabel={accessibilityLabel ?? format(value)}
    >
      {format(display)}
    </Text>
  );
}
