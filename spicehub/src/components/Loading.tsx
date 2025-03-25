const Loading = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="relative">
                {/* Outer Circle */}
                <div className="w-12 h-12 rounded-full absolute border-8 border-gray-200 dark:border-gray-700"></div>

                {/* Inner Circle with Spinning Animation */}
                <div className="w-12 h-12 rounded-full animate-spin absolute border-8 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent"></div>

                {/* Optional Text */}
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default Loading;