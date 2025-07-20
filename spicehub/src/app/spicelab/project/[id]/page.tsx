"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Folder, ChevronDown, Pen } from "lucide-react"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { CopyLinkButton } from "@/components/CopyButton"
import { Skeleton } from "@/components/ui/skeleton"
import { ProjectOverview } from "@/components/project/ProjectOverview"
import { NewTaskPayload, TaskList } from "@/components/project/TaskList"
import Dashboard from "@/components/project/Dashboard"
import { ActivitySidebar } from "@/components/project/ActivitySidebar"
import { ProjectEditDialog } from "@/components/project/ProjectEditDialog"
import { Task, TaskStatus } from "@/models/Task"
import { Project, ProjectUpdateEntry } from "@/models/Project"
import { UserInfo } from "@/models/User"
import { getCookie } from "typescript-cookie"
import { getBackendUrl } from "@/app/serveractions/backend-url"
import { projectContext } from "./projectContext"
import { toast } from "sonner"

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  // --- Data state
  const [project, setProject] = useState<Project>()
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<UserInfo[]>([])
  const [events, setEvents] = useState<ProjectUpdateEntry[]>([])
  const [refresh, setRefresh] = useState(false)
  const [isEditingProject, setIsEditingProject] = useState(false)
  const [loadingProject, setLoadingProject] = useState(true)
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [loadingEvents, setLoadingEvents] = useState(true)
  const loading = loadingProject || loadingTasks || loadingEvents

  // --- Sidebar toggle
  const [collapsed, setCollapsed] = useState(false)

  // reserve right‐padding on desktop only when sidebar open
  const contentPadding = collapsed ? "" : "lg:pr-96 xl:pr-[400px]"

  // --- Fetch all
  useEffect(() => {
    const at = getCookie("accessToken")
    if (!at) return

    const fetchAll = async () => {
      const base = await getBackendUrl()
      if (!base) throw new Error("Missing BACKEND_URL")

      // project
      setLoadingProject(true)
      try {
        const res = await fetch(`${base}/api/project/${id}`, {
          headers: { Authorization: at },
        })
        if (!res.ok) throw new Error("Failed to fetch project")
        setProject(await res.json())
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingProject(false)
      }

      // tasks/users/updates
      setLoadingTasks(true)
      setLoadingEvents(true)
      try {
        const [tRes, uRes, eRes] = await Promise.all([
          fetch(`${base}/api/project/${id}/getTasks`, {
            headers: { Authorization: at },
          }),
          fetch(`${base}/api/project/${id}/getUsers`, {
            headers: { Authorization: at },
          }),
          fetch(`${base}/api/project/${id}/updates`, {
            headers: { Authorization: at },
          }),
        ])
        if (!tRes.ok || !uRes.ok || !eRes.ok)
          throw new Error("Failed fetching tasks/users/updates")

        setTasks(await tRes.json())
        setUsers(await uRes.json())
        setEvents(await eRes.json())
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingTasks(false)
        setLoadingEvents(false)
      }
    }

    fetchAll()
  }, [id, refresh])

  // --- Handlers
  const handleStatusUpdate = (status: string) =>
    router.push(`/spicelab/project/${id}/statusUpdate?status=${status}`)

  const toggleTaskCompletion = async (tid: string) => {
    try {
      const t = tasks.find((x) => x.id === tid)
      if (!t) return
      const newStatus =
        t.status === TaskStatus.Finished
          ? TaskStatus.OnTrack
          : TaskStatus.Finished

      const base = await getBackendUrl()
      const token = getCookie("accessToken")
      if (!base || !token) throw new Error("Missing config")

      const res = await fetch(
        `${base}/api/project/${id}/${tid}/updateStatus`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(newStatus),
        }
      )
      if (!res.ok) throw new Error(await res.text())
      const updated = await res.json()

      setTasks((lst) =>
        lst.map((x) =>
          x.id === tid
            ? { ...x, status: newStatus, finished: updated.finished }
            : x
        )
      )
      toast.success(
        newStatus === TaskStatus.Finished
          ? "Zadanie oznaczone jako ukończone"
          : "Zadanie oznaczone jako w trakcie"
      )
    } catch {
      toast.error("Nie udało się zaktualizować statusu zadania")
    }
  }

  const updateTaskStatus = (tid: string, ns: Task["status"]) =>
    setTasks((lst) =>
      lst.map((x) => (x.id === tid ? { ...x, status: ns } : x))
    )

  const moveTaskToSection = (tid: string, newSectionId: string) =>
    setTasks((lst) =>
      lst.map((x) =>
        x.id === tid ? { ...x, sectionId: newSectionId } : x
      )
    )

  const deleteTasksById = (ids: string[]) =>
    setTasks((lst) => lst.filter((x) => !ids.includes(x.id)))

  const createTask = async (data: NewTaskPayload) => {
    try {
      const base = await getBackendUrl()
      const token = getCookie("accessToken")
      if (!base || !token) throw new Error("Missing config")

      const body = {
        assignedUsers: data.assignedUsers,
        name: data.name,
        description: data.description,
        dependencies: data.dependencies,
        percentage: data.percentage,
        status: data.status,
        priority: data.priority,
        deadlineDate: data.deadlineDate,
      }

      const res = await fetch(
        `${base}/api/project/${id}/${data.sectionId}/create`,
        {
          method: "POST",
          headers: { Authorization: token, "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      )
      if (!res.ok) throw new Error(await res.text())
      const newT = (await res.json()) as Task
      setTasks((lst) => [...lst, newT])
      setRefresh((f) => !f)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <projectContext.Provider
      value={{ project, tasks, events, users, loading, refresh, setRefresh }}
    >
      <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-gray-900">
        <Tabs
          defaultValue="przeglad"
          className="flex flex-col flex-1 overflow-hidden"
        >
          {/* HEADER + TABS */}
          <div
            className={`
              flex-shrink-0
              px-4 sm:px-6 lg:px-8 py-4
              border-b border-gray-200 dark:border-gray-700
              transition-all duration-300
              ${contentPadding}
            `}
          >
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center gap-2">
                <Folder className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                {loadingProject ? (
                  <Skeleton className="h-6 w-32" />
                ) : (
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {project?.name || "Nieznany projekt"}
                  </span>
                )}
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-1 text-gray-500 dark:text-gray-400"
                    >
                      <ChevronDown className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white dark:bg-gray-800">
                    <DropdownMenuItem
                      onClick={() => setIsEditingProject(true)}
                    >
                      <Pen className="h-4 w-4 mr-2" />
                      Zmień szczegóły
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <CopyLinkButton text="Kopiuj link" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                  onClick={() => handleStatusUpdate("")}
                >
                  Ustaw status
                </Button>
              </div>
              <div className="overflow-x-auto">
                <TabsList className="flex space-x-2">
                  <TabsTrigger value="przeglad">Przegląd</TabsTrigger>
                  <TabsTrigger value="lista">Lista</TabsTrigger>
                  <TabsTrigger value="panel">Dashboard</TabsTrigger>
                </TabsList>
              </div>
            </div>
          </div>

          {/* MAIN + SIDEBAR */}
          <div className="flex flex-1 overflow-hidden">
            <main
              className={`
      flex-1 overflow-auto no-scrollbar p-4 sm:p-6
      transition-all duration-300
      ${contentPadding}
              `}
            >
              <TabsContent value="przeglad" className="h-full w-full">
                {loadingProject ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ) : (
                  <ProjectOverview project={project!} />
                )}
              </TabsContent>

              <TabsContent value="lista" className="h-full w-full">
                {loadingTasks ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <TaskList
                    tasks={tasks}
                    projectId={id}
                    onToggleCompletion={toggleTaskCompletion}
                    onUpdateStatus={updateTaskStatus}
                    onMoveToSection={moveTaskToSection}
                    onDeleteTasks={deleteTasksById}
                    onCreateTask={createTask}
                    refresh={refresh}
                    setRefresh={setRefresh}
                  />
                )}
              </TabsContent>

              <TabsContent value="panel" className="h-full w-full">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full rounded-md" />
                    ))}
                  </div>
                ) : (
                  <Dashboard project={project!} tasks={tasks} />
                )}
              </TabsContent>
            </main>

            <ActivitySidebar
              events={events}
              users={users}
              loading={loadingEvents}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
            />
          </div>
        </Tabs>

        <ProjectEditDialog
          project={project}
          isOpen={isEditingProject}
          onClose={() => setIsEditingProject(false)}
          onSave={() => setIsEditingProject(false)}
        />
      </div>
    </projectContext.Provider>
  )
}