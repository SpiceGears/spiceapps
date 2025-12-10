import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RolePicker } from "./RolePicker";
import { Role, UserInfo } from "@/models/User";
import { Dispatch, SetStateAction } from "react";

interface EditUserDialogProps {
    isEditingUser: boolean;
    setIsEditingUser: (isOpen: boolean) => void;
    currentUser: UserInfo | null;
    setCurrentUser: (user: UserInfo | null) => void;
    roles: Role[];
    assignedRoles: string[];
    setAssignedRoles: Dispatch<SetStateAction<string[]>>;
    handleUserEdit: () => void;
}
    
export default function EditUserDialog({
    isEditingUser,
    setIsEditingUser,
    currentUser,
    setCurrentUser,
    roles,
    assignedRoles,
    setAssignedRoles,
    handleUserEdit,
}: EditUserDialogProps) {
    return (
        <Dialog open={isEditingUser} onOpenChange={setIsEditingUser}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edytuj użytkownika</DialogTitle>
                    <DialogDescription>Edytuj dane użytkownika</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Imię */}
                    <div className="space-y-2">
                        <Label htmlFor="user-name">Imię</Label>
                        <Input
                            id="user-name"
                            defaultValue={currentUser?.firstName}
                            className="w-full"
                        />
                    </div>

                    {/* Nazwisko */}
                    <div className="space-y-2">
                        <Label htmlFor="user-lastname">Nazwisko</Label>
                        <Input
                            id="user-lastname"
                            defaultValue={currentUser?.lastName}
                            className="w-full"
                        />
                    </div>

                    {/* Data urodzenia */}
                    <div className="space-y-2">
                        <Label htmlFor="birthday">Data urodzenia</Label>
                        <Input
                            id="birthday"
                            type="date"
                            defaultValue={currentUser?.birthday}
                        />
                    </div>

                    {/* Role */}
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

                    {/* Przyciski akcji */}
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
    )
}