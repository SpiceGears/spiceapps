import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faFlag } from '@fortawesome/free-solid-svg-icons';
import { useProjectData } from '../../hooks/projectData';

export default function ProjectView({ params }: { params: { projectId: string } }) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const { projectData, loading, error } = useProjectData(params.projectId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-between px-2 py-2 sm:px-4 sm:py-3 border-b border-gray-200">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {['Filtruj', 'Sortuj', 'Grupuj', 'Opcje'].map((action) => (
              <button
                key={action}
                onClick={() => console.log(`${action} clicked`)}
                className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 px-2 py-1 rounded transition-colors duration-200"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 border-b border-gray-200">
          <div>Nazwa zadania</div>
          <div>Przypisane do</div>
          <div className="hidden sm:block">Termin</div>
          <div className="hidden sm:block">Priorytet</div>
        </div>

        {/* Table Rows */}
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200 hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-xs sm:text-sm text-gray-700">Zadanie testowe {item}</span>
            </div>
            <div className="flex items-center justify-start">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full"></div>
            </div>
            <div className="hidden sm:flex items-center">
              <FontAwesomeIcon icon={faCalendar} className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mr-2" />
              <span className="text-xs sm:text-sm text-gray-600">15 Mar 2024</span>
            </div>
            <div className="hidden sm:flex items-center">
              <FontAwesomeIcon icon={faFlag} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
            </div>
          </div>
        ))}

        {/* Add Task Row */}
        {isAddingTask ? (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-gray-300" disabled />
              <input
                type="text"
                className="w-full px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded"
                placeholder="Nazwa zadania..."
                name="name"
                autoFocus
              />
            </div>
            <div className="flex items-center justify-start">
              <select className="w-full px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded">
                <option value="">Wybierz osobę...</option>
              </select>
            </div>
            <div className="hidden sm:flex items-center">
              <input
                type="date"
                className="w-full px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded"
              />
            </div>
            <div className="hidden sm:flex items-center">
              <select className="px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded" defaultValue="">
                <option value="" disabled>Wybierz priorytet</option>
                <option value="low">Niski</option>
                <option value="medium">Średni</option>
                <option value="high">Wysoki</option>
              </select>
            </div>

            {/* Action buttons for add task */}
            <div className="col-span-1 sm:col-span-4 flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsAddingTask(false)}
                className="px-2 py-1 text-xs sm:text-sm text-gray-600 hover:text-gray-800"
              >
                Anuluj
              </button>
              <button
                className="px-2 py-1 text-xs sm:text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  // Handle task submission
                  setIsAddingTask(false);
                }}
              >
                Potwierdź
              </button>
            </div>
          </div>
        ) : (
          <div
            className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-500 hover:bg-gray-50 cursor-pointer"
            onClick={() => setIsAddingTask(true)}
          >
            + Dodaj zadanie...
          </div>
        )}
      </div>

      {/* Add Section Button */}
      <button className="mt-6 w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50">
        + Dodaj sekcję
      </button>
    </div>
  );
}