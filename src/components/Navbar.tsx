"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faMessage, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useUserData } from '../hooks/userData';

export default function Navbar() {
    const { userData, loading, error } = useUserData();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    async function generateAccess() {
        try {
            const rtb = localStorage.getItem('rtb');
            const response = await fetch('/api/generateAccess', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                    'Authorization': `${rtb}`
                },
                body: JSON.stringify({ "refreshToken": rtb })
            });

            if (!response.ok) {
                throw new Error('Failed to generate access');
            }

            const token = await response.text();
            localStorage.setItem("atok", token);
            console.log('Generated access token received');
            // Handle error appropriately (e.g., show error message)
        } catch (error) {
            console.error('Error generating access:', error);
        }
    }

    if (loading) return <div className="h-16 bg-white shadow-sm"></div>;
    if (error) {
        generateAccess();
        //window.location.reload();
        return <div className="h-16 bg-white shadow-sm"></div>;
    }
    if (!userData) return <div className="h-16 bg-white shadow-sm"></div>;


    const handleLogout = () => {
        localStorage.removeItem('rtb');
        localStorage.removeItem('atok');
        window.location.href = '/login';
    };

    return (
        <div className="flex items-center justify-between p-4 bg-gray-200 dark:bg-gray-800 w-full h-16">
            <Link href="/dashboard/home" className="flex items-center h-full">
                <div className="flex items-center justify-center">
                    <Image 
                        src="/images/spicelab.png" 
                        alt="icon" 
                        width={250} 
                        height={250} 
                        className="object-contain dark:brightness-90" 
                    />
                </div>
            </Link>

            <div className="flex justify-center w-1/2">
                <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-700 dark:ring-gray-600 px-2 bg-transparent dark:bg-gray-700">
                    <FontAwesomeIcon 
                        icon={faSearch} 
                        className="w-4 h-4 text-gray-700 dark:text-gray-300" 
                    />
                    <input 
                        type="text" 
                        placeholder="Szukaj..." 
                        className="w-[250px] p-2 bg-transparent outline-none 
                                 text-gray-900 dark:text-gray-100
                                 placeholder-gray-500 dark:placeholder-gray-400" 
                    />
                </div>
            </div>

            <div className="flex items-center gap-6 justify-end">
                <div className="bg-white dark:bg-gray-700 rounded-full w-9 h-9 flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                    <FontAwesomeIcon 
                        icon={faMessage} 
                        className="w-6 h-6 text-[#0037A1] dark:text-blue-400" 
                    />
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-full w-9 h-9 flex items-center justify-center cursor-pointer relative hover:bg-gray-100 dark:hover:bg-gray-600">
                    <FontAwesomeIcon 
                        icon={faBell} 
                        className="w-6 h-6 text-[#0037A1] dark:text-blue-400" 
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs leading-3 font-medium text-gray-900 dark:text-gray-100">
                        {userData?.firstName} {userData?.lastName}
                    </span>
                    <span className="text-[13px] text-gray-500 dark:text-gray-400 text-right">
                        {userData?.coins} SpiceCoins
                    </span>
                </div>
                <div 
                    className="relative"
                    onMouseEnter={() => setShowProfileMenu(true)}
                    onMouseLeave={() => setShowProfileMenu(false)}
                >
                    <Image 
                        src="/icons/avatar.png" 
                        alt="Avatar" 
                        width={40} 
                        height={40} 
                        className="rounded-full ring-2 ring-gray-200 dark:ring-gray-700 cursor-pointer" 
                    />
                    
                    {showProfileMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                            <button
                                onClick={handleLogout}
                                className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Wyloguj
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}