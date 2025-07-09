// components/Sidebar.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { Home, Terminal, TestTube, Folder, Plus, X, HardDrive } from "lucide-react"
import { Button } from "./ui/button"
import { usePathname } from "next/navigation"

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname()
  const userData = { isAdmin: true }

  const navItems = React.useMemo(
    () => [
      { href: "/dashboard", icon: Home, label: "Strona główna" },
      { href: "/spicelab", icon: TestTube, label: "SpiceLab" },
      { href: "/drive", icon: HardDrive, label: "Dysk" },
      ...(pathname.startsWith("/spicelab")
        ? [{ href: "/spicelab/project", icon: Folder, label: "Projekty" }]
        : []),
      ...(userData.isAdmin
        ? [{ href: "/admin", icon: Terminal, label: "Admin" }]
        : []),
    ],
    [pathname]
  )

  return (
    <>
      {/* Mobile drawer */}
      <aside
        className={`
          fixed inset-0 z-40 md:hidden
          ${isOpen ? "block" : "hidden"}
        `}
        aria-hidden={!isOpen}
      >
        {/* backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={toggleSidebar}
        />
        {/* drawer panel */}
        <div
          className={`
            absolute inset-y-0 left-0 w-64 bg-gray-100 dark:bg-gray-800
            p-4 space-y-6 overflow-y-auto
          `}
        >
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-gray-600 dark:text-gray-300"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Zamknij</span>
            </Button>
          </div>

          {pathname.startsWith("/spicelab") && (
            <Link href="/spicelab/newProject">
              <Button
                variant="default"
                className="w-full flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                <span>Nowy Projekt</span>
              </Button>
            </Link>
          )}

          <nav className="space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 p-2 rounded
                           hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={toggleSidebar}
              >
                <item.icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="text-gray-900 dark:text-white">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`
          hidden md:flex md:flex-col
          fixed top-16 left-0 h-[calc(100vh-64px)]
          bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white
          transition-all duration-300 z-40
          ${isOpen ? "w-64" : "w-16"}
        `}
      >
        <div className="flex-1 flex flex-col p-4 space-y-6 overflow-y-auto">
          {pathname.startsWith("/spicelab") && (
            <Link href="/spicelab/newProject">
              <Button
                variant="default"
                className={`
                  w-full flex items-center justify-center gap-2
                  ${isOpen ? "" : "justify-center"}
                `}
              >
                <Plus className="h-5 w-5" />
                {isOpen && <span>Nowy Projekt</span>}
              </Button>
            </Link>
          )}

          <nav className="flex-1 flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center py-2 rounded hover:bg-gray-200
                  dark:hover:bg-gray-700 transition-colors
                  ${isOpen ? "px-3 gap-3 justify-start" : "justify-center"}
                `}
              >
                <item.icon className="h-6 w-6 text-gray-500 dark:text-gray-300" />
                {isOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  )
}