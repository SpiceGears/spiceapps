import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser, faCalendar, faFlag } from '@fortawesome/free-solid-svg-icons';

export default function List() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded"></div>
          <span className="text-lg font-semibold text-gray-800">Projekt testowy</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700">
            Ustaw status
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center px-6 py-2 bg-white border-b border-gray-200">
        {['Przegląd', 'Lista', 'Tablica', 'Oś czasu', 'Panel'].map((tab) => (
          <button
            key={tab}
            className={`px-3 py-1 rounded-md ${tab === 'Lista'
                ? 'bg-gray-100 text-gray-800'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
          >
            {tab}
          </button>
        ))}
        <button className="ml-auto text-gray-600 hover:text-gray-800">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      {/* Table Section */}
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
              + Dodaj zadanie
            </button>
            <div className="flex gap-4">
              {['Filtruj', 'Sortuj', 'Grupuj', 'Opcje'].map((action) => (
                <button
                  key={action}
                  className="text-gray-600 hover:text-gray-800 px-2"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-4 px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-50 border-b border-gray-200">
            <div>Nazwa zadania</div>
            <div>Przypisane do</div>
            <div>Termin</div>
            <div>Priorytet</div>
          </div>

          {/* Table Rows */}
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="grid grid-cols-4 px-4 py-3 border-b border-gray-200 hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Zadanie testowe {item}</span>
              </div>
              <div className="flex items-center justify-start">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-gray-500" />
                </div>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-600">15 Mar 2024</span>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faFlag} className="w-4 h-4 text-yellow-500" />
              </div>
            </div>
          ))}

          {/* Add Task Row */}
          <div className="px-4 py-3 text-gray-500 hover:bg-gray-50 cursor-pointer">
            + Dodaj zadanie...
          </div>
        </div>

        {/* Add Section Button */}
        <button className="mt-4 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50">
          + Dodaj sekcję
        </button>
      </div>
    </div>
  );
}