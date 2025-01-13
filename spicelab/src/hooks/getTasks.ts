// hooks/useProjectData.ts
import { useState, useEffect } from 'react';

export const useGetTasksData = (projectId) => {
    const [getTasks, setGetTasksData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getGetTasksData() {
            const atok = localStorage.getItem('atok');
            if (!atok) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/project/${projectId}/getTasks`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${atok}`
                    }
                });
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(errorData?.message || `Failed with status: ${response.status}`);
                }

                const data = await response.json();
                setGetTasksData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        }

        if (projectId) {
            getGetTasksData();
        }
    }, [projectId]);

    return { tasks: getTasks, setGetTasksData, loading, error };
};