import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Searchbar from "./Searchbar";
import Notifications from "./Notifications";
import ProfileDropdown from "./ProfileDropdown";

interface TopbarProps {
  toggleSidebar?: () => void;
}

export default function Topbar({ toggleSidebar }: TopbarProps) {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname === "/dashboard") return "SpiceHub";
    if (pathname.startsWith("/profile")) return "SpiceProfiles";
    if (pathname.startsWith("/admin")) return "SpiceAdmin";
    return "SpiceLab";
  };

  return (
    <header className="w-full fixed top-0 left-0 h-16 bg-gray-100 dark:bg-gray-800 shadow-md z-50">
      <div className="w-full h-full px-4 flex items-center justify-between">
        {/* Left section - at the left edge */}
        <div className="flex items-center space-x-3 ml-8">
          {toggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-gray-400 dark:text-gray-300 
                         hover:text-gray-500 dark:hover:text-gray-100 
                         hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
          <Link
            href="/dashboard"
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            {getTitle()}
          </Link>
        </div>

        {/* Center section - centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-md">
          <Searchbar />
        </div>

        {/* Right section - at the right edge */}
        <div className="flex items-center space-x-2 mr-8">
          <Notifications />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
