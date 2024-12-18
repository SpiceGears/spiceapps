"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Project {
    id: string;
    name: string;
    description: string;
    sTasks: string[];
    scopesRequired: string[];
    priority: string;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function getProjects() {
            const atok = localStorage.getItem('atok');
            if (!atok) {
                setError('Authentication token not found');
                return;
            }
            try {
                const response = await fetch('/api/project', {
                    method: 'GET',
                    headers: {
                        'Authorization': atok
                    }
                });
                const data = await response.json();
                console.log('API response:', data); // Log the response data
                if (data && Array.isArray(data.$values)) {
                    setProjects(data.$values);
                } else {
                    setError(data.error || 'Unexpected API response');
                }
            } catch (error) {
                setError('Error fetching projects');
            }
        }
        getProjects();
    }, []);

    const handleProjectClick = (projectId: string) => {
        router.push(`/dashboard/project/${projectId}`);
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Projekty</h1>
                </div>
                {/* Projects list */}
                {error ? (
                    <div className="px-4 py-3 text-red-500">{error}</div>
                ) : (
                    projects.map(project => (
                        <div
                            key={project.id}
                            className="grid grid-cols-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
                            onClick={() => handleProjectClick(project.id)}
                        >
                            <div>{project.name}</div>
                            <div>{project.description}</div>
                            <div>{project.priority}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}