// app/projects/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Folder,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  User,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

type Assignee = {
  id: string
  name: string
  avatarUrl?: string
  email?: string
}

type Task = {
  id: string
  title: string
  description?: string
  status: "todo" | "in-progress" | "completed"
  completed: boolean
  priority: "low" | "medium" | "high"
  assignees: Assignee[]
  dueDate?: string
  createdDate: string
  section: string
}

// Extended project data for list view (keeping original Project type intact)
type ProjectWithStats = Project & {
  status: "active" | "completed" | "on-hold"
  taskStats: {
    total: number
    completed: number
  }
  teamSize: number
  lastActivity: string
  color?: string
}

// Mock data - will be replaced with API calls
const mockProjects: ProjectWithStats[] = [
  {
    id: "123",
    name: "Project Alpha",
    description: "Pierwszy projekt z zaawansowanymi funkcjonalnościami",
    owner: { name: "Janusz Kowalski", avatarUrl: undefined },
    dueDate: "2025-06-15",
    status: "active",
    taskStats: { total: 24, completed: 18 },
    teamSize: 5,
    lastActivity: "2025-05-30",
    color: "blue",
  },
  {
    id: "2",
    name: "Project Beta",
    description: "Second project focused on user experience",
    owner: { name: "Jane Doe", avatarUrl: undefined },
    dueDate: "2025-07-20",
    status: "active",
    taskStats: { total: 16, completed: 8 },
    teamSize: 3,
    lastActivity: "2025-05-29",
    color: "green",
  },
  {
    id: "3",
    name: "Project Gamma",
    description: "Third project for mobile development",
    owner: { name: "John Smith", avatarUrl: undefined },
    dueDate: "2025-05-25",
    status: "on-hold",
    taskStats: { total: 12, completed: 12 },
    teamSize: 4,
    lastActivity: "2025-05-20",
    color: "purple",
  },
  {
    id: "4",
    name: "Project Delta",
    description: "E-commerce platform development",
    owner: { name: "Anna Nowak", avatarUrl: undefined },
    dueDate: "2025-08-10",
    status: "active",
    taskStats: { total: 32, completed: 5 },
    teamSize: 8,
    lastActivity: "2025-05-30",
    color: "orange",
  },
  {
    id: "5",
    name: "Project Epsilon",
    description: "Data analytics dashboard",
    owner: { name: "Piotr Wiśniewski", avatarUrl: undefined },
    status: "completed",
    taskStats: { total: 20, completed: 20 },
    teamSize: 6,
    lastActivity: "2025-05-15",
    color: "red",
  },
]

const statusConfig = {
  active: { label: "Aktywny", color: "bg-green-100 text-green-800" },
  completed: { label: "Zakończony", color: "bg-gray-100 text-gray-800" },
  "on-hold": { label: "Wstrzymany", color: "bg-yellow-100 text-yellow-800" },
}

export default function ProjectsPage() {
  const [projects] = useState<ProjectWithStats[]>(mockProjects)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const router = useRouter()

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleProjectClick = (projectId: string) => {
    router.push(`/spicelab/project/${projectId}`)
  }

  const getProgressPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Folder className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Projekty
              </h1>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nowy projekt
            </Button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Szukaj projektów..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Status:{" "}
                {statusFilter === "all"
                  ? "Wszystkie"
                  : statusConfig[
                      statusFilter as keyof typeof statusConfig
                    ]?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                Wszystkie
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                Aktywne
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                Zakończone
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("on-hold")}>
                Wstrzymane
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleProjectClick(project.id)}
            >
              <div className="p-6">
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        project.color === "blue"
                          ? "bg-blue-500"
                          : project.color === "green"
                          ? "bg-green-500"
                          : project.color === "purple"
                          ? "bg-purple-500"
                          : project.color === "orange"
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                    />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.name}
                    </h3>
                  </div>
                </div>

                {/* Project Description */}
                {project.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* Status Badge */}
                <div className="mb-4">
                  <Badge
                    className={`${
                      statusConfig[project.status].color
                    } border-0`}
                  >
                    {statusConfig[project.status].label}
                  </Badge>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Postęp zadań
                    </span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      {project.taskStats.completed}/{project.taskStats.total} (
                      {getProgressPercentage(
                        project.taskStats.completed,
                        project.taskStats.total
                      )}
                      %)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${getProgressPercentage(
                          project.taskStats.completed,
                          project.taskStats.total
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Project Info */}
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={project.owner.avatarUrl} />
                      <AvatarFallback className="text-xs">
                        {getInitials(project.owner.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{project.owner.name}</span>
                    <span className="text-gray-400">•</span>
                    <span>{project.teamSize} członków</span>
                  </div>
                  {project.dueDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Termin: {formatDate(project.dueDate)}</span>
                    </div>
                  )}
                </div>

                {/* Last Activity */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      Ostatnia aktywność: {formatDate(project.lastActivity)}
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Brak projektów
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery || statusFilter !== "all"
                ? "Nie znaleziono projektów spełniających kryteria wyszukiwania."
                : "Rozpocznij pracę tworząc swój pierwszy projekt."}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Utwórz pierwszy projekt
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
