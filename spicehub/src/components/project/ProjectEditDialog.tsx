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
import { Skeleton } from "@/components/ui/skeleton";
import { Project } from "@/models/Project"; // No need for ProjectPriority, ProjectStatus if not editable here
import { useUserById } from "@/hooks/useUserById";

// Define the exact shape of data the dialog will return
interface ProjectEditDialogData {
  name: string;
  description: string;
}

interface ProjectEditDialogProps {
  project?: Project;
  isOpen: boolean;
  onClose: () => void;
  // onSave now expects only name and description
  onSave: (data: ProjectEditDialogData) => void;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "";
  }
  const firstChar = parts[0][0] ?? "";
  const secondChar = parts[1]?.[0] ?? "";
  return (firstChar + secondChar).toUpperCase();
};

export function ProjectEditDialog({
  project,
  isOpen,
  onClose,
  onSave,
}: ProjectEditDialogProps) {
  const userId = project?.creator ?? "";
  const { data, loading} = useUserById(userId);

  // Only states for editable fields
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");

  // Update local state if the 'project' prop changes
  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
    }
  }, [project]);

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-6">
        <DialogHeader className="relative mb-4">
          <DialogTitle>Edytuj szczegóły projektu</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            // Pass only the edited name and description
            onSave({
              name,
              description,
            });
            onClose();
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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
                {loading ? (
                  <Skeleton className="h-8 w-8 rounded-full" />
                ) : (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {getInitials(
                        `${data?.firstName ?? ""} ${data?.lastName ?? ""}`
                      )}
                    </AvatarFallback>
                  </Avatar>
                )}

                {loading ? (
                  <Skeleton className="h-4 w-32" />
                ) : (
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {data?.firstName} {data?.lastName}
                  </span>
                )}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="O czym jest ten projekt?"
              className="w-full"
            />
          </div>

          {/* Remove Status, Priority, Scopes inputs as they are no longer editable here */}

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
  );
}