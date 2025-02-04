'use client';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import Image from 'next/image';
import * as Sentry from '@sentry/nextjs';

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
})

export default function Login() {
  const router = useRouter();
  const logine = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function login() {
    if (!logine?.current?.value || !password?.current?.value) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: logine.current.value,
          password: password.current.value
        })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      if (data.access_Token && data.refresh_Token) {
        localStorage.setItem("atok", data.access_Token);
        localStorage.setItem("rtb", data.refresh_Token);
        router.push('/dashboard/home');
      } else {
        throw new Error('Invalid token data received');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid login credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Image 
            src="/images/spicelab.png"
            alt="SpiceLab Logo"
            width={300}
            height={100}
            className="mx-auto dark:brightness-90"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
            Zaloguj się do konta
          </h2>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="login" className="sr-only">Email</label>
              <input
                id="login"
                name="login"
                type="text"
                ref={logine}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                         placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 
                         rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 
                         focus:border-blue-500 dark:focus:border-blue-400 focus:z-10 sm:text-sm
                         bg-white dark:bg-gray-700"
                placeholder="Login"
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

          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              onClick={login}
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent 
                       text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-500 
                       hover:bg-blue-700 dark:hover:bg-blue-600 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logowanie...' : 'Zaloguj się'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}