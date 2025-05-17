"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const subteams = [
    { id: 1, name: "Programiści" },
    { id: 2, name: "Mechanicy" },
    { id: 3, name: "MTR" },
    { id: 4, name: "Zarządzanie" },
    { id: 5, name: "Marketing" },
];

export default function NewProject() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedSubteams, setSelectedSubteams] = useState<number[]>([]);

    const handleSubteamChange = (id: number) => {
        setSelectedSubteams((prev) =>
            prev.includes(id)
                ? prev.filter((sid) => sid !== id)
                : [...prev, id]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Submit logic here
        alert(
            `Project: ${name}\nDescription: ${description}\nSubteams: ${selectedSubteams
                .map((id) => subteams.find((s) => s.id === id)?.name)
                .join(", ")}`
        );
    };

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white dark:bg-gray-900 rounded-lg shadow p-8">
            <h1 className="text-2xl font-bold mb-6">Nowy Projekt</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Label htmlFor="project-name" className="mb-2 block">Nazwa projektu</Label>
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
                    <Label htmlFor="project-description" className="mb-2 block">Opis</Label>
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
                    <Label htmlFor="project-departments" className="mb-2 block">Działy</Label>
                    <div className="relative">
                        {/* shadcn dropdown menu for multi-select */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring text-left flex items-center justify-between"
                                >
                                    <span>
                                        {selectedSubteams.length === 0
                                            ? "Wybierz działy"
                                            : subteams
                                                .filter((s) => selectedSubteams.includes(s.id))
                                                .map((s) => s.name)
                                                .join(", ")}
                                    </span>
                                    <svg className="ml-2 w-4 h-4 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full min-w-[12rem]">
                                {subteams.map((subteam) => (
                                    <DropdownMenuCheckboxItem
                                        key={subteam.id}
                                        checked={selectedSubteams.includes(subteam.id)}
                                        onCheckedChange={() => handleSubteamChange(subteam.id)}
                                    >
                                        {subteam.name}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <small className="text-gray-500">Kliknij, aby wybrać wiele działów</small>
                    </div>
                </div>
                <Button type="submit" className="w-full">
                    Utwórz projekt
                </Button>
            </form>
        </div>
    );
}