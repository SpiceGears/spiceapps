// components/project/TaskSection.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import { TaskCard } from "./TaskCard";
import { Task } from "@/models/Task";
import { Section } from "@/models/Task";

interface TaskSectionProps {
  sectionId: string;
  name: string;
  tasks: Task[];
  sections: Section[];
  // icon: React.ReactNode;
  onToggleCompletion: (taskId: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (
    e: React.DragEvent,
    sectionId: string,
    dropZoneElement: HTMLElement
  ) => void;
  onRenameSection: (sectionId: string, newName: string) => void;
  onDeleteSection: (sectionId: string) => void;
}

export function TaskSection({
  sectionId,
  name,
  tasks,
  sections,
  // icon,
  onToggleCompletion,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  onRenameSection,
  onDeleteSection,
}: TaskSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(name);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus and select text when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Auto-edit mode for new sections
  useEffect(() => {
    if (name === "Nowa kolumna") {
      setIsEditing(true);
    }
  }, [name]);

  const handleStartEditing = () => {
    setEditingName(name);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editingName.trim() && editingName !== name) {
      onRenameSection(sectionId, editingName.trim());
    } else {
      setEditingName(name);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditingName(name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDeleteSection(sectionId);
    setShowDeleteDialog(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="flex-shrink-0 w-80 h-full flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/30">
        {/* Section Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-t-lg">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* {icon} */}

            {isEditing ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  ref={inputRef}
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleSaveEdit}
                  className="h-7 text-sm font-medium px-2 py-1 min-w-0 flex-1"
                  maxLength={50}
                />
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleSaveEdit}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-green-600 dark:text-green-400"
                    title="Zapisz"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600 dark:text-red-400"
                    title="Anuluj"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span
                  className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-gray-100 transition-colors truncate"
                  onClick={handleStartEditing}
                  title="Kliknij, aby edytować"
                >
                  {name}
                </span>
                <Badge variant="secondary" className="ml-2 flex-shrink-0">
                  {tasks.length}
                </Badge>
              </>
            )}
          </div>

          {!isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 flex-shrink-0">
                  <MoreHorizontal className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="sr-only">Open menu</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleStartEditing}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Zmień nazwę</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDeleteClick}
                  className="text-red-700 dark:text-red-500"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Usuń kolumnę</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Tasks Container */}
        <div
          className="flex-1 p-4 space-y-3 overflow-y-auto min-h-[400px]"
          onDragOver={onDragOver}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop(e, sectionId, e.currentTarget)}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              sections={sections}
              onToggleCompletion={onToggleCompletion}
              onDragStart={onDragStart}
            />
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Usuń kolumnę "{name}"
            </AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć tę kolumnę?
              {tasks.length > 0 && (
                <span className="block mt-2 font-medium text-red-600 dark:text-red-400">
                  ⚠️ Wszystkie zadania w tej kolumnie ({tasks.length}{" "}
                  {tasks.length === 1
                    ? "zadanie"
                    : tasks.length < 5
                    ? "zadania"
                    : "zadań"}
                  ) zostaną również usunięte.
                </span>
              )}
              <span className="block mt-2 text-sm">
                Ta akcja jest nieodwracalna.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Anuluj
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Usuń kolumnę
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
