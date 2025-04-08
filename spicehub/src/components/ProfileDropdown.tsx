import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUserCircle,
  faCog,
  faCaretDown,
  faCaretUp,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleProfileDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div className="relative">
      <button
        onClick={toggleProfileDropdown}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <FontAwesomeIcon
          icon={faUserCircle}
          size="lg"
          className="w-8 h-8 text-gray-100"
        />
        <span className="text-gray-100">username</span>
        <FontAwesomeIcon 
          icon={faCaretDown} 
          className={`w-4 h-4 text-gray-100 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>

      <div 
        className={`absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-950 rounded-md shadow-lg z-10 
                   transition-all duration-200 ease-in-out origin-top-right
                   ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        <Link href="/profile">
          <p className="flex items-center space-x-2 px-4 py-2 text-gray-100 hover:bg-gray-100">
            <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
            <span>Your Profile</span>
          </p>
        </Link>
        <Link href="/settings">
          <p className="flex items-center space-x-2 px-4 py-2 text-gray-100 hover:bg-gray-100">
            <FontAwesomeIcon icon={faCog} className="w-4 h-4" />
            <span>Settings</span>
          </p>
        </Link>
        <Link href="/logout">
          <p className="flex items-center space-x-2 px-4 py-2 text-gray-100 hover:bg-gray-100">
            <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
            <span>Sign Out</span>
          </p>
        </Link>
      </div>
    </div>
  );
}
