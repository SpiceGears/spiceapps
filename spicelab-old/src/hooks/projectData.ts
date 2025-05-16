// hooks/useProjectData.ts
import { useState, useEffect } from 'react';

export const useProjectData = (projectId) => {
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getProjectInfo() {
            const atok = localStorage.getItem('atok');
            if (!atok) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/project/${projectId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${atok}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Project data fetch failed');
                }

                const data = await response.json();
                setProjectData(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        if (projectId) {
            getProjectInfo();
        }
    }, [projectId]);

    return { projectData, loading, error };
};