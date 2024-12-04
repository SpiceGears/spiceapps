'use client';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

export default function CreateProject() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        department: ''
    });

    const isButtonDisabled = !formData.name || !formData.description;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    async function createProject(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
            const atok = localStorage.getItem('atok');
            
            if (!atok) {
                throw new Error('Authentication token not found');
            }
    
            const response = await fetch('/api/project/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': atok
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    scopes: formData.department ? [formData.department] : []
                })
            });
    
            // Get response content first
            const responseData = await response.text();
            console.log('Raw response:', responseData);
    
            if (!response.ok) {
                throw new Error(responseData || `HTTP error! status: ${response.status}`);
            }
    
            // For empty but successful response, get ID from headers
            const locationHeader = response.headers.get('location');
            if (locationHeader) {
                const projectId = locationHeader.split('/').pop();
                router.push(`/dashboard/project/${projectId}`);
                return;
            }
    
            // Try parsing response as JSON if not empty
            if (responseData) {
                try {
                    const data = JSON.parse(responseData);
                    if (data.id) {
                        router.push(`/dashboard/project/${data.id}`);
                        return;
                    }
                } catch (parseError) {
                    console.error('Parse error:', parseError);
                }
            }
    
            // Fallback to projects list if no ID found
            router.push('/dashboard/home');
    
        } catch (err) {
            console.error('Project creation error:', err);
            setError(err instanceof Error ? err.message : 'Failed to create project');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <button 
                onClick={() => router.back()}
                className="absolute top-4 left-4 p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
            </button>

            <div className="max-w-2xl mx-auto mt-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Stwórz nowy projekt</h1>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={createProject} className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nazwa projektu
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Wprowadź nazwę projektu"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Opis
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Opisz swój projekt"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Wydział
                                </label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Wybierz wydział</option>
                                    <option value="programmers">Programiści</option>
                                    <option value="mechanics">Mechanicy</option>
                                    <option value="marketing">Marketing</option>
                                    <option value="socialmedia">More Than Robots</option>
                                    <option value="executive">Zarządzanie</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isButtonDisabled || loading}
                            className={`mt-8 w-full p-2 rounded-md text-white ${
                                isButtonDisabled || loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {loading ? "Tworzenie..." : "Stwórz projekt"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}