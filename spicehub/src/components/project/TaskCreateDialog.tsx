// components/project/TaskCreateDialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Flag, FolderOpen } from "lucide-react";

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

type Section = {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
};

interface TaskCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id" | "createdDate">) => void;
  sections: Section[];
  defaultSection?: string;
}

// Mock assignees - in real app this would come from props or API
const availableAssignees: Assignee[] = [
  { id: "1", name: "Janusz Kowalski", email: "janusz@example.com" },
  { id: "2", name: "Anna Nowak", email: "anna@example.com" },
  { id: "3", name: "Piotr Wiśniewski", email: "piotr@example.com" },
  { id: "4", name: "Maria Kowalczyk", email: "maria@example.com" },
];

export function TaskCreateDialog({
  isOpen,
  onClose,
  onSave,
  sections,
  defaultSection,
}: TaskCreateDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    section: defaultSection || (sections[0]?.id || ""),
    status: "todo" as Task["status"],
    assignees: [] as Assignee[],
    dueDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleClose = () => {
    // Reset form
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      section: defaultSection || (sections[0]?.id || ""),
      status: "todo",
      assignees: [],
      dueDate: "",
    });
    setErrors({});
    onClose();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tytuł zadania jest wymagany";
    }

    if (!formData.section) {
      newErrors.section = "Wybierz sekcję dla zadania";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const newTask: Omit<Task, "id" | "createdDate"> = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      priority: formData.priority,
      section: formData.section,
      status: formData.status,
      assignees: formData.assignees,
      dueDate: formData.dueDate || undefined,
      completed: false,
    };

    onSave(newTask);
    handleClose();
  };

  const handleAssigneeToggle = (assignee: Assignee) => {
    setFormData(prev => ({
      ...prev,
      assignees: prev.assignees.find(a => a.id === assignee.id)
        ? prev.assignees.filter(a => a.id !== assignee.id)
        : [...prev.assignees, assignee]
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return "Wysoki";
      case "medium": return "Średni";
      case "low": return "Niski";
      default: return "Średni";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dodaj nowe zadanie</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Tytuł zadania <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Wprowadź tytuł zadania..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Opis</Label>
            <Textarea
              id="description"
              placeholder="Dodaj opis zadania..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Section Selection */}
          <div className="space-y-2">
            <Label>
              Sekcja <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.section}
              onValueChange={(value) => setFormData(prev => ({ ...prev, section: value }))}
            >
              <SelectTrigger className={errors.section ? "border-red-500" : ""}>
                <SelectValue placeholder="Wybierz sekcję">
                  {formData.section && (
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4" />
                      {sections.find(s => s.id === formData.section)?.title}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    <div className="flex items-center gap-2">
                      {section.icon}
                      {section.title}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.section && (
              <p className="text-sm text-red-500">{errors.section}</p>
            )}
          </div>

          {/* Priority and Status Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <Label>Priorytet</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Task["priority"]) => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4" />
                      <Badge variant="outline" className={getPriorityColor(formData.priority)}>
                        {getPriorityLabel(formData.priority)}
                      </Badge>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-red-500" />
                      <Badge variant="outline" className={getPriorityColor("high")}>
                        Wysoki
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-yellow-500" />
                      <Badge variant="outline" className={getPriorityColor("medium")}>
                        Średni
                      </Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-green-500" />
                      <Badge variant="outline" className={getPriorityColor("low")}>
                        Niski
                      </Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Task["status"]) => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Do zrobienia</SelectItem>
                  <SelectItem value="in-progress">W trakcie</SelectItem>
                  <SelectItem value="completed">Ukończone</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Termin wykonania</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          {/* Assignees */}
          <div className="space-y-2">
            <Label>Przypisane osoby</Label>
            <div className="space-y-2">
              {availableAssignees.map((assignee) => (
                <div
                  key={assignee.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.assignees.find(a => a.id === assignee.id)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                  onClick={() => handleAssigneeToggle(assignee)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-sm">{assignee.name}</p>
                      <p className="text-xs text-gray-500">{assignee.email}</p>
                    </div>
                  </div>
                  {formData.assignees.find(a => a.id === assignee.id) && (
                    <Badge variant="secondary">Wybrane</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Assignees Summary */}
          {formData.assignees.length > 0 && (
            <div className="space-y-2">
              <Label>Wybrane osoby ({formData.assignees.length})</Label>
              <div className="flex flex-wrap gap-2">
                {formData.assignees.map((assignee) => (
                  <Badge
                    key={assignee.id}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100 hover:text-red-800 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    onClick={() => handleAssigneeToggle(assignee)}
                  >
                    {assignee.name} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Anuluj
          </Button>
          <Button onClick={handleSave}>
            Dodaj zadanie
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
