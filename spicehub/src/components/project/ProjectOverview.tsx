// components/project/ProjectOverview.tsx
"use client"

import { Upload } from "lucide-react"

type Project = {
  id: string
  name: string
  description?: string
  owner: {
    name: string
    avatarUrl?: string
  }
  dueDate?: string
}

interface ProjectOverviewProps {
  project?: Project
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <div className="p-6 h-full w-full">
      <div className="space-y-4 text-left flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Opis projektu
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mt-5 text-lg">
            {project?.description ?? "Brak opisu"}
          </p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8">
            Pliki
          </h2>
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 mt-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            onClick={() => {
              const fileInput = document.getElementById("file-upload")
              if (fileInput) fileInput.click()
            }}
          >
            <div className="h-14 w-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <Upload className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-center">
              Tutaj możesz dodać pliki do projektu.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
              Przeciągnij i upuść pliki lub kliknij, aby dodać
            </p>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              multiple
            />
          </div>
        </div>
      </div>
    </div>
  )
}
