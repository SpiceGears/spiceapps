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

export interface DeleteSectionProps {
    onSheetChange: (idx: number) => void;
    deleteSection: () => void; 
}

export default function DeleteSection({ onSheetChange, deleteSection }: DeleteSectionProps) {
  const { register, close } = useSheets();
  const snapPoints = useMemo(() => ["30%"], []);

  const handleDeletePress = () => {
    deleteSection();
    close("sectionDelete");
  };

  const handleCancel = () => {
    close("sectionDelete");
  };

  return (
    <BottomSheetModal
      ref={register("sectionDelete")}
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
        <Text className="text-lg font-semibold mb-4 text-center text-light-danger">
          Czy jesteś pewny? Ta akcja nie może być cofnięta!
        </Text>

        {/* Delete */}
        <Pressable
          className="flex-row items-center py-3"
          onPress={handleDeletePress}
        >
          <Ionicons name="trash" size={20} color="#da4755" />
          <Text className="ml-4 text-base text-light-danger">
            Usuń sekcję
          </Text>
        </Pressable>

        <Divider color="gray" thickness={1} />

        {/* Cancel */}
        <Pressable
          className="flex-row items-center py-3"
          onPress={handleCancel}
        >
          <Ionicons name="close" size={20} color="#444" />
          <Text className="ml-4 text-base text-gray-800">
            Anuluj
          </Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
}