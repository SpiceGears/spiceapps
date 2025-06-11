"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Shield, Edit, Trash2} from "lucide-react";
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
import { RolePicker} from "@/components/admin/RolePicker";
import { UserInfo } from "@/models/User";
import { getBackendUrl } from "../serveractions/backend-url";
import { getCookie } from "typescript-cookie";
import { Switch } from "@/components/ui/switch";
import { Role } from "@/models/User";


export default function Admin() {
  const [activeTab, setActiveTab] = useState<"members" | "roles" | "approvals">("members");
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [isDeletingRole, setIsDeletingRole] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [assignedRoles, setAssignedRoles] = useState<string[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [unapprovedUsers, setUnapprovedUsers] = useState<UserInfo[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const backend = await getBackendUrl();
      if (!backend) {
        console.error("No backend URL found");
        return;
      }
      const token = getCookie("accessToken");

      const res = await fetch(`${backend}/api/user/getAll`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token } : {}),
        },
      });

      if (res.ok) {
        const data: UserInfo[] = await res.json();
        setUsers(data);
      } else {
        console.error("Failed to fetch users");
      }
    };

    const fetchRoles = async () => {
      const backend = await getBackendUrl();
      if (!backend) {
        console.error("No backend URL found");
        return;
      }
      const token = getCookie("accessToken");
      const res = await fetch(`${backend}/api/roles`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token } : {}),
        },
      });

      if (res.ok) {
        const data: Role[] = await res.json();
        setRoles(data);
      } else {
        console.error("Failed to fetch roles");
      }
    };

    const fetchUnapprovedUsers = async () => {
      const backend = await getBackendUrl();
      if (!backend) {
        console.error("No backend URL found");
        return;
      }
      const token = getCookie("accessToken");
      const res = await fetch(`${backend}/api/admin/getUnapprovedUsers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token } : {}),
        },
      });

      if (res.ok) {
        const data: UserInfo[] = await res.json();
        setUnapprovedUsers(data);
      } else {
        console.error("Failed to fetch unapproved users");
      }
    };

    fetchUsers();
    fetchRoles();
    fetchUnapprovedUsers();
  }, []);

  return (
    <div className="flex h-full w-full justify-center">
      <div className="w-64 h-[calc(100vh-4rem)] bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="px-4 py-6">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("members")}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === "members"
                ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
            >
              Członkowie
            </button>
            <button
              onClick={() => setActiveTab("roles")}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === "roles"
                ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
            >
              Role
            </button>
            <button
              onClick={() => setActiveTab("approvals")}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "approvals"
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Zatwierdzenia
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
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{user.firstName[0]}</AvatarFallback>
                        {/* <AvatarImage
                          src={`https://ui-avatars.com/api/?name=${user.name
                            .replace(" ", "")
                            .trim()}&background=random&color=fff`}
                        /> */}
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-500">Użytkownik</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setCurrentUser(user);
                        setAssignedRoles(user.roles ? user.roles.map(r => r.name) : []);
                        setIsEditingUser(true);
                      }}
                    >
                      Edytuj
                    </Button>
                    <Dialog
                      open={isEditingUser}
                      onOpenChange={setIsEditingUser}
                    >
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edytuj użytkownika</DialogTitle>
                          <DialogDescription>
                            Edytuj dane użytkownika
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="user-name">Imię i nazwisko</Label>
                            <Input
                              id="user-name"
                              defaultValue={currentUser?.firstName}
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="user-email">Email</Label>
                            <Input
                              id="user-email"
                              defaultValue={currentUser?.email}
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="user-roles">Role</Label>
                            <div className="flex items-center gap-2">
                              {/* current role badge */}
                              <div className="flex flex-wrap gap-2 mb-2">
                                {assignedRoles.map((r) => (
                                  <span
                                    key={r}
                                    className="inline-flex items-center px-2 py-0.5 text-sm font-medium bg-gray-200 dark:bg-gray-700 rounded"
                                  >
                                    {r}
                                    <button
                                      onClick={() =>
                                        setAssignedRoles((prev) => prev.filter((x) => x !== r))
                                      }
                                      className="ml-1 text-gray-500 hover:text-gray-700"
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>

                              <RolePicker
                                roles={roles}
                                onSelect={(role) => {
                                  setAssignedRoles((prev) => {
                                    if (prev.includes(role.name)) return prev;
                                    return [...prev, role.name];
                                  });
                                }}
                                currentUser={currentUser}
                              />
                            </div>
                          </div>
                          <DialogFooter className="sm:justify-between">
                            <Button variant="outline" onClick={() => setIsEditingUser(false)}>
                              Anuluj
                            </Button>
                            <Button
                              onClick={() => {
                                // tu powinna znaleźć się logika zapisu zmian użytkownika
                                setIsEditingUser(false);
                                setCurrentUser(null);
                              }}
                            >
                              Zapisz zmiany
                            </Button>
                          </DialogFooter>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "roles" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                ROLE
              </h2>
              <Button variant="default" size="sm" onClick={() => { setIsAddingRole(true) }}>
                Stwórz rolę
              </Button>
            </div>

            <div>
              {roles.map((role) => (
                <div
                  key={role.name}
                  className="flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">{role.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {/* <span className="text-sm text-gray-500">
                        {role.memberCount}
                      </span> */}
                      <Avatar className="h-4 w-4">
                        <AvatarFallback className="text-xs">U</AvatarFallback>
                      </Avatar>
                    </div>
                    <DropdownMenu modal={false}>
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
                        <DropdownMenuItem variant="destructive"
                          onClick={() => {
                            setCurrentRole(role);
                            setIsDeletingRole(true);
                          }}
                        >
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
              onOpenChange={(open) => {
                setIsEditingRole(open);
                if (!open) {
                  setCurrentRole(null);
                }
              }}
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
                        {[
                          { key: "projects.show", label: "Dostęp do projektów ogólnie" },
                          { key: "projects.add", label: "Dodawanie i edycja projektów" },
                          { key: "projects.delete", label: "Usuwanie projektów" },
                          { key: "roles.list", label: "Wyświetlanie listy ról" },
                          { key: "roles.manage", label: "Zarządzanie rolami" },
                          { key: "roles.assign", label: "Ustawianie ról" },
                          { key: "tasks.add", label: "Dodawanie i edycja zadań" },
                          { key: "tasks.override", label: "Edycja zadań innych użytkowników" },
                          { key: "users.unapproved", label: "Wyświetlanie i zatwierdzanie niezatwierdzonych użytkowników" },
                          { key: "admin", label: "Uprawnienia administratora (wszystkie akcje dozwolone)" },
                        ].map((permission) => (
                            <div
                              key={permission.key}
                              className="flex items-center justify-between"
                            >
                              <span>{permission.label}</span>
                              <Switch
                              checked={currentRole?.scopes?.includes(permission.key) ?? false}
                              // onCheckedChange={...}
                              id={`perm-${permission.key}`}
                              />
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
                  <Button
                    onClick={() => {
                      // tu by była logika zapisu
                      setIsEditingRole(false);
                      setCurrentRole(null);
                    }}
                  >
                    Zapisz zmiany
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isAddingRole}
              onOpenChange={(open) => {
                setIsAddingRole(open);
              }}
            >
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Stwórz rolę</DialogTitle>
                  <DialogDescription>
                    Stwórz nową rolę
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
                </div>

                <DialogFooter className="sm:justify-between">
                  <Button variant="outline" onClick={() => { setIsAddingRole(false) }}>
                    Anuluj
                  </Button>
                  <Button
                    onClick={() => {
                      // tu by była logika zapisu
                      setIsAddingRole(false);
                    }}
                  >
                    Zapisz zmiany
                  </Button>
                </DialogFooter>

              </DialogContent>
            </Dialog>

            <Dialog
              open={isDeletingRole}
              onOpenChange={setIsDeletingRole}
            >
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Usuń rolę: {currentRole?.name}</DialogTitle>
                  <DialogDescription>
                    Czy na pewno chcesz usunąć tę rolę?
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="sm:justify-between">
                  <Button variant="outline" onClick={() => setIsDeletingRole(false)}>
                    Anuluj
                  </Button>
                  <Button
                    onClick={() => {
                      setIsDeletingRole(false);
                      setCurrentRole(null);
                    }}
                  >
                    Zapisz zmiany
                  </Button>
                </DialogFooter>

              </DialogContent>
            </Dialog>
          </div>
        )}
        {activeTab === "approvals" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Zatwierdzenie użytkowników</h2>
              <Input
                placeholder="Wyszukaj oczekujących..."
                className="w-64"
              />
            </div>
            <Card className="p-4">
              <div className="space-y-4">
                {unapprovedUsers.length === 0 && (
                  <p className="text-gray-500">Brak oczekujących użytkowników.</p>
                )}
                {unapprovedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{user.firstName[0]}</AvatarFallback>
                        {/* <AvatarImage
                          src={`https://ui-avatars.com/api/?name=${user.name
                            .replace(" ", "")
                            .trim()}&background=random&color=fff`}
                        /> */}
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() =>
                          setUnapprovedUsers((prev) =>
                            prev.filter((u) => u.id !== user.id)
                          )
                        }
                      >
                        Zatwierdź
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          setUnapprovedUsers((prev) =>
                            prev.filter((u) => u.id !== user.id)
                          )
                        }
                      >
                        Odrzuć
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
