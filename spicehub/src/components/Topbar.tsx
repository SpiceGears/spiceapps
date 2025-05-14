import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Searchbar from "./Searchbar"
import Notifications from "./Notifications"
import ProfileDropdown from "./ProfileDropdown"

interface TopbarProps {
  toggleSidebar?: () => void
}

export default function Topbar({ toggleSidebar }: TopbarProps) {
  const pathname = usePathname();

  return (
    <header className="w-full fixed top-0 left-0 h-16 bg-gray-100 dark:bg-gray-800 shadow-md z-50">
      <div className="container mx-auto h-full px-4">
        <div className="flex items-center justify-between h-full">
          {/* Left section */}
          <div className="flex items-center space-x-3">
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
                {pathname === "/dashboard"
                ? "SpiceHub"
                : pathname.startsWith("/profile")
                ? "SpiceProfiles"
                : pathname.startsWith("/admin")
                ? "SpiceAdmin"
                : "SpiceLab"}
            </Link>
          </div>

          {/* Center section */}
          <div className="hidden md:flex justify-center flex-grow px-4 max-w-md mx-auto">
            <Searchbar />
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-2">
            <Notifications />
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  )
}