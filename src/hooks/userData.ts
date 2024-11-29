// hooks/useUserData.ts
import { useState, useEffect } from 'react';

export const useUserData = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getUserInfo() {
            const atok = localStorage.getItem('atok');
            if (!atok) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/user/getInfo', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${atok}`
                    }
                });
                if (!response.ok) {
                    throw new Error('userGetData failed');
                }

                const data = await response.json();
                setUserData(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        getUserInfo();
    }, []);

    return { userData, loading, error };
};