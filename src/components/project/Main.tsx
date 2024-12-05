import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useProjectData } from '@/hooks/projectData';
import Overview from '@/components/project/Overview';
import List from '@/components/project/List';

export default function ProjectNav({ activeTab, onTabChange, projectId }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const { projectData, loading, error } = useProjectData(projectId);

    const toggleEditing = () => {
        setIsEditing(!isEditing);
        setEditedName(projectData?.name || '');
    };

    const handleNameChange = (e) => {
        setEditedName(e.target.value);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Przegląd':
                return <Overview params={{ projectId }} />;
            case 'Lista':
                return <List params={{ projectId, taskId: '' }} />;
            case 'Tablica':
                return <div>coming soon</div>;
            case 'Oś czasu':
                return <div>coming soon</div>;
            case 'Panel':
                return <div>coming soon</div>;
            default:
                return <Overview params={{ projectId }} />;
        }
    };

    const tabs = ['Przegląd', 'Lista', 'Tablica', 'Oś czasu', 'Panel'];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <FontAwesomeIcon 
                                icon={faFolder} 
                                className="text-blue-500 h-5 w-5"
                            />
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="text-lg font-semibold text-gray-800 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                                    value={editedName}
                                    onChange={handleNameChange}
                                    onBlur={toggleEditing}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.currentTarget.blur();
                                        }
                                    }}
                                    autoFocus
                                />
                            ) : (
                                <h1 
                                    className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
                                    onClick={toggleEditing}
                                >
                                    {projectData?.name}
                                </h1>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative inline-block text-left">
                                <button
                                    className="px-4 py-2 text-sm font-medium text-white border border-gray-300 rounded-md bg-blue-600 hover:bg-blue-700 focus:outline-none flex items-center gap-2"
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
                                    className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden z-10"
                                >
                                    <div className="py-1">
                                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                            W toku
                                        </a>
                                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                                            Wstrzymane
                                        </a>
                                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                            Anulowane
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex space-x-8 -mb-px">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => onTabChange(tab)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {renderTabContent()}
            </main>
        </div>
    );
}