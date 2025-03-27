import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

export default function Notifications() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNotifications = () => setIsOpen((prev) => !prev);

    return (
        <div className="relative">
            <FontAwesomeIcon 
                icon={faBell} 
                onClick={toggleNotifications}
                size="xl"
                className="p-2 rounded-full text-gray-50 hover:text-gray-100 focus:outline-none cursor-pointer"
            /> 
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <div className="py-2">
                        <p className="px-4 py-2 text-gray=700">Brak nowych powiadomień</p>
                    </div>
                </div>
            )}
        </div>
    );
}