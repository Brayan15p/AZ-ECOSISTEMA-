import { Ionicons } from "@expo/vector-icons";
import {
  WASTE_CATEGORIES,
  searchWaste,
  type WasteCategoryId,
} from "@az/core";
import { gray, wasteCategory } from "@az/ui-tokens";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { Appear } from "../../components/ui/Appear";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { IconBadge } from "../../components/ui/IconBadge";
import { Screen } from "../../components/ui/Screen";
import { withAlpha } from "../../lib/color";

type CatMeta = {
  id: WasteCategoryId;
  label: string;
  bag: string;
  tip: string;
  color: string;
  icon: string;
};

const CATS: CatMeta[] = (Object.keys(WASTE_CATEGORIES) as WasteCategoryId[]).map(
  (id) => ({
    id,
    label: WASTE_CATEGORIES[id].label,
    bag: WASTE_CATEGORIES[id].bag,
    tip: WASTE_CATEGORIES[id].tip,
    color: wasteCategory[id].color,
    icon: wasteCategory[id].icon,
  }),
);

const META = Object.fromEntries(CATS.map((c) => [c.id, c])) as Record<WasteCategoryId, CatMeta>;

export default function Clasificar() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<WasteCategoryId | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const results = useMemo(() => {
    const base = searchWaste(query);
    return filter ? base.filter((it) => it.category === filter) : base;
  }, [query, filter]);

  return (
    <Screen scroll={false}>
      <Appear>
        <View className="pt-2">
          <Text className="text-title1 text-text-primary">¿Dónde va?</Text>
          <Text className="text-subhead text-text-secondary">
            Busca un residuo y te decimos en qué bolsa va.
          </Text>
        </View>
      </Appear>

      {/* Buscador */}
      <Appear delay={40}>
        <View className="flex-row items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3">
          <Ionicons name="search" size={18} color={gray[500]} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Ej: botella, pila, cáscara…"
            placeholderTextColor={gray[400]}
            className="flex-1 text-callout text-text-primary"
            autoCorrect={false}
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery("")} hitSlop={10} accessibilityLabel="Limpiar búsqueda">
              <Ionicons name="close-circle" size={18} color={gray[400]} />
            </Pressable>
          ) : null}
        </View>
      </Appear>

      {/* Filtros por categoría */}
      <Appear delay={80}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
        >
          <FilterChip
            label="Todos"
            active={filter === null}
            color={gray[700]}
            onPress={() => setFilter(null)}
          />
          {CATS.map((c) => (
            <FilterChip
              key={c.id}
              label={c.label}
              active={filter === c.id}
              color={c.color}
              icon={c.icon}
              onPress={() => setFilter(filter === c.id ? null : c.id)}
            />
          ))}
        </ScrollView>
      </Appear>

      {/* Resultados */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        {results.length === 0 ? (
          <EmptyState
            icon="help-buoy-outline"
            title="No lo encontramos"
            subtitle="Prueba con otra palabra. Si dudas, ante todo no contamines la bolsa blanca."
          />
        ) : (
          results.map((item) => {
            const m = META[item.category];
            const open = openId === item.name;
            return (
              <Card
                key={item.name}
                onPress={() => setOpenId(open ? null : item.name)}
                accessibilityLabel={`${item.name}: ${m.label}, ${m.bag}`}
                className="gap-2"
              >
                <View className="flex-row items-center gap-3">
                  <IconBadge icon={m.icon as never} color={m.color} />
                  <View className="flex-1">
                    <Text className="text-callout text-text-primary">{item.name}</Text>
                    <Text className="text-caption1" style={{ color: m.color, fontWeight: "600" }}>
                      {m.bag}
                    </Text>
                  </View>
                  <Ionicons name={open ? "chevron-up" : "chevron-down"} size={18} color={gray[400]} />
                </View>
                {open ? (
                  <View
                    className="flex-row gap-2 rounded-xl p-3"
                    style={{ backgroundColor: withAlpha(m.color, 0.08) }}
                  >
                    <Ionicons name="bulb-outline" size={16} color={m.color} />
                    <Text className="flex-1 text-footnote text-text-secondary">{m.tip}</Text>
                  </View>
                ) : null}
              </Card>
            );
          })
        )}
      </ScrollView>
    </Screen>
  );
}

function FilterChip({
  label,
  active,
  color,
  icon,
  onPress,
}: {
  label: string;
  active: boolean;
  color: string;
  icon?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      className="flex-row items-center gap-1.5 rounded-full border px-3.5 py-2 active:opacity-70"
      style={{
        backgroundColor: active ? color : "transparent",
        borderColor: active ? color : withAlpha(color, 0.3),
      }}
    >
      {icon ? (
        <Ionicons name={icon as never} size={14} color={active ? "#FFFFFF" : color} />
      ) : null}
      <Text
        className="text-footnote"
        style={{ color: active ? "#FFFFFF" : color, fontWeight: "600" }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
