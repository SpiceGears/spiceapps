import { AlertTriangle, CheckCircle, Clock, Users } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Task, TaskStatus } from "@/models/Task";
import { getTaskPriorityBadge, getTaskPriorityLabel, getTaskStatusBadge, getTaskStatusLabel } from "@/utils/helpers";

type Props = {
    tasks: Task[];
}

export default function TasksWidget({ tasks }: Props) {
      const now = Date.now()
      const done = tasks.filter((t) => t.status === TaskStatus.Finished)
      const upcoming = tasks.filter(
        (t) =>
          t.status !== TaskStatus.Finished &&
          (!t.deadlineDate ||
            new Date(t.deadlineDate).getTime() >= now)
      )
      const overdue = tasks.filter(
        (t) =>
          t.status !== TaskStatus.Finished &&
          t.deadlineDate &&
          new Date(t.deadlineDate).getTime() < now
      )
    return (
        <Card className="h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="flex items-center justify-between pb-0">
            <CardTitle>Moje zadania</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming" className="space-y-4">
              <TabsList className="flex w-full grid-cols-3">
                <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
                  Aktualne ({upcoming.length})
                </TabsTrigger>
                <TabsTrigger value="overdue" className="text-xs sm:text-sm">
                  Zaległe ({overdue.length})
                </TabsTrigger>
                <TabsTrigger value="done" className="text-xs sm:text-sm">
                  Ukończone ({done.length})
                </TabsTrigger>
              </TabsList>

              {(['upcoming', 'overdue', 'done'] as const).map((key) => {
                const data =
                  key === 'upcoming'
                    ? upcoming
                    : key === 'overdue'
                    ? overdue
                    : done
                return (
                  <TabsContent key={key} value={key}>
                    {data.length === 0 ? (
                      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                        {key === 'upcoming'
                          ? 'Brak aktualnych zadań.'
                          : key === 'overdue'
                          ? 'Brak zaległych zadań.'
                          : 'Brak ukończonych zadań.'}
                      </div>
                    ) : (
                      <ul className="space-y-4 mt-4">
                        {data.map((t) => (
                          <li
                            key={t.id}
                            // onClick={() => handleTaskClick(t)}
                            className="
                              flex flex-col p-4
                              bg-white dark:bg-gray-900
                              border border-gray-200 dark:border-gray-700
                              rounded-lg cursor-pointer
                              hover:bg-gray-50 dark:hover:bg-gray-800
                              hover:shadow-md
                              transition-all duration-200
                            "
                          >
                            {/* Nagłówek */}
                            <div className="flex justify-between items-start gap-3">
                              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-100 min-w-0 flex-1">
                                {key === 'upcoming' && (
                                  <Clock className="text-gray-500 dark:text-gray-400 flex-shrink-0" size={16} />
                                )}
                                {key === 'overdue' && (
                                  <AlertTriangle className="text-red-500 flex-shrink-0" size={16} />
                                )}
                                {key === 'done' && (
                                  <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
                                )}
                                <span className="font-medium truncate">{t.name}</span>
                              </div>
                              {(key === 'upcoming' || key === 'overdue') && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                  {t.deadlineDate
                                    ? new Date(t.deadlineDate).toLocaleDateString()
                                    : '-'}
                                </span>
                              )}
                            </div>

                            {/* Opis */}
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                              {t.description}
                            </p>

                            {/* Badges */}
                            <div className="mt-3 flex flex-wrap gap-2">
                              <span
                                className={`
                                px-2 py-0.5 rounded-full text-xs whitespace-nowrap
                                ${getTaskStatusBadge(t.status)}
                              `}
                              >
                                {getTaskStatusLabel(t.status)}
                              </span>
                              <span
                                className={`
                                px-2 py-0.5 rounded-full text-xs whitespace-nowrap
                                ${getTaskPriorityBadge(t.priority)}
                              `}
                              >
                                {getTaskPriorityLabel(t.priority)}
                              </span>
                            </div>

                            {/* Meta */}
                            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <span className="whitespace-nowrap">
                                Utworzono:{' '}
                                {new Date(t.created).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1 whitespace-nowrap">
                                <Users className="inline-block w-3 h-3" />{' '}
                                {t.assignedUsers.length}
                              </span>
                            </div>

                            {/* Data ukończenia */}
                            {key === 'done' && t.finished && (
                              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Ukończono:{' '}
                                {new Date(t.finished).toLocaleDateString()}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </TabsContent>
                )
              })}
            </Tabs>
          </CardContent>
        </Card>
    )
}