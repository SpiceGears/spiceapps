'use client';
import { useState } from 'react';

export default function RegisterPage() {

  async function register(formData: {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    surname: string;
    dateOfBirth: string;
    phoneNumber: string;
    department: string;
  }) {
    if (formData.password !== formData.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          surname: formData.surname,
          dateOfBirth: formData.dateOfBirth,
          phoneNumber: formData.phoneNumber,
          department: formData.department
        })
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
    } catch (error) {
      console.error('Registration error:', error);
      // Handle error appropriately (e.g., show error message to user)
    }
  }

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    surname: '',
    dateOfBirth: '',
    phoneNumber: '',
    department: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
            Zarejestruj się
          </h1>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Krok 1: Dane osobiste
            </h2>

            <div>
              <input
                type="text"
                name="name"
                placeholder="Imię"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 
                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                                             placeholder-gray-500 dark:placeholder-gray-400
                                             focus:ring-blue-500 dark:focus:ring-blue-400 
                                             focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>

            <div>
              <input
                type="text"
                name="surname"
                placeholder="Nazwisko"
                value={formData.surname}
                onChange={handleInputChange}
                required
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 
                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                                             placeholder-gray-500 dark:placeholder-gray-400
                                             focus:ring-blue-500 dark:focus:ring-blue-400 
                                             focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data urodzenia
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 
                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                                             focus:ring-blue-500 dark:focus:ring-blue-400 
                                             focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>

            <div>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Numer telefonu"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 
                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                                             placeholder-gray-500 dark:placeholder-gray-400
                                             focus:ring-blue-500 dark:focus:ring-blue-400 
                                             focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>

            <div>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 
                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                                             focus:ring-blue-500 dark:focus:ring-blue-400 
                                             focus:border-blue-500 dark:focus:border-blue-400"
              >
                <option value="">Wybierz wydział</option>
                <option value="programmers">Programiści</option>
                <option value="mechanics">Mechanicy</option>
                <option value="marketing">Marketing</option>
                <option value="socialmedia">More Than Robots</option>
                <option value="executive">Zarządzanie</option>
              </select>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                                             shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 
                                             hover:bg-blue-700 dark:hover:bg-blue-600 
                                             focus:outline-none focus:ring-2 focus:ring-offset-2 
                                             focus:ring-blue-500 dark:focus:ring-offset-gray-900"
              >
                Dalej
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Krok 2: Dane logowania
            </h2>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 
                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                                             placeholder-gray-500 dark:placeholder-gray-400
                                             focus:ring-blue-500 dark:focus:ring-blue-400 
                                             focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Hasło"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 
                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                                             placeholder-gray-500 dark:placeholder-gray-400
                                             focus:ring-blue-500 dark:focus:ring-blue-400 
                                             focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>

            <div>
              <input
                type="password"
                name="repeatPassword"
                placeholder="Powtórz hasło"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 
                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                                             placeholder-gray-500 dark:placeholder-gray-400
                                             focus:ring-blue-500 dark:focus:ring-blue-400 
                                             focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 
                                             rounded-md shadow-sm text-sm font-medium 
                                             text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 
                                             hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Wstecz
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm 
                                             text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 
                                             hover:bg-blue-700 dark:hover:bg-blue-600 
                                             focus:outline-none focus:ring-2 focus:ring-offset-2 
                                             focus:ring-blue-500 dark:focus:ring-offset-gray-900
                                             disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Zarejestruj się
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}