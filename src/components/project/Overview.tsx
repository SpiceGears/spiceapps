import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function Overview() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded"></div>
                    <span className="text-lg font-semibold text-gray-800">SpiceLab</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-4 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700">
                        Ustaw status
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center px-6 py-2 bg-white border-b border-gray-200">
                {['Przegląd', 'Lista', 'Tablica', 'Oś czasu', 'Panel', 'Gantt', 'Obciążenie'].map((tab) => (
                    <button
                        key={tab}
                        className={`px-3 py-1 rounded-md ${
                            tab === 'Przegląd'
                                ? 'bg-gray-100 text-gray-800'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
                <button className="ml-auto text-gray-600 hover:text-gray-800">
                    <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                </button>
            </div>

            <div className="flex">
                <main className="w-3/4 p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Opis projektu</h2>
                        <p className="text-gray-600 mt-2">Czego dotyczy ten projekt?</p>
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
                    <h3 className="text-xl font-semibold mb-6 text-gray-800">Status projektu</h3>
                    <div className="flex flex-col gap-4">
                        <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                            W trakcie
                        </button>
                        <button className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500">
                            Zagrożone
                        </button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                            Opóźnione
                        </button>
                    </div>
                    
                    <div className="mt-10 text-gray-600">
                        <h4 className="font-semibold mb-4">Historia projektu</h4>
                        <p className="mb-4">Zespół dołączył - 9 dni temu</p>
                        <p className="mb-4">Dołączyłeś - 9 dni temu</p>
                        <p>Projekt utworzony przez - Jan Kowalski</p>
                    </div>
                </aside>
            </div>
        </div>
    );
}