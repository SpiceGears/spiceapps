import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useProjectData } from "../../hooks/projectData";

export default function Overview({ params }: { params: { projectId: string } }) {
    const { projectData, loading, error } = useProjectData(params.projectId);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                <main className="w-3/4 p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Opis projektu</h2>
                        <p className="text-gray-600 mt-2">{projectData?.description}</p>
                    </div>

                    <div className="mb-10">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Role projektowe</h3>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                <span className="mr-2">+</span> Dodaj rolę
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Kluczowe zasoby</h3>
                            <div className="flex items-center gap-4">
                                <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    <span className="mr-2">+</span> Dodaj zasób
                                </button>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Dokumenty</h3>
                            <div className="flex items-center gap-4">
                                <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    <span className="mr-2">+</span> Dodaj dokument
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                <aside className="w-1/4 min-h-screen px-6 py-8 bg-gray-100 border-l border-gray-200">       
                    <div className="mt-10 text-gray-600">
                        <h4 className="font-semibold mb-4">Historia projektu</h4>
                        <p className="mb-4">comming soon</p>
                    </div>
                </aside>
            </div>
        </div>
    );
}