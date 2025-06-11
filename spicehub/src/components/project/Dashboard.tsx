// components/project/Dashboard.tsx
"use client"

import {
  TrendingUp,
  Clock,
  AlertCircle,
  Users,
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

export default function Dashboard({ project, tasks }: { project: Project; tasks: Task[] }) {
  // Count how many tasks have status = 1 (Finished)
  const completedTasks = tasks.filter((task) => task.status === 1).length;
  const completionPercentage = Math.round(
    (completedTasks / tasks.length) * 100
  );

  return (
    <div className="p-6 h-full w-full">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Postęp projektu
              </h3>
              <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {completionPercentage}%
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {completedTasks} z {tasks.length} zadań ukończonych
            </p>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Zadania do zrobienia
              </h3>
              <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {tasks.length - completedTasks}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Pozostałe zadania
            </p>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Zadania przeterminowane
              </h3>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600">
              {tasks.filter(task => task.deadlineDate && new Date(task.deadlineDate) < new Date() && task.status !== 1).length}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Wymagają uwagi
            </p>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Deadlines */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Nadchodzące terminy
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {tasks
                  .filter(
                    (task) =>
                      task.deadlineDate &&
                      new Date(task.deadlineDate) > new Date() &&
                      task.status !== 1
                  )
                  .sort(
                    (a, b) =>
                      new Date(a.deadlineDate!).getTime() -
                      new Date(b.deadlineDate!).getTime()
                  )
                  .slice(0, 5)
                  .map((deadline) => (
                    <div
                      key={deadline.id}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                          {deadline.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {Array.isArray(deadline.assignedUsers) && deadline.assignedUsers.length === 1 ? (
                            <span className="flex items-center gap-2">
                              {(() => {
                                const user = useUserById(deadline.assignedUsers[0]);
                                return (
                                  <>
                                    <Avatar className="h-5 w-5">
                                      <AvatarFallback>
                                        {user?.data?.firstName?.[0]}
                                        {user?.data?.lastName?.[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>
                                      {user?.data?.firstName} {user?.data?.lastName}
                                    </span>
                                  </>
                                );
                              })()}
                            </span>
                          ) : Array.isArray(deadline.assignedUsers) && deadline.assignedUsers.length > 1 ? (
                            <span className="flex -space-x-2">
                              {deadline.assignedUsers.slice(0, 3).map((userId, idx) => {
                                const user = useUserById(userId);
                                return (
                                  <Avatar key={userId} className="h-5 w-5 border-2 border-white dark:border-gray-900">
                                    <AvatarFallback>
                                      {user?.data?.firstName?.[0]}
                                      {user?.data?.lastName?.[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                );
                              })}
                              {deadline.assignedUsers.length > 3 && (
                                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                  +{deadline.assignedUsers.length - 3}
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">Brak przypisanych</span>
                          )}
                        </p>
                      </div>
                      {/* <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={getPriorityColor(project.)}
                    >
                      {deadline.priority === "high"
                        ? "Wysoki"
                        : deadline.priority === "medium"
                        ? "Średni"
                        : "Niski"}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(deadline.dueDate), "dd MMM")}
                    </span>
                  </div> */}
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
