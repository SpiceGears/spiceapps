'use client';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

export default function CreateProject() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department: ''
  });

  const isButtonDisabled = !formData.name || !formData.description;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your submit logic here
  };

  async function createProject() {
    try {
      const atok = localStorage.getItem('atok');
      const { name, description, department } = formData;
      const response = await fetch('/api/project/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${atok}`
        },
        body: JSON.stringify({ 
          name, 
          description, 
          scopes: department ? [department] : [] 
        })
      });
      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      router.push('/dashboard/project/' + data.id);
    } catch (error) {
      console.error('Create project error:', error);
      // Handle error appropriately (e.g., show error message
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 p-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
      </button>

      <div className="max-w-2xl mx-auto mt-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Stwórz nowy projekt</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nazwa projektu
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Wprowadź nazwę projektu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opis
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Opisz swój projekt"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dział
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Wybierz dział</option>
                  <option value="mechanics">Mechanicy</option>
                  <option value="programmers">Programiści</option>
                  <option value="socialmedia">More Than Robots</option>
                  <option value="executive">Zarządzanie</option>
                  <option value="marketing">Marketing</option>
                  <option value="all">Wszyscy</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isButtonDisabled}
              className={`mt-8 w-full p-2 rounded-md text-white ${isButtonDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={createProject}
            >
              Stwórz projekt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}