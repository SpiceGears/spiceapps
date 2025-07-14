// components/project/ProjectOverview.tsx
"use client"

import { Upload } from "lucide-react"
import { Project } from "@/models/Project"
import ProjectFile from "./ProjectFile"

interface ProjectOverviewProps {
  project?: Project
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <div className="p-4 h-full w-full">
      <div className="space-y-4 text-left flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Opis projektu
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mt-5 text-lg">
            {project?.description ?? "Brak opisu"}
          </p>
          <ProjectFile 
            project={project!}
          />
        </div>
      </div>
    </div>
  )
}
