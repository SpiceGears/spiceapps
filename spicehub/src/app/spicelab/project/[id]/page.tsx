"use client"
import { useState, use } from "react"
import {
  Folder,
  ChevronDown,
  Pen,
  Palette,
  X,
  Calendar as CalendarIcon,
  Upload
} from "lucide-react"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Calendar as CalendarUI } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { CopyLinkButton } from "@/components/CopyButton"
import { StatusUpdate } from "@/components/project/timeline/StatusUpdate"
import { ProjectCreated } from "@/components/project/timeline/ProjectCreated"

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

const projects: Project[] = [
  {
    id: "123",
    name: "Project Alpha",
    description: "Pierwszy projekt",
    owner: { name: "Janusz Kowalski", avatarUrl: undefined },
  },
  {
    id: "2",
    name: "Project Beta",
    description: "Second project",
    owner: { name: "Jane Doe", avatarUrl: undefined },
  },
  {
    id: "3",
    name: "Project Gamma",
    description: "Third project",
    owner: { name: "John Smith", avatarUrl: undefined },
  },
]

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [isEditingProject, setIsEditingProject] = useState(false)
  const { id } = use(params)
  const project = projects.find((p) => p.id === id)

  // state for the date-picker, seeded from project.dueDate
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    project?.dueDate ? new Date(project.dueDate) : undefined
  )

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Tabs defaultValue="przeglad" className="flex flex-col min-h-screen">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Folder className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {project?.name ?? "Nieznany projekt"}
            </span>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 text-gray-500 dark:text-gray-400"
                >
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <DropdownMenuItem onClick={() => setIsEditingProject(true)}>
                  <Pen className="w-4 h-4 mr-2" />
                  Zmień szczegóły projektu
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Palette className="w-4 h-4 mr-2" />
                  Zmień kolor projektu
                </DropdownMenuItem>
                <DropdownMenuItem>Opcja 3</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <CopyLinkButton text="Skopiuj link do projektu" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <TabsList>
            <TabsTrigger value="przeglad">Przegląd</TabsTrigger>
            <TabsTrigger value="lista">Lista</TabsTrigger>
            <TabsTrigger value="panel">Dashboard</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto">
            <div className="flex flex-col items-center justify-center h-full w-full">
<TabsContent value="przeglad" className="p-6 h-full w-full">
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
                      const fileInput = document.getElementById('file-upload');
                      if (fileInput) fileInput.click();
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
                    <input id="file-upload" type="file" className="hidden" multiple />
                  </div>
                </div>
              </div>
            </TabsContent>
              <TabsContent value="lista" className="p-6 h-full w-full">
                <div className="space-y-4 text-left flex flex-col items-center">
                  <div className="w-full max-w-2xl">
                    <h2 className="text-xl font-bold">Lista</h2>
                    <p>Zawartość listy</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="tablica" className="p-6 h-full w-full">
                <div className="space-y-4 text-left flex flex-col items-center">
                  <div className="w-full max-w-2xl">
                    <h2 className="text-xl font-bold">Tablica</h2>
                    <p>Zawartość tablicy</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="os-czasu" className="p-6 h-full w-full">
                <div className="space-y-4 text-left flex flex-col items-center">
                  <div className="w-full max-w-2xl">
                    <h2 className="text-xl font-bold">Oś czasu</h2>
                    <p>Zawartość osi czasu</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="panel" className="p-6 h-full w-full">
                <div className="space-y-4 text-left flex flex-col items-center">
                  <div className="w-full max-w-2xl">
                    <h2 className="text-xl font-bold">Panel</h2>
                    <p>Zawartość panelu</p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </div>

          <div className="w-100 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col">
            <div className="text-center py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-700 dark:text-gray-300">
                Aktywność w projekcie
              </h3>
            </div>
            <div className="p-4 flex-1">
              <StatusUpdate
                title="Zaktualizowano status projektu"
                author="Janusz Kowalski"
                date={format(new Date(), "PPP")}
              />
              <ProjectCreated
                title="Utworzono projekt"
                author="Janusz Kowalski"
                date={format(new Date(), "PPP")}
              />
            </div>
          </div>
        </div>
      </Tabs>

      {isEditingProject && project && (
        <Dialog open={isEditingProject} onOpenChange={setIsEditingProject}>
          <DialogContent className="max-w-xl p-6">
            <DialogHeader className="relative mb-4">
              <DialogTitle>Edytuj szczegóły projektu</DialogTitle>
            </DialogHeader>

            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault()
                // here you could persist changes, including selectedDate
                setIsEditingProject(false)
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
                      <CalendarUI
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
      )}
    </div>
  )
}
