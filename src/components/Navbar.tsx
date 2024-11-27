import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faMessage, faBell } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
    return (
        <div className="flex items-center justify-between p-4 bg-white">
            <div className="w-4/6"></div>
            
            <div className="flex justify-center w-1/2">
                <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
                    <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
                    <input type="text" placeholder="Szukaj..." className="w-[250px] p-2 bg-transparent outline-none" />
                </div>
            </div>
            <div className="flex items-center gap-6 justify-end w-full">
                <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
                    <FontAwesomeIcon icon={faMessage} className="w-4 h-4 text-[#0037A1]"/>
                </div>
                <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
                    <FontAwesomeIcon icon={faBell} className="w-4 h-4 text-[#0037A1]" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs leading-3 font-medium">Jan Kowalski</span>
                    <span className="text-[14px] text-gray-500 text-right">0 SpiceCoins</span>
                </div>
                <Image src="/icons/avatar.png" alt="Avatar" width={40} height={40} className="rounded-full" />
            </div>
        </div>
    );
}