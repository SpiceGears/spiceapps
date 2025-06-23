import { router } from "expo-router";
import {
  Pressable,
  View,
  Text,
  LayoutChangeEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/Constants/TeamColors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Project } from "@/models/Project";
import { useBottomSheet } from "@/contexts/BottomSheetContext";

interface HeaderProps {
  project: Project;
}

export default function ProjectScreenHeader({
  project,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const { present } = useBottomSheet();

  function getHeaderColor(scopes?: string[]) {
    if (!scopes?.length || scopes.length > 1) return COLORS.NEUTRAL;
    for (let s of scopes) {
      const key = s.trim().toUpperCase() as keyof typeof COLORS;
      if (key in COLORS) return COLORS[key];
    }
    return COLORS.NEUTRAL;
  }

  const headerBg = getHeaderColor(project?.scopesRequired);

  return (
    <View
      className="absolute top-0 left-0 right-0 z-10 px-4 pb-5"
      style={{
        paddingTop: insets.top + 8,
        backgroundColor: headerBg,
      }}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.replace("/(tabs)/spicelab")}>
            <Ionicons name="arrow-back" size={22} color="#000" />
          </Pressable>
          <Text className="ml-3 mb-0.5 text-[20px] text-black">
            Powrót
          </Text>
        </View>
        <Pressable onPress={present}>
          <Ionicons name="ellipsis-horizontal" size={28} color="#000" />
        </Pressable>
      </View>
      <View className="flex-row items-center mt-8">
        <Ionicons name="folder" size={25} color="#000" />
        <Text className="ml-5 text-2xl font-bold text-black">
          {project?.name}
        </Text>
      </View>
    </View>
  );
}