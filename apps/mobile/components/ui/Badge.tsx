import { Text, View } from "react-native";

/** Etiqueta de estado con color a medida (pasamos hex desde los tokens). */
export function Badge({ label, color }: { label: string; color: string }) {
  return (
    <View
      className="self-start rounded-full px-3 py-1"
      style={{ backgroundColor: `${color}1A` }} // ~10% alpha
    >
      <Text className="text-footnote" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}
