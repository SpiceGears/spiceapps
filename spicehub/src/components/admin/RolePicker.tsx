// components/RolePicker.tsx
"use client";

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

export interface Role {
  name: string;
  memberCount: number;
}

interface RolePickerProps {
  roles: Role[];
  onSelect: (role: Role) => void;
  className?: string;
}

export function RolePicker({
  roles,
  onSelect,
  className,
}: RolePickerProps) {
  const [open, setOpen] = useState(false);

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
            {roles.map((role) => (
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
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
