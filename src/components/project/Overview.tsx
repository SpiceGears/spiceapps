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
        <div className="bg-white rounded-lg shadow">
            <div className="p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Informacje o projekcie</h2>
                    <div className="text-gray-600">
                        {isEditingDesc ? (
                            <input
                                type="text"
                                className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                                value={editedDesc}
                                onChange={handleDescChange}
                                onBlur={toggleDescEditing}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.currentTarget.blur();
                                    }
                                }}
                                autoFocus
                            />
                        ) : (
                            <p 
                                className="cursor-pointer hover:text-blue-600"
                                onClick={toggleDescEditing}
                            >
                                {projectData?.description || 'Click to add project description...'}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Detale</h3>
                        <div className="space-y-2">
                            <div>
                                <span className="text-sm text-gray-500">Stoworzyny przez: </span>
                                <span className="ml-2 text-sm">{projectData?.creator || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Data stworzenia: </span>
                                <span className="ml-2 text-sm">
                                    {projectData?.createdAt ? new Date(projectData.createdAt).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Statystyki</h3>
                        <div className="space-y-2">
                            <div>
                                <span className="text-sm text-gray-500">Wykonane zadania: </span>
                                <span className="ml-2 text-sm">{projectData?.taskCount || 0}</span>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Członków: </span>
                                <span className="ml-2 text-sm">{projectData?.memberCount || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Dokumenty</h3>
                        <button 
                            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors duration-200 flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            Dodaj dokumenty
                        </button>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Zasoby</h3>
                        <button 
                            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors duration-200 flex items-center justify-center"
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