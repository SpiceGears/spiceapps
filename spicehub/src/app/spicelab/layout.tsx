// app/layouts/DashboardLayout.tsx
"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/Sidebar"
import Topbar from "@/components/Topbar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // Start open on desktop, closed on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768
    }
    return true
  })

  // Keep in sync if user resizes the window
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const onChange = (e: MediaQueryListEvent) => setIsSidebarOpen(e.matches)
    mq.addEventListener("change", onChange)
    // ensure initial state
    setIsSidebarOpen(mq.matches)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const toggleSidebar = () => setIsSidebarOpen((o) => !o)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Topbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main
        className={`
          min-h-screen transition-all duration-300 pt-10
          ${isSidebarOpen ? "md:ml-58" : "md:ml-10"}
        `}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}