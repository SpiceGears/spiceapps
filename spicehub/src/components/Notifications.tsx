import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

export default function Notifications() {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const toggleNotifications = () => setIsOpen((prev) => !prev);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if(isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);

    return (
        <div className="relative" ref={containerRef}>
            <FontAwesomeIcon 
                icon={faBell} 
                onClick={toggleNotifications}
                size="xl"
                className={`p-2 rounded-full text-gray-100 hover:text-gray-100 focus:outline-none cursor-pointer 
                  transition-all duration-200 ${isOpen ? 'transform rotate-12' : ''}`}
            /> 
            
            <div 
                className={`absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-950 rounded-md shadow-lg z-10
                         transition-all duration-200 ease-in-out origin-top-right
                         ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
            >
                <div className="py-2">
                    <p className="px-4 py-2 text-gray-100">Brak nowych powiadomień</p>
                </div>
            </div>
        </div>
    );
}