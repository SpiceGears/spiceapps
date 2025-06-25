import { TaskPriority, TaskStatus } from "@/models/Task";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface TaskCardProps {
  id: number;
  name: string;
  description: string;
  isCompleted: boolean;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.Planned:
      return "bg-green-500";
    case TaskStatus.OnTrack:
      return "bg-blue-500";
    case TaskStatus.Finished:
      return "bg-orange-500";
    case TaskStatus.Problem:
        return "bg-white"
  }
};

const getTakStatusLabel = (status: TaskStatus) => {
    switch(status) {
        case -1:
            return "Planowane"
        case 0:
            return "W trakcie"
        case 1:
            return "Ukończone"
        case 2:
            return "Problem"
    }
}

const getTaskPriorityLabel = (priority: TaskPriority) => {
    switch(priority) {
        case TaskPriority.Low:
            return "Niski"
        case TaskPriority.Medium:
            return "Średni"
        case TaskPriority.High:
            return "Wysoki"
    }
}

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.Low:
      return "bg-green-500";
    case TaskPriority.Medium:
      return "bg-orange-500";
    case TaskPriority.High:
        return "bg-red-500"
  }
};

export default function TaskCard({
  id,
  name,
  description,
  isCompleted,
  status,
  priority,
  dueDate,
}: TaskCardProps) {
  return (
    <View className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-600">
      <View className="flex-row items-start mb-3">
        <TouchableOpacity className="mr-3 pt-0.5">
          <View
            className={`w-5 h-5 rounded-full border-2 ${
              isCompleted
                ? "bg-green-500 border-green-500"
                : "bg-white border-gray-300"
            } justify-center items-center`}
          >
            {isCompleted && <Text className="text-white text-xs font-bold">✓</Text>}
          </View>
        </TouchableOpacity>
        <View className="flex-1">
          <Text
            className={`text-base font-semibold text-gray-800 mb-1 ${
              isCompleted ? "line-through opacity-60" : ""
            }`}
          >
            {name}
          </Text>
          <Text
            className={`text-sm text-gray-600 leading-5 ${
              isCompleted ? "line-through opacity-60" : ""
            }`}
          >
            {description}
          </Text>
        </View>
        <TouchableOpacity className="p-1 ml-2">
          <Text className="text-base text-gray-600 font-bold">⋯</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-between items-end">
        <View className="flex-row gap-2">
          <View className={`px-2 py-1 rounded-xl ${getStatusColor(status)}`}>
            <Text className="text-white text-xs font-medium">{getTakStatusLabel(status)}</Text>
          </View>
          <View className={`px-2 py-1 rounded-xl ${getPriorityColor(priority)}`}>
            <Text className="text-white text-xs font-medium">{getTaskPriorityLabel(priority)}</Text>
          </View>
        </View>
        <Text className="text-xs text-gray-600 font-medium">{dueDate}</Text>
      </View>
    </View>
  );
}