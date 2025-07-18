"use client"

import { useState } from "react"
import { ProjectUpdateEntry } from "@/models/Project"
import { UserInfo } from "@/models/User"
import ProjectUpdateIcon from "./ProjectUpdateIcon"
import { Skeleton } from "@/components/ui/skeleton"
import ProjectStatusPreview from "./ProjectStatusPopup"

export interface TimelineItemProps {
  update: ProjectUpdateEntry
  users: UserInfo[]
  loading: boolean
}

export function StatusUpdate({
  update,
  users,
  loading,
}: TimelineItemProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // 1) find the real user
  const user = users.find((u) => u.id === update.user)
  if (!user) {
    // either render nothing, a placeholder, or your skeleton
    return (
      <div className="flex items-center p-4 bg-gray-100 rounded-lg animate-pulse">
        <Skeleton className="w-6 h-6 mr-2" />
        <Skeleton className="flex-1 h-4" />
      </div>
    )
  }

  const displayName = `${user.firstName} ${user.lastName}`.trim()
  const dateString = new Date(update.happenedAt).toLocaleString("pl-PL")

  return (
    <div
      className="
        flex items-start gap-2
        bg-gray-100 text-gray-900
        dark:bg-gray-800 dark:text-gray-100
        rounded-lg p-4
      "
    >
      {/* line + dot */}
      <div className="flex flex-col items-center mr-4">
        {!loading ? (
          <>
            <ProjectUpdateIcon icon={update.type} />
            <span className="flex-1 w-px bg-gray-200 dark:bg-gray-700" />
          </>
        ) : (
          <>
            <Skeleton className="block w-5 h-5 text-green-500 mt-2 -ml-1" />
            <Skeleton className="flex-1 w-px" />
          </>
        )}
      </div>

      {/* content */}
      {!loading ? (
        <div
          className="flex flex-col cursor-pointer"
          onClick={() => setIsPreviewOpen(true)}
        >
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {update.name}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {displayName} · {dateString}
          </span>
        </div>
      ) : (
        <div className="flex flex-col">
          <Skeleton className="text-sm font-medium" />
          <Skeleton className="text-xs" />
        </div>
      )}

      {/* 2) pass the real UserInfo here */}
      <ProjectStatusPreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        update={update}
        user={user}
      />
    </div>
  )
}