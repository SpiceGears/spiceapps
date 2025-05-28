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

interface DashboardData {
  stats: {
    totalTasks: number
    completedTasks: number
    overdueTasks: number
    teamMembers: number
  }
  upcomingDeadlines: Array<{
    id: number
    task: string
    assignee: string
    dueDate: string
    priority: string
  }>
  teamMembers: Array<{
    id: number
    name: string
    role: string
    tasksCompleted: number
    totalTasks: number
    avatar?: string
  }>
}

interface DashboardProps {
  data: DashboardData
}

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

export function Dashboard({ data }: DashboardProps) {
  const completionPercentage = Math.round(
    (data.stats.completedTasks / data.stats.totalTasks) * 100
  )

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
              {data.stats.completedTasks} z {data.stats.totalTasks} zadań
              ukończonych
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
              {data.stats.totalTasks - data.stats.completedTasks}
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
              {data.stats.overdueTasks}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Wymagają uwagi
            </p>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Członkowie zespołu
              </h3>
              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {data.stats.teamMembers}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Aktywnych użytkowników
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
                {data.upcomingDeadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {deadline.task}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {deadline.assignee}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getPriorityColor(deadline.priority)}
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Performance */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Wydajność zespołu
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {data.teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gray-600 text-white">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {member.tasksCompleted}/{member.totalTasks}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          zadań
                        </p>
                      </div>
                      <div className="w-20">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${
                                (member.tasksCompleted / member.totalTasks) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
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
