import { Pressable, Text } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons";
import { useSheets } from "@/contexts/SheetsContext";

export interface NavigationProps {
    currentTab: string
}

export default function Navigation({ currentTab }: NavigationProps) {
    const insets = useSafeAreaInsets();
    const { register, close, open } = useSheets();

    const getLabel = (currentTab: string) => {
        switch(currentTab) {
            case "Table":
                return "Tabela"
            case "Overview":
                return "Przegląd"
            case "Dashboard":
                return "Dashboard"
        }
    }

    return (
        <Pressable
            onPress={() => open("tabSelection")}
            className="absolute left-1/2 transform -translate-x-1/2 w-40 p-3 rounded-full shadow-lg
                     bg-light-primary items-center justify-center"
            style={{
                bottom: insets.bottom + 20,
            }}
        >
            <Text className="text-dark-text text-xl text-center">
                {getLabel(currentTab)}
            </Text>
        </Pressable>
    )
}