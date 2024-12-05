"use client"
import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faFolderOpen,
  faUser,
  faGear,
  faRightFromBracket,
  faTimes,
  faChartLine,
  faUsers
} from "@fortawesome/free-solid-svg-icons";
import Settings from "./Settings";

export default function Menu() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const menuItems = [
    {
      title: "MENU",
      items: [
        {
          label: "Strona Główna",
          href: "/dashboard/home",
          icon: faHouse,
        },
        {
          label: "Projekty",
          href: "/dashboard/project",
          icon: faFolderOpen,
        },
      ],
    },
    {
      title: "UP",
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
      <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
        <div className="flex-grow overflow-y-auto">
          {menuItems.map((section, idx) => (
            <div key={idx} className="p-4">
              <h3 className="text-xs font-semibold text-gray-400 mb-4">{section.title}</h3>
              <div className="space-y-2">
                {section.items.map((item, itemIdx) => (
                  <Link
                    key={itemIdx}
                    href={item.href}
                    className="flex items-center text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pb-20 px-4 border-t border-gray-200">
          <div className="space-y-2 pt-3">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center w-full text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faGear} className="w-5 h-5 mr-3" />
              Ustawienia
            </button>
            <Link
              href="/logout"
              className="flex items-center text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100"
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
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsSettingsOpen(false)}
          />

          <div className="fixed left-1/3 top-1/3 transform -translate-x-1/4 -translate-y-1/4 w-full max-w-md bg-white rounded-lg shadow-xl">
            {isSettingsOpen && (
              <Settings
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}