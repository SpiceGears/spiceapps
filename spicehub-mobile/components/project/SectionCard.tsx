import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import TaskCard from "./TaskCard";
import { TaskPriority, TaskStatus } from "@/models/Task";
import TaskDelete from "@/components/project/BottomSheets/TaskDelete"
import { Task } from "@/models/Task";
import { useSheets } from "@/contexts/SheetsContext";

interface SectionCardProps {
  sectionName: string;
  taskCount: number;
  tasks: Task[];
  sectionId: string;
  setSelectedTask: (data: { sectionId: string; task: Task } | null) => void;
  onOpenSectionMenu: (sectionId: string) => void;
}

export default function SectionCard({
  sectionName,
  taskCount,
  tasks,
  sectionId,
  setSelectedTask,
  onOpenSectionMenu
}: SectionCardProps) {
  const { open } = useSheets();
  return (
    <View className="bg-light-bg rounded-xl mr-4 p-4 w-80 shadow-lg min-h-96">
      <View className="flex-row justify-between items-center mb-4 pb-3 border-b border-gray-300">
        <Text className="text-lg font-bold text-gray-800">{sectionName}</Text>
        <View className="flex-row items-center">
          <View className="mr-3">
            <View className="bg-light-primary rounded-xl min-w-6 h-6 justify-center items-center px-2">
              <Text className="text-white text-xs font-bold">{taskCount}</Text>
            </View>
          </View>
          <TouchableOpacity className="p-1" onPress={() => onOpenSectionMenu(sectionId)}>
            <Text className="text-xl text-gray-600 font-bold">⋯</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="gap-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            sectionId={sectionId}
            task={task}
            setSelectedTask={setSelectedTask}
          />
        ))}
      </View>
    </View>
  );
}