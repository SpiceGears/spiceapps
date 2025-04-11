export default function Settings() {
    return (
        <div className="min-h-screen bg-gray-900 text-white pb-10">
            {/* Header with date */}
            <div className="w-full ml-10 py-6 mb-6 flex justify-between items-center">
                <h1 className="text-4xl font-semibold">Ustawienia</h1>
                <a href="/dashboard">
                    <button
                        type="button"
                        className="p-2 mr-12 w-12 h-12 text-gray-500 hover:text-white hover:bg-gray-800 rounded focus:outline-none flex items-center justify-center"
                        aria-label="Close"
                    >
                        <span className="text-3xl font-semibold leading-none" aria-hidden="true">
                            &times;
                        </span>
                    </button>
                </a>
            </div>

            {/* Settings content */}
            <div className="w-full h-screen bg-gray-900">
                <div className="w-full h-full px-4 py-4">
                    <div className="grid grid-cols-3 gap-6 h-full">
                        <div className="bg-gray-800 rounded-lg shadow-md p-4 col-span-1">
                            
                        </div>
                        <div className="bg-gray-800 rounded-lg shadow-md p-4 col-span-2">
                            Right
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}