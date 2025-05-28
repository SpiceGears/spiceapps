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

interface ProjectEditDialogProps {
  project?: Project
  isOpen: boolean
  onClose: () => void
}

export function ProjectEditDialog({
  project,
  isOpen,
  onClose,
}: ProjectEditDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    project?.dueDate ? new Date(project.dueDate) : undefined
  )

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
                  {project.owner.avatarUrl ? (
                    <AvatarImage
                      src={project.owner.avatarUrl}
                      alt={project.owner.name}
                    />
                  ) : (
                    <AvatarFallback>
                      {project.owner.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {project.owner.name}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="due-date">Termin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="due-date"
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    {selectedDate
                      ? format(selectedDate, "PPP", { locale: undefined })
                      : "Wybierz termin"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
