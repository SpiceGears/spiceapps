// ProjectMenu.tsx
import React, { useMemo } from "react";
import { Pressable, View } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Text } from "react-native";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useSheets } from "@/contexts/SheetsContext";
import Divider from "@/components/utilities/Divider";
import { Task } from "@/models/Task";

interface SectionMenuProps {
  onSheetChange: (idx: number) => void;
  selectedTask: { sectionId: string; task: Task } | null;
}

export default function SectionMenu({ onSheetChange }: SectionMenuProps) {
  const { register, close, open } = useSheets();
  const snapPoints = useMemo(() => ["50%", "94%"], []);

  // helper to run your action then dismiss
  const handleItemPress = (action: () => void) => {
    action();
    close("sectionMenu");
  };

  return (
    <BottomSheetModal
      ref={register("sectionMenu")}
      index={1}                   // open at snapPoints[1] === "94%"
      snapPoints={snapPoints}
      onChange={onSheetChange}
      enablePanDownToClose={true}
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
          Opcje sekcji
        </Text>

        {/* Edit */}
        <Pressable
          className="flex-row items-center py-3"
          onPress={() =>
            handleItemPress(() => {
              open("sectionEdit")
            })
          }
        >
          <Ionicons name="pencil" size={20} color="#444" />
          <Text className="ml-4 text-base text-gray-800">
            Edytuj sekcję
          </Text>
        </Pressable>
        <Divider 
          color="gray"
          thickness={1}
        />

        {/* Delete */}
        <Pressable
          className="flex-row items-center py-3"
          onPress={() =>
            handleItemPress(() => {
              open("sectionDelete")
            })
          }
        >
          <Ionicons name="trash" size={20} color="#da4755" />
          <Text className="ml-4 text-base text-light-danger">
            Usuń sekcję
          </Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
}