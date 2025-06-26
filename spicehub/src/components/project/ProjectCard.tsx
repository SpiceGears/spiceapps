// components/ProjectCard.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserById } from '@/hooks/userById'
import { Project, ProjectStatus } from '@/models/Project'
import { TaskStatus } from '@/models/Task'
import { ChevronRight, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const statusConfig: Record<
  ProjectStatus,
  { label: string; color: string }
> = {
  [ProjectStatus.Healthy]: {
    label: "Aktywny",
    color: "bg-green-100 text-green-800",
  },
  [ProjectStatus.Finished]: {
    label: "Zakończony",
    color: "bg-gray-100 text-gray-800",
  },
  [ProjectStatus.Delayed]: {
    label: "Opóźniony",
    color: "bg-yellow-100 text-yellow-800",
  },
  [ProjectStatus.Endangered]: {
    label: "Zagrożony",
    color: "bg-red-100 text-red-800",
  },
  [ProjectStatus.Abandoned]: {
    label: "Porzucony",
    color: "bg-gray-500 bg-white-400"
  }
}

const getInitials = (name: string) => {
  const parts = name.split(' ')
  if (parts.length < 2) return parts[0]?.[0]?.toUpperCase() ?? ''
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

const ProjectCard = ({ project }: { project: Project }) => {
  const router = useRouter()
  const { data, loading, error } = useUserById(project.creator)

  const handleClick = (id: string) =>
    router.push(`/spicelab/project/${id}`)

  return (
    <div
      onClick={() => handleClick(project.id)}
      className="group bg-white dark:bg-gray-800 rounded-lg border
                 border-gray-200 dark:border-gray-700 p-6 cursor-pointer
                 hover:shadow-lg transition"
    >
      {/* Always render title/desc/status immediately */}
      <h3 className="text-lg font-semibold mb-2">
        {project.name}
      </h3>
      {project.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {project.description}
        </p>
      )}
      <Badge
        className={`${statusConfig[project.status].color} mb-4`}
      >
        {statusConfig[project.status].label}
      </Badge>

      {/* Author row */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
        <User className="w-4 h-4 flex-shrink-0" />

        {loading ? (
          <>
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-24 ml-1 rounded" />
          </>
        ) : error || !data ? (
          <span className="italic text-red-500 text-xs">
            nie udało się załadować autora
          </span>
        ) : (
          <>
            <Avatar className="w-5 h-5">
              <AvatarImage src={undefined} />
              <AvatarFallback className="text-xs">
                {getInitials(`${data.firstName} ${data.lastName}`)}
              </AvatarFallback>
            </Avatar>
            <span>
              {data.firstName} {data.lastName}
            </span>
          </>
        )}
      </div>

      {/* Footer “last activity” */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        {loading ? (
          <Skeleton className="h-4 w-32 rounded" />
        ) : (
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Ostatnia aktywność: kiedyś tam</span>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectCard