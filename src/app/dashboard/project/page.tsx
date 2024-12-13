"use client"
import React, { useEffect, useState } from 'react';

interface Project {
    id: string;
    name: string;
    sTasks: string[];
    scopesRequired: string[];
    priority: string;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        async function getProjects() {
            const atok = localStorage.getItem('atok');
            if (!atok) {
                throw new Error('Authentication token not found');
            }
            const response = await fetch('/api/project', {
                method: 'GET',
                headers: {
                    'Authorization': atok
                }
            });
            const data = await response.json();
            setProjects(data);
        }
        getProjects();
    }, []);

    return (
        <div className="p-6 bg-white dark:bg-gray-800">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Projekty</h1>
                </div>
                {/* Projects list */}
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="grid grid-cols-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700"
                    >
                        <div>{project.name}</div>
                        <div>{project.owner}</div>
                        <div>{project.dueDate}</div>
                        <div>{project.priority}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
