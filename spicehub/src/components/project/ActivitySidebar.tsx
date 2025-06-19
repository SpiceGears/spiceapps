// components/project/ActivitySidebar.tsx
"use client"

import { format } from "date-fns"
import { StatusUpdate } from "@/components/project/timeline/StatusUpdate"
import { ProjectCreated } from "@/components/project/timeline/ProjectCreated"
import { useContext, useEffect, useState } from "react"
import { projectContext } from "@/app/spicelab/project/[id]/page"
import { ProjectUpdateEntry } from "@/models/Project"
import { getBackendUrl } from "@/app/serveractions/backend-url"
import { getCookie } from "typescript-cookie"

export function ActivitySidebar() {
  const ctx = useContext(projectContext);

  
  return (
    <div className="w-100 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col">
      <div className="text-center py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-gray-700 dark:text-gray-300">
          Aktywność w projekcie
        </h3>
      </div>
      <div className="p-4 flex-1">
        {/* <StatusUpdate
          update={ctx.events[0]}
        /> */}
        {ctx.events.toReversed().map((update, index) => {
          return (<StatusUpdate update={update} key={update.id} />)
        })}
      </div>
    </div>
  )
}
