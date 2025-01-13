'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
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
          department: formData.department,
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      router.push('/auth/login');
    } catch (error) {
      console.error('Registration error:', error);
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

  const [errors, setErrors] = useState<string[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep = () => {
    const newErrors: string[] = [];
    if (step === 1) {
      if (!formData.email) newErrors.push('Email is required.');
      if (!formData.password) newErrors.push('Password is required.');
      if (formData.password !== formData.confirmPassword)
        newErrors.push('Passwords do not match.');
    } else if (step === 2) {
      if (!formData.name) newErrors.push('Name is required.');
      if (!formData.surname) newErrors.push('Surname is required.');
      if (!formData.dateOfBirth) newErrors.push('Date of birth is required.');
      if (!formData.phoneNumber) newErrors.push('Phone number is required.');
    } else if (step === 3) {
      if (!formData.department) newErrors.push('Department is required.');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      register(formData);
    }
  };

  return (
      <div className={`flex justify-center items-center min-h-screen p-5 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <form onSubmit={handleSubmit} className="max-w-md w-full p-5 rounded-lg shadow-md bg-white dark:bg-gray-800">
          <div className="flex justify-center mb-4">
            <img
                src={theme === 'dark' ? '/images/spicelab-dark.png' : '/images/spicelab.png'}
                alt="SpiceLab Logo"
                className="w-32"
            />
          </div>

          {errors.length > 0 && (
              <div className="mb-4 text-sm text-red-500">
                {errors.map((error, index) => (
                    <p key={index}>{error}</p>
                ))}
              </div>
          )}

          {step === 1 && (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold">Krok 1: Szczegóły konta</h2>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Hasło"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Potwierdź Hasło"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                />
                <button type="button" onClick={handleNext} className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600">
                  Dalej
                </button>
              </div>
          )}

          {step === 2 && (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold">Krok 2: Dane osobiste</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Imię"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                />
                <input
                    type="text"
                    name="surname"
                    placeholder="Nazwisko"
                    value={formData.surname}
                    onChange={handleInputChange}
                    required
                    className="p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                />
                <label htmlFor="dateOfBirth" className="text-sm text-gray-600 dark:text-gray-400">
                  Data urodzenia
                </label>
                <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    className="p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                />
                <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Numer Telefonu"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                />
                <div className="flex justify-between gap-4">
                  <button type="button" onClick={handlePrevious} className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600">
                    Wróć
                  </button>
                  <button type="button" onClick={handleNext} className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600">
                    Dalej
                  </button>
                </div>
              </div>
          )}

          {step === 3 && (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold">Krok 3: Wybierz swój dział</h2>
                <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className="p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                >
                  <option value="">Wybierz swój dział</option>
                  <option value="mechanic">Mechanik</option>
                  <option value="programmer">Programista</option>
                  <option value="socialmedia">More Than Robots</option>
                  <option value="executive">Zarządzanie</option>
                  <option value="marketing">Marketing</option>
                  <option value="mentor">Mentor</option>
                </select>
                <div className="flex justify-between gap-4">
                  <button type="button" onClick={handlePrevious} className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600">
                    Wróć
                  </button>
                  <button type="submit" className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600">
                    Zarejestruj się
                  </button>
                </div>
              </div>
          )}
        </form>
      </div>
  );
}