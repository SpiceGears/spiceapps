import {
  Calendar,
  MoreHorizontal,
  Pen,
  GripVertical,
  Trash2Icon,
  Users,
  User,
} from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format, isBefore, addDays } from "date-fns";
import { pl } from "date-fns/locale";
import TaskEditDialog from "./TaskEditDialog";
import { Task, Section, TaskStatus } from "@/models/Task";
import { projectContext } from "@/app/spicelab/project/[id]/projectContext";
import React from "react";

interface TaskCardProps {
  task: Task;
  sections: Section[];
  refresh: boolean;
  setRefresh: any;
  onToggleCompletion: (taskId: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onUpdateStatus?: (taskId: string, newStatus: TaskStatus) => void;
}

// Priority color helper
const getPriorityColor = (priority: Number) => {
  switch (priority) {
    case 3:
      return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800";
    case 2:
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
    case 1:
      return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800";
    default:
      return "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800";
  }
};

// Status color helper
const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.Finished:
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800";
    case TaskStatus.OnTrack:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    case TaskStatus.Planned:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800";
    case TaskStatus.Problem:
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800";
  }
};

const getStatusLabel = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.Finished:
      return "Ukończone";
    case TaskStatus.OnTrack:
      return "W trakcie";
    case TaskStatus.Planned:
      return "Zaplanowane";
    case TaskStatus.Problem:
      return "Problem";
    default:
      return "Nieznany";
  }
};

const getDueDateColor = (deadlineDate?: Date) => {
  if (!deadlineDate) return "text-gray-500 dark:text-gray-400";
  const due = deadlineDate;
  const now = new Date();
  const tomorrow = addDays(now, 1);

  if (isBefore(due, now)) return "text-red-600 dark:text-red-400";
  if (isBefore(due, tomorrow)) return "text-orange-600 dark:text-orange-400";
  return "text-gray-700 dark:text-gray-300";
};

export function TaskCard({
  task,
  sections,
  refresh,
  setRefresh,
  onToggleCompletion,
  onDragStart,
  onUpdateStatus,
}: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);

  const ctx = useContext(projectContext);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(e, task.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

const renderAssignedUsers = () => {
  const assigned = task.assignedUsers || [];

  // 0 users → Unassigned
  if (assigned.length === 0) {
    return (
      <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
        <Avatar className="h-4 w-4">
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <span className="text-xs">Nieprzypisane</span>
      </div>
    );
  }


  // more than 2 users → avatars only, overlapped + tooltip listing all names
return (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="flex items-center -space-x-2 cursor-pointer">
        {assigned.map((userId) => {
          const user = ctx.users.find((u) => u.id === userId);
          const initials = user
            ? `${user.firstName[0]}${user.lastName[0]}`
            : "";
          return (
            <Avatar
              key={userId}
              className="h-6 w-6 ring-2 ring-white dark:ring-gray-800"
            >
              {user?.avatarSet && (
                <AvatarImage
                  src={undefined}
                  alt={`${user.firstName} ${user.lastName}`}
                />
              )}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          );
        })}
      </div>
    </TooltipTrigger>
    <TooltipContent side="top" align="center" className="max-w-xs">
      <div className="flex flex-col space-y-1">
        {assigned.map((userId) => {
          const user = ctx.users.find((u) => u.id === userId);
          if (!user) return null;
          return (
            <span
              key={userId}
              className="text-sm text-gray-200 dark:text-gray-800"
            >
              {user.firstName} {user.lastName}
            </span>
          );
        })}
      </div>
    </TooltipContent>
  </Tooltip>
);
};
  return (
    <div
      className={`group relative border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 min-h-[160px] ${
        isDragging
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
        {/* No checkbox, but you can add one for "finished" */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Header with title and menu */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4
                className={`font-medium text-base leading-tight ${
                  task.status === TaskStatus.Finished
                    ? "line-through text-gray-500 dark:text-gray-400"
                    : "text-gray-900 dark:text-gray-100"
                }`}
              >
                {task.name}
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
              {task.priority === 3
                ? "Wysoki"
                : task.priority === 2
                ? "Średni"
                : "Niski"}
            </Badge>
          </div>

          {/* Assignees Section */}
          <div className="space-y-2">{renderAssignedUsers()}</div>

          {/* Footer with due date */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1" />
            {task.deadlineDate && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className={`text-sm ${getDueDateColor(task.deadlineDate)}`}>
                  {format(new Date(task.deadlineDate), "dd MMM", { locale: pl })}
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
        sections={sections}
        onSave={(updatedTask) => {
          // Handle task update logic here
          setIsEditingTask(false);
        }}
      />
    </div>
  );
}
