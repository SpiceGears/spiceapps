import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faFlag, faUser, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useProjectData } from '@/hooks/projectData';
import { useGetTasksData } from '@/hooks/getTasks';

interface Task {
  id: number;
  name: string;
  assignedUsers: AssignedUsers;
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

export default function List({ params }: { params: { projectId: string; taskId: string } }) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editedTaskId, setEditedTaskId] = useState<number | null>(null);
  const [taskForm, setTaskForm] = useState({
    name: '',
    assignedUsers: [] as string[],
    deadlineDate: '',
    priority: 0,
    status: 0,
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
            Authorization: atok,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        if (data && Array.isArray(data.$values)) {
          setUsers(data.$values);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
    fetchUsers();
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
            Authorization: atok,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();
        if (data && Array.isArray(data.$values)) {
          setTasks(data.$values.map((task: any) => ({ ...task })));
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }

    fetchTasks();
    const intervalId = setInterval(fetchTasks, 5000);

    return () => clearInterval(intervalId);
  }, [params.projectId]);

  const handleTaskClick = (task: Task) => {
    setTaskForm({
      name: task.name,
      assignedUsers: task.assignedUsers.$values,
      deadlineDate: task.deadlineDate || '',
      priority: task.priority,
      status: task.status,
    });
    setEditedTaskId(task.id);
    setIsAddingTask(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({
      ...prev,
      [name]: name === 'priority' || name === 'status' ? parseInt(value) : value,
    }));
  };

  const resetTaskForm = () => {
    setTaskForm({
      name: '',
      assignedUsers: [],
      deadlineDate: '',
      priority: 0,
      status: 0,
    });
    setEditedTaskId(null);
    setIsAddingTask(false);
  };

  const handleAddTaskClick = () => {
    resetTaskForm();
    setIsAddingTask(true);
  };

  const handleSubmit = async () => {
    try {
      const atok = localStorage.getItem('atok');
      if (!atok) throw new Error('No authentication token found');

      const endpoint = editedTaskId
          ? `/api/project/${params.projectId}/${editedTaskId}/edit`
          : `/api/project/${params.projectId}/create`;
      const method = editedTaskId ? 'PUT' : 'POST';

      // Validate assignedUsers as GUIDs
      const validatedAssignedUsers = taskForm.assignedUsers.map((id) =>
          id.match(/^[0-9a-fA-F-]{36}$/) ? id : null
      );

      if (validatedAssignedUsers.includes(null)) {
        throw new Error('Invalid GUID in assignedUsers.');
      }

      const payload = {
        name: taskForm.name,
        assignedUsers: validatedAssignedUsers,
        priority: taskForm.priority,
        deadlineDate: taskForm.deadlineDate,
        status: taskForm.status,
        body: '', // Add a placeholder or optional field for `body`.
        description: '',
        dependencies: [],
      };

      // Validate required fields
      if (!payload.name || !payload.deadlineDate || !payload.assignedUsers.length) {
        throw new Error('Please fill in all required fields.');
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: atok,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save task: ${errorText}`);
      }

      resetTaskForm();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  if (projectLoading || tasksLoading) return <div>Loading...</div>;
  if (projectError || tasksError) return <div>Error: {projectError?.message || tasksError?.message}</div>;

  return (
      <div className="p-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md mb-4"
            onClick={handleAddTaskClick}
        >
          <FontAwesomeIcon icon={faPlus} /> Utwórz zadanie
        </button>

        {isAddingTask && (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{editedTaskId ? 'Edytuj zadanie' : 'Utwórz zadanie'}</h2>
                <button
                    className="text-red-500 hover:text-red-700"
                    onClick={resetTaskForm}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Nazwa zadania"
                    value={taskForm.name}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"
                />
                <select
                    name="assignedUsers"
                    value={taskForm.assignedUsers[0] || ''}  // Make sure it reflects a single selected user
                    onChange={(e) => setTaskForm(prev => ({...prev, assignedUsers: [e.target.value]}))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Wybierz użytkownika</option>
                  {users.map(user => (
                      <option key={user.id} value={user.id}>{`${user.firstName} ${user.lastName}`}</option>
                  ))}
                </select>
                <input
                    type="date"
                    name="deadlineDate"
                    value={taskForm.deadlineDate}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"
                />
                <select
                    name="priority"
                    value={taskForm.priority}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"
                >
                  <option value={0}>Niski</option>
                  <option value={1}>Średni</option>
                  <option value={2}>Wysoki</option>
                </select>
                <select
                    name="status"
                    value={taskForm.status}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"
                >
                  <option value={-1}>Planowane</option>
                  <option value={0}>W trakcie</option>
                  <option value={1}>Zakończone</option>
                  <option value={2}>Problem</option>
                </select>
              </div>
              <button
                  className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
                  onClick={handleSubmit}
              >
                {editedTaskId ? 'Zaktualizuj zadanie' : 'Utwórz zadanie'}
              </button>
            </div>
        )}

        <div
            className="hidden md:grid grid-cols-5 px-4 py-3 font-semibold bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
          <div>Nazwa</div>
          <div>Przypisane do</div>
          <div>Termin</div>
          <div>Priorytet</div>
          <div>Status</div>
        </div>
        {tasks.map((task) => (
            <div
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className={`grid grid-cols-1 md:grid-cols-5 gap-4 px-4 py-3 border-b border-gray-300 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800`}
            >
              <div>{task.name}</div>
              <div>
                {task.assignedUsers.$values.map((userId) => {
                  const user = users.find((u) => u.id === userId);
                  return user ? (
                      <span key={userId} className="inline-block px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded-md">
                  {user.firstName} {user.lastName}
                </span>
                  ) : null;
                })}
              </div>
              <div>{new Date(task.deadlineDate).toLocaleDateString()}</div>
              <div>
                <FontAwesomeIcon
                    icon={faFlag}
                    className={`${
                        task.priority === 0
                            ? 'text-green-500'
                            : task.priority === 1
                                ? 'text-yellow-500'
                                : 'text-red-500'
                    }`}
                />
              </div>
              <div>{task.status === -1 ? 'Planowane' : task.status === 0 ? 'W trakcie' : task.status === 1 ? 'Zakończone' : 'Problem'}</div>
            </div>
        ))}
      </div>
  );
}