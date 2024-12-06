'use client'
import React from "react";
import { useUserData } from "../../../hooks/userData"

const Dashboard = () => {
    const { userData, loading, error } = useUserData();

    if (loading) return <div className="text-gray-600 dark:text-gray-400">Loading...</div>;
    if (error) return <div className="text-red-600 dark:text-red-400">Error loading user data</div>;
    if (!userData) return <div className="text-gray-600 dark:text-gray-400">No user data available</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
            <header className="p-6 flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Home</h1>
                <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm px-4 py-2 rounded-md text-gray-800 dark:text-gray-200">
                    Coming soon
                </button>
            </header>
            
            <main className="p-6">
                {/* Greeting Section */}
                <div className="text-center mb-10">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date().toLocaleDateString('pl-PL', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </p>
                    <h2 className="text-3xl font-bold mt-2 text-gray-800 dark:text-gray-200">
                        {new Date().getHours() < 17 ? "Dzień dobry" : "Dobry wieczór"}, {userData?.firstName}
                    </h2>
                </div>

                {/* Stats Section */}
                <div className="flex items-center justify-center gap-4 text-sm mb-6">
                    <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700 px-4 py-2 rounded-md flex items-center text-gray-800 dark:text-gray-200">
                        <span className="mr-2">Mój tydzień</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15l3.75-3.75 3.75 3.75" />
                        </svg>
                    </div>
                    <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700 px-4 py-2 rounded-md text-gray-800 dark:text-gray-200">
                        Wykonano 9999 zadań
                    </div>
                </div>

                {/* Tasks Section */}
                <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700 rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Moje zadania</h3>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-gray-500 dark:text-gray-400 cursor-pointer">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12h10.5m-10.5 0l3.375-3.375M6.75 12l3.375 3.375" />
                        </svg>
                    </div>
                    
                    <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                        <button className="text-gray-800 dark:text-gray-200 border-b-2 border-gray-800 dark:border-gray-200">Nadchodzące</button>
                        <button>Zaległe</button>
                        <button>Ukończone</button>
                    </div>
                    
                    <button className="text-gray-500 dark:text-gray-400 flex items-center gap-2 hover:text-gray-800 dark:hover:text-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Stwórz zadanie
                    </button>
                </div>

                {/* Projects and People Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Projects Section */}
                    <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Projekty</h2>
                            <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                Ostatnie
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500">
                                    +
                                </div>
                                <span className="text-sm text-gray-800 dark:text-gray-200">Stwórz projekt</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-pink-500 dark:bg-pink-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-xl">≡</span>
                                </div>
                                <span className="text-sm text-gray-800 dark:text-gray-200">test</span>
                            </div>
                        </div>
                    </div>

                    {/* People Section */}
                    <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Wydziały</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: 'Programiści', color: 'bg-blue-200 dark:bg-blue-800' },
                                { name: 'Mechanicy', color: 'bg-green-200 dark:bg-green-800' },
                                { name: 'Zarządzanie', color: 'bg-purple-200 dark:bg-purple-800' }
                            ].map((dept, idx) => (
                                <div key={idx} className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 ${dept.color} rounded-lg flex items-center justify-center`}>
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">{dept.name.charAt(0)}</span>
                                    </div>
                                    <span className="text-sm text-gray-800 dark:text-gray-200">{dept.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <button className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700">
                                Zobacz więcej
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;