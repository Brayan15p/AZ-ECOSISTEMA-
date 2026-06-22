import { useState } from "react";
import { FlatList, View } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";
import { Card } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Chip } from "@/ui/Chip";
import { TextField } from "@/ui/TextField";
import { Sheet } from "@/ui/Sheet";
import { SegmentedTabs } from "@/ui/SegmentedTabs";
import { useOperatorStore } from "@/state/operatorStore";
import type { Publication } from "@shared/types";

const CATEGORIES: Publication["category"][] = ["anuncio", "campaña", "educativo", "alerta"];

export default function PublicationsScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const publications = useOperatorStore((s) => s.publications);
  const addPublication = useOperatorStore((s) => s.addPublication);
  const deletePublication = useOperatorStore((s) => s.deletePublication);

  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<Publication["category"]>("anuncio");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const submit = () => {
    if (!title.trim() || !body.trim()) return;
    addPublication({ title: title.trim(), body: body.trim(), category, imageUrl: imageUrl.trim() || null });
    setOpen(false);
    setTitle("");
    setBody("");
    setImageUrl("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgCanvas }}>
      <View style={{ paddingTop: spacing["5xl"], paddingHorizontal: spacing["2xl"], paddingBottom: spacing.lg }}>
        <Button label="← Volver" variant="ghost" size="sm" onPress={() => router.back()} />
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.sm }}>
          <Text variant="h2">Publicaciones</Text>
          <Button label="+ Nueva" size="sm" onPress={() => setOpen(true)} />
        </View>
        <Text variant="bodySm" tone="secondary" style={{ marginTop: spacing.xs }}>
          Se verán en la app ciudadana, sección Noticias.
        </Text>
      </View>

      <FlatList
        data={publications}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: spacing["2xl"], gap: spacing.md, paddingBottom: spacing["5xl"] }}
        ListEmptyComponent={<Text tone="muted">Sin publicaciones aún.</Text>}
        renderItem={({ item }) => (
          <Card padding={spacing.lg}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View style={{ flex: 1 }}>
                <Chip label={item.category} tone="info" />
                <Text variant="h3" style={{ marginTop: spacing.xs }}>
                  {item.title}
                </Text>
                <Text variant="bodySm" tone="secondary" style={{ marginTop: spacing.xs }}>
                  {item.body}
                </Text>
              </View>
            </View>
            <Button label="Eliminar" variant="ghost" size="sm" onPress={() => deletePublication(item.id)} />
          </Card>
        )}
      />

      <Sheet visible={open} onClose={() => setOpen(false)}>
        <Text variant="h3">Nueva publicación</Text>
        <View style={{ marginTop: spacing.lg, gap: spacing.lg }}>
          <SegmentedTabs
            options={CATEGORIES.map((c) => ({ key: c, label: c }))}
            value={category}
            onChange={(k) => setCategory(k as Publication["category"])}
          />
          <TextField label="Título" value={title} onChangeText={setTitle} />
          <TextField label="Contenido" value={body} onChangeText={setBody} multiline numberOfLines={4} />
          <TextField label="URL de imagen (opcional)" value={imageUrl} onChangeText={setImageUrl} autoCapitalize="none" />
          <Button label="Publicar" onPress={submit} />
        </View>
      </Sheet>
    </View>
  );
}
