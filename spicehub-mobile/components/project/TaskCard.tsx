import { useSheets } from "@/contexts/SheetsContext";
import { TaskPriority, TaskStatus } from "@/models/Task";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Task } from "@/models/Task";

interface TaskCardProps {
  sectionId: string;
  task: Task;
  setSelectedTask: (data: { sectionId: string; task: Task } | null) => void;
}

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.Planned:
      return "bg-slate-500";
    case TaskStatus.OnTrack:
      return "bg-blue-500";
    case TaskStatus.Finished:
      return "bg-green-500";
    case TaskStatus.Problem:
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getTaskStatusLabel = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.Planned:
      return "Planowane";
    case TaskStatus.OnTrack:
      return "W trakcie";
    case TaskStatus.Finished:
      return "Ukończone";
    case TaskStatus.Problem:
      return "Problem";
    default:
      return "Nieznany";
  }
};

const getTaskPriorityLabel = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.Low:
      return "Niski";
    case TaskPriority.Medium:
      return "Średni";
    case TaskPriority.High:
      return "Wysoki";
    default:
      return "Średni";
  }
};

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.Low:
      return "bg-emerald-500";
    case TaskPriority.Medium:
      return "bg-amber-500";
    case TaskPriority.High:
      return "bg-rose-500";
    default:
      return "bg-gray-500";
  }
};

export default function TaskCard({
  task,
  sectionId,
  setSelectedTask
}: TaskCardProps) {
  const { id, name, description, finished, status, priority, deadlineDate } = task;
  const isFinished = Boolean(finished);
  const { open } = useSheets();

  const handleOpenTaskMenu = () => {
    setSelectedTask({ sectionId, task: task });
    open("taskMenu");
  };

  return (
    <View className="bg-light-bg-light rounded-xl p-5 border-l-4 border-light-primary shadow-sm mb-3">
      {/* Header Section */}
      <View className="flex-row items-start mb-4">
        <TouchableOpacity className="mr-4 pt-1">
          <View
            className={`w-6 h-6 rounded-full border-2 ${
              isFinished
                ? "bg-green-500 border-green-500"
                : "bg-white border-gray-300"
            } justify-center items-center shadow-sm`}
          >
            {isFinished && (
              <Text className="text-white text-xs font-bold">✓</Text>
            )}
          </View>
        </TouchableOpacity>
        
        <View className="flex-1">
          <Text
            className={`text-lg font-bold text-light-text mb-2 ${
              isFinished ? "line-through opacity-60" : ""
            }`}
          >
            {name}
          </Text>
          <Text
            className={`text-sm text-light-text-muted leading-5 ${
              isFinished ? "line-through opacity-60" : ""
            }`}
          >
            {description}
          </Text>
        </View>
        
        <TouchableOpacity className="p-2 -mr-2 -mt-1" onPress={handleOpenTaskMenu}>
          <Text className="text-lg text-gray-400 font-bold">⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View className="border-b border-gray-100 mb-4" />

      {/* Footer Section */}
      <View className="flex-row justify-between items-center">
        {/* Status and Priority Badges */}
        <View className="flex-row gap-2">
          <View className={`px-3 py-1.5 rounded-full ${getStatusColor(status)}`}>
            <Text className="text-white text-xs font-semibold tracking-wide">
              {getTaskStatusLabel(status)}
            </Text>
          </View>
          <View className={`px-3 py-1.5 rounded-full ${getPriorityColor(priority)}`}>
            <Text className="text-white text-xs font-semibold tracking-wide">
              {getTaskPriorityLabel(priority)}
            </Text>
          </View>
        </View>

        {/* Date */}
        <View className="flex-row items-center">
          <View className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
          <Text className="text-xs text-gray-500 font-medium">
            {new Date(deadlineDate).toLocaleDateString('pl-PL')}
          </Text>
        </View>
      </View>
    </View>
  );
}