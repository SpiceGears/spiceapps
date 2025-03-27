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
          className="w-8 h-8 text-gray-50"
        />
        <span className="text-gray-50">username</span>
        {isOpen ? (
            <FontAwesomeIcon icon={faCaretUp} className="w-4 h-4 text-gray-50" />
            ) : (
            <FontAwesomeIcon icon={faCaretDown} className="w-4 h-4 text-gray-50" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <Link href="/profile">
            <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100 items-center space-x-2">
              <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
              <span>Your Profile</span>
            </p>
          </Link>
          <Link href="/settings">
            <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100 items-center space-x-2">
              <FontAwesomeIcon icon={faCog} className="w-4 h-4" />
              <span>Settings</span>
            </p>
          </Link>
          <Link href="/logout">
            <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100 items-center space-x-2">
              <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
              <span>Sign Out</span>
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}
