// components/project/TaskList.tsx
"use client"

import { useState } from "react"
import { Search, Plus, Clock, Activity, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TaskSection } from "./TaskSection"

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

interface TaskListProps {
  tasks: Task[]
  onToggleCompletion: (taskId: string) => void
  onUpdateStatus: (taskId: string, newStatus: Task["status"]) => void // Fixed type
}

export function TaskList({
  tasks,
  onToggleCompletion,
  onUpdateStatus,
}: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [selectedAssignee, setSelectedAssignee] = useState<string>("all")

  // Filter and search logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesPriority =
      selectedPriority === "all" || task.priority === selectedPriority
    const matchesAssignee =
      selectedAssignee === "all" || task.assignee.name === selectedAssignee

    return matchesSearch && matchesPriority && matchesAssignee
  })

  const tasksByStatus = {
    todo: filteredTasks.filter((task) => task.status === "todo"),
    "in-progress": filteredTasks.filter(
      (task) => task.status === "in-progress"
    ),
    completed: filteredTasks.filter((task) => task.status === "completed"),
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (
    e: React.DragEvent,
    newStatus: Task["status"],
    dropZoneElement: HTMLElement
  ) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("text/plain")

    if (taskId) {
      onUpdateStatus(taskId, newStatus)
    }

    dropZoneElement.classList.remove("drag-over")
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    const element = e.currentTarget as HTMLElement
    element.classList.add("drag-over")
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    const element = e.currentTarget as HTMLElement
    const rect = element.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      element.classList.remove("drag-over")
    }
  }

  return (
    <div className="p-6 h-full w-full">
      <div className="flex flex-col w-full max-w-6xl mx-auto">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Szukaj zadań..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select
              value={selectedPriority}
              onValueChange={setSelectedPriority}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priorytet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="high">Wysoki</SelectItem>
                <SelectItem value="medium">Średni</SelectItem>
                <SelectItem value="low">Niski</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedAssignee}
              onValueChange={setSelectedAssignee}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Przypisany" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszyscy</SelectItem>
                <SelectItem value="Janusz Kowalski">Janusz Kowalski</SelectItem>
                <SelectItem value="Anna Nowak">Anna Nowak</SelectItem>
                <SelectItem value="Piotr Wiśniewski">
                  Piotr Wiśniewski
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Drag and Drop Instructions */}
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            💡 Przeciągnij zadania między sekcjami, aby zmienić ich sekcję
          </p>
        </div>

        {/* Task Sections */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
          <TaskSection
            title="Do zrobienia"
            tasks={tasksByStatus.todo}
            status="todo"
            icon={<Clock className="h-4 w-4 text-orange-500" />}
            onToggleCompletion={onToggleCompletion}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
          <TaskSection
            title="W trakcie"
            tasks={tasksByStatus["in-progress"]}
            status="in-progress"
            icon={<Activity className="h-4 w-4 text-blue-500" />}
            onToggleCompletion={onToggleCompletion}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
          <TaskSection
            title="Ukończone"
            tasks={tasksByStatus.completed}
            status="completed"
            icon={<CheckCircle className="h-4 w-4 text-green-500" />}
            onToggleCompletion={onToggleCompletion}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
        </div>

        {/* Add Section Button */}
        <Button
          variant="outline"
          className="mt-4 self-start text-gray-500 dark:text-gray-400"
        >
          <Plus className="h-4 w-4 mr-2" />
          Dodaj sekcję
        </Button>
      </div>
    </div>
  )
}
