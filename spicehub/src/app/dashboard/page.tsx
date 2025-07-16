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

export default function Dashboard() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAll() {
      try {
        const tk = getCookie("accessToken");
        if (!tk) throw new Error("Brak tokena – zaloguj się ponownie");
        const backend = await getBackendUrl();
        const headers = {
          "Content-Type": "application/json",
          Authorization: tk,
        };

        const uRes = await fetch(`${backend}/api/user/getInfo`, { headers });
        if (!uRes.ok) throw new Error("Nie udało się pobrać użytkownika");
        const uData: UserInfo = await uRes.json();
        setUser(uData);

        const tRes = await fetch(
          `${backend}/api/user/${uData.id}/getAssignedTasks`,
          { headers }
        );
        if (!tRes.ok) throw new Error("Nie udało się pobrać zadań");
        setTasks(await tRes.json());

        const pRes = await fetch(`${backend}/api/project`, { headers });
        if (!pRes.ok) throw new Error("Nie udało się pobrać projektów");
        setProjects(await pRes.json());
      } catch (err: any) {
        setError(err.message || "Coś poszło nie tak");
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  const uncompletedTasksCount = tasks.filter((task) => !task.finished).length;
  const projectsCount = projects.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex justify-center items-center">
        <p>Ładowanie...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex justify-center items-center">
        <p className="text-red-500">{error}</p>
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