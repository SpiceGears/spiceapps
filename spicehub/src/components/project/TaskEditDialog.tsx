"use client";

import { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CalendarIcon, X, Plus } from "lucide-react";
import { Task, Section, TaskStatus } from "@/models/Task";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { NewTaskPayload } from "./TaskList";
import { UserInfo } from "@/models/User";
import { projectContext } from "@/app/spicelab/project/[id]/page";
import { getBackendUrl } from "@/app/serveractions/backend-url";
import { getCookie } from "typescript-cookie";

// Dummy user type for assignees (replace with your actual user model)
type Assignee = {
  id: string;
  name: string;
  avatarUrl?: string;
  email?: string;
};

// Dummy available users (replace with your actual users)
const defaultAvailableUsers: UserInfo[] = [];

type TaskEditDialogProps = {
  task?: Task;                 // if undefined, this will be a "create" form
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  availableUsers?: UserInfo[];
  sections: Section[];
};

const statusLabels = new Map<TaskStatus, string>([
  [TaskStatus.Planned, "Zaplanowane"],
  [TaskStatus.OnTrack, "W trakcie"],
  [TaskStatus.Finished, "Ukończone"],
  [TaskStatus.Problem, "Problem"],
]);

const priorityLabels: Record<number, string> = {
  1: "Niski",
  2: "Średni",
  3: "Wysoki",
};

const priorityColors: Record<number, string> = {
  1: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800",
  2: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  3: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800",
};

