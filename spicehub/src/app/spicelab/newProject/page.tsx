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

export default function NewProject() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSubteams, setSelectedSubteams] = useState<Department[]>([]);

  const handleSubteamChange = (dept: Department) => {
    setSelectedSubteams((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1) Await your server‐action so `backend` is a string, not a Promise
    const backend = await getBackendUrl();

    const at = getCookie("accessToken");
    if (!at) {
      console.error("Cookie error, no Access Token found");
      return;
    }

    const res = await fetch(`${backend}/api/project/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: at,
      },
      body: JSON.stringify({
        name,
        description,
        scopes: selectedSubteams,
        status: 0,
        priority: 0,
      }),
    });

    if (res.ok) {
      console.log(await res.json());
    } else {
      console.error("Create failed:", res.status, await res.text());
    }
  };

  // Filter out the reverse‐mapping keys so we only get [ "HR", 1 ], [ "SALES", 2 ], …
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
                >
                  <span>
                    {selectedSubteams.length === 0
                      ? "Wybierz działy"
                      : enumEntries
                          .filter(([_, v]) =>
                            selectedSubteams.includes(v)
                          )
                          .map(([k]) => k)
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
                  >
                    {key}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <small className="text-gray-500">
              Kliknij, aby wybrać wiele działów
            </small>
          </div>
        </div>
        <Button type="submit" className="w-full">
          Utwórz projekt
        </Button>
      </form>
    </div>
  );
}