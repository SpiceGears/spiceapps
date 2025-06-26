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

interface ProjectMenuProps {
  onSheetChange: (idx: number) => void;
}

export default function ProjectMenu({ onSheetChange }: ProjectMenuProps) {
  const { register, close, open } = useSheets();
  const snapPoints = useMemo(() => ["50%", "94%"], []);

  // helper to run your action then dismiss
  const handleItemPress = (action: () => void) => {
    action();
    close("projectSettings");
  };

  return (
    <BottomSheetModal
      ref={register("projectSettings")}
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
          Opcje projektu
        </Text>

        {/* Edit */}
        <Pressable
          className="flex-row items-center py-3"
          onPress={() =>
            handleItemPress(() => {
              open("projectEdit")
            })
          }
        >
          <Ionicons name="pencil" size={20} color="#444" />
          <Text className="ml-4 text-base text-gray-800">
            Edytuj projekt
          </Text>
        </Pressable>
        <Divider 
          color="gray"
          thickness={1}
        />

        {/* Activity */}
        <Pressable
          className="flex-row items-center py-3"
          onPress={() =>
            handleItemPress(() => {
              // TODO: your share logic
            })
          }
        >
          <Ionicons name="time-outline" size={20} color="#444" />
          <Text className="ml-4 text-base text-gray-800">
            Zobacz historię aktywności
          </Text>
        </Pressable>
                <Divider 
          color="gray"
          thickness={1}
        />

        {/* Share */}
        <Pressable
          className="flex-row items-center py-3"
          onPress={() =>
            handleItemPress(() => {
              // TODO: your share logic
            })
          }
        >
          <Ionicons name="share-social" size={20} color="#444" />
          <Text className="ml-4 text-base text-gray-800">
            Udostępnij projekt
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
              open("projectDelete")
            })
          }
        >
          <Ionicons name="trash" size={20} color="hsl(9 21% 41%)" />
          <Text className="ml-4 text-base text-light-danger">
            Usuń projekt
          </Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
}