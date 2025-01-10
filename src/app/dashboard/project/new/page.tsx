'use client';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

interface FormData {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    department: string;
}

export default function CreateProject() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        department: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const errors: string[] = [];
        if (!formData.name.trim()) errors.push('Nazwa projektu jest wymagana.');
        if (!formData.description.trim()) errors.push('Opis projektu jest wymagany.');
        if (!formData.department) errors.push('Dział projektu jest wymagany.');

        setValidationErrors(errors);
        return errors.length === 0;
    };

    async function createProject(e: React.FormEvent) {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const atok = localStorage.getItem('atok');

            if (!atok) {
                throw new Error('Authentication token not found');
            }

            // if (formData.department === "all") {
            //     setFormData(prev => ({
            //         ...prev,
            //         department: ""
            //     }));
            // }

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

            const responseData = await response.text();
            console.log('Raw response:', responseData);

            if (!response.ok) {
                throw new Error(responseData || `HTTP error! status: ${response.status}`);
            }

            const locationHeader = response.headers.get('location');
            if (locationHeader) {
                const projectId = locationHeader.split('/').pop();
                router.push(`/dashboard/project/${projectId}`);
                return;
            }

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

            router.push('/dashboard/home');

        } catch (err) {
            console.error('Project creation error:', err);
            setError(err instanceof Error ? err.message : 'Failed to create project');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <button
                onClick={() => router.back()}
                className="absolute top-4 left-4 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
            </button>

            <div className="max-w-2xl mx-auto mt-12">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8">
                    Stwórz nowy projekt
                </h1>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded">
                        {error}
                    </div>
                )}

                {validationErrors.length > 0 && (
                    <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400 rounded">
                        <ul>
                            {validationErrors.map((err, index) => (
                                <li key={index}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={createProject} className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Nazwa projektu
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md
                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                             focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                    placeholder="Wprowadź nazwę projektu"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Opis
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md
                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                             focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                    placeholder="Opisz swój projekt"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Dział
                                </label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md
                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                             focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                                >
                                    <option value="">Wybierz wydział</option>
                                    <option value="all">Project drużynowy</option>
                                    <option value="department.programmers">Programiści</option>
                                    <option value="department.mechanics">Mechanicy</option>
                                    <option value="department.marketing">Marketing</option>
                                    <option value="department.socialmedia">More Than Robots</option>
                                    <option value="department.executive">Zarządzanie</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`mt-8 w-full p-2 rounded-md text-white ${
                                loading
                                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
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