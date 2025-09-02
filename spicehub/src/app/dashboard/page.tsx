// app/dashboard/page.tsx
"use client";

import SeasonCard from "@/components/widgets/Season";
import SpicelabCard from "@/components/widgets/Spicelab"; // Changed import name
import Welcome from "@/components/dashboard/Welcome";
import { useEffect, useState } from "react";
import { UserInfo } from "@/models/User";
import { Task } from "@/models/Task";
import { Project } from "@/models/Project";
import { getCookie } from "typescript-cookie";
import { getBackendUrl } from "../serveractions/backend-url";
import { api } from "@/services/api";
import { useUser } from "@/hooks/useUser";
import { useProjects } from "@/hooks/useProjects";
import { useAssignedTasks } from "@/hooks/useAssignedTasks";
import Loading from "@/components/Loading";

export default function Dashboard() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);

      const userData = await api.getUser();
      const [projectsData, assignedTasksData] = await Promise.all([
        api.getProjects(),
        api.getAssignedTasks(userData.id),
      ]);

      setUser(userData);
      setProjects(projectsData);
      setAssignedTasks(assignedTasksData);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, [refresh]);

const uncompletedTasksCount = assignedTasks.filter((task) => !task.finished).length;
  const projectsCount = projects.length;

  if (loading) return <Loading />;

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex justify-center items-center">
        <p>Ładowanie...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white pb-10">
      {/* Header with date */}
      <Welcome />

      {/* Dashboard content */}
      <div className="container mx-auto px-4">
        {/* Widgets container */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Season widget */}
          <SeasonCard
            program="First Global Challenge"
            seasonName="Eco Equilibrium"
            seasonYear={2025}
            kickoffDate="2025-10-29"
            seasonUrl="https://first.global/fgc/"
          />

          <SpicelabCard
            uncompletedTasksCount={uncompletedTasksCount}
            projectsCount={projectsCount}
          />
        </div>
      </div>
    </div>
  );
}