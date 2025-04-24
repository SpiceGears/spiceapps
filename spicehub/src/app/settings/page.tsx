"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ustawienia</h1>
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Zamknij ustawienia"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Powiadomienia</TabsTrigger>
          <TabsTrigger value="account">Konto</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="space-y-4">
            <Label htmlFor="username">Nazwa użytkownika</Label>
            <Input id="username"/>

            <Label htmlFor="bio">Opis</Label>
            <Input id="bio"/>
            <Button className="mt-4">Zapisz zmiany</Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="space-y-4">
          </div>
        </TabsContent>

        <TabsContent value="account">
          <div className="space-y-4">
          <Label htmlFor="email">E-mail</Label>
            <Input id="email"/>
            <Button className="mt-4">Zapisz</Button>
            <Label htmlFor="password">Nowe hasło</Label>
            <Input id="password" type="password" placeholder="********" />
            <Button className="mt-4">Zmień hasło</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
