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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { Project } from "@/models/Project"
import { useUserData } from "@/hooks/userData"
import { useUserById } from "@/hooks/userById"

interface ProjectEditDialogProps {
  project?: Project
  isOpen: boolean
  onClose: () => void
  onSave: (project: Project) => void
}

const getInitials = (name: string) => {
  const parts = name.split(' ')
  if (parts.length < 2) return parts[0]?.[0]?.toUpperCase() ?? ''
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export function ProjectEditDialog({
  project,
  isOpen,
  onClose,
}: ProjectEditDialogProps) {
const { data, loading, error } = useUserById(project?.creator ?? "")

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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Twórca projektu
              </label>
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  {/* {project.owner.avatarUrl ? (
                    <AvatarImage
                      src={undefined}
                      alt={project.creator}
                    />
                  ) : ( */}
                    <AvatarFallback>
                      {getInitials(data?.firstName + " " + data?.lastName)}
                    </AvatarFallback>
                  {/* )} */}
                </Avatar>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {data?.firstName + " " + data?.lastName}
                </span>
              </div>
            </div>
          </div>

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
