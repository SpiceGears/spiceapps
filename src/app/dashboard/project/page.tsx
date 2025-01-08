"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFlag} from "@fortawesome/free-solid-svg-icons";

interface Project {
    id: string;
    name: string;
    description: string;
    sTasks: string[];
    scopesRequired: string[];
    priority: number;
    status: number;
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
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
            <div className="p-6 max-w-6xl mx-auto">
                <div
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
                    {/* Header */}
                    <div
                        className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                        <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-100">Projekty</h1>
                    </div>
                    <div
                        className="grid grid-cols-4 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                        <div>Nazwa zadania</div>
                        <div>Status</div>
                        <div>Priorytet</div>
                        <div>Status</div>
                    </div>
                    {/* Projects list */}
                    {error ? (
                        <div className="px-4 py-3 text-red-500 dark:text-red-400">{error}</div>
                    ) : (
                        projects.map(project => (
                            <div
                                key={project.id}
                                className="grid grid-cols-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => handleProjectClick(project.id)}
                            >
                                <div className="text-gray-800 dark:text-gray-200">{project.name}</div>
                                <div className="text-gray-600 dark:text-gray-400">{project.description}</div>
                                <FontAwesomeIcon
                                    icon={faFlag}
                                    className={`w-4 h-4 ${
                                        project.priority === 0
                                            ? 'text-green-500 dark:text-green-400'
                                            : project.priority === 1
                                                ? 'text-orange-500 dark:text-orange-400'
                                                : project.priority === 2
                                                    ? 'text-red-500 dark:text-red-400'
                                                    : 'text-gray-400 dark:text-gray-500'
                                    } mr-2`}
                                />
                                <div className="text-gray-600 dark:text-gray-400">
                                    {project.status === -1
                                        ? 'Planowane'
                                        : project.status === 0
                                            ? 'W trakcie'
                                            : project.status === 1
                                                ? 'Skończone'
                                                : project.status === 2
                                                    ? 'Problem'
                                                    : 'Brak statusu'}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}