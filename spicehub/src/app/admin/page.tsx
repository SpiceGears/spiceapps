"use client";

import { useEffect, useRef, useState } from "react";
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
import { Department, UserInfo } from "@/models/User";
import { getBackendUrl } from "../serveractions/backend-url";
import { getCookie } from "typescript-cookie";
import { Switch } from "@/components/ui/switch";
import { Role } from "@/models/User";
import { toast, ToastClassnames } from "sonner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const departmentScopeRec: Record<Department, string | null> = 
  {
    [Department.NaDr]: null,
    [Department.Executive]: "department.executive",
    [Department.Marketing]: "department.marketing",
    [Department.Mechanics]: "department.mechanics",
    [Department.Mentor]: null,
    [Department.Programmers]: "department.programmers",
    [Department.SocialMedia]: "department.socialmedia"
  }

const selectDepartmentString: Record<string, Department> = 
{
  "mech": Department.Mechanics,
  "prog": Department.Programmers,
  "mtr": Department.SocialMedia,
  "mark": Department.Marketing,
  "exec": Department.Executive,
  "ment": Department.Mentor,

  "nadr": Department.NaDr
}


export default function Admin() {
  const [activeTab, setActiveTab] = useState<"members" | "roles" | "approvals">("members");
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [isDeletingRole, setIsDeletingRole] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [currentScopes, setCurrentScopes] = useState<string[]>();
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [assignedRoles, setAssignedRoles] = useState<string[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [unapprovedUsers, setUnapprovedUsers] = useState<UserInfo[]>([]);
  const [BackendUrl, setBackendUrl] = useState("");




  //role edit dialog
  const roleName = useRef<HTMLInputElement | null>(null);
  const roleNameCreate = useRef<HTMLInputElement | null>(null);

  const [roleDepartment, setRoleDepartment] = useState<Department>(Department.NaDr);
  
  async function handleUserEdit() 
  {
    const backend = await getBackendUrl();
    if (!backend) throw new Error("No backend")
    const at = await getCookie("accessToken")
    if (!at) throw new Error("No access token");

    const user = currentUser;
    if (!user) {console.error("GET OUT, NOW"); throw new Error("User not set, weird")}

    const rolesToRemove: Role[] = user.roles.filter(role => !assignedRoles.includes(role.name));
    const rolesToAdd: Role[] = roles.filter(role =>
      assignedRoles.includes(role.name) && !user.roles.some(r => r.name === role.name)
    )

    const rolesToRemoveIDs: string[] = rolesToRemove.map(role => role.roleId).filter((id): id is string => typeof id === 'string');
    const rolesToAddIds = rolesToAdd.map(role => role?.roleId).filter((id): id is string => typeof id === 'string');

    const remRes = await fetch(`${backend}/api/user/${user.id}/removeRoles`, 
      {
        method: 'PUT',
        headers: {Authorization: at, "Content-Type": "application/json"},
        body: JSON.stringify(rolesToRemoveIDs)
      })

    if (!remRes.ok) 
    {
      let err = await remRes.text();
      console.error("Fetch failed: "+err)
      toast("Error", {description: "Removing roles returned error: "+ err, className: "bg-red-500"})
      return;
    }

    const addRes = await fetch(`${backend}/api/user/${user.id}/assignRoles`, 
      {
        method: 'PUT',
        headers: {Authorization: at, "Content-Type": "application/json"},
        body: JSON.stringify(rolesToAddIds)
      })
    if (!addRes.ok) 
    {
      let err = await addRes.text();
      console.error("Fetch failed: "+err)
      toast("Error", {description: "Assigning roles returned error: "+ err, className: "bg-red-500"})
      return;
    } 
    
    setRefresh(!refresh)
  }

  async function handleRoleEdit(role: Role, currentRoleId: string) 
  {
    const backend = await getBackendUrl();
    if (!backend) throw new Error("No backend!");
    const at = getCookie("accessToken");
    if (!at) throw new Error("No access token!");

    const res = await fetch(`${backend}/api/roles/${currentRoleId}`, 
      {
        method: 'PUT',
        headers: {Authorization: at, "Content-Type": "application/json"},
        body: JSON.stringify(role)
      })
    if (res.ok) 
      {
        setRefresh(!refresh)
        toast("Zapisano rolę!", {description: `Zmieniono ustawienia roli ${role.name}`})
      }
      else 
      {
        toast("Role editing failed!", {description: `Cannot edit role: ${await res.text()}`})
      }
  }

  async function handleRoleCreate(name: string) 
  {
    const backend = await getBackendUrl();
    if (!backend) throw new Error("No backend!");
    const at = getCookie("accessToken");
    if (!at) throw new Error("No access token!");

    let role: Role = 
    {
      roleId: "00000000-0000-0000-0000-00000000000e",
      name: name,
      scopes: [],
      department: roleDepartment,
    }

    const res = await fetch(`${backend}/api/roles/create`, 
      {
        method: 'POST',
        headers: {Authorization: at, "Content-Type": "application/json"},
        body: JSON.stringify(role)
      })
    if (res.ok) 
      {
        setRefresh(!refresh)
        toast("Utworzono rolę!", {description: `Nowa rola została dodana`})
      }
      else 
      {
        toast("Role editing failed!", {description: `Cannot edit role: ${await res.text()}`})
      }
  }

  async function handleRoleDelete(roleId: string) 
  {
    const backend = await getBackendUrl();
    if (!backend) throw new Error("No backend!");
    const at = getCookie("accessToken");
    if (!at) throw new Error("No access token!");
    const res = await fetch(`${backend}/api/roles/${roleId}`, 
      {
        method: 'DELETE',
        headers: {Authorization: at, "Content-Type": "application/json"},
      })
    if (res.ok) 
      {
        setRefresh(!refresh)
        toast("Usunięto rolę!", {description: `Rola została usunięta`})
      }
      else 
      {
        toast("Role editing failed!", {description: `Cannot edit role: ${await res.text()}`})
      }
  }

  async function approveUser(userId: string) 
  {
    const backend = await getBackendUrl();
    if (!backend) throw new Error("No backend!");
    const at = getCookie("accessToken");
    if (!at) throw new Error("No access token!");

    const res = await fetch(`${backend}/api/user/${userId}/approve`, 
      {
        method: 'PUT',
        headers: {Authorization: at, "Content-Type": "application/json"},
      })
    if (res.ok) 
      {
        setRefresh(!refresh)
        toast("Zatwierdzono!", {description: `${unapprovedUsers?.find(u => u.id == userId)?.firstName} może rozpocząć pracę!`})
      }
      else 
      {
        toast("Zatwierdzenie zawiodło", {description: `Cannot approve user: ${await res.text()}`})
      }
  }


  useEffect(() => {
    const fetchUsers = async () => {
      const backend = await getBackendUrl();
      
      if (!backend) {
        console.error("No backend URL found");
        return;
      }
      setBackendUrl(backend)
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
  }, [refresh]);

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
                        <AvatarImage src={`${BackendUrl}/api/user/${user.id}/avatar`} alt={`${user.firstName} ${user.lastName}`}></AvatarImage>
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
                            <Label htmlFor="user-name">Imię</Label>
                            <Input
                              id="user-name"
                              defaultValue={currentUser?.firstName}
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="user-name">Nazwisko</Label>
                            <Input
                              id="user-name"
                              defaultValue={currentUser?.lastName}
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="birthday">Data urodzenia</Label>
                            <Input id="birthday" type="date" defaultValue={currentUser?.birthday}/>
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
                                handleUserEdit();
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
                  key={role.roleId}
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
                            setCurrentScopes(role.scopes);
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
              <DialogContent className="sm:max-w-md max-h-[95vh] overflow-y-scroll">
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
                      ref={roleName}
                    />
                  </div>
                  <Select onValueChange={value => 
                    {
                      let depart = selectDepartmentString[value];
                      setRoleDepartment(depart)
                    }}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Wybierz dział" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Dział</SelectLabel>
                        <SelectItem value="nadr">Nie należy</SelectItem>
                        <SelectItem value="mech">Mechanicy</SelectItem>
                        <SelectItem value="prog">Programiści</SelectItem>
                        <SelectItem value="mtr">Social Media</SelectItem>
                        <SelectItem value="mark">Marketing</SelectItem>
                        <SelectItem value="exec">Zarządzanie</SelectItem>
                        <SelectItem value="ment">Mentorat</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <div className="space-y-2">
                    <Label>Uprawnienia</Label>
                    <Card className="p-4">
                      <div className="space-y-4">
                        {[
                          { key: "projects.show", label: "Dostęp do projektów" },
                          { key: "projects.add", label: "Dodawanie i edycja projektów" },
                          { key: "projects.delete", label: "Usuwanie projektów" },
                          { key: "tasks.add", label: "Dodawanie i edycja zadań" },
                          { key: "tasks.override", label: "Edycja zadań innych użytkowników" },
                          
                          { key: "roles.list", label: "Wyświetlanie listy ról" },
                          { key: "roles.manage", label: "Zarządzanie rolami" },
                          { key: "roles.assign", label: "Ustawianie ról" },

                          { key: departmentScopeRec[Department.Mechanics] ?? "", label: "Dział: Mechanicy" },
                          { key: departmentScopeRec[Department.Programmers] ?? "", label: "Dział: Programiści" },
                          { key: departmentScopeRec[Department.SocialMedia] ?? "", label: "Dział: Social Media" },
                          { key: departmentScopeRec[Department.Marketing] ?? "", label: "Dział: Marketing" },
                          { key: departmentScopeRec[Department.Executive] ?? "", label: "Dział: Zarządzanie" },

                          { key: "level.01", label: "Ranga: 01" },
                          { key: "level.02", label: "Ranga: 02" },
                          { key: "level.03", label: "Ranga: 03" },
                          { key: "level.04", label: "Ranga: 04" },
                          { key: "level.05", label: "Ranga: 05" },

                          { key: "department.captain", label: "Rola: Kapitan działu" },
                          { key: "department.vicecaptain", label: "Rola: Wicekapitan działu" },
                          { key: "department.chancellor", label: "Rola: Kanclerz" },

                          
                          { key: "users.unapproved", label: "Wyświetlanie i zatwierdzanie niezatwierdzonych użytkowników" },
                          { key: "file.override", label: "Nadpisywanie plików innych"},
                          { key: "admin", label: "Uprawnienia administratora (wszystkie akcje dozwolone)" },
                        ].map((permission) => (
                            <div
                              key={permission.key}
                              className="flex items-center justify-between"
                            >
                              <span>{permission.label}</span>
                              <Switch
                              checked={currentScopes?.includes(permission.key) ?? false}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setCurrentScopes((prev) =>
                                    prev ? [...prev, permission.key] : [permission.key]
                                  );
                                } else {
                                  setCurrentScopes((prev) =>
                                    prev ? prev.filter((i) => i !== permission.key) : []
                                  );
                                }
                              }}
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
                      let role: Role = 
                      {
                        roleId: currentRole?.roleId ?? "",
                        name: roleName.current?.value ?? "Rola",
                        scopes: currentScopes ?? [],
                        department: roleDepartment
                      }
                      handleRoleEdit(role, currentRole?.roleId ?? "undefined");
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
                      ref={roleNameCreate}
                      defaultValue={currentRole?.name}
                      className="w-full"
                    />
                  </div>
                </div>
                <Select onValueChange={value => 
                    {
                      let depart = selectDepartmentString[value];
                      setRoleDepartment(depart)
                    }}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Wybierz dział" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Dział</SelectLabel>
                        <SelectItem value="nadr">Nie należy</SelectItem>
                        <SelectItem value="mech">Mechanicy</SelectItem>
                        <SelectItem value="prog">Programiści</SelectItem>
                        <SelectItem value="mtr">Social Media</SelectItem>
                        <SelectItem value="mark">Marketing</SelectItem>
                        <SelectItem value="exec">Zarządzanie</SelectItem>
                        <SelectItem value="ment">Mentorat</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                <DialogFooter className="sm:justify-between">
                  <Button variant="outline" onClick={() => { setIsAddingRole(false) }}>
                    Anuluj
                  </Button>
                  <Button
                    onClick={() => {
                      // tu by była logika zapisu
                      let e = roleNameCreate.current?.value
                      if (!e) e = "Nowa rola";
                      handleRoleCreate(e);
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
                      handleRoleDelete(currentRole?.roleId ?? "null");
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
                        onClick={() =>{
                          approveUser(user.id);
                          setUnapprovedUsers((prev) =>
                            prev.filter((u) => u.id !== user.id)
                          )}
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
