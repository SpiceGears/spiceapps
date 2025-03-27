import { useState } from "react";
import Searchbar from "./Searchbar";

export default function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="w-full left-0 top-0 fixed shadow-md bg-gray-800 z-50">
        <div className="container px-4 py-4 flex items-center justify-between">
            <div className="text-2xl font-bold text-white">SpiceHub</div>

            <div>
                <Searchbar />
            </div>
        </div>
    </header>
  );
}
