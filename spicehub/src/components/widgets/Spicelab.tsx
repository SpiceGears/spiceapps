// components/widgets/Spicelab.tsx
import { ChevronRight, ListTodo, AlertCircle } from "lucide-react";
import Link from "next/link";

interface SpicelabCardProps {
  uncompletedTasksCount: number;
  projectsCount: number;
}

function SpicelabCard({
  uncompletedTasksCount,
  projectsCount,
}: SpicelabCardProps) {
  return (
    <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-0 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl">
      {/* Header with title and status */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Spicelab
        </h2>
      </div>

      {/* Body with stats */}
      <div className="p-4">
        <div className="flex items-center justify-between text-gray-900 dark:text-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full">
              <ListTodo className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Nierobione zadania
              </div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {uncompletedTasksCount}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Projekty
              </div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {projectsCount}
              </div>
            </div>
          </div>
          <Link href="/spicelab">
            <button className="bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 transition-colors">
              Przejdź to SpiceLaba
              <ChevronRight className="w-3 h-3" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SpicelabCard;