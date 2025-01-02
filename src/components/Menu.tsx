// Menu.tsx
"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Settings from './Settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUsers,
  faChartLine,
  faCog,
  faRightFromBracket,
  faPlus
} from '@fortawesome/free-solid-svg-icons';

export default function Menu() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const menuItems = [
    {
      title: "Menu główne",
      items: [
        {
          label: "Home",
          href: "/dashboard/home",
          icon: faHome,
        },
        {
          label: "Projekty",
          href: "/dashboard/project",
          icon: faChartLine,
        }
      ],
    },
    {
      title: "Administracja",
      items: [
        {
          label: "Statystyki",
          href: "/dashboard/statistics",
          icon: faChartLine,
        },
        {
          label: "Użytkownicy",
          href: "/dashboard/users",
          icon: faUsers,
        },
      ],
    },
  ];

  return (
      <>
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg h-screen flex flex-col justify-between">
          {/* New Project Button */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Link
                href="/dashboard/project/new"
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
              Nowy projekt
            </Link>
          </div>

          {/* Main menu area */}
          <div className="flex-1">
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

          {/* Bottom buttons */}
          <div className="pb-20 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2 pt-3">
              <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="flex w-full items-center text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon icon={faCog} className="w-5 h-5 mr-3" />
                Ustawienia
              </button>

              <Link
                  href="/logout"
                  className="flex items-center text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="w-5 h-5 mr-3" />
                Wyloguj
              </Link>
            </div>
          </div>
        </div>

        {isSettingsOpen && (
            <div className="fixed inset-0">
              <div
                  className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 backdrop-blur-sm"
                  onClick={() => setIsSettingsOpen(false)}
              />

              <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <Settings
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                />
              </div>
            </div>
        )}
      </>
  );
}
