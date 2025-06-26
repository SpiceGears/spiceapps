// components/project/TaskCreateDialog.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
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
import { Task, TaskStatus, Section } from "@/models/Task";
import { getBackendUrl } from "@/app/serveractions/backend-url";
import { getCookie } from "typescript-cookie";
import { NewTaskPayload } from "./TaskList";

export interface TaskCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: NewTaskPayload) => void;
  sections: Section[];
  defaultSection?: string;
}

export function TaskCreateDialog({
  isOpen,
  onClose,
  onSave,
  sections,
  defaultSection,
}: TaskCreateDialogProps): ReactNode {
  type FormData = {
    name: string;
    description: string;
    priority: number;
    status: TaskStatus;
    sectionId: string;
    assignedUsers: string[];
    deadlineDate: string;
  };

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    priority: 2,
    status: TaskStatus.Planned,
    sectionId: defaultSection || sections[0]?.id || "",
    assignedUsers: [],
    deadlineDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      priority: 2,
      status: TaskStatus.Planned,
      sectionId: defaultSection || sections[0]?.id || "",
      assignedUsers: [],
      deadlineDate: "",
    });
    setErrors({});}
    // List of users who can be assigned to this task
    const [availableAssignees, setAvailableAssignees] = useState<
      { id: string; name: string; email: string }[]
    >([]);

    useEffect(() => {
      const fetchAssignees = async () => {
        try {
          const backend = await getBackendUrl();
          const token = getCookie("accessToken");
          if (!backend || !token) return;

          // Fetch all users
          const usersRes = await fetch(`${backend}/api/user/getAll`, {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          });
          if (!usersRes.ok) return;
          const users = await usersRes.json();

          // Fetch project members (users who can access this project)
          const projectId = defaultSection; // assuming defaultSection is projectId
          const membersRes = await fetch(`${backend}/api/project/${projectId}/getUsers`, {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          });
          if (!membersRes.ok) return;
          const members = await membersRes.json(); // array of user ids

          // Filter users who are project members
          let filtered = users.filter((u: any) => members.includes(u.id));

          // Exclude users already assigned to this task (if editing, not creating)
          // For create dialog, formData.assignedUsers is empty, so this is just for safety
          filtered = filtered.filter(
            (u: any) => !formData.assignedUsers.includes(u.id)
          );

          setAvailableAssignees(filtered);
        } catch (err) {
          setAvailableAssignees([]);
        }
      };

      fetchAssignees();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultSection, formData.assignedUsers]);

    const handleClose = () => {
      resetForm();
      onClose();
    };

    const validate = () => {
      const errs: Record<string, string> = {};
      if (!formData.name.trim()) errs.name = "Nazwa zadania jest wymagana";
      if (!formData.sectionId) errs.sectionId = "Wybierz sekcję";
      setErrors(errs);
      return Object.keys(errs).length === 0;
    };

    const handleSave = async () => {
      if (!validate()) return;
      const payload: NewTaskPayload = {
        // name: formData.name.trim(),
        // description: formData.description.trim(),
        // status: formData.status,
        // priority: formData.priority,
        // assignedUsers: formData.assignedUsers,
        // deadlineDate: formData.deadlineDate ? new Date(formData.deadlineDate) : null,
        name: formData.name,
        description: formData.description,
        deadlineDate: new Date(formData.deadlineDate),
        dependencies: [],
        percentage: 0,
        status: formData.status,
        priority: formData.priority,
        assignedUsers: formData.assignedUsers,
        sectionId: formData.sectionId,

      };

      try {
        // #ALREADY COVERED IN PAGE.TSX#
        // const res = await fetch(
        //   `/api/project/${defaultSection}/${formData.sectionId}/create`,
        //   {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(payload),
        //   }
        // );
        // if (!res.ok) throw new Error("Błąd podczas tworzenia zadania");
        onSave(payload);
        handleClose();
      } catch (err) {
        console.error(err);
      }
    };

    const toggleAssignee = (id: string) => {
      setFormData((f) => ({
        ...f,
        assignedUsers: f.assignedUsers.includes(id)
          ? f.assignedUsers.filter((u) => u !== id)
          : [...f.assignedUsers, id],
      }));
    };

    const getPriorityColor = (p: number) => {
      switch (p) {
        case 3:
          return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
        case 2:
          return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
        case 1:
          return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      }
    };
    const getPriorityLabel = (p: number) =>
      p === 3 ? "Wysoki" : p === 2 ? "Średni" : "Niski";

    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Dodaj nowe zadanie</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Nazwa zadania <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Wprowadź nazwę..."
                value={formData.name}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, name: e.target.value }))
                }
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Opis</Label>
              <Textarea
                id="description"
                placeholder="Dodaj opis..."
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>

            {/* Section */}
            <div className="space-y-2">
              <Label>
                Sekcja <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.sectionId}
                onValueChange={(v) =>
                  setFormData((f) => ({ ...f, sectionId: v }))
                }
              >
                <SelectTrigger
                  className={errors.sectionId ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Wybierz sekcję" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4" />
                        {s.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sectionId && (
                <p className="text-sm text-red-500">{errors.sectionId}</p>
              )}
            </div>

            {/* Priority & Status */}
            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div className="space-y-2">
                <Label>Priorytet</Label>
                <Select
                  value={formData.priority.toString()}
                  onValueChange={(v) =>
                    setFormData((f) => ({ ...f, priority: Number(v) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4" />
                        <Badge
                          variant="outline"
                          className={getPriorityColor(formData.priority)}
                        >
                          {getPriorityLabel(formData.priority)}
                        </Badge>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                  {[1, 2, 3].map((val) => (
                    <SelectItem key={val} value={val.toString()}>
                      <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4" />
                        <Badge
                          variant="outline"
                          className={getPriorityColor(val)}
                        >
                          {getPriorityLabel(val)}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status.toString()}
                  onValueChange={(v) =>
                    setFormData((f) => ({
                      ...f,
                      status: Number(v) as TaskStatus,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TaskStatus.Planned.toString()}>
                      Planowane
                    </SelectItem>
                    <SelectItem value={TaskStatus.OnTrack.toString()}>
                      W trakcie
                    </SelectItem>
                    <SelectItem value={TaskStatus.Finished.toString()}>
                      Ukończone
                    </SelectItem>
                    <SelectItem value={TaskStatus.Problem.toString()}>
                      Problem
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <Label htmlFor="deadlineDate">Termin wykonania</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="deadlineDate"
                  type="date"
                  className="pl-10"
                  value={formData.deadlineDate}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, deadlineDate: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* Assignees */}
            <div className="space-y-2">
              <Label>Przypisane osoby</Label>
              <div className="space-y-2">
                {availableAssignees.map((u) => {
                  const sel = formData.assignedUsers.includes(u.id);
                  return (
                    <div
                      key={u.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${sel
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        }`}
                      onClick={() => toggleAssignee(u.id)}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-sm">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                      {sel && <Badge variant="secondary">Wybrane</Badge>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Assignees */}
            {formData.assignedUsers.length > 0 && (
              <div className="space-y-2">
                <Label>
                  Wybrane osoby ({formData.assignedUsers.length})
                </Label>
                <div className="flex flex-wrap gap-2">
                  {formData.assignedUsers.map((id) => {
                    const u = availableAssignees.find((x) => x.id === id)!;
                    return (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100 hover:text-red-800 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                        onClick={() => toggleAssignee(id)}
                      >
                        {u.name} ×
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Anuluj
            </Button>
            <Button onClick={handleSave}>Dodaj zadanie</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}