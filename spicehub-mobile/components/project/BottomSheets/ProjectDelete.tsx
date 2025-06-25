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

export interface ProjectMenuProps {
    onSheetChange: (idx: number) => void;
    deleteProject: () => void; 
}

export default function ProjectDelete({ onSheetChange, deleteProject }: ProjectMenuProps) {
    const { register, close, open } = useSheets();
    const snapPoints = useMemo(() => ["30%"], []);

    const handleItemPress = (action: () => void) => {
        action();
        close("projectDelete");
    };

    return (
        <BottomSheetModal
            ref={register("projectDelete")}
            index={1}
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
                <Text className="text-lg font-semibold mb-4 text-center text-red-400">
                    Czy jesteś pewny? Ten akcji nie można odwrócić!
                </Text>

                {/* Delete */}
                <Pressable
                    className="flex-row items-center py-3"
                    onPress={deleteProject}
                >
                    <Ionicons name="trash" size={20} color="crimson" />
                    <Text className="ml-4 text-base text-red-600">
                        Usuń projekt
                    </Text>
                </Pressable>

                <Divider
                    color="gray"
                    thickness={1}
                />

                {/* Share */}
                <Pressable
                    className="flex-row items-center py-3"
                    onPress={() => {
                        handleItemPress(() => {
                            open("projectSettings")
                        })
                    }}
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