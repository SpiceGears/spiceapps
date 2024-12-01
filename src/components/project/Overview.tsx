import React from 'react';

export default function Overview({}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="flex justify-between items-center px-8 py-4 border-b border-gray-200 bg-white">
                <h1 className="text-lg font-semibold text-gray-800">Testowy projekt</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Dostosuj
                </button>
            </header>

            <nav className="border-b border-gray-200 px-8 py-4 bg-white">
                <div className="flex gap-6">
                    <a href="#" className="text-gray-600 hover:text-blue-600">Przegląd</a>
                    <a href="#" className="text-gray-600 hover:text-blue-600">Lista</a>
                    <a href="#" className="text-gray-600 hover:text-blue-600">Tablica</a>
                    <a href="#" className="text-gray-600 hover:text-blue-600">Oś czasu</a>
                    <a href="#" className="text-gray-600 hover:text-blue-600">Panel</a>
                </div>
            </nav>

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
                        <p>Projekt utworzony przez - Michał Kulik</p>
                    </div>

                    <div className="mt-10">
                        <h4 className="font-semibold mb-4 text-gray-800">Szybkie akcje</h4>
                        <div className="flex flex-col gap-3">
                            <button className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50">
                                Dodaj zadanie
                            </button>
                            <button className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50">
                                Ustawienia projektu
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}