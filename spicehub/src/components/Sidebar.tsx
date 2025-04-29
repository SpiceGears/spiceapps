import Link from "next/link";
import { Home, User, Settings, TestTube } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  // Define navigation items with fixed larger icons
  const navItems = [
    { href: "/dashboard", icon: Home, label: "Strona główna" },
    { href: "/dashboard", icon: TestTube, label: "SpiceLab" },
  ];

  // Mobile sidebar using Sheet component
  const MobileSidebar = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden fixed left-4 top-20 z-50 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
        >
          <Home className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="
       w-64 p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
      ">
        <div className="flex flex-col h-full p-4">
          <div className="space-y-4 mt-8">
            {navItems.map((item, index) => (
              <Link 
                key={index} 
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  // Desktop sidebar
  return (
    <>
      {/* Mobile sidebar for smaller screens */}
      <div className="md:hidden">
        <MobileSidebar />
      </div>
      
      {/* Desktop sidebar */}
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