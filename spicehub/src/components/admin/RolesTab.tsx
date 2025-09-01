"use client";

import { useState, useRef } from "react";
import { Role, Department, NewRole } from "@/models/User";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Shield, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { permissions } from "@/Constants/permissions";

type Props = {
    roles: Role[];
    onRefresh: () => void;
}

const departmentOptions: { value: string; label: string; dept: Department }[] = [
    { value: "nadr", label: "Nie należy", dept: Department.NaDr },
    { value: "mech", label: "Mechanicy", dept: Department.Mechanics },
    { value: "prog", label: "Programiści", dept: Department.Programmers },
    { value: "mtr", label: "Social Media", dept: Department.SocialMedia },
    { value: "mark", label: "Marketing", dept: Department.Marketing },
    { value: "exec", label: "Zarządzanie", dept: Department.Executive },
    { value: "ment", label: "Mentorat", dept: Department.Mentor },
];

export default function RolesTab({ roles, onRefresh }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [currentRole, setCurrentRole] = useState<Role | null>(null);
    const [currentScopes, setCurrentScopes] = useState<string[]>([]);
    const [roleDepartment, setRoleDepartment] = useState<Department>(Department.NaDr);

    const roleNameRef = useRef<HTMLInputElement | null>(null);
    const roleNameCreateRef = useRef<HTMLInputElement | null>(null);

    async function handleRoleEdit() {
        if (!currentRole) return;
        const updated: Role = {
            ...currentRole,
            name: roleNameRef.current?.value || currentRole.name,
            scopes: currentScopes,
            department: roleDepartment
        };
        try {
            await api.updateRole(currentRole.roleId, updated);
            toast.success("Rola zaktualizowana");
            onRefresh();
        } catch (err: any) {
            toast.error("Błąd podczas aktualizacji roli", { description: err.message });
        }
        setIsEditing(false);
        setCurrentRole(null);
    }

    async function handleRoleCreate() {
        const name = roleNameCreateRef.current?.value || "Nowa rola";
        const newRole: NewRole = {
            name,
            scopes: [],
            department: roleDepartment,
        };
        try {
            await api.createRole(newRole);
            toast.success("Rola utworzona");
            onRefresh();
        } catch (err: any) {
            toast.error("Błąd podczas tworzenia roli", { description: err.message });
        }
        setIsAdding(false);
    }

    async function handleRoleDelete() {
        if (!currentRole) return;
        try {
            await api.deleteRole(currentRole.roleId);
            toast.success("Rola usunięta");
            onRefresh();
        } catch (err: any) {
            toast.error("Błąd podczas usuwania roli", { description: err.message });
        }
        setIsDeleting(false);
        setCurrentRole(null);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    Role
                </h2>
                <Button variant="default" size="sm" onClick={() => { setIsAdding(true) }}>
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
                                            setIsEditing(true);
                                        }}
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        <span>Edytuj rolę</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem variant="destructive"
                                        onClick={() => {
                                            setCurrentRole(role);
                                            setIsDeleting(true);
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

            {isEditing && currentRole && (
            <Dialog
                open={isEditing}
                onOpenChange={(open) => {
                    setIsEditing(open);
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
                                defaultValue={currentRole?.name}
                                className="w-full"
                                ref={roleNameRef}
                            />
                        </div>
                        <Select
                            onValueChange={val => {
                                const dept = departmentOptions.find((d) => d.value === val)?.dept ?? Department.NaDr;
                                setRoleDepartment(dept);
                            }}
                            defaultValue={departmentOptions.find((d) => d.dept === currentRole?.department)?.value}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Wybierz dział" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Działy</SelectLabel>
                                    {departmentOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <div className="space-y-2">
                            <Label>Uprawnienia</Label>
                            <Card className="p-3 space-y-2">
                                {permissions.map((perm) => (
                                    <div key={perm.key} className="flex items-center justify-between">
                                        <span>{perm.label}</span>
                                        <Switch
                                            checked={currentScopes.includes(perm.key)}
                                            onCheckedChange={(checked) =>
                                                setCurrentScopes((prev) =>
                                                    checked ? [...prev, perm.key] : prev.filter((p) => p !== perm.key)
                                                )
                                            }
                                        />
                                    </div>
                                ))}
                            </Card>
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-between">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Anuluj
                        </Button>
                        <Button onClick={handleRoleEdit}>
                            Zapisz zmiany
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            )}



            {isAdding && (
            <Dialog
                open={isAdding}
                onOpenChange={(open) => {
                    setIsAdding(open);
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
                                ref={roleNameCreateRef}
                                defaultValue={currentRole?.name}
                                className="w-full"
                            />
                        </div>
                    </div>
                    <Select
                        onValueChange={(val) => {
                            const dept = departmentOptions.find((d) => d.value === val)?.dept ?? Department.NaDr;
                            setRoleDepartment(dept);
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Wybierz dział" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {departmentOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <DialogFooter className="sm:justify-between">
                        <Button variant="outline" onClick={() => { setIsAdding(false) }}>
                            Anuluj
                        </Button>
                        <Button onClick={handleRoleCreate}>
                            Zapisz zmiany
                        </Button>
                    </DialogFooter>

                </DialogContent>
            </Dialog>
            )}


            {isDeleting && currentRole && (
            <Dialog
                open={isDeleting}
                onOpenChange={setIsDeleting}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Usuń rolę: {currentRole?.name}</DialogTitle>
                        <DialogDescription>
                            Czy na pewno chcesz usunąć tę rolę?
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="sm:justify-between">
                        <Button variant="outline" onClick={() => setIsDeleting(false)}>
                            Anuluj
                        </Button>
                        <Button onClick={handleRoleDelete}>
                            Zapisz zmiany
                        </Button>
                    </DialogFooter>

                </DialogContent>
            </Dialog>
            )}
        </div>
    )
}