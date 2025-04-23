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
          <TabsTrigger value="team">Zespół</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="space-y-4">
            <Label htmlFor="username">Nazwa użytkownika</Label>
            <Input id="username" placeholder="np. michal_kulik" />

            <Label htmlFor="bio">Opis</Label>
            <Input id="bio" placeholder="np. Frontend developer w Spice Gears" />

            <Button className="mt-4">Zapisz zmiany</Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="space-y-4">
            <Label htmlFor="email">E-mail powiadomień</Label>
            <Input id="email" placeholder="np. michal@spicehub.dev" />
            <Button className="mt-4">Zapisz</Button>
          </div>
        </TabsContent>

        <TabsContent value="account">
          <div className="space-y-4">
            <Label htmlFor="password">Nowe hasło</Label>
            <Input id="password" type="password" placeholder="********" />
            <Button className="mt-4">Zmień hasło</Button>
          </div>
        </TabsContent>

        <TabsContent value="team">
          <div className="space-y-4">
            <Label htmlFor="team-name">Nazwa zespołu</Label>
            <Input id="team-name" placeholder="np. Spice Gears 5883" />

            <Label htmlFor="team-code">Kod zespołu</Label>
            <Input id="team-code" placeholder="np. SG5883" />

            <Button className="mt-4">Aktualizuj dane zespołu</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
