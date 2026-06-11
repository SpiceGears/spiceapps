import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project, ProjectStatus } from "@/models/Project";
import { getProjectStatusBadge, getProjectStatusLabel } from "@/utils/helpers";
import Link from "next/link";

type Props = {
  projects: Project[];
}

export default function ProjectsWidget({ projects }: Props) {
  const hiddenStatuses = [ProjectStatus.Abandoned, ProjectStatus.Finished]
  const visibleProjects = projects.filter((p) => !hiddenStatuses.includes(p.status))
  return (
    <Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader className="flex items-center justify-between pb-0">
        <CardTitle>Projekty</CardTitle>
        <a
          href="/spicelab/project"
          className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
        >
          Więcej…
        </a>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 mt-4">
          {visibleProjects.map((p) => (
            <Link key={p.id} href={`/spicelab/project/${p.id}`}>
              <div
                className="
                              p-4 bg-white dark:bg-gray-700
                              border border-gray-200 dark:border-gray-700
                              rounded-lg shadow-sm cursor-pointer
                              hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800
                              transition-all duration-200
                            "
              >
                {/* Header - responsive layout */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 min-w-0 flex-1">
                    {p.name}
                  </h3>
                  <span
                    className={`
                                  px-3 py-1 rounded-full text-xs whitespace-nowrap self-start
                                  ${getProjectStatusBadge(p.status)}
                                `}
                  >
                    {getProjectStatusLabel(p.status)}
                  </span>
                </div>

                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {p.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}