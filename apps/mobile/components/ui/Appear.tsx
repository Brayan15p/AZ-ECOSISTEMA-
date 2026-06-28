import type { ReactNode } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";

/**
 * Aparición suave hacia arriba con retardo (para listas escalonadas).
 * Envoltura sin `className` —solo layout— para no chocar con NativeWind.
 */
export function Appear({
  children,
  delay = 0,
  distance = 14,
}: {
  children: ReactNode;
  delay?: number;
  distance?: number;
}) {
  return (
    <Animated.View
      entering={FadeInDown.springify().damping(18).mass(0.7).delay(delay).withInitialValues({
        transform: [{ translateY: distance }],
        opacity: 0,
      })}
    >
      {children}
    </Animated.View>
  );
}
