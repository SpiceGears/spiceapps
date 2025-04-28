"use client"

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Topbar toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            
            <main 
                className={`min-h-screen transition-all duration-300 pt-16
                    ${isSidebarOpen ? 'md:ml-64' : 'md:ml-16'}`}
            >
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}