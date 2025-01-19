"use client";

import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHome,
  faUsers,
  faChartLine,
  faRightFromBracket,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

interface MenuProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Menu({ isSidebarOpen, toggleSidebar }: MenuProps) {
  const menuItems = [
    {
      title: "Menu główne",
      items: [
        { label: "Home", href: "/dashboard/home", icon: faHome },
        { label: "Projekty", href: "/dashboard/project", icon: faChartLine },
      ],
    },
    {
      title: "Administracja",
      items: [
        { label: "Statystyki", href: "/dashboard/statistics", icon: faChartLine },
        { label: "Użytkownicy", href: "/dashboard/users", icon: faUsers },
      ],
    },
  ];

  return (
      <div className="h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          {/* Collapse Button */}
          <button
              onClick={toggleSidebar}
              className="md:hidden p-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>

          {/* New Project Button */}
          <Link
              href="/dashboard/project/new"
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mt-4"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Nowy projekt
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto">
          {menuItems.map((section, idx) => (
              <div key={idx} className="p-4">
                <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-4">
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item, itemIdx) => (
                      <Link
                          key={itemIdx}
                          href={item.href}
                          className="flex items-center text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <FontAwesomeIcon icon={item.icon} className="w-5 h-5 mr-3" />
                        {item.label}
                      </Link>
                  ))}
                </div>
              </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link
              href="/logout"
              className="flex items-center text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="w-5 h-5 mr-3" />
            Wyloguj
          </Link>
        </div>
      </div>
  );
}