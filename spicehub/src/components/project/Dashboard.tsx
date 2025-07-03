// components/project/Dashboard.tsx
"use client"

import { useMemo } from "react"
import {
  TrendingUp,
  Clock,
  AlertCircle,
  Calendar as CalendarIcon,
} from "lucide-react"
import { format } from "date-fns"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Project } from "@/models/Project"
import { Task } from "@/models/Task"
import { useUserById } from "@/hooks/userById"

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800"
    case "medium":
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
    case "low":
      return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800"
    default:
      return "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800"
  }
}

export default function Dashboard({
  project,
  tasks,
}: {
  project: Project
  tasks: Task[]
}) {
  const now = useMemo(() => new Date(), [])
  const completed = tasks.filter((t) => t.status === 1).length
  const total = tasks.length || 1
  const pct = Math.round((completed / total) * 100)

  return (
    <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 md:py-8 h-full w-full">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
                     gap-4 sm:gap-6 md:gap-8"
        >
          {/* Progress */}
          <div
            className="border border-gray-200 dark:border-gray-700 rounded-lg
                       p-4 sm:p-6 bg-white dark:bg-gray-900"
          >
            <div className="flex items-center justify-between mb-2">
              <h3
                className="text-xs sm:text-sm md:text-base font-medium
                           text-gray-700 dark:text-gray-300"
              >
                Postęp projektu
              </h3>
              <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            <div
              className="text-2xl sm:text-3xl md:text-4xl font-bold
                         text-gray-900 dark:text-gray-100"
            >
              {pct}%
            </div>
            <div className="mt-2">
              <div
                className="w-full bg-gray-200 dark:bg-gray-700
                           rounded-full h-2"
              >
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <p
              className="text-xs sm:text-sm md:text-base text-gray-500
                         dark:text-gray-400 mt-2"
            >
              {completed} z {tasks.length} zadań ukończonych
            </p>
          </div>

          {/* To Do */}
          <div
            className="border border-gray-200 dark:border-gray-700 rounded-lg
                       p-4 sm:p-6 bg-white dark:bg-gray-900"
          >
            <div className="flex items-center justify-between mb-2">
              <h3
                className="text-xs sm:text-sm md:text-base font-medium
                           text-gray-700 dark:text-gray-300"
              >
                Zadania do zrobienia
              </h3>
              <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            <div
              className="text-2xl sm:text-3xl md:text-4xl font-bold
                         text-gray-900 dark:text-gray-100"
            >
              {tasks.length - completed}
            </div>
            <p
              className="text-xs sm:text-sm md:text-base text-gray-500
                         dark:text-gray-400 mt-2"
            >
              Pozostałe zadania
            </p>
          </div>

          {/* Overdue */}
          <div
            className="border border-gray-200 dark:border-gray-700 rounded-lg
                       p-4 sm:p-6 bg-white dark:bg-gray-900"
          >
            <div className="flex items-center justify-between mb-2">
              <h3
                className="text-xs sm:text-sm md:text-base font-medium
                           text-gray-700 dark:text-gray-300"
              >
                Zadania przeterminowane
              </h3>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
            <div
              className="text-2xl sm:text-3xl md:text-4xl font-bold
                         text-red-600"
            >
              {
                tasks.filter(
                  (t) =>
                    t.deadlineDate &&
                    new Date(t.deadlineDate) < now &&
                    t.status !== 1
                ).length
              }
            </div>
            <p
              className="text-xs sm:text-sm md:text-base text-gray-500
                         dark:text-gray-400 mt-2"
            >
              Wymagają uwagi
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming Deadlines */}
          <div
            className="border border-gray-200 dark:border-gray-700 rounded-lg
                       bg-white dark:bg-gray-900 flex flex-col"
          >
            <div
              className="p-4 sm:p-6 border-b border-gray-200
                         dark:border-gray-700"
            >
              <h3
                className="text-lg sm:text-xl md:text-2xl font-medium
                           text-gray-900 dark:text-gray-100 flex items-center gap-2"
              >
                <CalendarIcon className="h-5 w-5" />
                Nadchodzące terminy
              </h3>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[360px]">
              <div className="space-y-4">
                {tasks
                  .filter(
                    (t) =>
                      t.deadlineDate &&
                      new Date(t.deadlineDate) > now &&
                      t.status !== 1
                  )
                  .sort(
                    (a, b) =>
                      new Date(a.deadlineDate!).getTime() -
                      new Date(b.deadlineDate!).getTime()
                  )
                  .slice(0, 5)
                  .map((dl) => (
                    <div
                      key={dl.id}
                      className="flex flex-col sm:flex-row items-start
                                 sm:items-center justify-between p-3 sm:p-4
                                 border border-gray-200 dark:border-gray-700
                                 rounded-lg hover:bg-gray-50
                                 dark:hover:bg-gray-800/50"
                    >
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm sm:text-base font-medium
                                     text-gray-900 dark:text-gray-100 truncate"
                        >
                          {dl.name}
                        </p>
                        <p
                          className="text-xs sm:text-sm text-gray-500
                                     dark:text-gray-400 truncate mt-1"
                        >
                          {Array.isArray(dl.assignedUsers) &&
                          dl.assignedUsers.length === 1 ? (
                            <span className="flex items-center gap-2">
                              {(() => {
                                const u = useUserById(
                                  dl.assignedUsers[0]
                                )
                                return (
                                  <>
                                    <Avatar className="h-5 w-5">
                                      <AvatarFallback>
                                        {u?.data?.firstName?.[0]}
                                        {u?.data?.lastName?.[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="truncate">
                                      {u?.data?.firstName}{" "}
                                      {u?.data?.lastName}
                                    </span>
                                  </>
                                )
                              })()}
                            </span>
                          ) : Array.isArray(dl.assignedUsers) &&
                            dl.assignedUsers.length > 1 ? (
                            <span className="flex -space-x-2">
                              {dl.assignedUsers.slice(0, 3).map((id) => {
                                const u = useUserById(id)
                                return (
                                  <Avatar
                                    key={id}
                                    className="h-5 w-5 border-2 border-white
                                               dark:border-gray-900"
                                  >
                                    <AvatarFallback>
                                      {u?.data?.firstName?.[0]}
                                      {u?.data?.lastName?.[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                )
                              })}
                              {dl.assignedUsers.length > 3 && (
                                <span
                                  className="ml-2 text-xs text-gray-500
                                             dark:text-gray-400"
                                >
                                  +{dl.assignedUsers.length - 3}
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">
                              Brak przypisanych
                            </span>
                          )}
                        </p>
                      </div>
                      {/*
                      <div className="mt-2 sm:mt-0 flex-shrink-0
                                      flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={getPriorityColor(dl.priority)}
                        >
                          {dl.priority === "high"
                            ? "Wysoki"
                            : dl.priority === "medium"
                            ? "Średni"
                            : "Niski"}
                        </Badge>
                        <span
                          className="text-xs sm:text-sm text-gray-500
                                     dark:text-gray-400"
                        >
                          {format(new Date(dl.deadlineDate!), "dd MMM")}
                        </span>
                      </div>
                      */}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}