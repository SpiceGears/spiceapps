"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getBackendUrl } from "@/app/serveractions/backend-url";
import { getCookie } from "typescript-cookie";
import { Department } from "@/models/User";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewProject() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSubteams, setSelectedSubteams] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubteamChange = (dept: Department) => {
    setSelectedSubteams((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const departmentScopeRec: Record<Department, string | null> = {
    [Department.NaDr]: null,
    [Department.Executive]: "department.executive",
    [Department.Marketing]: "department.marketing",
    [Department.Mechanics]: "department.mechanics",
    [Department.Mentor]: null,
    [Department.Programmers]: "department.programmers",
    [Department.SocialMedia]: "department.socialmedia",
  };

  const departmentLabel: Record<Department, string> = {
    [Department.NaDr]: "Cała drużyna",
    [Department.Executive]: "Zarządzanie",
    [Department.Marketing]: "Marketing",
    [Department.Mechanics]: "Mechanicy",
    [Department.Mentor]: "Mentorzy",
    [Department.Programmers]: "Programiści",
    [Department.SocialMedia]: "Social Media",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const backend = await getBackendUrl();

      const at = getCookie("accessToken");
      if (!at) {
        console.error("No access token");
        return;
      }

      let scopesAsStrings: string[] = [];

      if (selectedSubteams.length === 0 || selectedSubteams.includes(Department.NaDr)) {
        const naDrScope = departmentScopeRec[Department.NaDr];
        if (naDrScope) {
          scopesAsStrings.push(naDrScope);
        }
      } else {
        for (const depar of selectedSubteams) {
          const str = departmentScopeRec[depar];
          if (str) {
            scopesAsStrings.push(str);
          }
        }
      }

      const payload = {
        name,
        description,
        scopes: scopesAsStrings,
        status: 0,
        priority: 0,
      };

      const res = await fetch(`${backend}/api/project/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: at,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        console.log(await res.json());
        router.push("/spicelab/project");
      } else {
        console.error("Create failed:", res.status, await res.text());
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const enumEntries = Object.entries(Department).filter(
    ([, val]) => typeof val === "number"
  ) as [keyof typeof Department, Department][];

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white dark:bg-gray-900 rounded-lg shadow p-8">
      <h1 className="text-2xl font-bold mb-6">Nowy Projekt</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="project-name" className="mb-2 block">
            Nazwa projektu
          </Label>
          <Input
            id="project-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Wpisz nazwę projektu"
            disabled={isLoading}
          />
        </div>
        <div>
          <Label htmlFor="project-description" className="mb-2 block">
            Opis
          </Label>
          <Textarea
            id="project-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
            placeholder="Wpisz opis projektu"
            disabled={isLoading} // Disable textarea while loading
          />
        </div>
        <div>
          <Label htmlFor="project-departments" className="mb-2 block">
            Działy
          </Label>
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring text-left flex items-center justify-between"
                  disabled={isLoading}
                >
                  <span>
                    {selectedSubteams.length === 0
                      ? "Wybierz działy"
                      : selectedSubteams
                          .map((val) => departmentLabel[val])
                          .join(", ")}
                  </span>
                  <svg
                    className="ml-2 w-4 h-4 opacity-60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[12rem]">
                {enumEntries.map(([key, val]) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={selectedSubteams.includes(val)}
                    onCheckedChange={() => handleSubteamChange(val)}
                    disabled={isLoading}
                  >
                    {departmentLabel[val]}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <small className="text-gray-500">
              Kliknij, aby wybrać wiele działów
            </small>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          {isLoading ? "Tworzenie..." : "Utwórz projekt"}
        </Button>
      </form>
    </div>
  );
}