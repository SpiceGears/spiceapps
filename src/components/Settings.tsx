import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Settings({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const [language, setLanguage] = useState('pl');

    // Wait for mounting to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    return (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Ustawienia</h2>
                        <button 
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                    Motyw
                                </label>
                                <select 
                                    value={theme}
                                    onChange={(e) => setTheme(e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 
                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                             focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                >
                                    <option value="light">Jasny</option>
                                    <option value="dark">Ciemny</option>
                                    <option value="system">Systemowy</option>
                                </select>
                            </div>

                            {/* Other settings remain the same */}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 
                                     hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
                        >
                            Anuluj
                        </button>
                        <button
                            className="px-4 py-2 text-sm text-white bg-blue-600 rounded 
                                     hover:bg-blue-700 transition-colors"
                            onClick={() => {
                                console.log('Saving settings:', { theme, language });
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