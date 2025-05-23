import React, { useEffect, useState } from 'react';
import { useProjectData } from '@/hooks/projectData';
import { toast } from 'react-hot-toast';
import Loading from '@/components/Loading';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    roles: string[] | null; // Make roles nullable in the type
    department: string;
    birthDate: string;
    isApproved: boolean;
}

export default function Overview({ params: { projectId } }) {
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [editedDesc, setEditedDesc] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const { projectData, loading, error } = useProjectData(projectId);
    const [userError, setError] = useState<string>('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleDescEditing = () => {
        setIsEditingDesc(!isEditingDesc);
        setEditedDesc(projectData?.description || '');
    };

    const handleDescChange = (e) => {
        setEditedDesc(e.target.value);
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
                    name: projectData.name,
                    description: editedDesc,
                    scopes: []
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update project description');
            }

            const data = await response.json();
            console.log('Project updated:', data);
            toast.success('Project description updated successfully');

        } catch (error) {
            console.error('Error updating project:', error);
            toast.error('Failed to update project description');
        }
    }

    const handleApiError = (error: unknown, defaultMessage: string) => {
        console.error(defaultMessage, error);
        const errorMessage = error instanceof Error ? error.message : defaultMessage;
        setError(errorMessage);
        setTimeout(() => setError(''), 5000); // Clear error after 5 seconds
    };

    const fetchUsers = async () => {
        try {
            const atok = localStorage.getItem('atok');
            if (!atok) throw new Error('Authentication token not found');

            const response = await fetch('/api/user/getAll', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${atok}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            const fetchedUsers = data.$values ?? [];
            setUsers(fetchedUsers);

        } catch (error) {
            handleApiError(error, 'Failed to fetch users');
            setUsers([]);
        }
    };

    if (loading) return <Loading />;
    if (error) return <div>Error: {error}</div>;

    const creator = users.find(user => user.id === projectData?.creator);

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
                                onBlur={() => {
                                    setIsEditingDesc(false);
                                    if (editedDesc && editedDesc !== projectData?.description) {
                                        editProject();
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setIsEditingDesc(false);
                                        if (editedDesc && editedDesc !== projectData?.description) {
                                            editProject();
                                        }
                                    }
                                }}
                                className="text-lg font-semibold text-gray-800 dark:text-gray-200 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
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
                                    {creator ? (
                                        <div key={creator.id} className="flex items-center gap-1">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${creator.firstName}+${creator.lastName}&background=random&color=fff`}
                                                alt={`${creator.firstName} ${creator.lastName}`}
                                                className="w-6 h-6 rounded-full"
                                            />
                                            <span className="text-gray-600 dark:text-gray-200">{`${creator.firstName} ${creator.lastName}`}</span>
                                        </div>
                                    ) : 'N/A'}
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
            </div>
        </div>
    );
}