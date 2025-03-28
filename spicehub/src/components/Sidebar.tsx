import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {
    faTachometerAlt,
    faUser,
    faCog,
    faBars,
    faAngleDoubleLeft,
    faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";

interface SidebarProps {
    isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {


    return (
        <div className="flex">
            <aside className={`bg-gray-800 text-white transition-all duration-300 p-4 ${isOpen ? 'w-64' : 'w-16'} mt-16`} style={{ height: "calc(100vh - 64px)" }}>
                <nav>
                    <ul className="space-y-4">
                        <li>
                            <Link href="/">
                                <p className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded">
                                    <FontAwesomeIcon icon={faTachometerAlt} />
                                    {isOpen && <span>SpiceLab</span>}
                                </p>
                            </Link>
                        </li>
                        <li>
                            <Link href="/profile">
                                <p className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded">
                                    <FontAwesomeIcon icon={faUser} />
                                    {isOpen && <span>SpiceCos</span>}
                                </p>
                            </Link>
                        </li>
                        <li>
                            <Link href="/settings">
                                <p className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded">
                                    <FontAwesomeIcon icon={faCog} />
                                    {isOpen && <span>SpiceCos</span>}
                                </p>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>
        </div>
    )
}