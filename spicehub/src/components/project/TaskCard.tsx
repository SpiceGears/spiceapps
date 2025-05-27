// components/project/TaskCard.tsx
"use client"

import {
  Calendar,
  MoreHorizontal,
  Pen,
  User,
  X,
  GripVertical,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { format, isBefore, addDays } from "date-fns"

type Task = {
  id: string
  title: string
  description?: string
  status: "todo" | "in-progress" | "completed"
  completed: boolean
  priority: "low" | "medium" | "high"
  assignee: {
    name: string
    avatarUrl?: string
  }
  dueDate?: string
  createdDate: string
}

interface TaskCardProps {
  task: Task
  onToggleCompletion: (taskId: string) => void
  onDragStart: (e: React.DragEvent, taskId: string) => void
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800"
    case "medium":
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
    case "low":
      return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800"
    default:
      return "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800"
  }
}

const getDueDateColor = (dueDate?: string) => {
  if (!dueDate) return "text-gray-500 dark:text-gray-400"
  const due = new Date(dueDate)
  const now = new Date()
  const tomorrow = addDays(now, 1)

  if (isBefore(due, now)) return "text-red-600 dark:text-red-400"
  if (isBefore(due, tomorrow)) return "text-orange-600 dark:text-orange-400"
  return "text-gray-700 dark:text-gray-300"
}

export function TaskCard({ task, onToggleCompletion, onDragStart }: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    onDragStart(e, task.id)
    
    // Add visual feedback
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <div 
      className={`group relative border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 ${
        isDragging 
          ? 'opacity-30 scale-95 shadow-2xl ring-2 ring-blue-400 ring-opacity-50' 
          : ''
      }`}
    >
      {/* Drag Handle */}
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className="absolute left-1 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-6 h-10 cursor-move opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md z-10"
        title="Przeciągnij, aby przenieść zadanie"
      >
        <GripVertical className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      </div>

      {/* Drag overlay when dragging */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900 bg-opacity-20 rounded-lg pointer-events-none z-20" />
      )}

      {/* Card Content */}
      <div className="flex items-start gap-3 p-4 pl-10">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggleCompletion(task.id)}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4
                className={`font-medium mb-1 ${
                  task.completed
                    ? "line-through text-gray-500 dark:text-gray-400"
                    : "text-gray-900 dark:text-gray-100"
                }`}
              >
                {task.title}
              </h4>
              {task.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {task.description}
                </p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Pen className="h-4 w-4 mr-2" />
                  Edytuj
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Przypisz
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <X className="h-4 w-4 mr-2" />
                  Usuń
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs bg-gray-600 text-white">
                    {task.assignee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {task.assignee.name}
                </span>
              </div>

              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span className={`text-xs ${getDueDateColor(task.dueDate)}`}>
                    {format(new Date(task.dueDate), "dd MMM")}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={getPriorityColor(task.priority)}
              >
                {task.priority === "high"
                  ? "Wysoki"
                  : task.priority === "medium"
                  ? "Średni"
                  : "Niski"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
