"use client";

import React, { useState } from "react";
import Menu from "../../components/Menu";
import Navbar from "../../components/Navbar";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    return (
        <div className="h-screen flex flex-col">
            {/* Navbar */}
            <Navbar toggleSidebar={toggleSidebar} />

            {/* Content Area */}
            <div className="flex flex-1">
                {/* Sidebar with z-index adjustment */}
                <div
                    className={`fixed inset-y-0 left-0 z-30 transform bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out md:relative md:z-0 md:translate-x-0 ${
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                    style={{ width: "16rem" }}
                >
                    <Menu isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                </div>

                {/* Main Content */}
                <div
                    className={`flex-1 bg-[#F7F8FA] overflow-scroll transition-all duration-300 ${
                        isSidebarOpen ? "md:ml-64" : "md:ml-0"
                    }`}
                >
                    {children}
                    <Toaster position="top-right" />
                </div>
            </div>
        </div>
    );
}