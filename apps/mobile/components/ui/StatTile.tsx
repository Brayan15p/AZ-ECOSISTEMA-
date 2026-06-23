import { Text } from "react-native";
import { Card } from "./Card";

/** Métrica compacta: valor grande + etiqueta + pista opcional. */
export function StatTile({
  label,
  value,
  hint,
  valueColor,
}: {
  label: string;
  value: string;
  hint?: string;
  valueColor?: string;
}) {
  return (
    <Card className="flex-1">
      <Text className="text-caption1 uppercase text-text-tertiary">{label}</Text>
      <Text
        className="mt-1 text-title1 text-text-primary"
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </Text>
      {hint ? (
        <Text className="mt-0.5 text-footnote text-text-secondary">{hint}</Text>
      ) : null}
    </Card>
  );
}
