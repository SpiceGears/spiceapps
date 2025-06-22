"use client";
import Loading from '@/components/Loading';
import React, { useRef, useState } from 'react'

export type RegisterBody = 
{
  email: string,
  password: string,
  name: string,
  surname: string,
  birthday: string,
  department: string,
}


const page = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined)

  const firstName = useRef<HTMLInputElement | undefined>(undefined);
  const lastName = useRef<HTMLInputElement | undefined>(undefined);
  const password = useRef<HTMLInputElement | undefined>(undefined);
  const passwordConfirm = useRef<HTMLInputElement | undefined>(undefined);
  const department = useRef<HTMLInputElement | undefined>(undefined);
  const email = useRef<HTMLInputElement | undefined>(undefined);

  function register() 
  {
    if (password.current && passwordConfirm.current && password.current.value != passwordConfirm.current.value) 
    {
      setError("Hasła nie są te same.")
      return;
    }

    
  }

  
return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
          Zarejestruj nowe konto
        </h2>
      </div>

      <div className="mt-8 space-y-6">
        <div className="rounded-md shadow-sm space-y-4">
          {/* First + Last Name Row */}
          <div className="flex gap-4">
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="w-1/2 appearance-none px-3 py-2 border border-gray-300 dark:border-gray-600 
                placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 
                rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 
                focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm bg-white dark:bg-gray-700"
              placeholder="Imię"
            />
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="w-1/2 appearance-none px-3 py-2 border border-gray-300 dark:border-gray-600 
                placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 
                rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 
                focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm bg-white dark:bg-gray-700"
              placeholder="Nazwisko"
            />
          </div>

          {/* Email Field */}
          <div>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full appearance-none px-3 py-2 border border-gray-300 dark:border-gray-600 
                placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 
                rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 
                focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm bg-white dark:bg-gray-700"
              placeholder="Email"
            />
          </div>

          {/* Password + Confirm Password Row */}
          <div className="flex gap-4">
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-1/2 appearance-none px-3 py-2 border border-gray-300 dark:border-gray-600 
                placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 
                rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 
                focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm bg-white dark:bg-gray-700"
              placeholder="Hasło"
            />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="w-1/2 appearance-none px-3 py-2 border border-gray-300 dark:border-gray-600 
                placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 
                rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 
                focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm bg-white dark:bg-gray-700"
              placeholder="Potwierdź hasło"
            />
          </div>

          {/* Department Dropdown */}
          <div>
            <select
              id="department"
              name="department"
              required
              className="w-full appearance-none px-3 py-2 border border-gray-300 dark:border-gray-600 
                text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 
                rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 
                focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm"
            >
              <option value="">Wybierz dział</option>
              <option value="mechanic">Mechanicy</option>
              <option value="programmer">Programiści</option>
              <option value="socialmedia">Social Media</option>
              <option value="marketing">Marketing</option>
              <option value="executive">Zarządzanie</option>
              <option value="mentor">Mentorat</option>
            </select>
          </div>
        </div>

        {/* Register Button */}
        <div>
          <button
            onClick={() => {register()}}
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent 
              text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-500 
              hover:bg-blue-700 dark:hover:bg-blue-600 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
          >
            {loading ? 'Rejestrowanie...' : 'Zarejestruj się'}
          </button>
        </div>
        {error && (
                    <div className="text-red-600 dark:text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}
        {loading && <Loading />}
      </div>
    </div>
  </div>
);

}

export default page