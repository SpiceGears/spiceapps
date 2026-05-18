'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCookie } from 'typescript-cookie'
import { getBackendUrl } from '../serveractions/backend-url'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import {
  List as ListIcon,
  CheckCircle,
  AlertTriangle,
  Clock,
  Loader2,
  Users,
} from 'lucide-react'
import { Task, TaskPriority, TaskStatus } from '@/models/Task'
import { Project, ProjectStatus } from '@/models/Project'
import { UserInfo } from '@/models/User'

const getTaskStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.Planned:  return 'Zaplanowane'
    case TaskStatus.OnTrack:  return 'W toku'
    case TaskStatus.Finished: return 'Ukończone'
    case TaskStatus.Problem:  return 'Problem'
  }
}
const getTaskStatusBadge = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.Planned:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    case TaskStatus.OnTrack:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case TaskStatus.Finished:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case TaskStatus.Problem:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
}

const getTaskPriorityLabel = (prio: TaskPriority): string => {
  switch (prio) {
    case TaskPriority.Low:    return 'Niski'
    case TaskPriority.Medium: return 'Średni'
    case TaskPriority.High:   return 'Wysoki'
  }
}
const getTaskPriorityBadge = (prio: TaskPriority): string => {
  switch (prio) {
    case TaskPriority.Low:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case TaskPriority.Medium:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case TaskPriority.High:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
}

const getProjectStatusLabel = (st: ProjectStatus): string => {
  switch (st) {
    case ProjectStatus.Healthy:    return 'Na dobrej drodze'
    case ProjectStatus.Endangered: return 'Zagrożony'
    case ProjectStatus.Delayed:    return 'Opóźniony'
    case ProjectStatus.Abandoned:  return 'Porzucony'
    case ProjectStatus.Finished:   return 'Ukończony'
  }
}
function getProjectStatusBadge(st: ProjectStatus): string {
  switch (st) {
    case ProjectStatus.Healthy:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case ProjectStatus.Endangered:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case ProjectStatus.Delayed:
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case ProjectStatus.Abandoned:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case ProjectStatus.Finished:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <div
      className="
      flex flex-col items-center justify-center p-4
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-700
      rounded-lg shadow-sm hover:shadow
      transition
    "
    >
      <div className="text-2xl text-gray-500 dark:text-gray-400 mb-2">
        {icon}
      </div>
      <div className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
        {value}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {title}
      </div>
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Zawsze ukrywaj porzucone i ukończone projekty
  const [hiddenStatuses, setHiddenStatuses] = useState<ProjectStatus[]>([
    ProjectStatus.Abandoned,
    ProjectStatus.Finished,
  ])

  const visibleProjects = projects.filter((p) => !hiddenStatuses.includes(p.status))

  useEffect(() => {
    async function loadAll() {
      try {
        const tk = getCookie('accessToken')
        if (!tk) throw new Error('Brak tokena – zaloguj się ponownie')
        const backend = await getBackendUrl()
        const headers = {
          'Content-Type': 'application/json',
          Authorization: tk,
        }

        // Użytkownik
        const uRes = await fetch(`${backend}/api/user/getInfo`, { headers })
        if (!uRes.ok) throw new Error('Nie udało się pobrać użytkownika')
        const uData: UserInfo = await uRes.json()
        setUser(uData)

        // Zadania
        const tRes = await fetch(
          `${backend}/api/user/${uData.id}/getAssignedTasks`,
          { headers }
        )
        if (!tRes.ok) throw new Error('Nie udało się pobrać zadań')
        setTasks(await tRes.json())

        // Projekty
        const pRes = await fetch(`${backend}/api/project`, { headers })
        if (!pRes.ok) throw new Error('Nie udało się pobrać projektów')
        setProjects(await pRes.json())
      } catch (err: any) {
        setError(err.message || 'Coś poszło nie tak')
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  // const handleTaskClick = (task: Task) => {
  //   // Navigate to project that contains this task
  //   // Assuming task has a projectId field - adjust if different
  //   if (task.dependencies) {
  //     router.push(`/spicelab/project/${task.dependencies[0]}`)
  //   }
  // }

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500 dark:text-gray-400" />
      </div>
    )
  if (error)
    return (
      <div className="p-8 text-red-600 dark:text-red-400">
        <p>{error}</p>
      </div>
    )

  // Kategoryzacja wg TaskStatus i terminu
  const now = Date.now()
  const done = tasks.filter((t) => t.status === TaskStatus.Finished)
  const upcoming = tasks.filter(
    (t) =>
      t.status !== TaskStatus.Finished &&
      (!t.deadlineDate ||
        new Date(t.deadlineDate).getTime() >= now)
  )
  const overdue = tasks.filter(
    (t) =>
      t.status !== TaskStatus.Finished &&
      t.deadlineDate &&
      new Date(t.deadlineDate).getTime() < now
  )

  return (
    <div
      className="
      min-h-screen p-4 sm:p-6 lg:p-8
      bg-gray-50 text-gray-900
      dark:bg-gray-900 dark:text-gray-100
    "
    >
      {/* Powitanie */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback className="bg-purple-500 text-white">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Witaj, {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Masz {tasks.length} przypisanych zadań
            </p>
          </div>
        </div>
      </div>

      {/* Statystyki */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <StatCard
          title="Wszystkie zadania"
          value={tasks.length}
          icon={<ListIcon />}
        />
        <StatCard title="Aktualne" value={upcoming.length} icon={<Clock />} />
        <StatCard
          title="Zaległe"
          value={overdue.length}
          icon={<AlertTriangle />}
        />
        <StatCard title="Ukończone" value={done.length} icon={<CheckCircle />} />
      </div>

      {/* Główne widgety */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Zadania */}
        <Card className="h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="flex items-center justify-between pb-0">
            <CardTitle>Moje zadania</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming" className="space-y-4">
              <TabsList className="flex w-full grid-cols-3">
                <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
                  Aktualne ({upcoming.length})
                </TabsTrigger>
                <TabsTrigger value="overdue" className="text-xs sm:text-sm">
                  Zaległe ({overdue.length})
                </TabsTrigger>
                <TabsTrigger value="done" className="text-xs sm:text-sm">
                  Ukończone ({done.length})
                </TabsTrigger>
              </TabsList>

              {(['upcoming', 'overdue', 'done'] as const).map((key) => {
                const data =
                  key === 'upcoming'
                    ? upcoming
                    : key === 'overdue'
                    ? overdue
                    : done
                return (
                  <TabsContent key={key} value={key}>
                    {data.length === 0 ? (
                      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                        {key === 'upcoming'
                          ? 'Brak aktualnych zadań.'
                          : key === 'overdue'
                          ? 'Brak zaległych zadań.'
                          : 'Brak ukończonych zadań.'}
                      </div>
                    ) : (
                      <ul className="space-y-4 mt-4">
                        {data.map((t) => (
                          <li
                            key={t.id}
                            // onClick={() => handleTaskClick(t)}
                            className="
                              flex flex-col p-4
                              bg-white dark:bg-gray-900
                              border border-gray-200 dark:border-gray-700
                              rounded-lg cursor-pointer
                              hover:bg-gray-50 dark:hover:bg-gray-800
                              hover:shadow-md
                              transition-all duration-200
                            "
                          >
                            {/* Nagłówek */}
                            <div className="flex justify-between items-start gap-3">
                              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-100 min-w-0 flex-1">
                                {key === 'upcoming' && (
                                  <Clock className="text-gray-500 dark:text-gray-400 flex-shrink-0" size={16} />
                                )}
                                {key === 'overdue' && (
                                  <AlertTriangle className="text-red-500 flex-shrink-0" size={16} />
                                )}
                                {key === 'done' && (
                                  <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
                                )}
                                <span className="font-medium truncate">{t.name}</span>
                              </div>
                              {(key === 'upcoming' || key === 'overdue') && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                  {t.deadlineDate
                                    ? new Date(t.deadlineDate).toLocaleDateString()
                                    : '-'}
                                </span>
                              )}
                            </div>

                            {/* Opis */}
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                              {t.description}
                            </p>

                            {/* Badges */}
                            <div className="mt-3 flex flex-wrap gap-2">
                              <span
                                className={`
                                px-2 py-0.5 rounded-full text-xs whitespace-nowrap
                                ${getTaskStatusBadge(t.status)}
                              `}
                              >
                                {getTaskStatusLabel(t.status)}
                              </span>
                              <span
                                className={`
                                px-2 py-0.5 rounded-full text-xs whitespace-nowrap
                                ${getTaskPriorityBadge(t.priority)}
                              `}
                              >
                                {getTaskPriorityLabel(t.priority)}
                              </span>
                            </div>

                            {/* Meta */}
                            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <span className="whitespace-nowrap">
                                Utworzono:{' '}
                                {new Date(t.created).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1 whitespace-nowrap">
                                <Users className="inline-block w-3 h-3" />{' '}
                                {t.assignedUsers.length}
                              </span>
                            </div>

                            {/* Data ukończenia */}
                            {key === 'done' && t.finished && (
                              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Ukończono:{' '}
                                {new Date(t.finished).toLocaleDateString()}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </TabsContent>
                )
              })}
            </Tabs>
          </CardContent>
        </Card>

        {/* Projekty */}
        <Card className="h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="flex items-center justify-between pb-0">
            <CardTitle>Projekty</CardTitle>
            <Link
              href="/spicelab/project"
              className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
            >
              Więcej…
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 mt-4">
              {visibleProjects.map((p) => (
                <Link key={p.id} href={`/spicelab/project/${p.id}`}>
                  <div
                    className="
                      p-4 bg-white dark:bg-gray-900
                      border border-gray-200 dark:border-gray-700
                      rounded-lg shadow-sm cursor-pointer
                      hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800
                      transition-all duration-200
                    "
                  >
                    {/* Header - responsive layout */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 min-w-0 flex-1">
                        {p.name}
                      </h3>
                      <span
                        className={`
                          px-3 py-1 rounded-full text-xs whitespace-nowrap self-start
                          ${getProjectStatusBadge(p.status)}
                        `}
                      >
                        {getProjectStatusLabel(p.status)}
                      </span>
                    </div>
                    
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {p.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}