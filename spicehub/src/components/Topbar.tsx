import Searchbar from "./Searchbar";
import Notifications from "./Notifications";
import ProfileDropdown from "./ProfileDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

interface TopbarProps {
  toggleSidebar: () => void;
}

export default function Topbar({ toggleSidebar }: TopbarProps) {
  return (
    <header className="w-full left-0 top-0 fixed shadow-md bg-gray-800 z-50 flex items-center">
      <button
        onClick={toggleSidebar}
        className="text-white ml-10 focus:outline-none"
      >
        <FontAwesomeIcon icon={faBars} size="lg" />
      </button>

      <div className="container mx-auto px-4 py-4 flex items-center w-full">
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
