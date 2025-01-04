import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faFlag } from '@fortawesome/free-solid-svg-icons';
import { useProjectData } from '@/hooks/projectData';
import { useGetTasksData } from '@/hooks/getTasks';

interface Task {
  id: number;
  name: string;
  description: string;
  assignedUsers: AssignedUsers;
  dueDate: string;
  deadlineDate: string;
  priority: number;
  status: number;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

interface AssignedUsers {
  $id: string;
  $values: string[];
}

export default function List({ params }: { params: { projectId: string, taskId: string } }) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editedTaskId, setEditedTaskId] = useState<number | null>(null);
  const [taskForm, setTaskForm] = useState({
    name: '',
    description: '',
    assignedUser: '',
    deadlineDate: '',
    priority: 0,
    status: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const { loading: projectLoading, error: projectError } = useProjectData(params.projectId);
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
    fetchUsers()
  }, [params.projectId]);

  useEffect(() => {
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
        console.log('Fetched tasks:', data); // Debug fetched tasks

        if (data && Array.isArray(data.$values)) {
          const tasks = data.$values.map((task: any) => ({
            ...task,
          }));
          setTasks(tasks);
          console.log('Tasks with assigned users:', tasks); // Debug tasks with assigned users
        } else {
          console.error('Invalid data format:', data);
          throw new Error('Invalid data format');
        }

      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }

    fetchTasks();
  }, [params.projectId]);

  const handleTaskClick = (task: Task) => {
    console.log('Task clicked:', task); // Debug task click
    setTaskForm({
      name: task.name,
      description: task.description,
      assignedUser: task.assignedUsers.$values[0] || '',
      deadlineDate: task.deadlineDate || '',
      priority: task.priority,
      status: task.status
    });
    setEditedTaskId(task.id);
    setIsAddingTask(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Field: ${name}, Value: ${value}`);  // Debug input change
    setTaskForm(prev => ({
      ...prev,
      [name]: name === 'priority' || name === 'status' ? parseInt(value) : value
    }));
  };

  const resetTaskForm = () => {
    setTaskForm({
      name: '',
      description: '',
      assignedUser: '',
      deadlineDate: '',
      priority: 0,
      status: 0
    });
  };

  const handleAddTaskClick = () => {
    resetTaskForm();
    setEditedTaskId(null);
    setIsAddingTask(true);
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
          assignedUsers: taskForm.assignedUser ? [taskForm.assignedUser] : [],
          priority: taskForm.priority,
          deadlineDate: taskForm.deadlineDate,
          status: taskForm.status,
          dependencies: []
        })
      });
      console.log('Task payload:', {
        name: taskForm.name,
        description: taskForm.description,
        assignedUsers: taskForm.assignedUser ? [taskForm.assignedUser] : [],
        priority: taskForm.priority,
        deadlineDate: taskForm.deadlineDate,
        status: taskForm.status
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      resetTaskForm();
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
          assignedUsers: taskForm.assignedUser ? [taskForm.assignedUser] : [],
          priority: taskForm.priority,
          deadlineDate: taskForm.deadlineDate,
          dependencies: [],
          status: taskForm.status
        })
      });
      console.log('Update task payload:', {
        name: taskForm.name,
        description: taskForm.description,
        assignedUsers: taskForm.assignedUser ? [taskForm.assignedUser] : [],
        priority: taskForm.priority,
        deadlineDate: taskForm.deadlineDate,
        status: taskForm.status
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      resetTaskForm();
      setEditedTaskId(null);
      setIsAddingTask(false);

    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  async function deleteTask() {
    try {
      const atok = localStorage.getItem('atok');
      if (!atok) throw new Error('No authentication token found');

      const response = await fetch(`/api/project/${params.projectId}/${editedTaskId}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': atok
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      resetTaskForm();
      setEditedTaskId(null);
      setIsAddingTask(false);

    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  const assignedUserIds: string[] = [];

  tasks.forEach(task => {
    if (Array.isArray(task.assignedUsers.$values)) {
      task.assignedUsers.$values.forEach(userId => {
        assignedUserIds.push(userId);
      });
    }
  });

  if (projectLoading || tasksLoading) return <div className="text-gray-600 dark:text-gray-400">Loading...</div>;
  if (projectError || tasksError) return <div className="text-red-600 dark:text-red-400">Error: {projectError?.message || tasksError?.message}</div>;

  return (
      <div className="p-6 bg-white dark:bg-gray-800">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <button
                onClick={handleAddTaskClick}
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

          <div className="grid grid-cols-5 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <div>Nazwa zadania</div>
            <div>Przypisane do</div>
            <div>Termin</div>
            <div>Priorytet</div>
            <div>Status</div>
          </div>

          {isAddingTask && (
              <div className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
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
                      name="assignedUser"
                      value={taskForm.assignedUser}
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
                      name="deadlineDate"
                      value={taskForm.deadlineDate}
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
                    <option value="0">Niski</option>
                    <option value="1">Średni</option>
                    <option value="2">Wysoki</option>
                  </select>
                </div>
                <div>
                  <select
                      name="status"
                      value={taskForm.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="-1">Planowane</option>
                    <option value="0">W trakcie</option>
                    <option value="1">Skończone</option>
                    <option value="2">Problem</option>
                  </select>
                </div>
                <div className="col-span-5 flex justify-end gap-2">
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
                      onClick={deleteTask}
                      className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Usuń
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
                  className={`grid grid-cols-5 px-4 py-3 border-b border-gray-200 hover:bg-gray-50 ${task.status === 1 ? 'bg-green-100' : ''}`}
                  onClick={() => handleTaskClick(task)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">{task.name}</span>
                </div>
                <div className="flex items-center justify-start">
                  {Array.isArray(task?.assignedUsers?.$values) && task.assignedUsers.$values.length > 0 ? (
                      task.assignedUsers.$values.map((userId) => {
                        const user = users.find(u => u.id === userId);
                        if (!user) return null;

                        return (
                            <div key={userId} className="flex items-center gap-1">
                              <img
                                  src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&color=fff`}
                                  alt={`${user.firstName} ${user.lastName}`}
                                  className="w-6 h-6 rounded-full"
                              />
                              <span className="text-gray-600">{`${user.firstName} ${user.lastName}`}</span>
                            </div>
                        );
                      })
                  ) : (
                      <span>No assigned users</span>
                  )}
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 text-gray-400 mr-2"/>
                  <span className="text-gray-600">{new Date(task.deadlineDate).toISOString().split('T')[0]}</span>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon
                      icon={faFlag}
                      className={`w-4 h-4 ${task.priority === 0 ? 'text-green-500' : task.priority === 1 ? 'text-orange-500' : task.priority === 2 ? 'text-red-500' : 'text-gray-400'} mr-2`}
                  />
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600">{task.status === -1 ? 'Planowane' : task.status === 0 ? 'W trakcie' : task.status === 1 ? 'Skończone' : task.status === 2 ? 'Problem' : 'Brak ustawionego statusu'}</span>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
}