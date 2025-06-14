// app/project/[id]/page.tsx
"use client"

import { useState, useEffect, useMemo, use, createContext, SetStateAction, Dispatch } from "react"
import { useRouter } from "next/navigation"
import { Folder, ChevronDown, Pen, Palette } from "lucide-react"
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
import { Project } from "@/models/Project"
import { getCookie } from "typescript-cookie"
import { getBackendUrl } from "@/app/serveractions/backend-url"
import { UserInfo } from "@/models/User"

export type ProjectContext =
{
  project: Project | undefined,
  tasks: Task[],
  users: UserInfo[],
  
  refresh: boolean, //the refresh value to listen for data re-fetch
  setRefresh: Dispatch<SetStateAction<boolean>> | undefined//the setstate for refreshing and re-fetching data
}

export const projectContext = createContext<ProjectContext>({project: undefined, tasks: [], users: [], refresh: false, setRefresh: undefined});

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  const [project, setProject] = useState<Project>()
  const [refresh, setRefresh] = useState(false); // an helper to restart useEffect without infinite looping
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [isEditingProject, setIsEditingProject] = useState(false)

  // loading flags
  const [isLoadingProject, setIsLoadingProject] = useState(true)
  const [isLoadingTasks, setIsLoadingTasks] = useState(true)
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)

  // derive some dashboard data
  const dashboardData = useMemo(() => {
    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === TaskStatus.Finished).length,
      onTrack: tasks.filter((t) => t.status === TaskStatus.OnTrack).length,
    }
  }, [tasks])

  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoadingProject(true)
      try {
        const backendUrl = await getBackendUrl()
        if (!backendUrl) throw new Error("Missing BACKEND_URL")

        const at = getCookie("accessToken")
        if (!at) throw new Error("No access token")

        const res = await fetch(`${backendUrl}/api/project/${id}`, {
          headers: { Authorization: at },
        })
        if (!res.ok) throw new Error("Failed to fetch project")

        const projectData: Project = await res.json()
        setProject(projectData)
        console.log(projectData)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoadingProject(false)
      }
    }
    const fetchTasksData = async () => {
      setIsLoadingTasks(true)
      try {
        const backendUrl = await getBackendUrl()
        if (!backendUrl) throw new Error("Missing BACKEND_URL")

        const at = getCookie("accessToken")
        if (!at) throw new Error("No access token")

        const res = await fetch(
          `${backendUrl}/api/project/${id}/getTasks`,
          { headers: { Authorization: at } }
        )
        if (!res.ok) throw new Error("Failed to fetch tasks")

        const tasksData: Task[] = await res.json()
        setTasks(tasksData)
        console.log(tasksData)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoadingTasks(false)
      }
    }

    const fetchUsersData = async () => {
      setIsLoadingTasks(true)
      try {
        const backendUrl = await getBackendUrl()
        if (!backendUrl) throw new Error("Missing BACKEND_URL")

        const at = getCookie("accessToken")
        if (!at) throw new Error("No access token")

        const res = await fetch(
          `${backendUrl}/api/project/${id}/getUsers`,
          { headers: { Authorization: at } }
        )
        if (!res.ok) throw new Error("Failed to fetch users")

        const usersData: UserInfo[] = await res.json()
        setUsers(usersData)
        console.log(usersData)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoadingTasks(false)
      }
    }


    fetchProjectData()
    fetchTasksData()
    fetchUsersData()
  }, [id, refresh])

  

  const handleStatusUpdate = (status: string) => {
    router.push(
      `/spicelab/project/${id}/statusUpdate?status=${status}`
    )
  }

  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prev: any[]) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status:
                t.status === TaskStatus.Finished
                  ? TaskStatus.OnTrack
                  : TaskStatus.Finished,
              finished:
                t.status === TaskStatus.Finished ? undefined : new Date(),
              percentage:
                t.status === TaskStatus.Finished ? 0 : 100,
            }
          : t
      )
    )
  }

  const updateTaskStatus = (
    taskId: string,
    newStatus: Task["status"]
  ) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      )
    )
  }

  const moveTaskToSection = (
    taskId: string,
    newSection: string
  ) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, section: newSection } : t
      )
    )
  }

  const deleteTasksById = (ids: string[]) => {
    setTasks((prev) =>
      prev.filter((t) => !ids.includes(t.id))
    )
  }

  //create Task and add it to Tasks to make
  const createTask = async (
    data: NewTaskPayload
  ) => {
    // const newTask: Task = {
    //   ...data,
    //   id: `task-${Date.now()}-${Math.random()
    //     .toString(36)
    //     .substr(2, 9)}`,
    //   created: new Date(),
    // }
    // setTasks((prev) => [...prev, newTask])
    const backendUrl = await getBackendUrl()
    if (!backendUrl) throw new Error("Missing BACKEND_URL")

    const at = getCookie("accessToken")
    if (!at) throw new Error("No access token")

      //construct body, omitting sectionId so we don't get HTTP 415
    let body = {
      assignedUsers: data.assignedUsers,
      name: data.name,
      description: data.description,
      dependencies: data.dependencies,
      percentage: data.percentage,
      status: data.status,
      priority: data.priority,
      deadlineDate: data.deadlineDate
    }

    //send RCP to create task
    const res = await fetch(`${backendUrl}/api/project/${project?.id ?? "nothing"}/${data.sectionId}/create`,
      {
        method: "POST",
        headers:
        {
          Authorization: at,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      })
    let resdata: any;
    if (!res.ok) {
      resdata = await res.text();
      console.error(resdata);
    }
    else {
      //add to task list and refresh with UseEffect
      let resdata = await res.json();
      let newTask = resdata as Task;
      setTasks((prev) => {return [...prev, newTask]});
      setRefresh(!refresh);
    }
  }

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "todo":
        return "bg-gray-500"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <projectContext.Provider value={{project: project, tasks: tasks, users: users, refresh: refresh, setRefresh: setRefresh}}>
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Tabs defaultValue="przeglad" className="flex flex-col flex-1">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Folder className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            {isLoadingProject ? (
              <Skeleton className="w-40 h-6" />
            ) : (
              <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {project?.name ?? "Nieznany projekt"}
              </span>
            )}

            {/* Project Options */}
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
              <DropdownMenuContent className="bg-white dark:bg-gray-800">
                <DropdownMenuItem
                  onClick={() => setIsEditingProject(true)}
                >
                  <Pen className="w-4 h-4 mr-2" />
                  Zmień szczegóły projektu
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Palette className="w-4 h-4 mr-2" />
                  Zmień kolor projektu
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <CopyLinkButton text="Skopiuj link do projektu" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Set Status */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                >
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                  Ustaw status
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-gray-800">
                {[
                  ["in-progress", "W trakcie"],
                  ["todo", "Do zrobienia"],
                  ["completed", "Ukończony"],
                ].map(([stat, label]) => (
                  <DropdownMenuItem
                    key={stat}
                    onClick={() => handleStatusUpdate(stat)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 ${getStatusDotColor(
                          stat
                        )} rounded-full mr-2`}
                      />
                      {label}
                    </div>
                  </DropdownMenuItem>
                ))}
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
            {/* Overview Tab */}
            <TabsContent value="przeglad" className="h-full p-6">
              {isLoadingProject ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : (
                <ProjectOverview project={project} />
              )}
            </TabsContent>

            {/* Task List Tab */}
            <TabsContent value="lista" className="h-full p-6">
              {isLoadingTasks ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-4"
                    >
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

            {/* Dashboard Tab */}
            <TabsContent value="panel" className="h-full p-6">
              {isLoadingProject || isLoadingTasks ? (
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <Skeleton
                      key={idx}
                      className="h-24 w-full rounded-md"
                    />
                  ))}
                </div>
              ) : (
                project ? <Dashboard project={project} tasks={tasks} /> : null
              )}
            </TabsContent>
          </div>

          <ActivitySidebar />
        </div>
      </Tabs>

      <ProjectEditDialog
        project={project}
        isOpen={isEditingProject}
        onClose={() => setIsEditingProject(false)}
        onSave={(updated) => {
          console.log("Saved:", updated)
          setIsEditingProject(false)
        }}
      />
    </div>
    </projectContext.Provider>
  )
}