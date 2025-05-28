// app/project/[id]/page.tsx
"use client"

import { useState, use } from "react"
import { Folder, ChevronDown, Pen, Palette, X } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { CopyLinkButton } from "@/components/CopyButton"
import { ProjectOverview } from "@/components/project/ProjectOverview"
import { TaskList } from "@/components/project/TaskList"
import { Dashboard } from "@/components/project/Dashboard"
import { ActivitySidebar } from "@/components/project/ActivitySidebar"
import { ProjectEditDialog } from "@/components/project/ProjectEditDialog"

type Project = {
  id: string
  name: string
  description?: string
  owner: {
    name: string
    avatarUrl?: string
  }
  dueDate?: string
}

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
  section: string // Add section field to track which section the task is in
}

// Mock data - will be replaced with API calls
const projects: Project[] = [
  {
    id: "123",
    name: "Project Alpha",
    description: "Pierwszy projekt",
    owner: { name: "Janusz Kowalski", avatarUrl: undefined },
  },
  {
    id: "2",
    name: "Project Beta",
    description: "Second project",
    owner: { name: "Jane Doe", avatarUrl: undefined },
  },
  {
    id: "3",
    name: "Project Gamma",
    description: "Third project",
    owner: { name: "John Smith", avatarUrl: undefined },
  },
]

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Analiza wymagań systemu",
    description:
      "Szczegółowa analiza wymagań funkcjonalnych i niefunkcjonalnych",
    status: "completed",
    completed: false,
    priority: "high",
    assignee: { name: "Janusz Kowalski", avatarUrl: undefined },
    dueDate: "2025-05-30",
    createdDate: "2025-05-20",
    section: "todo",
  },
  {
    id: "2",
    title: "Przygotowanie dokumentacji technicznej",
    description: "Stworzenie kompletnej dokumentacji technicznej projektu",
    status: "in-progress",
    completed: true,
    priority: "medium",
    assignee: { name: "Anna Nowak", avatarUrl: undefined },
    dueDate: "2025-06-10",
    createdDate: "2025-05-22",
    section: "in-progress",
  },
  {
    id: "3",
    title: "Implementacja modułu autoryzacji",
    description: "Rozwój systemu logowania i zarządzania uprawnieniami",
    status: "in-progress",
    completed: false,
    priority: "high",
    assignee: { name: "Piotr Wiśniewski", avatarUrl: undefined },
    dueDate: "2025-06-05",
    createdDate: "2025-05-15",
    section: "in-progress",
  },
    {
    id: "4",
    title: "Implementacja modułu autoryzacji",
    description: "Rozwój systemu logowania i zarządzania uprawnieniami",
    status: "in-progress",
    completed: false,
    priority: "high",
    assignee: { name: "Piotr Wiśniewski", avatarUrl: undefined },
    dueDate: "2025-06-05",
    createdDate: "2025-05-15",
    section: "in-progress",
  },
    {
    id: "5",
    title: "Implementacja modułu autoryzacji",
    description: "Rozwój systemu logowania i zarządzania uprawnieniami",
    status: "in-progress",
    completed: false,
    priority: "high",
    assignee: { name: "Piotr Wiśniewski", avatarUrl: undefined },
    dueDate: "2025-06-05",
    createdDate: "2025-05-15",
    section: "in-progress",
  },
    {
    id: "6",
    title: "Implementacja modułu autoryzacji",
    description: "Rozwój systemu logowania i zarządzania uprawnieniami",
    status: "in-progress",
    completed: false,
    priority: "high",
    assignee: { name: "Piotr Wiśniewski", avatarUrl: undefined },
    dueDate: "2025-06-05",
    createdDate: "2025-05-15",
    section: "in-progress",
  },
    {
    id: "7",
    title: "Implementacja modułu autoryzacji",
    description: "Rozwój systemu logowania i zarządzania uprawnieniami",
    status: "in-progress",
    completed: false,
    priority: "high",
    assignee: { name: "Piotr Wiśniewski", avatarUrl: undefined },
    dueDate: "2025-06-05",
    createdDate: "2025-05-15",
    section: "in-progress",
  },
  {
    id: "8",
    title: "Design interfejsu użytkownika",
    description: "Projektowanie mockupów i prototypów UI/UX",
    status: "todo",
    completed: true,
    priority: "medium",
    assignee: { name: "Maria Kowalczyk", avatarUrl: undefined },
    dueDate: "2025-05-25",
    createdDate: "2025-05-10",
    section: "completed",
  },
  
]

