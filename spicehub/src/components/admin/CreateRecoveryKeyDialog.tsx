import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserInfo } from "@/models/User";
import { Dispatch, SetStateAction, useState } from "react";

interface CreateRecoveryKeyDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    users: UserInfo[];
    onCreate: (userId: string) => void;
}

export default function CreateRecoveryKeyDialog({
    isOpen,
    setIsOpen,
    users,
    onCreate,
}: CreateRecoveryKeyDialogProps) {
    const [selectedUserId, setSelectedUserId] = useState<string>("");

    const handleCreate = () => {
        if (selectedUserId) {
            onCreate(selectedUserId);
            setSelectedUserId("");
            setIsOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Utwórz klucz odzyskiwania</DialogTitle>
                    <DialogDescription>Wybierz użytkownika dla którego chcesz utworzyć klucz odzyskiwania</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* User Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="user-select">Użytkownik</Label>
                        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                            <SelectTrigger id="user-select" className="w-full">
                                <SelectValue placeholder="Wybierz użytkownika" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                        {user.firstName} {user.lastName} ({user.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Buttons */}
                    <DialogFooter className="sm:justify-between">
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            Anuluj
                        </Button>
                        <Button onClick={handleCreate} disabled={!selectedUserId}>
                            Utwórz klucz
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}