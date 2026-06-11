'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '@/components/ui/card'
import {
  List as ListIcon,
  CheckCircle,
  AlertTriangle,
  Clock,
  Loader2,
  Users,
} from 'lucide-react'
import { Task, TaskStatus } from '@/models/Task'
import { Project, ProjectStatus } from '@/models/Project'
import { UserInfo } from '@/models/User'
import { api } from '@/services/api'
import Welcome from '@/components/spicelab/Welcome'
import StatCard from '@/components/spicelab/StatCard'
import { getProjectStatusLabel, getProjectStatusBadge }from '@/utils/helpers'
import TasksWidget from '@/components/spicelab/TasksWidget'
import ProjectsWidget from '@/components/spicelab/ProjectsWidget'

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAll() {
      try {
        // Użytkownik
        const currentUser = await api.getUser()
        setUser(currentUser)

        // Zadania
        if (currentUser?.id) {
          setTasks(await api.getUserAssignedTasks(currentUser.id))
        }

        // Projekty
        setProjects(await api.getProjects())
      } catch (err: any) {
        setError(err.message || 'Coś poszło nie tak')
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

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
      <Welcome user={user} tasks={tasks} />

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
        <TasksWidget tasks={tasks} />

        {/* Projekty */}
        <ProjectsWidget projects={projects} />
      </div>
    </div>
  )
}