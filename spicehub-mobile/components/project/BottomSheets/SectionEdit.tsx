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

export interface SectionEditProps {
  onSheetChange: (idx: number) => void;
  oldName: string;
  onSave: (name: string) => void;
}

export default function SectionEdit({
  onSheetChange,
  oldName,
  onSave,
}: SectionEditProps) {
  const { register, close } = useSheets();
  const [name, setName] = useState<string>("");

  const snapPoints = useMemo(() => ["30%"], []);

  function handleSave() {
    onSave(name.trim());
    close("sectionEdit");
  }

  return (
    <BottomSheetModal
      ref={register("sectionEdit")}
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
            Edytuj sekcję
          </Text>

          {/* PROJECT NAME */}
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Nazwa sekcji
          </Text>
          <BottomSheetTextInput
            className="bg-white border border-[#1976d2] rounded-md px-4 py-2 mb-4 text-base"
            placeholder="Wpisz nową nazwę sekcji"
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
              <Text className="text-[#1976d2]">Anuluj</Text>
            </Pressable>
            <Pressable
              className="bg-[#1976d2] px-4 py-2 rounded-md"
              onPress={handleSave}
            >
              <Text className="text-white">Zapisz</Text>
            </Pressable>
          </View>
        </BottomSheetScrollView>
      </KeyboardAvoidingView>
    </BottomSheetModal>
  );
}