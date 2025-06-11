// components/project/ProjectEditDialog.tsx
"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Project } from "@/models/Project"
import { useUserById } from "@/hooks/userById"

interface ProjectEditDialogProps {
  project?: Project
  isOpen: boolean
  onClose: () => void
  onSave: (project: Project) => void
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) {
    return ""
  }
  const firstChar  = parts[0][0] ?? ""
  const secondChar = parts[1]?.[0] ?? ""
  return (firstChar + secondChar).toUpperCase()
}

export function ProjectEditDialog({
  project,
  isOpen,
  onClose,
}: ProjectEditDialogProps) {
  const userId = project?.creator ?? ""
  const { data, loading, error } = useUserById(userId)

  if (!project) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-6">
        <DialogHeader className="relative mb-4">
          <DialogTitle>Edytuj szczegóły projektu</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault()
            onClose()
          }}
        >
          {/* project name */}
          <div className="space-y-1">
            <label
              htmlFor="project-name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nazwa
            </label>
            <Input
              id="project-name"
              defaultValue={project.name}
              placeholder="Wprowadź nazwę projektu"
              className="w-full"
            />
          </div>

          {/* creator info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Twórca projektu
              </label>
              <div className="flex items-center gap-2">
                {loading ? (
                  <Skeleton className="h-8 w-8 rounded-full" />
                ) : (
                  <Avatar className="w-8 h-8">
                    {/* {data?.avatarUrl ? (
                      <AvatarImage
                        src={undefined}
                        alt={`${data.firstName} ${data.lastName}`}
                      />
                    ) : ( */}
                      <AvatarFallback>
                        {getInitials(
                          `${data?.firstName ?? ""} ${data?.lastName ?? ""}`
                        )}
                      </AvatarFallback>
                    {/* )} */}
                  </Avatar>
                )}

                {/* name */}
                {loading ? (
                  <Skeleton className="h-4 w-32" />
                ) : error ? (
                  <span className="text-sm text-red-500">
                    Błąd ładowania
                  </span>
                ) : (
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {data?.firstName} {data?.lastName}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* description */}
          <div className="space-y-1">
            <label
              htmlFor="project-desc"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Opis projektu
            </label>
            <Textarea
              id="project-desc"
              defaultValue={project.description}
              placeholder="O czym jest ten projekt?"
              className="w-full"
            />
          </div>

          {/* actions */}
          <DialogFooter>
            <Button type="submit">Zapisz zmiany</Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Anuluj
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}