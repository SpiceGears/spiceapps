import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faFolderOpen,
  faUser,
  faGear,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

export default function Menu() {
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
          href: "/dashboard/projects",
          icon: faFolderOpen,
        },
        {
          label: "Profil",
          href: "/dashboard/profile",
          icon: faUser,
        },
      ],
    },
    {
      title: "OTHER",
      items: [
        {
          label: "Ustawienia",
          href: "/dashboard/settings",
          icon: faGear,
        },
        {
          label: "Wyloguj",
          href: "/dashboard/logout",
          icon: faRightFromBracket,
        },
      ],
    },
  ];

  return (
    <div className="">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => (
            <Link
              href={item.href}
              key={item.label}
              className="flex items-center justify-center lg:justify-start gap-2 text-gray-500 py-1"
            >
              <FontAwesomeIcon
                icon={item.icon}
                className="w-6 h-6 text-black"
              />
              <span className="hidden lg:block text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
