import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faFlag } from '@fortawesome/free-solid-svg-icons';
import { useProjectData } from '../../hooks/projectData';
import { useGetTasksData } from '@/hooks/getTasks';

export default function ProjectView({ params }: { params: { projectId: string, taskId: string } }) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editedTaskId, setEditedTaskId] = useState<number | null>(null);
  const [taskForm, setTaskForm] = useState({
    name: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'low'
  });

  const { projectData, loading: projectLoading, error: projectError } = useProjectData(params.projectId);
  const { loading: tasksLoading, error: tasksError } = useGetTasksData(params.projectId);
  const { projectId } = params;

  if (projectLoading || tasksLoading) return <div>Loading...</div>;
  if (projectError || tasksError) return <div>Error: {projectError?.message || tasksError?.message || 'Unknown error'}</div>;

  const handleTaskClick = (taskId: number) => {
    if (editedTaskId !== taskId) setEditedTaskId(taskId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  async function createTask() {
    try {
      const atok = localStorage.getItem('atok');
      if (!atok) throw new Error('No authentication token found');

      const response = await fetch(`/api/project/${projectId}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': atok
        },
        body: JSON.stringify({
          name: taskForm.name,
          description: taskForm.description,
          assignedUsers: ["eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"],
          //dueDate: taskForm.dueDate,
          priority: taskForm.priority,
          dependencies: [params.projectId]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      setTaskForm({
        name: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        priority: 'low'
      });
      setIsAddingTask(false);

    } catch (error) {
      console.error('Error creating task:', error);
    }
  }

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

        {/* Add Task Form */}
        {isAddingTask && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
            <div>
              <input
                type="text"
                name="name"
                value={taskForm.name}
                onChange={handleInputChange}
                placeholder="Nazwa zadania"
                className="w-full px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <select
                name="assignedTo"
                value={taskForm.assignedTo}
                onChange={handleInputChange}
                className="w-full px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded"
              >
                <option value="">Wybierz osobę</option>
                <option>Użytkownik 1</option>
                <option>Użytkownik 2</option>
              </select>
            </div>
            <div className="hidden sm:block">
              <input
                type="date"
                name="dueDate"
                value={taskForm.dueDate}
                onChange={handleInputChange}
                className="w-full px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded"
              />
            </div>
            <div className="hidden sm:block">
              <select
                name="priority"
                value={taskForm.priority}
                onChange={handleInputChange}
                className="w-full px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded"
              >
                <option value="low">Niski</option>
                <option value="medium">Średni</option>
                <option value="high">Wysoki</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-4 flex justify-end gap-2">
              <button
                onClick={() => setIsAddingTask(false)}
                className="px-2 py-1 text-xs sm:text-sm text-gray-600 hover:text-gray-800"
              >
                Anuluj
              </button>
              <button
                onClick={createTask}
                className="px-2 py-1 text-xs sm:text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Zapisz
              </button>
            </div>
          </div>
        )}

        {/* Add Task Button */}
        <div 
          onClick={() => setIsAddingTask(true)}
          className="px-4 py-3 text-gray-500 hover:bg-gray-50 cursor-pointer"
        >
          + Dodaj zadanie...
        </div>
      </div>
    </div>
  );
}