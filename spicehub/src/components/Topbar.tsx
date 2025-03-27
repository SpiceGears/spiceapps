import { useState } from "react";
import Searchbar from "./Searchbar";
import Notifications from "./Notifications";
import ProfileDropdown from "./ProfileDropdown";

export default function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="w-full left-0 top-0 fixed shadow-md bg-gray-800 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center">
            <div className="text-2xl font-bold text-white w-1/4">SpiceHub</div>

            <div className="w-2/4 flex justify-center">
                <Searchbar />
            </div>
            
            <div className="w-1/4 flex items-center justify-end space-x-4">
                <Notifications />
                <ProfileDropdown />
            </div>
        </div>
    </header>
  );
}