// components/project/TaskSection.tsx
"use client"

import { ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { TaskCard } from "./TaskCard"

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
  return (
    <Collapsible defaultOpen className="w-full">
      <CollapsibleTrigger className="flex items-center justify-between py-3 px-4 w-full hover:bg-gray-50 dark:hover:bg-gray-800/50 text-left">
        <div className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200" />
          {icon}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {title}
          </span>
          <Badge variant="secondary" className="ml-2">
            {tasks.length}
          </Badge>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div
          className="space-y-3 px-4 pb-4 min-h-[100px] transition-all duration-200"
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
          <Button
            variant="ghost"
            className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Dodaj zadanie...
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
