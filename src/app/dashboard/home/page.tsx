'use client'
import React, {useEffect} from "react";
import { useUserData } from "../../../hooks/userData"
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Project {
    id: string;
    name: string;
    description: string;
    sTasks: string[];
    scopesRequired: string[];
    priority: string;
}

const Dashboard = () => {
    const { userData, loading, error } = useUserData();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Mój tydzień');
    const [activeTab, setActiveTab] = useState('Nadchodzące');
    const [projects, setProjects] = useState<Project[]>([]);
    const router = useRouter();

    useEffect(() => {
        async function getProjects() {
            const atok = localStorage.getItem('atok');
            if (!atok) {
                console.log('Authentication token not found');
                return;
            }
            try {
                const response = await fetch('/api/project', {
                    method: 'GET',
                    headers: {
                        'Authorization': atok
                    }
                });
                const data = await response.json();
                console.log('API response:', data); // Log the response data
                if (data && Array.isArray(data.$values)) {
                    setProjects(data.$values);
                } else {
                    console.log(data.error || 'Unexpected API response');
                }
            } catch (error) {
                console.log('Error fetching projects', error);
            }
        }
        getProjects();
    }, []);

    if (loading) return <div className="text-gray-600 dark:text-gray-400">Loading...</div>;
    if (error) return <div className="text-red-600 dark:text-red-400">Error loading user data</div>;
    if (!userData) return <div className="text-gray-600 dark:text-gray-400">No user data available</div>;


    const handleSelect = (option) => {
        setSelectedOption(option);
        setDropdownOpen(false);
        // Wywołaj odpowiednią funkcję dla wybranej opcji
        console.log(`Wybrano: ${option}`);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleProjectClick = (projectId: string) => {
        router.push(`/dashboard/project/${projectId}`);
    };

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
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                        {new Date().toLocaleDateString('pl-PL', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </p>
                    <h2 className="text-5xl font-bold mt-2 text-gray-800 dark:text-gray-200">
                        {new Date().getHours() < 17 ? "Dzień dobry" : "Dobry wieczór"}, {userData?.firstName}
                    </h2>
                </div>

                {/* Stats Section */}
                <div className="flex items-center justify-center gap-4 text-sm mb-6">
                    <div className="relative">
                        <button
                            className="bg-white text-lg dark:bg-gray-800 shadow dark:shadow-gray-700 px-4 py-2 rounded-md flex items-center text-gray-800 dark:text-gray-200"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <span className="mr-2">{selectedOption}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                 stroke="currentColor"
                                 className={`w-4 h-4 transform ${dropdownOpen ? 'rotate-180' : ''}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15l3.75-3.75 3.75 3.75"/>
                            </svg>
                        </button>
                        {dropdownOpen && (
                            <div
                                className="absolute text-lg right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 z-10">
                                {['Mój tydzień', 'Mój miesiąc', 'Mój sezon', 'Lifetime'].map((option) => (
                                    <a
                                        key={option}
                                        href="#"
                                        onClick={() => handleSelect(option)}
                                        className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        {option}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                    <div
                        className="bg-white text-lg dark:bg-gray-800 shadow dark:shadow-gray-700 px-4 py-2 rounded-md text-gray-800 dark:text-gray-200">
                        Wykonano 9999 zadań
                    </div>
                </div>

                {/* Tasks Section */}
                <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700 rounded-lg p-6 mb-6">
                    <div
                        className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                        <div className="flex items-center gap-4">
                            <img
                                src={`https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=random&color=fff`}
                                alt={`${userData.firstName} ${userData.lastName}`}
                                className="w-10 h-10 rounded-full"
                            />
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Moje zadania</h3>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="w-6 h-6 text-gray-500 dark:text-gray-400 cursor-pointer">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M6.75 12h10.5m-10.5 0l3.375-3.375M6.75 12l3.375 3.375"/>
                        </svg>
                    </div>

                    <div
                        className="flex justify-start space-x-6 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                        {['Nadchodzące', 'Zaległe', 'Ukończone'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => handleTabClick(tab)}
                                className={`pb-2 ${activeTab === tab ? 'text-gray-800 dark:text-gray-200 border-b-2 border-gray-800 dark:border-gray-200' : 'hover:text-gray-700 dark:hover:text-gray-300'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/*<button className="text-gray-500 dark:text-gray-400 flex items-center gap-2 hover:text-gray-800 dark:hover:text-gray-200">*/}
                    {/*    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">*/}
                    {/*        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />*/}
                    {/*    </svg>*/}
                    {/*    Stwórz zadanie*/}
                    {/*</button>*/}
                </div>

                {/* Projects and People Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Projects Section */}
                    <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Projekty</h2>
                            <button
                                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                Ostatnie
                            </button>
                        </div>
                        <div className="space-y-4">
                            {/*<div className="flex items-center space-x-4">*/}
                            {/*    <div className="w-12 h-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500">*/}
                            {/*        +*/}
                            {/*    </div>*/}
                            {/*    <span className="text-sm text-gray-800 dark:text-gray-200">Stwórz projekt</span>*/}
                            {/*</div>*/}
                            {/* Projects list */}
                            <div
                                className="grid grid-cols-4 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <div>Nazwa projektu</div>
                                <div>Opis projektu</div>
                                <div>Status</div>
                                <div>Priorytet</div>
                            </div>
                            {error ? (
                                <div className="px-4 py-3 text-red-500">{error}</div>
                            ) : (
                                projects.map(project => (
                                    <div
                                        key={project.id}
                                        className="grid grid-cols-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
                                        onClick={() => handleProjectClick(project.id)}
                                    >
                                        <div>{project.name}</div>
                                        <div>{project.description}</div>
                                        {/*<div>{project.sTasks.length}</div>*/}
                                        <div>{project.priority}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/*/!* People Section *!/*/}
                    {/*<div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700 rounded-lg p-6">*/}
                    {/*    <div className="flex justify-between items-center mb-6">*/}
                    {/*        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Wydziały</h2>*/}
                    {/*    </div>*/}
                    {/*    <div className="space-y-4">*/}
                    {/*        {[*/}
                    {/*            { name: 'Programiści', color: 'bg-blue-200 dark:bg-blue-800' },*/}
                    {/*            { name: 'Mechanicy', color: 'bg-green-200 dark:bg-green-800' },*/}
                    {/*            { name: 'Zarządzanie', color: 'bg-purple-200 dark:bg-purple-800' }*/}
                    {/*        ].map((dept, idx) => (*/}
                    {/*            <div key={idx} className="flex items-center space-x-4">*/}
                    {/*                <div className={`w-12 h-12 ${dept.color} rounded-lg flex items-center justify-center`}>*/}
                    {/*                    <span className="font-semibold text-gray-800 dark:text-gray-200">{dept.name.charAt(0)}</span>*/}
                    {/*                </div>*/}
                    {/*                <span className="text-sm text-gray-800 dark:text-gray-200">{dept.name}</span>*/}
                    {/*            </div>*/}
                    {/*        ))}*/}
                    {/*    </div>*/}
                    {/*    <div className="mt-6">*/}
                    {/*        <button className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700">*/}
                    {/*            Zobacz więcej*/}
                    {/*        </button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;