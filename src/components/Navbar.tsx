import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faMessage, faBell } from "@fortawesome/free-solid-svg-icons";

export default function Navbar(){
    return (
        <div className="flex items-center justify-between p-4">
        <div className="hidden md:flex">
            <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
            <input type="text" placeholder="Szukaj..."/>
        </div>
        <div className="flex items-center gap-6">
            <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
                <FontAwesomeIcon icon={faMessage} className="w-4 h-4" />
            </div>
            <div className="bg-white rounded-full w-h h-7 flex items-center justify-center cursor-pointer">
                <FontAwesomeIcon icon={faBell} className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
                <span className="text-xs leading-3 font-medium">Jan Kowalski</span>
            </div>
            <Image src="/icons/avatar.png" alt="Avatar" width={40} height={40} className="rounded-full" />
        </div>
        </div>
    );
}