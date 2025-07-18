import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  StatusUpdateType,
  ProjectStatus,
  ProjectUpdateEntry,
} from "@/models/Project"
import { UserInfo } from "@/models/User"
import { FileTextIcon, XIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { pl } from "date-fns/locale"

const typeLabels: Record<StatusUpdateType, string> = {
  [StatusUpdateType.ProjectCreated]: "Utworzenie projektu",
  [StatusUpdateType.ProjectStatus]: "Aktualizacja statusu",
  [StatusUpdateType.SectionAdd]: "Dodanie sekcji",
  [StatusUpdateType.SectionEdit]: "Edycja sekcji",
  [StatusUpdateType.SectionDelete]: "Usunięcie sekcji",
  [StatusUpdateType.TaskAdd]: "Dodanie zadania",
  [StatusUpdateType.TaskEdit]: "Edycja zadania",
  [StatusUpdateType.TaskDelete]: "Usunięcie zadania",
  [StatusUpdateType.TaskStatusUpdate]: "Zmiana statusu zadania",
  [StatusUpdateType.TaskMoveToSection]: "Przeniesienie zadania",
}

const statusLabels: Record<ProjectStatus, string> = {
  [ProjectStatus.Healthy]: "Zdrowy",
  [ProjectStatus.Endangered]: "Zagrożony",
  [ProjectStatus.Delayed]: "Opóźniony",
  [ProjectStatus.Abandoned]: "Porzucony",
  [ProjectStatus.Finished]: "Zakończony",
}

const statusClasses: Record<ProjectStatus, string> = {
  [ProjectStatus.Healthy]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  [ProjectStatus.Endangered]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  [ProjectStatus.Delayed]: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  [ProjectStatus.Abandoned]: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  [ProjectStatus.Finished]: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
}

export interface ProjectStatusPreviewProps {
  isOpen: boolean
  onClose: () => void
  update: ProjectUpdateEntry
  user: UserInfo
}

export default function ProjectStatusPreview({
  isOpen,
  onClose,
  update,
  user,
}: ProjectStatusPreviewProps) {
  const date = new Date(update.happenedAt)
  const formatted = date.toLocaleString("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  })
  const ago = formatDistanceToNow(date, { locale: pl, addSuffix: true })
  const typeText = typeLabels[update.type] ?? "Nieznany typ"
  const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg bg-white dark:bg-gray-800">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileTextIcon className="h-5 w-5 text-blue-600 dark:text-blue-500" />
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {typeText}
              </DialogTitle>
            </div>
            <DialogClose asChild>
              <button className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-700">
                <XIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>
            </DialogClose>
          </div>
          <DialogDescription className="mt-2 flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200">
                {initials}
              </div>
              <span className="text-gray-800 dark:text-gray-100">
                {user.firstName} {user.lastName}
              </span>
            </div>
            <span className="text-gray-500 dark:text-gray-400">•</span>
            <time
              dateTime={date.toISOString()}
              title={formatted}
              className="text-gray-600 dark:text-gray-400"
            >
              {formatted} ({ago})
            </time>
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            {update.summary}
          </p>
          {update.type === StatusUpdateType.ProjectStatus && (
            <span
              className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                statusClasses[update.status]
              }`}
            >
              {statusLabels[update.status]}
            </span>
          )}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <dt className="font-medium text-gray-700 dark:text-gray-300">
                  Nazwa aktualizacji
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-gray-100">
                  {update.name}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-medium text-gray-700 dark:text-gray-300">
                  Załączniki
                </dt>
                <dd className="mt-1">
                  {update.linkedFiles.length > 0 ? (
                    <ul className="space-y-2">
                      {/* {update.linkedFiles.map((f, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <FileTextIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <a
                            href={f.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            {f.name ?? f.url}
                          </a>
                        </li>
                      ))} */}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                      Brak załączników
                    </p>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <button
            onClick={onClose}
            className="ml-auto rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Zamknij
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}