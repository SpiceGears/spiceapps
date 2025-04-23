import Link from "next/link";
import { UserCircle, User, Cog, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProfileDropdown() {
  const userData = {
    firstName: "Jan",
    lastName: "Kowalski",
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 text-gray-100 hover:bg-gray-700 hover:text-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <img
          src={`https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=random&color=fff`}
          alt={`${userData.firstName} ${userData.lastName}`}
          className="w-8 h-8 rounded-full" // Adjusted size to w-8 h-8
          />
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 bg-gray-800 border-gray-700 text-gray-100"
        align="end"
      >
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem asChild className="hover:bg-gray-700 cursor-pointer focus:bg-gray-700">
          <Link href="/profile" className="flex items-center w-full">
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="hover:bg-gray-700 cursor-pointer focus:bg-gray-700">
          <Link href="/settings" className="flex items-center w-full">
            <Cog className="mr-2 h-4 w-4" />
            <span>Ustawienia</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem asChild className="hover:bg-gray-700 cursor-pointer focus:bg-gray-700">
          <Link href="/logout" className="flex items-center w-full">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Wyloguj się</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}