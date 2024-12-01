"use client"
import { faBell, faMessage, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { useUserData } from '../hooks/userData';

export default function Navbar() {
    const { userData, loading, error } = useUserData();

    if (loading) return <div>Loading...</div>;
    if (error) {
        generateAccess()
        return <div>Error loading user data</div>;
    }
    if (!userData) return <div>No user data available</div>;

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
                    'Authorization': `Bearer ${rtb}`,
                },
                body: JSON.stringify({ rtb })
            });

            console.log('Response status:', response.status);
            if (response.status === 401) {
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error data:', errorData);
                throw new Error(errorData.message || 'Failed to generate access token');
            }

            const data = await response.json();
            console.log('Response data:', data);
            if (data.accessToken) {
                localStorage.setItem('atok', data.accessToken);
            } else {
                throw new Error('Invalid response format');
            }

        } catch (error) {
            console.error('generateAccess error:', error);
        }
    }

    return (
        <div className="flex items-center justify-between p-4 bg-gray-200 w-full h-16">
            <Link href="/dashboard/home" className="flex items-center h-full">
                <div className="flex items-center justify-center">
                    <Image src="/images/spicelab.png" alt="icon" width={120} height={50} className="object-contain" />
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
                <div className="flex flex-col"></div>
                    <span className="text-xs leading-3 font-medium">{userData?.firstName} {userData?.lastName}</span>
                    <span className="text-[13px] text-gray-500 text-right">{userData?.coins} SpiceCoins</span>
                </div>
                <Image src="/icons/avatar.png" alt="Avatar" width={40} height={40} className="rounded-full" />
            </div>
    );
}