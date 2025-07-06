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
import { Picker } from "@react-native-picker/picker"; // Import Picker
import DateTimePicker from "@react-native-community/datetimepicker"; // Import DateTimePicker
import { Section, TaskStatus } from "@/models/Task";

export interface TaskCreateProps {
  onSheetChange: (idx: number) => void;
  onSave: (
    name: string,
    description: string,
    priority: number,
    status: TaskStatus,
    deadlineDate: Date | undefined,
    section: string
  ) => void;
  sections: Section[];
}

export default function TaskCreate({
  onSheetChange,
  onSave,
  sections
}: TaskCreateProps) {
  const { register, close } = useSheets();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<number>(1);
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.Planned);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [selectedSection, setSelectedSection] = useState<string | undefined>(undefined);

  const snapPoints = useMemo(() => ["80%"], []);

  function handleSave() {
      onSave(name.trim(), description.trim(), priority, status, date, selectedSection!);
      close("taskCreate");
    }

  return (
    <BottomSheetModal
      ref={register("taskCreate")}
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
            Utwórz zadanie
          </Text>

          {/* PROJECT NAME */}
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Nazwa zadania
          </Text>
          <BottomSheetTextInput
            className="bg-white border border-[#1976d2] rounded-md px-4 py-2 mb-4 text-base"
            placeholder="Wpisz nową nazwę sekcji"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />

          {/* DESCRIPTION */}
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Opis zadania
          </Text>
          <BottomSheetTextInput
            className="bg-white border border-[#1976d2] rounded-md px-4 py-2 mb-4 text-base"
            placeholder="Dodaj opis zadania"
            placeholderTextColor="#888"
            multiline
            numberOfLines={3}
            value={description}
            onChangeText={setDescription}
          />

          {/* SECTION DROPDOWN */}
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Sekcja
          </Text>
          <View className="bg-white border border-[#1976d2] rounded-md mb-4">
            <Picker
              selectedValue={selectedSection}
              onValueChange={(itemValue) => setSelectedSection(itemValue)}
            >
              {sections.map((section) => (
                <Picker.Item key={section.id} label={section.name} value={section.id} color="black" />
              ))}
            </Picker>
          </View>

          {/* PRIORITY DROPDOWN */}
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Priorytet
          </Text>
          <View className="bg-white border border-[#1976d2] rounded-md mb-4">
            <Picker
              selectedValue={priority}
              onValueChange={(itemValue) => setPriority(itemValue)}
            >
              <Picker.Item label="Niski" value={1} color="black" />
              <Picker.Item label="Średni" value={2} color="black" />
              <Picker.Item label="Wysoki" value={3} color="black" />
            </Picker>
          </View>

          {/* STATUS DROPDOWN */}
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Status
          </Text>
          <View className="bg-white border border-[#1976d2] rounded-md mb-4">
            <Picker
              selectedValue={status}
              onValueChange={(itemValue) => setStatus(itemValue as TaskStatus)}
            >
              <Picker.Item label="Do zrobienia" value={TaskStatus.Planned} color="black" />
              <Picker.Item label="W trakcie" value={TaskStatus.OnTrack} color="black" />
              <Picker.Item label="Zrobione" value={TaskStatus.Finished} color="black" />
              <Picker.Item label="Problem" value={TaskStatus.Problem} color="black" />
            </Picker>
          </View>

          {/* DATE PICKER */}
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Termin
          </Text>
          <Pressable
            className="bg-white border border-[#1976d2] rounded-md px-4 py-2 mb-4"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className="text-base text-gray-800">
              {date ? date.toLocaleDateString() : "Wybierz termin"}
            </Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}

          {/* ACTIONS */}
          <View className="flex-row justify-end">
            <Pressable
              className="px-4 py-2 mr-4"
              onPress={() => close("taskCreate")}
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