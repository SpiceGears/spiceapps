import Link from "next/link";
import { Home, Terminal, TestTube, Folder, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation"
interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  const userData = {
    isAdmin: true,
  }
  // Define navigation items with fixed larger icons
  const navItems = [
    { href: "/dashboard", icon: Home, label: "SpiceHub" },
    { href: "/spicelab", icon: TestTube, label: "SpiceLab" },
    ...(pathname.startsWith("/spicelab") ? [{ href: "/spicelab/projects", icon: Folder, label: "Projekty" }] : []),
    ...(userData.isAdmin ? [{ href: "/admin", icon: Terminal, label: "Admin" }] : []),
  ];

  return (
    <>
      <aside
        className={`hidden md:block fixed left-0 top-16 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white h-[calc(100vh-64px)] transition-all duration-300 ${isOpen ? "w-64" : "w-16"
          } z-40`}
      >
        <div className="flex flex-col h-full">
          {/* Navigation menu */}
          <nav className="flex-grow p-4 my-5">
            <div className="space-y-4">
              {pathname.startsWith("/spicelab") && (
                <Link href="/spicelab/newProject">
                  <Button
                    variant="default"
                    className="w-full mb-5 flex items-center justify-center gap-2"
                  >
                    <Plus className="h-5 w-5 text-current mt-0.5" />
                    <span className="text-current">{isOpen ? "Nowy Projekt" : ""}</span>
                  </Button>
                </Link>
              )}
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 py-2
                   ${isOpen ? 'px-3 justify-start space-x-3' : 'justify-center'}`}
                >
                  {/* Using a consistent larger size for icons in both states */}
                  <item.icon
                    className="text-gray-500 dark:text-gray-300"
                  />
                  {isOpen && <span>{item.label}</span>}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}