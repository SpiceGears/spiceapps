// components/ProjectCardSkeleton.tsx
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronRight } from 'lucide-react'

export const ProjectCardSkeleton = () => {
  return (
    <div
      className="group bg-white dark:bg-gray-800 rounded-lg border
                 border-gray-200 dark:border-gray-700 p-6 animate-pulse"
    >
      {/* Title */}
      <Skeleton className="h-6 w-3/4 mb-2 rounded" />

      {/* Description (two lines) */}
      <Skeleton className="h-4 w-full mb-2 rounded" />
      <Skeleton className="h-4 w-5/6 mb-4 rounded" />

      {/* Badge */}
      <Skeleton className="h-5 w-16 mb-4 rounded" />

      {/* Author row */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-4 w-24 rounded" />
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/2 rounded" />
          <ChevronRight
            className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </div>
  )
}