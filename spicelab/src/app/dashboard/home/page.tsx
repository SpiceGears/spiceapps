'use client'
import React, { useEffect, useState } from "react";
import { useUserData } from "@/hooks/userData";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";

interface Project {
    id: string;
    name: string;
    description: string;
    sTasks: string[];
    scopesRequired: string[];
    priority: number;
    status: number;
}

interface Task {
    id: string;
    projectId: string;
    name: string;
    status: number;
    priority: number;
    percentage: number;
    created: string;
    deadlineDate: string;
    finished: string | null;
}

const Dashboard = () => {
    const { userData, loading, error } = useUserData();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Mój tydzień');
    const [activeTab, setActiveTab] = useState('Nadchodzące');
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [doneTasksCount, setDoneTasksCount] = useState(0);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
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

    useEffect(() => {
        if (userData) {
            fetchUserTasks(userData.id);
            getDoneTasks(userData.id, 'week');
        }
    }, [userData]);

    useEffect(() => {
        let filtered = [];
        if (activeTab === 'Nadchodzące') {
            filtered = tasks; // Adjust the condition based on your status values
        } else if (activeTab === 'Zaległe') {
            filtered = tasks.filter(task => task.deadlineDate > new Date().toISOString().split('T')[0]); // Adjust the condition based on your status values
        } else if (activeTab === 'Ukończone') {
            filtered = tasks.filter(task => task.status === 1); // Adjust the condition based on your status values
        }
        setFilteredTasks(filtered);
    }, [activeTab, tasks]);

    const fetchUserTasks = async (userId: string) => {
        try {
            const atok = localStorage.getItem('atok');
            const response = await fetch(`/api/user/${userId}/getAssignedTasks`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${atok}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch user tasks');
            const data = await response.json();
            setTasks(data.$values ?? []);
        } catch (error) {
            console.error('Error fetching user tasks:', error);
        }
    };

    const getDoneTasks = async (userId: string, period: string) => {
        try {
            const atok = localStorage.getItem('atok');
            const response = await fetch(`/api/user/${userId}/finishedTasks`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${atok}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch done tasks');
            const data = await response.json();
            const now = new Date();
            let filteredTasks = data.$values;

            if (period === 'week') {
                const lastWeek = new Date(now.setDate(now.getDate() - 7));
                filteredTasks = data.$values.filter(task => new Date(task.finished) >= lastWeek);
            } else if (period === 'month') {
                const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
                filteredTasks = data.$values.filter(task => new Date(task.finished) >= lastMonth);
            } else if (period === 'season') {
                const lastSeason = new Date(now.setMonth(now.getMonth() - 3));
                filteredTasks = data.$values.filter(task => new Date(task.finished) >= lastSeason);
            }

            setDoneTasksCount(filteredTasks.length);
        } catch (error) {
            console.error('Error fetching done tasks:', error);
        }
    };

    const getTotalDoneTasks = async (userId: string) => {
        try {
            const atok = localStorage.getItem('atok');
            const response = await fetch(`/api/user/${userId}/finishedTasks/count`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${atok}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch total done tasks');
            const data = await response.json();
            setDoneTasksCount(data.count);
        } catch (error) {
            console.error('Error fetching total done tasks:', error);
        }
    };

    if (loading) return <div className="text-gray-600 dark:text-gray-400">Loading...</div>;
    if (error) return <div className="text-red-600 dark:text-red-400">Error loading user data</div>;
    if (!userData) return <div className="text-gray-600 dark:text-gray-400">No user data available</div>;

    const handleSelect = (option) => {
        setSelectedOption(option);
        setDropdownOpen(false);
        let period = 'week';
        if (option === 'Mój miesiąc') period = 'month';
        else if (option === 'Mój sezon') period = 'season';
        else if (option === 'Lifetime') {
            getTotalDoneTasks(userData.id);
            return;
        }
        getDoneTasks(userData.id, period);
        console.log(`Wybrano: ${option}`);
    };

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const handleProjectClick = (projectId: string) => {
        router.push(`/dashboard/project/${projectId}`);
    };

    return (
        <div className="z-20 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans p-4 md:p-6">
            <header className="p-4 md:p-6 flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Home</h1>
                <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm px-4 py-2 rounded-md text-gray-800 dark:text-gray-200">
                    Coming soon
                </button>
            </header>

            <main className="p-4 md:p-6">
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
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm mb-6">
                    <div className="relative">
                        <button
                            className="bg-white text-lg dark:bg-gray-800 shadow dark:shadow-gray-700 px-4 py-2 rounded-md flex items-center text-gray-800 dark:text-gray-200 z-[10000]"
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
                        Wykonano {doneTasksCount} zadań
                    </div>
                </div>

                {/* Tasks and Projects Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Tasks Section */}
                    <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700 rounded-lg p-4 md:p-6">
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
                                 stroke="currentColor"
                                 className="w-6 h-6 text-gray-500 dark:text-gray-400 cursor-pointer">
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

                        <div className="space-y-4">
                            <div
                                className="grid grid-cols-3 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <div>Nazwa zadania</div>
                                <div>Status</div>
                                <div>Priorytet</div>
                            </div>
                            {filteredTasks.length === 0 ? (
                                <div className="px-4 py-3 text-gray-500 dark:text-gray-400">Brak zada��</div>
                            ) : (
                                filteredTasks.map(task => (
                                    <div
                                        key={task.id}
                                        className="grid grid-cols-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
                                    >
                                        <div className="truncate">{task.name}</div>
                                        <div>{task.status === -1 ? 'Planowane' : task.status === 0 ? 'W trakcie' : task.status === 1 ? 'Skończone' : task.status === 2 ? 'Problem' : 'Brak statusu'}</div>
                                        <FontAwesomeIcon
                                            icon={faFlag}
                                            className={`w-4 h-4 ${
                                                task.priority === 0
                                                    ? 'text-green-500 dark:text-green-400'
                                                    : task.priority === 1
                                                        ? 'text-orange-500 dark:text-orange-400'
                                                        : task.priority === 2
                                                            ? 'text-red-500 dark:text-red-400'
                                                            : 'text-gray-400 dark:text-gray-500'
                                            } mr-2`}
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Projects Section */}
                    <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700 rounded-lg p-4 md:p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Projekty</h2>
                            <button
                                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                Ostatnie
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div
                                className="grid grid-cols-4 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <div>Nazwa projektu</div>
                                <div>Opis projektu</div>
                                <div>Status</div>
                                <div>Priorytet</div>
                            </div>
                            {projects.length === 0 ? (
                                <div className="px-4 py-3 text-gray-500 dark:text-gray-400">Brak projektów</div>
                            ) : (
                                projects.map(project => (
                                    <div
                                        key={project.id}
                                        className="grid grid-cols-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
                                        onClick={() => handleProjectClick(project.id)}
                                    >
                                        <div className="truncate">{project.name}</div>
                                        <div className="truncate">{project.description}</div>
                                        <div>{project.status === -1 ? 'Planowane' : project.status === 0 ? 'W trakcie' : project.status === 1 ? 'Skończone' : project.status === 2 ? 'Problem' : 'Brak statusu'}</div>
                                        <FontAwesomeIcon
                                            icon={faFlag}
                                            className={`w-4 h-4 ${
                                                project.priority === 0
                                                    ? 'text-green-500 dark:text-green-400'
                                                    : project.priority === 1
                                                        ? 'text-orange-500 dark:text-orange-400'
                                                        : project.priority === 2
                                                            ? 'text-red-500 dark:text-red-400'
                                                            : 'text-gray-400 dark:text-gray-500'
                                            } mr-2`}
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;