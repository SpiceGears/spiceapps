// components/project/TaskSection.tsx
"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Copy, Archive, Trash2 } from "lucide-react";
import { TaskCard } from "./TaskCard";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "completed";
  completed: boolean;
  priority: "low" | "medium" | "high";
  assignee: {
    name: string;
    avatarUrl?: string;
  };
  dueDate?: string;
  createdDate: string;
  section: string;
};

interface TaskSectionProps {
  title: string;
  tasks: Task[];
  sectionId: string;
  icon: React.ReactNode;
  onToggleCompletion: (taskId: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (
    e: React.DragEvent,
    sectionId: string,
    dropZoneElement: HTMLElement
  ) => void;
}

export function TaskSection({
  title,
  tasks,
  sectionId,
  icon,
  onToggleCompletion,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
}: TaskSectionProps) {
  return (
    <div className="flex-shrink-0 w-80 h-full flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/30">
      {/* Section Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-t-lg">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {title}
          </span>
          <Badge variant="secondary" className="ml-2">
            {tasks.length}
          </Badge>
        </div>

        {/* Added Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600">
              <MoreHorizontal className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="sr-only">Open menu</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-700 dark:text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tasks Container */}
      <div
        className="flex-1 p-4 space-y-3 overflow-y-auto min-h-[400px]"
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, sectionId, e.currentTarget)}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleCompletion={onToggleCompletion}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
}
