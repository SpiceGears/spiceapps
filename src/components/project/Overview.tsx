import React, { useState } from 'react';
import { useProjectData } from '@/hooks/projectData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function Overview({ params: { projectId } }) {
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [editedDesc, setEditedDesc] = useState('');
    const { projectData, loading, error } = useProjectData(projectId);

    const toggleDescEditing = () => {
        setIsEditingDesc(!isEditingDesc);
        setEditedDesc(projectData?.description || '');
    };

    const handleDescChange = (e) => {
        setEditedDesc(e.target.value);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        Informacje o projekcie
                    </h2>
                    <div className="text-gray-600 dark:text-gray-400">
                        {isEditingDesc ? (
                            <input
                                type="text"
                                value={editedDesc}
                                onChange={handleDescChange}
                                onBlur={() => setIsEditingDesc(false)}
                                className="w-full p-2 border-b border-gray-300 dark:border-gray-600 
                                         focus:outline-none focus:border-blue-500 dark:focus:border-blue-400
                                         bg-transparent text-gray-900 dark:text-gray-100"
                                autoFocus
                            />
                        ) : (
                            <p 
                                className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                                onClick={toggleDescEditing}
                            >
                                {projectData?.description || 'Click to add project description...'}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Detale
                        </h3>
                        <div className="space-y-2">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Stworzony przez:
                                </span>
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                    {projectData?.creator || 'N/A'}
                                </span>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Data stworzenia:
                                </span>
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                    {projectData?.createdAt ? 
                                        new Date(projectData.createdAt).toLocaleDateString() : 
                                        'N/A'}
                                </span>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Członków:
                                </span>
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                    {projectData?.memberCount || 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Statystyki
                        </h3>
                        <div className="space-y-2">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Zadań ukończonych:
                                </span>
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                    {projectData?.completedTasks || '0'}
                                </span>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Zadań w toku:
                                </span>
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                    {projectData?.ongoingTasks || '0'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Dokumenty
                        </h3>
                        <button 
                            className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 
                                     rounded-lg text-gray-500 dark:text-gray-400 
                                     hover:text-gray-700 dark:hover:text-gray-200 
                                     hover:border-gray-400 dark:hover:border-gray-500 
                                     transition-colors duration-200 
                                     flex items-center justify-center
                                     bg-transparent"
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            Dodaj dokumenty
                        </button>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Zasoby
                        </h3>
                        <button 
                            className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 
                                     rounded-lg text-gray-500 dark:text-gray-400 
                                     hover:text-gray-700 dark:hover:text-gray-200 
                                     hover:border-gray-400 dark:hover:border-gray-500 
                                     transition-colors duration-200 
                                     flex items-center justify-center
                                     bg-transparent"
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            Dodaj zasoby
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}