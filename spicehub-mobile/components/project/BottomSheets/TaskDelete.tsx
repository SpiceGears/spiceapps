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
    deleteTask: () => void; 
}

export default function TaskDelete({ onSheetChange, deleteTask }: ProjectMenuProps) {
    const { register, close, open } = useSheets();
    const snapPoints = useMemo(() => ["30%"], []);

    const handleDeletePress = () => {
        deleteTask();
        close("taskDelete");
    };

    const handleCancelPress = () => {
        close("taskDelete");
        open("taskMenu");
    };

    return (
        <BottomSheetModal
            ref={register("taskDelete")}
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
                <Text className="text-lg font-semibold mb-4 text-center text-light-danger">
                    Czy jesteś pewny? Ten akcji nie można odwrócić!
                </Text>

                {/* Delete */}
                <Pressable
                    className="flex-row items-center py-3"
                    onPress={handleDeletePress}
                >
                    <Ionicons name="trash" size={20} color="#da4755" />
                    <Text className="ml-4 text-base text-light-danger">
                        Usuń zadanie
                    </Text>
                </Pressable>

                <Divider
                    color="gray"
                    thickness={1}
                />

                <Pressable
                    className="flex-row items-center py-3"
                    onPress={handleCancelPress}
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