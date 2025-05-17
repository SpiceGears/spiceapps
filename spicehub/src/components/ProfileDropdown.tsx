import Link from "next/link";
import { UserCircle, User, Cog, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "./ui/badge";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const userData = {
    firstName: "Jan",
    lastName: "Kowalski",
  }
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <img
            src={`https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=random&color=fff`}
            alt={`${userData.firstName} ${userData.lastName}`}
            className="w-8 h-8 rounded-full" // Adjusted size to w-8 h-8
          />
          <ChevronDown
            className={`ml-2 h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
        align="end"
      >
        <DropdownMenuLabel className="text-gray-700 dark:text-gray-100">{userData.firstName} {userData.lastName} <Badge variant="programmer">Programista</Badge></DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
        <DropdownMenuItem asChild className="hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 cursor-pointer">
          <Link href="/profile" className="flex items-center w-full text-gray-700 dark:text-gray-100">
            <User className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-300" />
            <span>Profil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 cursor-pointer">
          <Link href="/settings" className="flex items-center w-full text-gray-700 dark:text-gray-100">
            <Cog className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-300" />
            <span>Ustawienia</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
        <DropdownMenuItem asChild className="hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 cursor-pointer">
          <Link href="/logout" className="flex items-center w-full text-gray-700 dark:text-gray-100">
            <LogOut className="mr-2 h-4 w-4 text-red-700 dark:text-red-500" />
            <span>Wyloguj się</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}