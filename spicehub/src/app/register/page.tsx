"use client";
import Loading from '@/components/Loading';
import React, { useRef, useState } from 'react'
import { getBackendUrl } from '../serveractions/backend-url';
import { useRouter } from 'next/navigation';
import { ErrorRes } from '@/models/ErrorRes';

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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const firstName = useRef<HTMLInputElement | null>(null);
  const lastName = useRef<HTMLInputElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);
  const passwordConfirm = useRef<HTMLInputElement | null>(null);
  const department = useRef<HTMLSelectElement | null>(null);
  const email = useRef<HTMLInputElement | null>(null);
  const birthdayInput = useRef<HTMLInputElement | null>(null);

  function register() {
    if (password.current && passwordConfirm.current && password.current.value != passwordConfirm.current.value) {
      setError("Hasła nie są te same.")
      return;
    }

    const body: RegisterBody = {
      birthday: birthdayInput.current?.value ?? "",
      department: department.current?.value ?? "",
      email: email.current?.value ?? "",
      name: firstName.current?.value ?? "",
      surname: lastName.current?.value ?? "",
      password: password.current?.value ?? "",
    }

    registerFetch(body);


  }

  async function registerFetch(body: RegisterBody) {
    setLoading(true);
    const backend = await getBackendUrl();
    if (!backend) throw new Error("No Backend!");
    const res = await fetch(`${backend}/api/auth/register`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json"
        }
      });
    if (res.ok) {
      router.push("/unapproved");
    }
    else {
      setLoading(false);
      const error: ErrorRes = await res.json();
      setError(error.error);
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
                ref={firstName}
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
                ref={lastName}
                className="w-1/2 appearance-none px-3 py-2 border border-gray-300 dark:border-gray-600 
                placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 
                rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 
                focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm bg-white dark:bg-gray-700"
                placeholder="Nazwisko"
              />
            </div>

            {/* Birthday Field */}
            <div className='flex'>
              <p className='text-sm'>Data Urodzenia</p>
              <input
                id="birthday"
                name="birthday"
                type="date"
                required
                ref={birthdayInput}
                className="w-full appearance-none px-3 py-2 border border-gray-300 dark:border-gray-600 
                placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 
                rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 
                focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm bg-white dark:bg-gray-700"
                placeholder="Data urodzenia"
              />
            </div>

            {/* Email Field */}
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                ref={email}
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
                ref={password}
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
                ref={passwordConfirm}
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
                ref={department}
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
              onClick={() => { register() }}
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