export default function TaskEditDialog({
  task,
  isOpen,
  onClose,
  onSave,
  //availableUsers = defaultAvailableUsers,
  sections,
}: TaskEditDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: TaskStatus.Planned as TaskStatus,
    priority: 1 as number,
    section: sections.length > 0 ? sections[0].id : "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [isAssigneePopoverOpen, setIsAssigneePopoverOpen] = useState(false);

  const ctx = useContext(projectContext);

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name,
        description: task.description || "",
        status: task.status,
        priority: Number(task.priority),
        section: task.sectionId ||
          sections[0]?.id || "",    });
      setSelectedDate(
        task.deadlineDate ? new Date(task.deadlineDate) : undefined
      );
      setSelectedAssignees(task.assignedUsers || []);
    }
  }, [task, sections]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // if you’re creating a new task, you’ll need to give it an `id` here or upstream
    // const base: Partial<Task> = task ?? {};
    // const updatedTask: Task = {
    //   ...base,
    //   id: base.id ?? crypto.randomUUID(),
    //   name: formData.name,
    //   description: formData.description,
    //   status: formData.status,
    //   priority: formData.priority,
    //   section: formData.section,
    //   assignedUsers: selectedAssignees,
    //   deadlineDate: selectedDate,
    // } as Task;

    const taskPayload: NewTaskPayload =  
    {
      name: formData.name,
      description: formData.description,
      dependencies: [],
      deadlineDate: selectedDate || new Date(),
      percentage: 0,
      status: formData.status,
      sectionId: formData.section,
      priority: formData.priority,
      assignedUsers: selectedAssignees,
    }
    let sectionMove = formData.section != task?.sectionId;

    const editFetch = async () => {
      const backend = await getBackendUrl();
      if (!backend) throw new Error("Backend env var not SET");
      const at = getCookie("accessToken")
      if (!at) throw new Error("no accessToken provided")

      const res = await fetch(`${backend}/api/project/${ctx.project?.id}/${task?.sectionId}/${task?.id}/edit`, 
        {
          method: "PUT",
          headers: 
          {
            Authorization: at,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            dependencies: [],
            deadlineDate: selectedDate || task?.deadlineDate,
            percentage: 0,
            status: formData.status,
            priority: formData.priority,
            assignedUsers: selectedAssignees,
          })
        })

        if (!res.ok) throw new Error("Fetch failed: " + await res.text())
        else {
          console.log("Edit succeded - new info:"+await res.json());
        }
    }

    const moveFetch = async () => {
      const backend = await getBackendUrl();
      if (!backend) throw new Error("Backend env var not SET");
      const at = getCookie("accessToken")
      if (!at) throw new Error("no accessToken provided");

      const res = await fetch(`${backend}/api/project/${ctx.project?.id}/${task?.id}/moveTo`, 
        {
          method: "PUT",
          headers: {
            Authorization: at,
            "SectionId": formData.section
          }
        })
      if (!res.ok) throw new Error("Move fetch failed: "+await res.text())
      else {
        console.log("Move succeded")
      }
    }

    
    editFetch().then(()=>{
      if (sectionMove) {moveFetch().finally(()=>{
        if (ctx.setRefresh) ctx.setRefresh(!ctx.refresh);})}
      else {if (ctx.setRefresh) ctx.setRefresh(!ctx.refresh);}
    }, (r) => 
      {
        console.error("Edit task failed: ", r);
      })
    //onSave(updatedTask);
    onClose();
  };

  const handleAssigneeToggle = (userId: string, checked: boolean) => {
    setSelectedAssignees((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
  };

  const removeAssignee = (userId: string) => {
    setSelectedAssignees((prev) => prev.filter((id) => id !== userId));
  };

  const isUserAssigned = (userId: string) => {
    return selectedAssignees.includes(userId);
  };

  const currentSection = sections.find((s) => s.id === formData.section);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-6 max-h-[80vh] overflow-y-auto">
        <DialogHeader className="relative mb-4">
          <DialogTitle>{task ? "Edytuj zadanie" : "Nowe zadanie"}</DialogTitle>
          <DialogClose className="absolute top-2 right-2" />
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="task-name">Nazwa zadania</Label>
            <Input
              id="task-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Wprowadź nazwę zadania"
              className="w-full"
              required
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={String(formData.status)}
                onValueChange={(value: string) =>
                  setFormData({
                    ...formData,
                    status: Number(value) as TaskStatus,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue>
                    {statusLabels.get(formData.status)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Array.from(statusLabels.entries()).map(([st, label]) => (
                    <SelectItem key={st} value={String(st)}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priorytet</Label>
              <Select
                value={String(formData.priority)}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, priority: Number(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue>
                    <Badge
                      variant="secondary"
                      className={priorityColors[formData.priority]}
                    >
                      {priorityLabels[formData.priority]}
                    </Badge>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3].map((p) => (
                    <SelectItem key={p} value={String(p)}>
                      <Badge
                        variant="secondary"
                        className={priorityColors[p]}
                      >
                        {priorityLabels[p]}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignees & Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assignees */}
            <div className="space-y-2">
              <Label>Przypisane osoby</Label>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {selectedAssignees.map((uid) => {
                    const user = ctx.users.find((u) => u.id === uid);
                    if (!user) return null;
                    return (
                      <div
                        key={uid}
                        className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-800"
                      >
                        <Avatar className="w-6 h-6">
                          {/*user.avatarUrl ? (
                            <AvatarImage
                              src={user.avatarUrl}
                              alt={user.name}
                            />
                          ) : */(
                            <AvatarFallback className="text-xs">
                              {user.firstName + " " + user.lastName}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span className="text-sm font-medium">
                          {user.firstName + " " + user.lastName}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                          onClick={() => removeAssignee(uid)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    );
                  })}
                </div>

                <Popover
                  open={isAssigneePopoverOpen}
                  onOpenChange={setIsAssigneePopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Dodaj osobę
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="start">
                    <div className="p-4">
                      <h4 className="font-medium mb-3">Wybierz osoby</h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {ctx.users.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                          >
                            <input
                              type="checkbox"
                              checked={isUserAssigned(user.id)}
                              onChange={(e) =>
                                handleAssigneeToggle(
                                  user.id,
                                  e.target.checked
                                )
                              }
                            />
                            <Avatar className="w-8 h-8">
                              {/*user.avatarUrl ? (
                                <AvatarImage
                                  src={user.avatarUrl}
                                  alt={user.name}
                                />
                              ) :*/ (
                                <AvatarFallback>
                                  {user.firstName + " " + user.lastName}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {user.firstName + " " + user.lastName}
                              </p>
                              {user.email && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {user.email}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="due-date">Termin wykonania</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="due-date"
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    {selectedDate
                      ? format(selectedDate, "dd.MM.yyyy")
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

          {/* Section */}
          <div className="space-y-2">
            <Label htmlFor="task-section">Sekcja</Label>
            <Select
              value={formData.section}
              onValueChange={(value: string) =>
                setFormData({ ...formData, section: value })
              }
            >
              <SelectTrigger id="task-section" className="w-full">
                <SelectValue>
                  {currentSection?.name || "Wybierz sekcję"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {sections.map((sec) => (
                  <SelectItem key={sec.id} value={sec.id}>
                    {sec.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="task-description">Opis zadania</Label>
            <Textarea
              id="task-description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Opisz szczegóły zadania..."
              className="w-full min-h-[100px]"
            />
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Anuluj
              </Button>
            </DialogClose>
            <Button type="submit">
              {task ? "Zapisz zmiany" : "Utwórz zadanie"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}