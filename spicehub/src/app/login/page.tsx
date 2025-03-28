"use client"

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Loading from "@/components/Loading";

export default function LoginPage() {
    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function login() {
        setLoading(true);
        setError(null);
        const payload = {
            email: email.current?.value,
            password: password.current?.value,
        };
    
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            // Check for non-success responses
            if (!res.ok) {
                const errorData = await res.json();
                setError(errorData.message || 'Invalid login credentials');
                return; // exit early if login failed
            }
    
            const data = await res.json();
    
            if (data.refreshToken && data.accessToken) {
                localStorage.setItem('refreshToken', data.refreshToken);
                localStorage.setItem('accessToken', data.accessToken);
                router.push('/dashboard');
            } else {
                setError('Invalid login credentials');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError('Invalid login credentials');
        } finally {
            setLoading(false);
        }
    }
    return(
         <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
              <div className="text-center">
                <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
                Zaloguj się do konta
                </h2>
              </div>

              <div className="mt-8 space-y-6">
                <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    ref={email}
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                         placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 
                         rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 
                         focus:border-blue-500 dark:focus:border-blue-400 focus:z-10 sm:text-sm
                         bg-white dark:bg-gray-700"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Hasło</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    ref={password}
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                         placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 
                         rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 
                         focus:border-blue-500 dark:focus:border-blue-400 focus:z-10 sm:text-sm
                         bg-white dark:bg-gray-700"
                    placeholder="Hasło"
                  />
                </div>
                </div>

                <div>
                <button
                  onClick={login}
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent 
                         text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-500 
                         hover:bg-blue-700 dark:hover:bg-blue-600 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                >
                  {loading ? 'Logowanie...' : 'Zaloguj się'}
                </button>
                </div>
                {error && (
                    <div className="text-red-600 dark:text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}
                {loading && (
                    <Loading />
                )}
              </div>
            </div>
            </div>
    )
}