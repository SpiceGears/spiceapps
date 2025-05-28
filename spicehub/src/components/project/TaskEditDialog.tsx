"use client";

import { useState, useEffect } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CalendarIcon, User, X, Plus } from "lucide-react";

type Assignee = {
  id: string;
  name: string;
  avatarUrl?: string;
  email?: string;
};

type Task = {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "completed";
  completed: boolean;
  priority: "low" | "medium" | "high";
  assignees: Assignee[];
  dueDate?: string;
  createdDate: string;
  section: string;
};

type TaskEditDialogProps = {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  availableUsers?: Assignee[]; // List of all available users to assign
};

const assignees = [
    {
    id: "test",
    name: "test",
    avatarUrl: "test",
    email: "test",
  },
];

const priorityColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const statusLabels = {
  todo: "Do zrobienia",
  "in-progress": "W trakcie",
  completed: "Ukończone",
};

const priorityLabels = {
  low: "Niski",
  medium: "Średni",
  high: "Wysoki",
};

// Mock data for available users - replace with your actual data source
const defaultAvailableUsers: Assignee[] = [
  {
    id: "1",
    name: "Jan Kowalski",
    email: "jan.kowalski@example.com",
    avatarUrl: "/avatars/jan.jpg",
  },
  {
    id: "2",
    name: "Anna Nowak",
    email: "anna.nowak@example.com",
    avatarUrl: "/avatars/anna.jpg",
  },
  {
    id: "3",
    name: "Piotr Wiśniewski",
    email: "piotr.wisniewski@example.com",
  },
  {
    id: "4",
    name: "Maria Wójcik",
    email: "maria.wojcik@example.com",
  },
];

export default function TaskEditDialog({
  task,
  isOpen,
  onClose,
  onSave,
  availableUsers = defaultAvailableUsers,
}: TaskEditDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo" as Task["status"],
    priority: "medium" as Task["priority"],
    section: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedAssignees, setSelectedAssignees] = useState<Assignee[]>([]);
  const [isAssigneePopoverOpen, setIsAssigneePopoverOpen] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        section: task.section,
      });
      setSelectedDate(task.dueDate ? new Date(task.dueDate) : undefined);
      setSelectedAssignees(task.assignees || []);
    }
  }, [task]);

  if (!task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedTask: Task = {
      ...task,
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      section: formData.section,
      completed: formData.status === "completed",
      dueDate: selectedDate ? selectedDate.toISOString() : undefined,
      assignees: selectedAssignees,
    };

    onSave(updatedTask);
    onClose();
  };

  const handleAssigneeToggle = (user: Assignee, checked: boolean) => {
    if (checked) {
      setSelectedAssignees((prev) => [...prev, user]);
    } else {
      setSelectedAssignees((prev) =>
        prev.filter((assignee) => assignee.id !== user.id)
      );
    }
  };

  const removeAssignee = (userId: string) => {
    setSelectedAssignees((prev) =>
      prev.filter((assignee) => assignee.id !== userId)
    );
  };

  const isUserAssigned = (userId: string) => {
    return selectedAssignees.some((assignee) => assignee.id === userId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-6">
        <DialogHeader className="relative mb-4">
          <DialogTitle>Edytuj zadanie</DialogTitle>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="task-title">Nazwa zadania</Label>
            <Input
              id="task-title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Wprowadź nazwę zadania"
              className="w-full"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Task["status"]) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">{statusLabels.todo}</SelectItem>
                  <SelectItem value="in-progress">
                    {statusLabels["in-progress"]}
                  </SelectItem>
                  <SelectItem value="completed">
                    {statusLabels.completed}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priorytet</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Task["priority"]) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={priorityColors.low}
                      >
                        {priorityLabels.low}
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={priorityColors.medium}
                      >
                        {priorityLabels.medium}
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={priorityColors.high}
                      >
                        {priorityLabels.high}
                      </Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Przypisane osoby</Label>
              <div className="space-y-3">
                {/* Selected assignees */}
                <div className="flex flex-wrap gap-2">
                  {selectedAssignees.map((assignee) => (
                    <div
                      key={assignee.id}
                      className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-800"
                    >
                      <Avatar className="w-6 h-6">
                        {assignee.avatarUrl ? (
                          <AvatarImage
                            src={assignee.avatarUrl}
                            alt={assignee.name}
                          />
                        ) : (
                          <AvatarFallback className="text-xs">
                            {assignee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="text-sm font-medium">
                        {assignee.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                        onClick={() => removeAssignee(assignee.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Add assignee button */}
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
                        {availableUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                          >
                            <Checkbox
                              id={`user-${user.id}`}
                              checked={isUserAssigned(user.id)}
                              onCheckedChange={(checked) =>
                                handleAssigneeToggle(user, checked as boolean)
                              }
                            />
                            <Avatar className="w-8 h-8">
                              {user.avatarUrl ? (
                                <AvatarImage
                                  src={user.avatarUrl}
                                  alt={user.name}
                                />
                              ) : (
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {user.name}
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

          <div className="space-y-2">
            <Label htmlFor="task-section">Sekcja</Label>
            <Input
              id="task-section"
              value={formData.section}
              onChange={(e) =>
                setFormData({ ...formData, section: e.target.value })
              }
              placeholder="Wprowadź nazwę sekcji"
              className="w-full"
            />
          </div>

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

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Utworzone: {format(new Date(task.createdDate), "dd.MM.yyyy")}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              ID: {task.id}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Anuluj
              </Button>
            </DialogClose>
            <Button type="submit">Zapisz zmiany</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
