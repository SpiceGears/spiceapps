import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Searchbar from "./Searchbar";
import Notifications from "./Notifications";
import ProfileDropdown from "./ProfileDropdown";

interface TopbarProps {
  toggleSidebar?: () => void;
}

export default function Topbar({ toggleSidebar }: TopbarProps) {
  return (
    <header className="w-full left-0 top-0 fixed shadow-md bg-white dark:bg-gray-800 z-50 h-16">
      <div className="container mx-auto h-full px-4">
        <div className="flex items-center justify-between h-full">
          {/* Left section: Logo and toggle */}
          <div className="flex items-center space-x-3">
            {toggleSidebar && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className="text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            )}
            <Link href="/dashboard" className="text-2xl font-bold text-gray-900 dark:text-white">
              SpiceHub
            </Link>
          </div>
          
          {/* Center section: Search */}
          <div className="hidden md:flex justify-center flex-grow px-4 max-w-md mx-auto">
            <Searchbar />
          </div>
          
          {/* Right section: Notifications and profile */}
          <div className="flex items-center space-x-2">
            <Notifications />
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
