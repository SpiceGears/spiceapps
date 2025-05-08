import Link from "next/link";
import { Home, Terminal, TestTube } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const userData = {
    isAdmin: true,
  }
  // Define navigation items with fixed larger icons
  const navItems = [
    { href: "/dashboard", icon: Home, label: "Strona główna" },
    { href: "/spicelab", icon: TestTube, label: "SpiceLab" },
    ...(userData.isAdmin ? [{ href: "/admin", icon: Terminal, label: "Admin" }] : []),
    
  ];

  return (
    <>
      <aside 
       className={`hidden md:block fixed left-0 top-16 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white h-[calc(100vh-64px)] transition-all duration-300 ${
         isOpen ? "w-64" : "w-16"
       } z-40`}
      >
        <div className="flex flex-col h-full">
          {/* Navigation menu */}
          <nav className="flex-grow p-4 my-5">
            <div className="space-y-4">
              {navItems.map((item, index) => (
                <Link 
                  key={index}
                  href={item.href} 
                 className={`flex items-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 py-2
                   ${isOpen ? 'px-3 justify-start space-x-3' : 'justify-center'}`}
                >
                  {/* Using a consistent larger size for icons in both states */}
                  <item.icon size={isOpen ? 20 : 24} 
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