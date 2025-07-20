"use client"

import { format } from "date-fns"
import { StatusUpdate } from "@/components/project/timeline/StatusUpdate"
import { ProjectUpdateEntry } from "@/models/Project"
import { Activity, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { UserInfo } from "@/models/User"

export interface ActivitySidebarProps {
  events: ProjectUpdateEntry[]
  users: UserInfo[]
  loading: boolean
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}

export function ActivitySidebar({
  events,
  users,
  loading,
  collapsed,
  setCollapsed,
}: ActivitySidebarProps) {
  const formatSafeDate = (d: any): string => {
    if (!d) return "Brak danych"
    try {
      const dt = new Date(d)
      if (isNaN(dt.getTime())) return "Brak danych"
      return format(dt, "dd.MM.yyyy HH:mm")
    } catch {
      return "Brak danych"
    }
  }

  const widthClasses = "w-80 lg:w-96 xl:w-[400px]"
  const transformClasses = collapsed ? "translate-x-full" : "translate-x-0"

  return (
    <>
      {/* OPEN HANDLE (when collapsed) */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="
            fixed top-1/2 right-0 z-50
            -translate-y-1/2 p-2 rounded-l
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
          "
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      )}

      {/* BACKDROP on mobile when open */}
      {!collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed top-16 bottom-0 right-0 z-40
          ${widthClasses}
          transform transition-transform duration-300
          ${transformClasses}
          border-l border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900 flex flex-col shadow-xl lg:shadow-none
          overflow-y-auto
        `}
      >
        {/* HEADER */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-4 lg:px-6 flex items-center justify-between space-x-3">
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

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setCollapsed(true)}
              className="p-1 rounded bg-gray-200 dark:bg-gray-700"
            >
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-200" />
            </button>
          </div>
        </div>

        {/* BODY */}
        {events.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
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
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
            {events.toReversed().map((upd, idx) => (
              <div key={upd.id} className={`relative ${idx === 0 ? "animate-fadeIn" : ""}`}>
                {idx < events.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-600" />
                )}
                <StatusUpdate update={upd} users={users} loading={loading} />
              </div>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Ostatnia aktualizacja</span>
            <span>
              {events.length > 0
                ? formatSafeDate(events.at(-1)!.happenedAt)
                : "Brak danych"}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}