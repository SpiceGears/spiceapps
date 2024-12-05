'use client'
// pages/logout.tsx

import React from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
    const router = useRouter();
    const rtb = localStorage.getItem('rtb');
    
    // Call logout on component mount
    React.useEffect(() => {
        if (rtb) {
            logout(rtb);
        } else {
            //router.push('/login');
        }
    }, []);
    const logout = async (rtb: string | null) => {
        try {
            const response = await fetch('/api/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': rtb // Remove template literal and Bearer prefix
                }
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            localStorage.removeItem('rtb');
            localStorage.removeItem('atok');
            router.push('/auth/login');
        } catch (error) {
            console.error('Logout error:', error);
            //router.push('/login');
        }
    };

    return null;
}