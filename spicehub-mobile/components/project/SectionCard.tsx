import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import TaskCard from "./TaskCard";
import { TaskPriority, TaskStatus } from "@/models/Task";

interface Task {
  id: string;
  name: string;
  description: string;
  finished: string
  status: TaskStatus;
  priority: TaskPriority;
  deadlineDate: string
}

interface SectionCardProps {
  sectionName: string;
  taskCount: number;
  tasks: Task[];
}

export default function SectionCard({
  sectionName,
  taskCount,
  tasks,
}: SectionCardProps) {
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
          <TouchableOpacity className="p-1">
            <Text className="text-xl text-gray-600 font-bold">⋯</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="gap-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            name={task.name}
            description={task.description}
            finished={task.finished}
            status={task.status}
            priority={task.priority}
            deadlineDate={task.deadlineDate}
          />
        ))}
      </View>
    </View>
  );
}