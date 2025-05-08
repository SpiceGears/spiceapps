import { useMemo } from "react";

function getGreeting() {
    const hour = new Date().getHours(); 
    if (hour < 18) return "Dzień dobry"; 
    if (hour < 22) return "Dobry wieczór"; 
    return "Dobranoc"; // Good night
}

export default function Welcome() {
    const today = useMemo(() =>
        new Date().toLocaleDateString('pl-PL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }), []);

    const greeting = useMemo(getGreeting, []);

    return (
        <div className="w-full bg-gradient-to-r from-white via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 py-8 mb-8 shadow-lg rounded-xl">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">{greeting} 👋</h1>
                    <p className="text-lg text-gray-700 dark:text-gray-300">{today}</p>
                </div>
            </div>
        </div>
    );
}