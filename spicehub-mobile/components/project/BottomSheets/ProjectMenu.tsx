// ProjectMenu.tsx
import React from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Text } from "react-native";
import { Button } from "react-native-paper";

interface Props {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  onClose: () => void;
  onSheetChange?: (index: number) => void;
}

export default function ProjectMenu({
  bottomSheetModalRef,
  onClose,
  onSheetChange,
}: Props) {
  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={["50%"]}
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
        <Button onPress={onClose}>Dismiss</Button>
      </BottomSheetView>
    </BottomSheetModal>
  );
}