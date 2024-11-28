'use client'
import React from "react";

const Dashboard = () => {
    async function getUserInfo() 
    {
        const atok = localStorage.getItem('atok');
        if (atok == null) return;

        try {
            const response = await fetch('/api/user/getInfo', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${atok}`
                }
            });
            if (!response.ok) {
                throw new Error('userGetData failed');
            }

            const data = await response.json();
            console.log(data); // Handle the response data as needed
        } catch (error) {
            console.error('Login error:', error);
            // Handle error appropriately (e.g., show error message to user)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            <header className="p-6 flex justify-between items-center">
                <h1 className="text-xl font-semibold">Home</h1>
                <button className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded-md">
                    Customize
                </button>
            </header>
            <main className="p-6">
                <div className="text-center mb-10">
                    <p className="text-sm text-gray-500">Thursday, November 28</p>
                    <h2 className="text-3xl font-bold mt-2">Dobry wieczór, (user)</h2>
                </div>
                <div className="flex items-center justify-center gap-4 text-sm mb-6">
                    <div className="bg-white shadow px-4 py-2 rounded-md flex items-center">
                        <span className="mr-2">Mój tydzień</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-4 h-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 15l3.75-3.75 3.75 3.75"
                            />
                        </svg>
                    </div>
                    <div className="bg-white shadow px-4 py-2 rounded-md">
                        wykonano 0 zadań
                    </div>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <h3 className="text-lg font-semibold">Moje zadania</h3>
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 text-gray-500 cursor-pointer"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 12h10.5m-10.5 0l3.375-3.375M6.75 12l3.375 3.375"
                            />
                        </svg>
                    </div>
                    <div className="flex justify-between text-gray-500 text-sm border-b border-gray-200 pb-4 mb-4">
                        <button className="text-gray-800 border-b-2 border-gray-800" onClick={getUserInfo}>
                            Nadchodzące
                        </button>
                        <button>Zaległe</button>
                        <button>Ukończone</button>
                    </div>
                    <button className="text-gray-500 flex items-center gap-2 hover:text-gray-800">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                            />
                        </svg>
                        Stwórz zadanie
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;