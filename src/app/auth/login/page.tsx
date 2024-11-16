'use client';
import Image from "next/image"; // Importing the Image component from Next.js
import Link from "next/link"; // Importing the Link component from Next.js
import { useRef } from "react";

export default function Login() {
  const logine = useRef(null);
  const password = useRef(null);
  
  
  async function login() 
  {
    if (logine == null || password == null) return;


    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({login: logine.current.value, password: password.current.value})
    });
    console.log("wiadommosc", response)
    localStorage.setItem("atok", JSON.parse(await response.json()).access_token)
    localStorage.setItem("rtb", JSON.parse(await response.json()).refresh_token)
  }
  
  return (
    // Main container to center the content vertically and horizontally
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      {/* Logo at the top center */}
      <div className="mb-8">
        <Image src="/images/logo.png" alt="Logo" width={300} height={300} />
      </div>
      {/* Container to hold both the Login and Register forms side by side */}
    <div className="flex space-x-5">
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
            ref={logine}
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
            ref={password}
          />
        </div>
        {/* Login button */}
        <button
          type="submit"
          className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={(e: any) => {e.preventDefault(); login()}}
        >
          Zaloguj się
        </button>
        </form>
        {/* Link to register page */}
        <p className="mt-4 text-sm text-gray-600">
        Nie masz konta? <Link href="/auth/register" className="text-indigo-600 hover:text-indigo-500">Zarejestruj się</Link>
        </p>
        <p className="mt-4 text-sm text-gray-600">
        Zapomniałeś hasła? <Link href="/auth/forgotpass" className="text-indigo-600 hover:text-indigo-500">Zresetuj hasło</Link>
        </p>
      </div>
    </div>
    </div>
  );
}