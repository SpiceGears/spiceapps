"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MoreHorizontal, Shield } from "lucide-react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<"members" | "roles">("members");

  const roles = [
    { name: "Administrator", memberCount: 5 },
  ]

  return (    <div className="flex h-full w-full justify-center">
      <div className="w-64 h-[calc(100vh-4rem)] bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="px-4 py-6">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("members")}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === "members" ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
            >
              Członkowie
            </button>
            <button
              onClick={() => setActiveTab("roles")}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === "roles" ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
            >
              Role
            </button>
          </nav>
        </div>      </div>      <div className="w-[48rem] p-6 overflow-auto">
        {activeTab === "members" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Członkowie</h2>
              <Input placeholder="Wyszukaj członków..." className="w-64" />
            </div>
            
            <Card className="p-4">
              <div className="space-y-4">
                {["Jan Kowalski", "Anna Nowak", "Piotr Wiśniewski"].map((name) => (
                  <div key={name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{name[0]}</AvatarFallback>
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${name.replace(" ", "+")}&background=random&color=fff`} />
                      </Avatar>
                      <div>
                        <p className="font-medium">{name}</p>
                        <p className="text-sm text-gray-500">Użytkownik</p>
                      </div>
                    </div>
                    <Button variant="default" size="sm">Zarządzaj</Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}        {activeTab === "roles" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">ROLE</h2>
              <Button variant="default" size="sm">Stwórz rolę</Button>
            </div>
            
            <div>
              {
                roles.map((role) => (
                <div key={role.name} className="flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">{role.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-500">{role.memberCount}</span>
                      <Avatar className="h-4 w-4">
                        <AvatarFallback className="text-xs">U</AvatarFallback>
                      </Avatar>
                    </div>
                    <button className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
