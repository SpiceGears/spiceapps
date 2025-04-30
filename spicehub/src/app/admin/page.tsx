"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Shield, Edit, Trash2, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<"members" | "roles">("members");
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [currentRole, setCurrentRole] = useState<{name: string, memberCount: number} | null>(null);
  
  // Handle any lingering modal effects after closing dialog
  useEffect(() => {
    if (!isEditingRole) {
      const cleanup = () => {
        document.body.style.pointerEvents = '';
        document.body.classList.remove('overflow-hidden');
      };
      cleanup();
      return () => {};
    }
  }, [isEditingRole]);

  const roles = [
    { name: "Administrator", memberCount: 5 },
    { name: "Moderator", memberCount: 3 },
    { name: "Użytkownik", memberCount: 12 },
  ];

  return (
    <div className="flex h-full w-full justify-center">
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
        </div>
      </div>
      
      <div className="w-[48rem] p-6 overflow-auto">
        {activeTab === "members" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Członkowie</h2>
              <Input placeholder="Wyszukaj członków..." className="w-64" />
            </div>
            
            <Card className="p-4">
              <div className="space-y-4">
                {["Jan Kowalski", "Anna Nowak"].map((name) => (
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
        )}
        
        {activeTab === "roles" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">ROLE</h2>
              <Button variant="default" size="sm">Stwórz rolę</Button>
            </div>
            
            <div>
              {roles.map((role) => (
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => {
                            setCurrentRole(role);
                            setIsEditingRole(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edytuj rolę</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <UserPlus className="mr-2 h-4 w-4" />
                          <span>Dodaj użytkownika</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Usuń rolę</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
            
            <Dialog 
              open={isEditingRole} 
              onOpenChange={(open) => setIsEditingRole(open)}
            >
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edytuj rolę: {currentRole?.name}</DialogTitle>
                  <DialogDescription>
                    Zmień nazwę i uprawnienia roli
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="role-name">Nazwa roli</Label>
                    <Input 
                      id="role-name" 
                      defaultValue={currentRole?.name} 
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Uprawnienia</Label>
                    <Card className="p-4">
                      <div className="space-y-4">
                        {['Tworzenie projektów', 'Edycja użytkowników', 'Zarządzanie rolami'].map((permission) => (
                          <div key={permission} className="flex items-center justify-between">
                            <span>{permission}</span>
                            <input type="checkbox" className="h-4 w-4" defaultChecked={permission === 'Tworzenie projektów'} />
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
                
                <DialogFooter className="sm:justify-between">
                  <Button variant="outline" onClick={() => setIsEditingRole(false)}>
                    Anuluj
                  </Button>
                  <Button onClick={() => {
                    // Save logic would go here
                    setIsEditingRole(false);
                  }}>
                    Zapisz zmiany
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}
