import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface AddSectionCardProps {
  onPress?: () => void;
}

export default function AddSectionCard({ onPress }: AddSectionCardProps) {
  return (
    <TouchableOpacity
      className="bg-white rounded-xl mr-4 p-4 w-80 shadow-lg border-2 border-dashed border-blue-600 justify-center items-center min-h-52"
      onPress={onPress}
    >
      <View className="items-center justify-center">
        <Text className="text-5xl text-blue-600 mb-3">+</Text>
        <Text className="text-lg font-semibold text-blue-600">Add Section</Text>
      </View>
    </TouchableOpacity>
  );
}