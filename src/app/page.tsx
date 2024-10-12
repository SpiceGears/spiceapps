import Image from "next/image"; // Importing the Image component from Next.js

export default function Home() {
  return (
    // Main container to center the content vertically and horizontally
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Container to hold both the Login and Register forms side by side */}
      <div className="flex space-x-5">
        {/* Register form container */}
        <div className="w-full max-w-lg p-20 space-y-6 bg-white rounded shadow-md flex flex-col items-center">
          <h2 className="text-2xl font-bold text-center text-black">Rejestracja</h2>
          {/* Register form */}
          <form className="space-y-5" method="post">
            <div>
              {/* Username label and input field */}
              <label htmlFor="register-username" className="block text-sm font-medium text-gray-700">
                Nazwa użytkownika
              </label>
              <input
                type="text"
                id="register-username"
                name="register-username"
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              />
            </div>
            <div>
              {/* Email label and input field */}
              <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">
                Adres Email
              </label>
              <input
                type="email"
                id="register-email"
                name="register-email"
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              />
            </div>
            <div>
              {/* Password label and input field */}
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">
                Hasło
              </label>
              <input
                type="password"
                id="register-password"
                name="register-password"
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                //style={{ WebkitTextSecurity: 'disc' }}
              />
            </div>
            <div>
              {/* Confirm Password label and input field */}
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Potwierdź hasło
              </label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                //style={{ WebkitTextSecurity: 'disc' }}
              />
            </div>
            <div>
              {/* Dropdown menu for selecting a field */}
              <label htmlFor="field" className="block text-sm font-medium text-gray-700">
                Wybierz swój wydział
              </label>
              <select
                id="field"
                name="field"
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              >
                <option value="programista">Programista</option>
                <option value="mechanik">Mechanik</option>
                <option value="socialmedia">Social Media</option>
                <option value="zarzadanie">Zarządzanie</option>
                <option value="mentor">Mentor</option>
              </select>
            </div>
            {/* Register button */}
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Zarejestruj się
            </button>
          </form>
        </div>
        {/* Login form container */}
        <div className="w-full max-w-lg p-20 space-y-6 bg-white rounded shadow-md flex flex-col items-center">
          <h2 className="text-2xl font-bold text-center text-black">Logowanie</h2>
          {/* Login form */}
          <form className="space-y-4" method="post">
            <div>
              {/* Username label and input field */}
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Nazwa użytkownika
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              />
            </div>
            <div>
              {/* Password label and input field */}
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Hasło
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                //style={{ WebkitTextSecurity: 'disc' }}
              />
            </div>
            {/* Login button */}
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Zaloguj się
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}