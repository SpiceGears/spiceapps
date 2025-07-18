// components/project/TaskList.tsx
"use client";

import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TaskSection } from "./TaskSection";
import { TaskCreateDialog } from "./TaskCreateDialog";
import { getBackendUrl } from "@/app/serveractions/backend-url";
import { getCookie } from "typescript-cookie";
import {
  Task,
  TaskStatus,
  Section as SectionModel,
} from "@/models/Task";
import { toast } from "sonner";

export type NewTaskPayload = { sectionId: string, 
  name: string
  description: string
  dependencies: string[]
  percentage: Number
  status: TaskStatus
  priority: Number
  deadlineDate: Date
  assignedUsers: string[]
};

interface TaskListProps {
  tasks: Task[];
  projectId: string;
  onToggleCompletion: (taskId: string) => void;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onMoveToSection: (taskId: string, newSectionId: string) => void;
  onDeleteTasks?: (taskIds: string[]) => void;
  onCreateTask?: (task: NewTaskPayload) => void;
  refresh: boolean,
  setRefresh: any //no i will not copy the useStateSet type, no i won't
}

export function TaskList({
  tasks,
  projectId,
  onToggleCompletion,
  onUpdateStatus,
  onCreateTask,
  onMoveToSection,
  onDeleteTasks,
  refresh,
  setRefresh,
}: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<
    "all" | "high" | "medium" | "low"
  >("all");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [sections, setSections] = useState<SectionModel[]>([]);

  // Fetch sections
  useEffect(() => {
    async function fetchSections() {
      try {
        const backend = await getBackendUrl();
        const token = getCookie("accessToken");
        const res = await fetch(
          `${backend}/api/project/${projectId}/getSections`,
          { headers: token ? { Authorization: token } : {} }
        );
        if (!res.ok) throw new Error("Failed to fetch sections");
        const data: SectionModel[] = await res.json();
        // sanitize tasks = null → []
        // const sanitized = data.map((sec) => ({
        //   ...sec,
        //   tasks: Array.isArray(sec.tasks) ? sec.tasks : [],
        // }));
        setSections(data);
        console.log(data)
      } catch (e) {
        console.error(e);
      }
    }
    fetchSections();
  }, [projectId, refresh]);

  // Fetch tasks (if needed for future logic)
  useEffect(() => {
    async function fetchTasksData() {
      try {
        const backend = await getBackendUrl();
        const token = getCookie("accessToken");
        const res = await fetch(
          `${backend}/api/project/${projectId}/getTasks`,
          { headers: token ? { Authorization: token } : {} }
        );
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data: Task[] = await res.json();
        // sanitize tasks = null → []
        data.map((task) => ({
          ...task,
          scopesRequired: Array.isArray(task.scopesRequired)
            ? task.scopesRequired
            : [],
          dependencies: Array.isArray(task.dependencies)
            ? task.dependencies
            : [],
          assignedUsers: Array.isArray(task.assignedUsers)
            ? task.assignedUsers
            : [],
        }));
        // You can set state here if needed
      } catch (e) {
        console.error(e);
      }
    }
    fetchTasksData();
  }, [projectId, refresh]);

  // filter incoming tasks prop
  const filteredTasks = tasks.filter((t) => {
    const matchesName = t.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPri =
      selectedPriority === "all" ||
      (selectedPriority === "high" && t.priority === 3) ||
      (selectedPriority === "medium" && t.priority === 2) ||
      (selectedPriority === "low" && t.priority === 1);
    const matchesAssignee =
      selectedAssignee === "all" || t.assignedUsers.includes(selectedAssignee);
    return matchesName && matchesPri && matchesAssignee;
  });

  const getTasksForSection = (sectionId: string): Task[] => {
    const sec = sections.find((s) => s.id === sectionId);
    if (!sec) return [];
    const result = filteredTasks.filter(task => task.sectionId == sectionId)
    return result;
  };

  // drag & drop
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  };
const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
};
  const handleDrop = async (
  e: React.DragEvent,
  newSectionId: string,
  dropZone: HTMLElement
) => {
  e.preventDefault();
  const taskId = e.dataTransfer.getData("text/plain");
  
  if (!taskId) return;
  
  // Find the task being moved
  const task = tasks.find(t => t.id === taskId);
  if (!task || task.sectionId === newSectionId) {
    dropZone.classList.remove("drag-over");
    return;
  }
  
  try {
    // Update backend first
    const backend = await getBackendUrl();
    const token = getCookie("accessToken");
    
    const response = await fetch(`${backend}/api/project/${projectId}/${taskId}/moveTo`, {
      method: "PUT",
      headers: {
        ...(token ? { Authorization: token } : {}),
        "SectionId": newSectionId, // Pass SectionId as header
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to move task: ${errorText}`);
    }
    
    // Get the updated task from response
    const updatedTask = await response.json();
    
    // Update local state with the updated task
    onMoveToSection(taskId, newSectionId);
    
    // Optional: Show success message
    toast.success("Task moved successfully");
    
  } catch (error) {
    console.error("Error moving task:", error);
    toast.error("Failed to move task");
  }
  
  dropZone.classList.remove("drag-over");
};
  const handleDragEnter = (e: React.DragEvent) => {
    e.currentTarget.classList.add("drag-over");
  };
  const handleDragLeave = (e: React.DragEvent) => {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    ) {
      el.classList.remove("drag-over");
    }
  };

  // section CRUD
  const handleRenameSection = async (id: string, name: string) => {
    try {
      const backend = await getBackendUrl();
      const token = getCookie("accessToken");
      const res = await fetch(
        `${backend}/api/project/${projectId}/${id}/edit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: token } : {}),
          },
          body: JSON.stringify({ name }),
        }
      );
      if (!res.ok) throw new Error("Failed to rename section");
      setSections((s) => s.map((x) => (x.id === id ? { ...x, name } : x)));
    } catch (e) {
      console.error(e);
    }
  };
  const handleDeleteSection = (id: string) => {
    // const toDel = sections.find((s) => s.id === id)?.tasks.map((t) => t.id);
    // setSections((s) => s.filter((x) => x.id !== id));
    // if (toDel?.length && onDeleteTasks) onDeleteTasks(toDel);
    const fetchDelete = async () => 
      {
        const backend = await getBackendUrl();
        if (!backend) throw new Error("No backend?")
        const at = getCookie("accessToken");
        if (!at) throw new Error("No access token!")
          
        const res = await fetch(`${backend}/api/project/${projectId}/${id}/deleteSection`, 
          {
            method: "DELETE",
            headers: {Authorization: at}
          })
        if (res.ok) {
          setRefresh(!refresh);
          return;
        }
        else 
        {
          throw new Error("Fetch failed: "+await res.text())
        }
      }
    
    fetchDelete().catch(e => {toast("Błąd", {description: "Nie można usunąć sekcji: "+ e})})
  };
  const handleAddSection = async () => {
    try {
      const backend = await getBackendUrl();
      const token = getCookie("accessToken");
      const res = await fetch(
        `${backend}/api/project/${projectId}/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: token } : {}),
          },
          body: JSON.stringify({ name: "Nowa kolumna" }),
        }
      );
      if (!res.ok) throw new Error("Failed to create section");
      const newSec: SectionModel = await res.json();
      setSections((s) => [...s, { ...newSec}]);
    } catch (e) {
      console.error(e);
    }
  };

  // handle create‐task from dialog
  const handleCreateTask = (payload: NewTaskPayload) => {
    if (!onCreateTask) {console.error("On Create Task is not defined");return;};
    onCreateTask(payload);
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="p-6 h-full w-full">
      {/* Toolbar */}
      <div className="flex mb-6 gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Szukaj..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select
          value={selectedPriority}
          onValueChange={(v) =>
            setSelectedPriority(v as "all" | "high" | "medium" | "low")
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Priorytet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie</SelectItem>
            <SelectItem value="high">Wysoki</SelectItem>
            <SelectItem value="medium">Średni</SelectItem>
            <SelectItem value="low">Niski</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedAssignee}
          onValueChange={setSelectedAssignee}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Przypisany" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszyscy</SelectItem>
            {/* map real users here */}
          </SelectContent>
        </Select>
      </div>

      {/* Add Task */}
      <Button
        className="flex items-center gap-2 mb-6"
        onClick={() => setIsCreateDialogOpen(true)}
      >
        <Plus className="h-4 w-4" /> Dodaj zadanie
      </Button>

      {/* Columns */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {sections.map((sec) => (
          <TaskSection
            key={sec.id}
            sectionId={sec.id}
            name={sec.name}
            tasks={getTasksForSection(sec.id)}
            sections={sections}
            onToggleCompletion={onToggleCompletion}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onRenameSection={handleRenameSection}
            onDeleteSection={handleDeleteSection}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        ))}

        <div className="flex-shrink-0 w-80">
          <Button
            variant="outline"
            className="w-full h-16 border-dashed"
            onClick={handleAddSection}
          >
            <Plus className="h-4 w-4 mr-2" /> Dodaj kolumnę
          </Button>
        </div>
      </div>

      {/* Create Dialog */}
      <TaskCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleCreateTask}
        sections={sections}
        defaultSection={sections[0]?.id}
      />
    </div>
  );
}