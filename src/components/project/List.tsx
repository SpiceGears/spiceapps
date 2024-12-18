import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faFlag, faUser } from '@fortawesome/free-solid-svg-icons';
import { useProjectData } from '../../hooks/projectData';
import { useGetTasksData } from '@/hooks/getTasks';

export default function List({ params }: { params: { projectId: string, taskId: string } }) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editedTaskId, setEditedTaskId] = useState<number | null>(null);
  const [taskForm, setTaskForm] = useState({
    name: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'low'
  });
  const [users, setUsers] = useState<{ id: string, firstName: string, lastName: string }[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  const { projectData, loading: projectLoading, error: projectError } = useProjectData(params.projectId);
  const { loading: tasksLoading, error: tasksError } = useGetTasksData(params.projectId);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const atok = localStorage.getItem('atok');
        if (!atok) throw new Error('No authentication token found');

        const response = await fetch(`/api/project/${params.projectId}/getUsers`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': atok
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        if (data && Array.isArray(data.$values)) {
          setUsers(data.$values);
        } else {
          console.error('Invalid data format:', data);
          throw new Error('Invalid data format');
        }

      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    async function fetchTasks() {
      try {
        const atok = localStorage.getItem('atok');
        if (!atok) throw new Error('No authentication token found');

        const response = await fetch(`/api/project/${params.projectId}/getTasks`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': atok
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();
        if (data && Array.isArray(data.$values)) {
          setTasks(data.$values);
        } else {
          console.error('Invalid data format:', data);
          throw new Error('Invalid data format');
        }

      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }

    fetchUsers();
    fetchTasks();
  }, [params.projectId]);

  if (projectLoading || tasksLoading) return <div className="text-gray-600 dark:text-gray-400">Loading...</div>;
  if (projectError || tasksError) return <div className="text-red-600 dark:text-red-400">Error: {projectError?.message || tasksError?.message}</div>;

  const handleTaskClick = (task: any) => {
    setTaskForm({
      name: task.name,
      description: task.description,
      assignedTo: task.assignedUsers[0] || '',
      dueDate: task.dueDate,
      priority: task.priority
    });
    setEditedTaskId(task.id);
    setIsAddingTask(true);
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

      const response = await fetch(`/api/project/${params.projectId}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': atok
        },
        body: JSON.stringify({
          name: taskForm.name,
          description: taskForm.description,
          assignedUsers: [taskForm.assignedTo],
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

  async function updateTask() {
    try {
      const atok = localStorage.getItem('atok');
      if (!atok) throw new Error('No authentication token found');

      const response = await fetch(`/api/project/${params.projectId}/${editedTaskId}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': atok
        },
        body: JSON.stringify({
          name: taskForm.name,
          description: taskForm.description,
          assignedUsers: [taskForm.assignedTo],
          priority: taskForm.priority,
          dependencies: [params.projectId]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      setTaskForm({
        name: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        priority: 'low'
      });
      setEditedTaskId(null);
      setIsAddingTask(false);

    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  return (
      <div className="p-6 bg-white dark:bg-gray-800">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <button
                onClick={() => setIsAddingTask(true)}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              + Dodaj zadanie
            </button>
            <div className="flex gap-4">
              {['Filtruj', 'Sortuj', 'Grupuj', 'Opcje'].map((action) => (
                  <button
                      key={action}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-2"
                  >
                    {action}
                  </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <div>Nazwa zadania</div>
            <div>Przypisane do</div>
            <div>Termin</div>
            <div>Priorytet</div>
          </div>

          {isAddingTask && (
              <div className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <input
                      type="text"
                      name="name"
                      value={taskForm.name}
                      onChange={handleInputChange}
                      placeholder="Nazwa zadania"
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <select
                      name="assignedTo"
                      value={taskForm.assignedTo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Wybierz osobę</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{`${user.firstName} ${user.lastName}`}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                      type="date"
                      name="dueDate"
                      value={taskForm.dueDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <select
                      name="priority"
                      value={taskForm.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="low">Niski</option>
                    <option value="medium">Średni</option>
                    <option value="high">Wysoki</option>
                  </select>
                </div>
                <div className="col-span-4 flex justify-end gap-2">
                  <button
                      onClick={() => {
                        setIsAddingTask(false);
                        setEditedTaskId(null);
                      }}
                      className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Anuluj
                  </button>
                  <button
                      onClick={editedTaskId ? updateTask : createTask}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Zapisz
                  </button>
                </div>
              </div>
          )}

          {tasks.map(task => (
              <div
                  key={task.id}
                  className="grid grid-cols-4 px-4 py-3 border-b border-gray-200 hover:bg-gray-50"
                  onClick={() => handleTaskClick(task)}
              >
                <div className="flex items-center gap-2">
                  <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{task.name}</span>
                </div>
                <div className="flex items-center justify-start">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">{task.dueDate}</span>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faFlag} className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
          ))}

          <div
              onClick={() => setIsAddingTask(true)}
              className="px-4 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
          >
            + Dodaj zadanie...
          </div>
        </div>
      </div>
  );
}