const dashboardData = {
  stats: {
    totalTasks: 24,
    completedTasks: 18,
    overdueTasks: 3,
    teamMembers: 5,
  },
  upcomingDeadlines: [
    {
      id: 1,
      task: "Finalizacja projektu",
      assignee: "Janusz Kowalski",
      dueDate: "2025-05-30",
      priority: "high",
    },
    {
      id: 2,
      task: "Przegląd kodu",
      assignee: "Anna Nowak",
      dueDate: "2025-06-02",
      priority: "medium",
    },
    {
      id: 3,
      task: "Testy jednostkowe",
      assignee: "Piotr Wiśniewski",
      dueDate: "2025-06-05",
      priority: "low",
    },
  ],
  teamMembers: [
    {
      id: 1,
      name: "Janusz Kowalski",
      role: "Project Manager",
      tasksCompleted: 8,
      totalTasks: 10,
      avatar: undefined,
    },
    {
      id: 2,
      name: "Anna Nowak",
      role: "Developer",
      tasksCompleted: 6,
      totalTasks: 8,
      avatar: undefined,
    },
    {
      id: 3,
      name: "Piotr Wiśniewski",
      role: "Designer",
      tasksCompleted: 4,
      totalTasks: 6,
      avatar: undefined,
    },
  ],
}

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [isEditingProject, setIsEditingProject] = useState(false)
  const [tasks, setTasks] = useState<Task[]>(mockTasks)

  const { id } = use(params)
  const project = projects.find((p) => p.id === id)

  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return { ...task, completed: !task.completed }
        }
        return task
      })
    )
  }

  const updateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    )
  }

  const moveTaskToSection = (taskId: string, newSection: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, section: newSection } : task
      )
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">

      <Tabs defaultValue="przeglad" className="flex flex-col min-h-screen">
        {/* Project Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Folder className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {project?.name ?? "Nieznany projekt"}
            </span>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 text-gray-500 dark:text-gray-400"
                >
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <DropdownMenuItem onClick={() => setIsEditingProject(true)}>
                  <Pen className="w-4 h-4 mr-2" />
                  Zmień szczegóły projektu
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Palette className="w-4 h-4 mr-2" />
                  Zmień kolor projektu
                </DropdownMenuItem>
                <DropdownMenuItem>Opcja 3</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <CopyLinkButton text="Skopiuj link do projektu" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <TabsList>
            <TabsTrigger value="przeglad">Przegląd</TabsTrigger>
            <TabsTrigger value="lista">Lista</TabsTrigger>
            <TabsTrigger value="panel">Dashboard</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto">
            <TabsContent value="przeglad" className="h-full">
              <ProjectOverview project={project} />
            </TabsContent>

            <TabsContent value="lista" className="h-full">
              <TaskList
                tasks={tasks}
                onToggleCompletion={toggleTaskCompletion}
                onUpdateStatus={updateTaskStatus}
                onMoveToSection={moveTaskToSection}
              />
            </TabsContent>

            <TabsContent value="panel" className="h-full">
              <Dashboard data={dashboardData} />
            </TabsContent>
          </div>

          <ActivitySidebar />
        </div>
      </Tabs>

      <ProjectEditDialog
        project={project}
        isOpen={isEditingProject}
        onClose={() => setIsEditingProject(false)}
        onSave={(updatedProject) => {
          // Handle project update logic here
          console.log("Updated project:", updatedProject)
          setIsEditingProject(false)
        }}
      />
    </div>
  )
}
