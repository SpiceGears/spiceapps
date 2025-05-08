"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Ustawienia</h1>
          <button
            onClick={() => router.back()}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
            aria-label="Zamknij ustawienia"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="account">Konto</TabsTrigger>
            <TabsTrigger value="app">Aplikacja</TabsTrigger>
            <TabsTrigger value="spicelab">Spicelab</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="space-y-4">
              <Label htmlFor="username">Nazwa użytkownika</Label>
              <Input id="username" />

              <Label htmlFor="bio">Opis</Label>
              <Input id="bio" />
              <Button className="mt-4">Zapisz zmiany</Button>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="space-y-4">
            </div>
          </TabsContent>

          <TabsContent value="account">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" />
                <Button className="mt-4">Zapisz</Button>
              </div>
              <hr className="border-gray-700" />
              <div className="space-y-2">
                <Label htmlFor="password">Nowe hasło</Label>
                <Input id="password" type="password" placeholder="********" />
                <Button className="mt-4">Zmień hasło</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="app">
            <div className="space-y-4">
              <Label htmlFor="theme">Motyw</Label>
              <select
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2 text-black dark:text-white"
              >
                <option value="light">Jasny</option>
                <option value="dark">Ciemny</option>
                <option value="system">Systemowy</option>
              </select>
            </div>
          </TabsContent>

          <TabsContent value="spicelab">
            <div className="space-y-4">

            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
