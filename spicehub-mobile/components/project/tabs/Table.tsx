import React from "react";
import { SafeAreaView, ScrollView, useWindowDimensions } from "react-native";
import SectionCard from "../SectionCard";
import AddSectionCard from "../AddSectionCard";
import { Section, Task } from "@/models/Task";

// Extended interface to include the combined data
interface ExtendedSection extends Section {
  tasks: Task[];
  taskCount: number;
}

export interface TasksTabProps {
  sectionsData: ExtendedSection[];
  setSelectedTask: (data: { sectionId: string; task: Task } | null) => void;
  onOpenSectionMenu: (sectionId: string) => void;
}

export default function TasksTab({ sectionsData, setSelectedTask, onOpenSectionMenu }: TasksTabProps) {
    const { height } = useWindowDimensions();
  const handleAddSection = () => {
    console.log("Add section pressed");
  };

  return (
    <SafeAreaView className="flex-1 bg-light-bg-dark pt-5">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, height: height - 170, paddingBottom: 10}}
              >
        {sectionsData.map((section) => (
          <SectionCard
            key={section.id} // Use ID instead of index for better performance
            sectionName={section.name}
            taskCount={section.taskCount}
            tasks={section.tasks}
            sectionId={section.id}
            setSelectedTask={setSelectedTask}
            onOpenSectionMenu={onOpenSectionMenu}
          />
        ))}
        <AddSectionCard onPress={handleAddSection} />
      </ScrollView>
    </SafeAreaView>
  );
}