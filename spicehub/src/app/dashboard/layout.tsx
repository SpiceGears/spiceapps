"use client"

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isSidebarOpen , setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    return (
        <div className="flex flex-col">
            <Topbar toggleSidebar={toggleSidebar} />
            <div className="flex">
                <Sidebar isOpen={isSidebarOpen} />
                {children}
            </div>
        </div>
    )
}