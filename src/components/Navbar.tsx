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
        const rtb = localStorage.getItem("rtb");
        console.log('Refresh token:', rtb);
        if (!rtb) {
            console.error('No refresh token found');
            return;
        }

        try {
            const response = await fetch('/api/generateAccess', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken: rtb }),
            });

            const data = await response.json();
            
            if (response.status === 401) {
                console.log('Unauthorized - refresh token invalid');
                return;
            }

            if (!response.ok) {
                console.error('Error data:', data);
                throw new Error(data.message || 'Failed to generate access token');
            }

            console.log('Response data:', data);
            if (data.accessToken) {
                localStorage.setItem('atok', data.accessToken);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Failed to refresh token:', error);
            throw error;
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
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left section */}
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={32}
                                height={32}
                                className="block h-8 w-auto"
                            />
                        </Link>
                    </div>

                    {/* Search bar */}
                    <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
                        <div className="max-w-lg w-full lg:max-w-xs">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Search"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center">
                        <button className="p-2 text-gray-400 hover:text-gray-500">
                            <FontAwesomeIcon icon={faMessage} className="h-6 w-6" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-500">
                            <FontAwesomeIcon icon={faBell} className="h-6 w-6" />
                        </button>

                        {/* Profile dropdown */}
                        <div className="ml-3 relative">
                            <div>
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                                    </div>
                                </button>
                            </div>

                            {showProfileMenu && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                                    <div className="px-4 py-2 text-sm text-gray-700">
                                        {userData.firstName} {userData.lastName}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                    >
                                        <FontAwesomeIcon icon={faSignOut} className="mr-2" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}