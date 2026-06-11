import { ProjectStatus } from "@/models/Project"
import { TaskPriority, TaskStatus } from "@/models/Task"

const getTaskStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.Planned:  return 'Zaplanowane'
    case TaskStatus.OnTrack:  return 'W toku'
    case TaskStatus.Finished: return 'Ukończone'
    case TaskStatus.Problem:  return 'Problem'
  }
}

const getTaskStatusBadge = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.Planned:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    case TaskStatus.OnTrack:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case TaskStatus.Finished:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case TaskStatus.Problem:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
}

const getTaskPriorityLabel = (prio: TaskPriority): string => {
  switch (prio) {
    case TaskPriority.Low:    return 'Niski'
    case TaskPriority.Medium: return 'Średni'
    case TaskPriority.High:   return 'Wysoki'
  }
}

const getTaskPriorityBadge = (prio: TaskPriority): string => {
  switch (prio) {
    case TaskPriority.Low:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case TaskPriority.Medium:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case TaskPriority.High:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
}

const getProjectStatusLabel = (st: ProjectStatus): string => {
  switch (st) {
    case ProjectStatus.Healthy:    return 'Na dobrej drodze'
    case ProjectStatus.Endangered: return 'Zagrożony'
    case ProjectStatus.Delayed:    return 'Opóźniony'
    case ProjectStatus.Abandoned:  return 'Porzucony'
    case ProjectStatus.Finished:   return 'Ukończony'
  }
}

function getProjectStatusBadge(st: ProjectStatus): string {
  switch (st) {
    case ProjectStatus.Healthy:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case ProjectStatus.Endangered:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case ProjectStatus.Delayed:
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case ProjectStatus.Abandoned:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case ProjectStatus.Finished:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}

export { getTaskStatusBadge, getTaskStatusLabel, getTaskPriorityLabel, getTaskPriorityBadge, getProjectStatusLabel, getProjectStatusBadge };