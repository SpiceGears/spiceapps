import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Task } from "@/models/Task";

export function useTasks(projectId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTasks(projectId)
      .then(setTasks)
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, [projectId]);

  return { tasks, loading };
}