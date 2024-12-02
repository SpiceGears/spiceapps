"use client"
import { faBell, faMessage, faSearch, faUser, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { useUserData } from '../hooks/userData';
import { useState } from 'react';

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
        return <div className="h-16 bg-white shadow-sm"></div>;
    }
    if (!userData) return <div className="h-16 bg-white shadow-sm"></div>;

    const handleLogout = () => {
        localStorage.removeItem('atok');
        localStorage.removeItem('rtb');
        window.location.href = '/login';
    };

    return (
        <div className="flex items-center justify-between p-4 bg-gray-200 w-full h-16">
            <Link href="/dashboard/home" className="flex items-center h-full">
                <div className="flex items-center justify-center">
                    <Image src="/images/spicelab.png" alt="icon" width={250} height={250} className="object-contain" />
                </div>
            </Link>
            <div className="flex justify-center w-1/2">
                <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-700 px-2">
                    <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
                    <input type="text" placeholder="Szukaj..." className="w-[250px] p-2 bg-transparent outline-none placeholder-black" />
                </div>
            </div>
            <div className="flex items-center gap-6 justify-end">
                <div className="bg-white rounded-full w-9 h-9 flex items-center justify-center cursor-pointer">
                    <FontAwesomeIcon icon={faMessage} className="w-6 h-6 text-[#0037A1]" />
                </div>
                <div className="bg-white rounded-full w-9 h-9 flex items-center justify-center cursor-pointer relative">
                    <FontAwesomeIcon icon={faBell} className="w-6 h-6 text-[#0037A1]" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs leading-3 font-medium">{userData?.firstName} {userData?.lastName}</span>
                    <span className="text-[13px] text-gray-500 text-right">{userData?.coins} SpiceCoins</span>
                </div>
                <Image src="/icons/avatar.png" alt="Avatar" width={40} height={40} className="rounded-full" />
            </div>
        </div>
    );
}