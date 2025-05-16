'use client'
// pages/logout.tsx

import React from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
    const router = useRouter();

    React.useEffect(() => {
        // Ensure this code runs only in the browser
        if (typeof window !== 'undefined') {
            const rtb = localStorage.getItem('rtb');

            if (rtb) {
                logout(rtb);
            } else {
                router.push('/auth/login');
            }
        }
    }, []);

    const logout = async (rtb: string | null) => {
        try {
            const response = await fetch('/api/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': rtb
                },
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            localStorage.removeItem('rtb');
            localStorage.removeItem('atok');
            router.push('/auth/login');
        } catch (error) {
            console.error('Logout error:', error);
            router.push('/auth/login');
        }
    };

    return null;
}
