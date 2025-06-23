// ProjectMenu.tsx
import React, { useMemo } from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Text } from "react-native";
import { Button } from "react-native-paper";
import { useSheets } from "@/contexts/SheetsContext";

interface ProjectMenuProps {
    onSheetChange: () => void;
}

export default function ProjectMenu({
    onSheetChange
}:ProjectMenuProps) {
    const { register, close } = useSheets();
    const snapPoints = useMemo(() => ['50%'], []);
  return (
    <BottomSheetModal
      ref={register("projectSettings")}
      index={1}
      snapPoints={snapPoints}
      onChange={onSheetChange}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="close"
        />
      )}
    >
      <BottomSheetView className="p-4">
        <Text className="text-lg mb-4">Awesome options 🎉</Text>
        <Button onPress={() => close("projectSettings")}>Dismiss</Button>
      </BottomSheetView>
    </BottomSheetModal>
  );
}