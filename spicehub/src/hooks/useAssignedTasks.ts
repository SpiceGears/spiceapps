import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Task } from "@/models/Task";

export function useAssignedTasks(userId?: string) {
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setAssignedTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    api.getTasks(userId)
      .then(setAssignedTasks)
      .catch(() => setAssignedTasks([]))
      .finally(() => setLoading(false));
  }, [userId]);

  return { assignedTasks, loading };
}