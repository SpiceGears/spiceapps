'use client';

import React, { useRef, useState } from 'react'
import Link from "next/link";
import { toast } from 'sonner';
import { api } from '@/services/api';

const page = () => {
  const email = useRef<HTMLInputElement>(null);
  const recoveryCode = useRef<HTMLInputElement>(null);
  const newPassword = useRef<HTMLInputElement>(null);
  const confirmPassword = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email.current || !recoveryCode.current || !newPassword.current || !confirmPassword.current) {
      toast.error("Wszystkie pola są wymagane");
      return;
    }
    if (newPassword.current.value !== confirmPassword.current.value) {
      toast.error("Hasła nie są zgodne");
      return;
    }
    setLoading(true);

    try {
      const res = await api.recoverPasswordViaKey({
        email: email.current.value,
        resetCode: recoveryCode.current.value,
        newPassword: newPassword.current.value,
      });
      if (res.ok) {
        setLoading(false);
        toast.success("Hasło zostało zresetowane pomyślnie");
      } else {
        setLoading(false);
        const errorText = await res.text();
        toast.error("Nie udało się zresetować hasła: " + errorText);
      }
    }
    catch (error) {
      setLoading(false);
      toast.error("Nie udało się zresetować hasła: " + (error as Error).message);
      return;
    }


    // Placeholder for reset logic
    // On success: toast.success("Hasło zostało zresetowane pomyślnie");
    // On failure: toast.error("Nie udało się zresetować hasła");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
            Resetuj hasło
          </h2>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
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
              <label htmlFor="recoveryCode" className="sr-only">Kod odzyskiwania</label>
              <input
                id="recoveryCode"
                name="recoveryCode"
                type="text"
                ref={recoveryCode}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                                     placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 
                                     rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 
                                     focus:border-blue-500 dark:focus:border-blue-400 focus:z-10 sm:text-sm
                                     bg-white dark:bg-gray-700"
                placeholder="Kod odzyskiwania"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="sr-only">Nowe hasło</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                ref={newPassword}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                                     placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 
                                     rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 
                                     focus:border-blue-500 dark:focus:border-blue-400 focus:z-10 sm:text-sm
                                     bg-white dark:bg-gray-700"
                placeholder="Nowe hasło"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Potwierdź hasło</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                ref={confirmPassword}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                                     placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 
                                     rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 
                                     focus:border-blue-500 dark:focus:border-blue-400 focus:z-10 sm:text-sm
                                     bg-white dark:bg-gray-700"
                placeholder="Potwierdź hasło"
              />
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="group relative w-full mb-8 flex justify-center py-2 px-4 border border-transparent 
                                   text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-500 
                                   hover:bg-blue-700 dark:hover:bg-blue-600 
                                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
            >
              {loading ? 'Resetowanie...' : 'Resetuj hasło'}
            </button>
            <Link href="/login" className="mt-5 text-blue-600 dark:text-blue-500
                                   hover:text-blue-700 dark:hover:text-blue-600">Powrót do logowania</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page