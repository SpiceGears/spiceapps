"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SettingsPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<string>("light");

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Ustawienia</h1>
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-gray-100 transition-colors"
            aria-label="Zamknij ustawienia"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6 bg-gray-800 text-gray-400">
            <TabsTrigger
              value="profile" className="text-gray-400 hover:text-white data-[state=active]:bg-gray-700 data-[state=active]:text-white">Profil</TabsTrigger>
            <TabsTrigger
              value="account" className="text-gray-400 hover:text-white data-[state=active]:bg-gray-700 data-[state=active]:text-white">Konto</TabsTrigger>
            <TabsTrigger
              value="app" className="text-gray-400 hover:text-white data-[state=active]:bg-gray-700 data-[state=active]:text-white">Aplikacja</TabsTrigger>
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
                className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
              >
                <option value="light">Jasny</option>
                <option value="dark">Ciemny</option>
                <option value="system">Systemowy</option>
              </select>
              <Button className="mt-4">Zapisz zmiany</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
