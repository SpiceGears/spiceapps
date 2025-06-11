import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Role } from "@/models/User";
import { UserInfo } from "@/models/User";

interface RolePickerProps {
  roles: Role[];
  onSelect: (role: Role) => void;
  className?: string;
  currentUser: UserInfo | null;
}

export function RolePicker({
  roles,
  currentUser,
  onSelect,
  className,
}: RolePickerProps) {
  const [open, setOpen] = useState(false);
  // Helper to get roles not assigned to the user
  function getUnassignedRoles(allRoles: Role[], user: UserInfo | null): Role[] {
    if (!user || !user.roles) return allRoles;
    return allRoles.filter(
      (role) => !user.roles.some((userRole) => userRole.name === role.name)
    );
  }
  // Filter out roles that are already selected
  const availableRoles = getUnassignedRoles(roles, currentUser);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={className ?? "h-8 w-8 p-0"}
          aria-label="Dodaj rolę"
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Wyszukaj role…" />
          <CommandEmpty>Brak wyników.</CommandEmpty>
          <CommandGroup>
            {availableRoles.length === 0 ? (
              <CommandItem disabled>Wszystkie role zostały przypisane</CommandItem>
            ) : (
              availableRoles.map((role) => (
          <CommandItem
            key={role.name}
            value={role.name}
            onSelect={() => {
              onSelect(role);
              setOpen(false);
            }}
          >
            {role.name}
          </CommandItem>
              ))
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
