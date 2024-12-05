import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

export default function Settings({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [language, setLanguage] = useState('pl');
    const [theme, setTheme] = useState('light');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                {/* Modal Content */}
                <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Ustawienia</h2>
                        <button 
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Close"
                        >
                            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        <div className="space-y-6">
                            {/* Language Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Język
                                </label>
                                <select 
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                >
                                    <option value="pl">Polski</option>
                                    <option value="en">English</option>
                                </select>
                            </div>

                            {/* Theme Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Motyw
                                </label>
                                <select 
                                    value={theme}
                                    onChange={(e) => setTheme(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                >
                                    <option value="light">Jasny</option>
                                    <option value="dark">Ciemny</option>
                                    <option value="system">Systemowy</option>
                                </select>
                            </div>

                            {/* Email Notifications */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Powiadomienia email
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            Nowe zadania
                                        </span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            Komentarze
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Anuluj
                        </button>
                        <button
                            className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                            onClick={() => {
                                // Save settings logic here
                                console.log('Saving settings:', { language, theme });
                                onClose();
                            }}
                        >
                            Zapisz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}