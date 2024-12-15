"use client"
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useProjectData } from '../../hooks/projectData';
import Overview from './Overview';
import List from './List';

export default function ProjectNav({ activeTab, onTabChange, projectId }: { activeTab: string, onTabChange: (tab: string) => void, projectId: string }) {
    const [currentTab, setCurrentTab] = useState('Przegląd');
    const { projectData, loading, error } = useProjectData(projectId);
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState('');

    if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">Loading...</div>;
    if (error) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">Error: {error.message}</div>;

    const renderContent = () => {
        switch (currentTab) {
            case 'Przegląd':
                return <Overview params={{ projectId }} />;
            case 'Lista':
                return <List params={{ projectId, taskId: '' }} />;
            case 'Tablica':
            case 'Oś czasu':
            case 'Panel':
                return <div className="text-gray-600 dark:text-gray-400">Coming soon...</div>;
            default:
                return null;
        }
    };

    async function editProject() {
        const atok = localStorage.getItem('atok');
        if (!atok) {
            console.error('Authentication token not found');
            return;
        }

        try {
            const response = await fetch(`/api/project/${projectId}/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': atok
                },
                body: JSON.stringify({
                    name: editedName,
                    description: projectData.description,
                    scopes: projectData.scopes
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update project name');
            }

            const data = await response.json();
            console.log('Project updated:', data);

        } catch (error) {
            console.error('Error updating project:', error);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header Section */}
            <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded"></div>
                    {isEditingName ? (
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            onBlur={() => {
                                setIsEditingName(false);
                                if (editedName && editedName !== projectData?.name) {
                                    editProject();
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setIsEditingName(false);
                                    if (editedName && editedName !== projectData?.name) {
                                        editProject();
                                    }
                                }
                            }}
                            className="text-lg font-semibold text-gray-800 dark:text-gray-200 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                            autoFocus
                        />
                    ) : (
                        <span
                            className="text-lg font-semibold text-gray-800 dark:text-gray-200 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                            onClick={() => {
                                setIsEditingName(true);
                                setEditedName(projectData?.name || '');
                            }}
                        >
                            {projectData?.name || 'Click to add project name...'}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative inline-block text-left">
                        <button
                            className="px-4 py-2 text-sm font-medium text-white border border-gray-300 dark:border-gray-600
                                     rounded-md bg-blue-600 hover:bg-blue-700 focus:outline-none flex items-center gap-2"
                            onClick={(e) => {
                                const dropdown = document.getElementById('status-dropdown');
                                dropdown?.classList.toggle('hidden');
                                const svg = e.currentTarget.querySelector('svg');
                                svg?.classList.toggle('rotate-180');
                            }}
                        >
                            Status
                            <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div
                            id="status-dropdown"
                            className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800
                                     ring-1 ring-black ring-opacity-5 hidden"
                        >
                            <div className="py-1">
                                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200
                                                     hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                    W toku
                                </a>
                                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200
                                                     hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                                    Wstrzymane
                                </a>
                                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200
                                                     hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                    Anulowane
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center px-6 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                {['Przegląd', 'Lista', 'Tablica', 'Oś czasu', 'Panel'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setCurrentTab(tab)}
                        className={`px-3 py-1 rounded-md ${
                            tab === activeTab
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
                <button className="ml-auto text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                    <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                </button>
            </div>

            {/* Content Area */}
            <div className="p-6">
                {renderContent()}
            </div>
        </div>
    );
}