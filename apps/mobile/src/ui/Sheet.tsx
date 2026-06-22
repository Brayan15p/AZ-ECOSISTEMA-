import { Modal, Pressable, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Sheet({ visible, onClose, children }: Props) {
  const { colors, radius, spacing } = useTheme();
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: colors.bgOverlay, justifyContent: "flex-end" }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: colors.bgSurface,
            borderTopLeftRadius: radius["2xl"],
            borderTopRightRadius: radius["2xl"],
            padding: spacing["2xl"],
            maxHeight: "85%"
          }}
        >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
