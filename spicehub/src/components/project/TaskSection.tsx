// components/project/TaskSection.tsx
"use client"

import { ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TaskCard } from "./TaskCard"
import { useState } from "react"

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

interface TaskSectionProps {
  title: string
  tasks: Task[]
  status: string
  icon: React.ReactNode
  onToggleCompletion: (taskId: string) => void
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDragEnter: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (
    e: React.DragEvent,
    newStatus: Task["status"],
    dropZoneElement: HTMLElement
  ) => void
}

export function TaskSection({
  title,
  tasks,
  status,
  icon,
  onToggleCompletion,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
}: TaskSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex-shrink-0 w-80 h-full flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/30">
      {/* Section Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-t-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <ChevronDown
              className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                isCollapsed ? "-rotate-90" : ""
              }`}
            />
          </button>
          {icon}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {title}
          </span>
          <Badge variant="secondary" className="ml-2">
            {tasks.length}
          </Badge>
        </div>
      </div>

      {/* Tasks Container */}
      {!isCollapsed && (
        <div
          className="flex-1 p-4 space-y-3 overflow-y-auto min-h-[400px] transition-all duration-200"
          onDragOver={onDragOver}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={(e) =>
            onDrop(e, status as Task["status"], e.currentTarget)
          }
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleCompletion={onToggleCompletion}
              onDragStart={onDragStart}
            />
          ))}
          
          {/* Add Task Button */}
          <Button
            variant="ghost"
            className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 mt-3"
          >
            <Plus className="h-4 w-4 mr-2" />
            Dodaj zadanie
          </Button>
        </div>
      )}

      {/* Collapsed state */}
      {isCollapsed && (
        <div className="flex-1 flex items-center justify-center p-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {tasks.length} zadań
          </span>
        </div>
      )}
    </div>
  )
}
