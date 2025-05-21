"use client"

import React from "react"
import { FolderPlus } from "lucide-react"

export interface TimelineItemProps {
    title: string
    author: string
    date: string
}

export function ProjectCreated({
    title,
    author,
    date,
}: TimelineItemProps) {
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
            <div className="flex flex-col items-center mr-1">
                <FolderPlus className="block w-5 h-5 text-green-500 mt-2 -ml-1" />
                <span className="flex-1 w-px bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* content */}
            <div className="flex flex-col ml-1">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {title}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {author} · {date}
                </span>
            </div>
        </div>
    )
}