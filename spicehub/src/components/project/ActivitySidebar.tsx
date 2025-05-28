// components/project/ActivitySidebar.tsx
"use client"

import { format } from "date-fns"
import { StatusUpdate } from "@/components/project/timeline/StatusUpdate"
import { ProjectCreated } from "@/components/project/timeline/ProjectCreated"

export function ActivitySidebar() {
  return (
    <div className="w-100 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col">
      <div className="text-center py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-gray-700 dark:text-gray-300">
          Aktywność w projekcie
        </h3>
      </div>
      <div className="p-4 flex-1">
        <StatusUpdate
          title="Zaktualizowano status projektu"
          author="Janusz Kowalski"
          date={format(new Date(), "PPP")}
        />
        <ProjectCreated
          title="Utworzono projekt"
          author="Janusz Kowalski"
          date={format(new Date(), "PPP")}
        />
      </div>
    </div>
  )
}
