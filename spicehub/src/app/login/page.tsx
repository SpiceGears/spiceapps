"use client"

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Loading from "@/components/Loading";
import { getBackendUrl } from "../serveractions/backend-url";

import { getCookie, setCookie} from 'typescript-cookie';
import Link from "next/link";
export default function LoginPage() {
    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
      let rt = getCookie("refreshToken");
      if (rt) router.push("/dashboard")
    
      return () => {
      }
    }, [])
    

    async function login() {
        setLoading(true);
        setError(null);
        const payload = {
            login: email.current?.value,
            password: password.current?.value,
        };

        let backendurl = await getBackendUrl();
        if (!backendurl) alert("env var error");
    
        try {
            const res = await fetch(backendurl+'/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            // Check for non-success responses
            if (!res.ok) {
                const errorData = await res.text();
                console.log(errorData);
                setError(errorData || 'Invalid login credentials');
                return; // exit early if login failed
            }
    
            const data = await res.json();
    
            if (data.refresh_Token && data.access_Token) {
                //localStorage.setItem('refreshToken', data.refresh_Token);
                //localStorage.setItem('accessToken', data.access_Token);
                let ad = new Date();
                ad.setDate(ad.getDate() + 2);
                setCookie("refreshToken", data.refresh_Token, {expires: 30});
                setCookie("accessToken", data.access_Token, {expires: ad})
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

                <div className="text-center">
                <button
                  onClick={login}
                  disabled={loading}
                  className="group relative w-full mb-8 flex justify-center py-2 px-4 border border-transparent 
                         text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-500 
                         hover:bg-blue-700 dark:hover:bg-blue-600 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                >
                  {loading ? 'Logowanie...' : 'Zaloguj się'}
                </button>
                <Link href="/register" className="mt-5 text-blue-600 dark:text-blue-500
                         hover:text-blue-700 dark:hover:text-blue-600">Nie masz konta? Zarejestruj się tutaj.</Link>
                <br/>
                <Link href="/forgotPassword" className="mt-5 text-blue-600 dark:text-blue-500 
                         hover:text-blue-700 dark:hover:text-blue-600">Zapomniałeś hasła?</Link>
                
                
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