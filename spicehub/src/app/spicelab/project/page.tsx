// app/projects/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Folder,
  Plus,
  Search,
  Filter,
  ChevronRight,
  User,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { getBackendUrl } from "@/app/serveractions/backend-url"
import { getCookie } from "typescript-cookie"
import { Project, ProjectStatus } from "@/models/Project"
import ProjectCard from "@/components/project/ProjectCard"
import { TaskStatus } from "@/models/Task"
import { ProjectCardSkeleton } from "@/components/project/ProjectCardSkeleton"
import Link from "next/link"

// Helper to format dates
function formatDate(dateString?: string | Date) {
  if (!dateString) return "—"
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString
  return date.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const statusConfig: Record<
  ProjectStatus,
  { label: string; color: string }
> = {
  [ProjectStatus.Healthy]: {
    label: "Aktywny",
    color: "bg-green-100 text-green-800",
  },
  [ProjectStatus.Finished]: {
    label: "Zakończony",
    color: "bg-gray-100 text-gray-800",
  },
  [ProjectStatus.Delayed]: {
    label: "Opóźniony",
    color: "bg-yellow-100 text-yellow-800",
  },
  [ProjectStatus.Endangered]: {
    label: "Zagrożony",
    color: "bg-red-100 text-red-800",
  },
  [ProjectStatus.Abandoned]: {
    label: "Porzucony",
    color: "bg-gray-500 bg-white-400"
  }
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | ProjectStatus>(
    "all"
  )
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchProjects() {
      const backend = await getBackendUrl()
      const token = getCookie("accessToken")
      if (!backend || !token) return

      try {
        const res = await fetch(`${backend}/api/project`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        })
        if (!res.ok) throw new Error("Fetch failed")
        const data = (await res.json()) as Project[]
        setProjects(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || p.status == statusFilter
    return matchesSearch && matchesStatus
  })

  function handleClick(id: string) {
    router.push(`/spicelab/project/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                  : statusConfig[statusFilter].label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                Wszystkie
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {(
                Object.keys(statusConfig) as unknown as ProjectStatus[]
              ).map((st) => (
                <DropdownMenuItem
                  key={st}
                  onClick={() => setStatusFilter(st)}
                >
                  {statusConfig[st].label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Projects Grid or Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p}></ProjectCard>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-20">
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Brak projektów</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || statusFilter !== "all"
                ? "Nie znaleziono projektów."
                : "Stwórz swój pierwszy projekt."}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Link href="/spicelab/newProject">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" /> Utwórz projekt
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}