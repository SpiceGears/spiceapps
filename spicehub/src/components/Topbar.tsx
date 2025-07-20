// components/Topbar.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Menu,
  Search as SearchIcon,
  X as XIcon,
} from "lucide-react"
import Searchbar from "./Searchbar"
import Notifications from "./Notifications"
import ProfileDropdown from "./ProfileDropdown"

interface TopbarProps {
  toggleSidebar?: () => void
}

export default function Topbar({ toggleSidebar }: TopbarProps) {
  const pathname = usePathname()
  const [showMobileSearch, setShowMobileSearch] = React.useState(false)

  const getTitle = () => {
    if (pathname === "/dashboard") return "SpiceHub"
    if (pathname.startsWith("/profile")) return "SpiceProfiles"
    if (pathname.startsWith("/admin")) return "SpiceAdmin"
    return "SpiceLab"
  }

  return (
    <header className="fixed inset-x-0 top-0 h-16 bg-gray-100 dark:bg-gray-800 
                       shadow-md z-50">
      {/* Main bar */}
      <div className="h-full flex items-center justify-between
                      px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Left: sidebar toggle + title */}
        <div className="flex items-center space-x-2 sm:space-x-3">
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
            className="truncate text-lg sm:text-xl font-bold
                       text-gray-900 dark:text-white"
          >
            {getTitle()}
          </Link>
        </div>

        {/* Center: desktop search only */}
        {/* <div className="hidden md:block flex-1 mx-4 lg:mx-8 max-w-md">
          <Searchbar />
        </div> */}

        {/* Right: mobile-search button, notifications, profile */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* show on mobile only */}
          {/* <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-500 dark:text-gray-400"
            onClick={() => setShowMobileSearch(true)}
          >
            <SearchIcon className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button> */}

          {/* <Notifications /> */}
          <ProfileDropdown />
        </div>
      </div>

      {/* Mobile search overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-gray-100 dark:bg-gray-800
                        px-4 py-3 flex items-center z-50 md:hidden">
          <div className="flex-1">
            <Searchbar />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMobileSearch(false)}
            className="ml-2 text-gray-500 dark:text-gray-400"
          >
            <XIcon className="h-5 w-5" />
            <span className="sr-only">Close search</span>
          </Button>
        </div>
      )}
    </header>
  )
}