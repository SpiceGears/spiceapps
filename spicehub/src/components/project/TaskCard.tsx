// components/project/TaskCard.tsx
"use client";

import {
  Calendar,
  MoreHorizontal,
  Pen,
  User,
  X,
  GripVertical,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format, isBefore, addDays } from "date-fns";
import TaskEditDialog from "./TaskEditDialog";

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

interface TaskCardProps {
  task: Task;
  onToggleCompletion: (taskId: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onUpdateStatus?: (taskId: string, newStatus: Task["status"]) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800";
    case "medium":
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
    case "low":
      return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800";
    default:
      return "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800";
    case "in-progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    case "todo":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return "Ukończone";
    case "in-progress":
      return "W trakcie";
    case "todo":
      return "Do zrobienia";
    default:
      return "Nieznany";
  }
};

const getDueDateColor = (dueDate?: string) => {
  if (!dueDate) return "text-gray-500 dark:text-gray-400";
  const due = new Date(dueDate);
  const now = new Date();
  const tomorrow = addDays(now, 1);

  if (isBefore(due, now)) return "text-red-600 dark:text-red-400";
  if (isBefore(due, tomorrow)) return "text-orange-600 dark:text-orange-400";
  return "text-gray-700 dark:text-gray-300";
};

export function TaskCard({
  task,
  onToggleCompletion,
  onDragStart,
  onUpdateStatus,
}: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(e, task.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleStatusChange = (newStatus: Task["status"]) => {
    if (onUpdateStatus) {
      onUpdateStatus(task.id, newStatus);
    }
  };

  return (
    <div
      className={`group relative border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 min-h-[140px] ${isDragging
          ? "opacity-30 scale-95 shadow-2xl ring-2 ring-blue-400 ring-opacity-50"
          : ""
        }`}
    >
      {/* Drag Handle */}
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-6 h-12 cursor-move opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md z-10"
        title="Przeciągnij, aby przenieść zadanie"
      >
        <GripVertical className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      </div>

      {/* Drag overlay when dragging */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900 bg-opacity-20 rounded-lg pointer-events-none z-20" />
      )}

      {/* Card Content */}
      <div className="flex items-start gap-4 p-5 pl-12">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggleCompletion(task.id)}
          className={`mt-1 w-5 h-5 rounded-full flex-shrink-0 ${task.completed ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"}`}
        />

        <div className="flex-1 min-w-0 space-y-3">
          {/* Header with title and menu */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4
                className={`font-medium text-base leading-tight ${task.completed
                    ? "line-through text-gray-500 dark:text-gray-400"
                    : "text-gray-900 dark:text-gray-100"
                  }`}
              >
                {task.title}
              </h4>
              {task.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditingTask(true)}>
                  <Pen className="h-4 w-4 mr-2" />
                  Edytuj
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Przypisz
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2Icon className="h-4 w-4 mr-2 text-red-600" />
                  <span className="text-red-600">Usuń</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status and Priority Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={getStatusColor(task.status)}>
              {getStatusLabel(task.status)}
            </Badge>
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {task.priority === "high"
                ? "Wysoki"
                : task.priority === "medium"
                  ? "Średni"
                  : "Niski"}
            </Badge>
          </div>

          {/* Footer with assignee and due date */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="h-7 w-7 flex-shrink-0">
                <AvatarFallback className="text-xs bg-gray-600 text-white">
                  {task.assignee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                {task.assignee.name}
              </span>
            </div>

            {task.dueDate && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className={`text-sm ${getDueDateColor(task.dueDate)}`}>
                  {format(new Date(task.dueDate), "dd MMM")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <TaskEditDialog
        isOpen={isEditingTask}
        onClose={() => setIsEditingTask(false)}
        task={task}
        onSave={(updatedTask) => {
          // Handle task update logic here
          console.log("Updated Task:", updatedTask);
          setIsEditingTask(false);
        }}
      />
    </div>
  );
}
