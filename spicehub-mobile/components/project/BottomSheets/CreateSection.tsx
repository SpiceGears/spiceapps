// ProjectEdit.tsx
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useSheets } from "@/contexts/SheetsContext";

export interface CreateSectionProps {
  onSheetChange: (idx: number) => void;
  initialName?: string;
  onSave: (name: string) => void;
}

export default function SectionCreate({
  onSheetChange,
  initialName = 'Nowa sekcja',
  onSave,
}: CreateSectionProps) {
  const { register, close } = useSheets();
  const [name, setName] = useState(initialName!);

  const snapPoints = useMemo(() => ["30%"], []);

  function handleSave() {
    onSave(name.trim());
    close("createSection");
  }

  return (
    <BottomSheetModal
      ref={register("createSection")}
      index={1}
      snapPoints={snapPoints}
      onChange={onSheetChange}
      enablePanDownToClose
      handleIndicatorStyle={{ backgroundColor: "#ccc", width: 40 }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />
      )}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustPan"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <BottomSheetScrollView
          contentContainerStyle={{ padding: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-xl font-semibold mb-6 text-center">
            Edit Project
          </Text>

          {/* PROJECT NAME */}
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Project Name
          </Text>
          <BottomSheetTextInput
            className="bg-white border border-[#1976d2] rounded-md px-4 py-2 mb-4 text-base"
            placeholder="Enter project name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />

          {/* ACTIONS */}
          <View className="flex-row justify-end">
            <Pressable
              className="px-4 py-2 mr-4"
              onPress={() => close("projectEdit")}
            >
              <Text className="text-[#1976d2]">Cancel</Text>
            </Pressable>
            <Pressable
              className="bg-[#1976d2] px-4 py-2 rounded-md"
              onPress={handleSave}
            >
              <Text className="text-white">Save</Text>
            </Pressable>
          </View>
        </BottomSheetScrollView>
      </KeyboardAvoidingView>
    </BottomSheetModal>
  );
}