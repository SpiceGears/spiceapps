import React, { useMemo } from "react"
import { Pressable } from "react-native"
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet"
import { Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useSheets } from "@/contexts/SheetsContext"
import Divider from "@/components/utilities/Divider"

export interface ProjectMenuProps {
  onSheetChange: (idx: number) => void
  setCurrentTab: (name: "Overview" | "Table" | "Dashboard") => void
}

export default function TabSelection({
  onSheetChange,
  setCurrentTab,
}: ProjectMenuProps) {
  const { register, close } = useSheets()
  const snapPoints = useMemo(() => ["50%", "94%"], [])

  const handleItemPress = (tab: "Overview" | "Table" | "Dashboard") => {
    setCurrentTab(tab)
    close("tabSelection")
  }

  return (
    <BottomSheetModal
      ref={register("tabSelection")}
      index={1}
      snapPoints={snapPoints}
      onChange={onSheetChange}
      enablePanDownToClose
      handleIndicatorStyle={{ backgroundColor: "#ccc", width: 40 }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={0}
          appearsOnIndex={1}
          pressBehavior="close"
        />
      )}
    >
      <BottomSheetView className="p-4">
        <Text className="text-lg font-semibold mb-4 text-center">
          Wybierz zakładkę
        </Text>

        <Pressable
          className="flex-row items-center py-3"
          onPress={() => handleItemPress("Overview")}
        >
          <Ionicons name="eye-outline" size={20} color="#444" />
          <Text className="ml-4 text-base text-gray-800">Przegląd</Text>
        </Pressable>
        <Divider color="gray" thickness={1} />

        <Pressable
          className="flex-row items-center py-3"
          onPress={() => handleItemPress("Table")}
        >
          <Ionicons name="grid-outline" size={20} color="#444" />
          <Text className="ml-4 text-base text-gray-800">Tablica</Text>
        </Pressable>
        <Divider color="gray" thickness={1} />

        <Pressable
          className="flex-row items-center py-3"
          onPress={() => handleItemPress("Dashboard")}
        >
          <Ionicons
            name="stats-chart-outline"
            size={20}
            color="#444"
          />
          <Text className="ml-4 text-base text-gray-800">Dashboard</Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  )
}