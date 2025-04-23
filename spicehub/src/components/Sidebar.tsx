import Link from "next/link";
import { Home, User, Settings } from "lucide-react";
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
    { href: "/dashboard", icon: Home, label: "SpiceLab" },
    { href: "/profile", icon: User, label: "SpiceCos" },
    { href: "/settings", icon: Settings, label: "SpiceCos" }
  ];

  // Mobile sidebar using Sheet component
  const MobileSidebar = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden fixed left-4 top-20 z-50 bg-gray-800 text-gray-100"
        >
          <Home className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 bg-gray-800 border-gray-700 text-gray-100">
        <div className="flex flex-col h-full p-4">
          <div className="space-y-4 mt-8">
            {navItems.map((item, index) => (
              <Link 
                key={index} 
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-700"
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
        className={`hidden md:block fixed left-0 top-16 bg-gray-800 text-white h-[calc(100vh-64px)] transition-all duration-300 ${
          isOpen ? "w-64" : "w-16"
        } z-40`}
      >
        <div className="flex flex-col h-full">
          {/* Navigation menu */}
          <nav className="flex-grow p-4">
            <div className="space-y-4">
              {navItems.map((item, index) => (
                <Link 
                  key={index}
                  href={item.href} 
                  className={`flex items-center rounded hover:bg-gray-700 py-2
                    ${isOpen ? 'px-3 justify-start space-x-3' : 'justify-center'}`}
                >
                  {/* Using a consistent larger size for icons in both states */}
                  <item.icon size={isOpen ? 20 : 24} className="text-gray-300" />
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