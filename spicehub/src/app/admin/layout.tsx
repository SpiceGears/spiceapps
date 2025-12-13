"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useRegistrationNotifications } from "@/hooks/useRegistrationNotifications";
import { Toaster } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useRegistrationNotifications(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Toaster position="top-right" richColors />
      <Topbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main
        className={`min-h-screen transition-all duration-300 pt-10
                    ${isSidebarOpen ? "md:ml-58" : "md:ml-10"}`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
