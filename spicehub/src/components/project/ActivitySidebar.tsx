// components/project/ActivitySidebar.tsx
"use client"

import { format } from "date-fns"
import { StatusUpdate } from "@/components/project/timeline/StatusUpdate"
import { ProjectCreated } from "@/components/project/timeline/ProjectCreated"
import { useState } from "react"
import { ProjectUpdateEntry } from "@/models/Project"
import { Activity, Clock, ChevronRight } from "lucide-react"
import { UserInfo } from "@/models/User"
export interface ActivitySidebarProps {
  events: ProjectUpdateEntry[]
  users: UserInfo[]
  loading: boolean
}

export function ActivitySidebar({
  events,
  users,
  loading,
}: ActivitySidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)

  // Safe date formatting
  const formatSafeDate = (dateValue: any): string => {
    if (!dateValue) return "Brak danych"
    try {
      const d = new Date(dateValue)
      if (isNaN(d.getTime())) return "Brak danych"
      return format(d, "dd.MM.yyyy HH:mm")
    } catch {
      return "Brak danych"
    }
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="
          lg:hidden fixed top-4 right-4 z-50
          bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg
          border border-gray-200 dark:border-gray-700
        "
      >
        <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative inset-y-0 right-0 z-40
          w-80 lg:w-96 xl:w-[400px] h-screen
          transform transition-transform duration-300 ease-in-out
          ${isCollapsed ? "translate-x-full lg:translate-x-0" : "translate-x-0"}
          border-l border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900 flex flex-col
          shadow-xl lg:shadow-none
        `}
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Aktywność w projekcie
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {events.length}{" "}
                    {events.length === 1 ? "wydarzenie" : "wydarzeń"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCollapsed(true)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Brak aktywności
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                Aktywność projektu będzie wyświetlana tutaj, gdy tylko coś się
                wydarzy.
              </p>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <div className="p-4 lg:p-6 space-y-4">
                {events
                  .toReversed()
                  .map((update: ProjectUpdateEntry, idx: number) => (
                    <div
                      key={update.id}
                      className={`
                        relative transition-all duration-200
                        hover:scale-[1.02]
                        ${idx === 0 ? "animate-fadeIn" : ""}
                      `}
                    >
                      {/* Timeline Line */}
                      {idx < events.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-8 bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-600" />
                      )}

                      {/* Pass users + loading as props */}
                      <StatusUpdate
                        update={update}
                        users={users}
                        loading={loading}
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Ostatnia aktualizacja</span>
            <span>
              {events.length > 0
                ? formatSafeDate(events[0].happenedAt)
                : "Brak danych"}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  )
}