import { View, Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSheets } from "@/contexts/SheetsContext";

export interface NavigationProps {
  currentTab: string;
}

export default function Navigation({ currentTab }: NavigationProps) {
  const insets = useSafeAreaInsets();
  const { open } = useSheets();

  const getLabel = (tab: string) => {
    switch (tab) {
      case "Table":
        return "Tabela";
      case "Overview":
        return "Przegląd";
      case "Dashboard":
        return "Dashboard";
      default:
        return "";
    }
  };

  return (
    <View
      className="absolute left-0 right-0 flex-row items-center justify-center"
      style={{ bottom: insets.bottom + 10 }}
    >
      {/* LEFT BUTTON */}
      <Pressable
        onPress={() => open("filters")}
        className="p-3 rounded-full bg-light-primary shadow-lg"
      >
        <Ionicons name="chevron-back-outline" size={24} color="white" />
      </Pressable>

      {/* CENTER BUTTON */}
      <Pressable
        onPress={() => open("tabSelection")}
        className="mx-16 w-40 p-3 rounded-full bg-light-primary shadow-lg
                   items-center justify-center"
      >
        <Text className="text-dark-text text-xl">{getLabel(currentTab)}</Text>
      </Pressable>

      {/* RIGHT BUTTON */}
      <Pressable
        onPress={() => open("taskCreate")}
        className="p-3 rounded-full bg-light-primary shadow-lg"
      >
        <Ionicons name="add-outline" size={24} color="white" />
      </Pressable>
    </View>
  );
}