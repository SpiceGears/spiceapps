'use client'

import React, { useState, useEffect } from 'react';

interface Role {
    id: string;
    roleId?: string;
    name: string;
    scope: string[];
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    roles: string[] | null; // Make roles nullable in the type
}

interface NewRole {
    id?: string; // Make it optional since it's generated on the server
    name: string;
    scopes: string[] | null;
}

const AdminPanel = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [unapprovedUsers, setUnapprovedUsers] = useState<User[]>([]);
    const [userRoles, setUserRoles] = useState<Map<string, string[]>>(new Map());
    const [newRole, setNewRole] = useState<NewRole>({
        name: '',
        scopes: []
    });
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetchRoles();
        fetchUsers();
        fetchUnapprovedUsers();
    }, []);

    useEffect(() => {
        const fetchUserRoles = async () => {
            try {
                const promises = users.map(user => getUserRoles(user.id));
                const allRoles = await Promise.all(promises);

                const rolesMap = new Map();
                users.forEach((user, index) => {
                    rolesMap.set(user.id, allRoles[index].map((role: any) => role.roleId));
                });

                setUserRoles(rolesMap);
            } catch (error) {
                handleApiError(error, 'Error fetching user roles');
            }
        };

        if (users.length > 0) {
            fetchUserRoles();
        }
    }, [users]);

    const handleApiError = (error: unknown, defaultMessage: string) => {
        console.error(defaultMessage, error);
        const errorMessage = error instanceof Error ? error.message : defaultMessage;
        setError(errorMessage);
        setTimeout(() => setError(''), 5000); // Clear error after 5 seconds
    };

    const fetchRoles = async () => {
        try {
            const atok = localStorage.getItem('atok');
            if (!atok) throw new Error('Authentication token not found');

            const response = await fetch('/api/roles', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${atok}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch roles');
            const data = await response.json();
            setRoles(data.$values?.map((role: any) => ({
                id: role.id || role.roleId,
                name: role.name,
                scope: role.scopes || []
            })) ?? []);
        } catch (error) {
            handleApiError(error, 'Failed to fetch roles');
            setRoles([]);
        }
    };

    const fetchUsers = async () => {
        try {
            const atok = localStorage.getItem('atok');
            if (!atok) throw new Error('Authentication token not found');

            const response = await fetch('/api/user/getAll', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${atok}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            const fetchedUsers = data.$values ?? [];
            setUsers(fetchedUsers);

            // Fetch roles for each user
            const promises = fetchedUsers.map(user => getUserRoles(user.id));
            const allRoles = await Promise.all(promises);

            const rolesMap = new Map();
            fetchedUsers.forEach((user, index) => {
                rolesMap.set(user.id, allRoles[index].map((role: any) => role.roleId));
            });

            setUserRoles(rolesMap);
        } catch (error) {
            handleApiError(error, 'Failed to fetch users');
            setUsers([]);
        }
    };

    const fetchUnapprovedUsers = async () => {
        try {
            const atok = localStorage.getItem('atok');
            if (!atok) throw new Error('Authentication token not found');

            const response = await fetch('/api/admin/getUnapprovedUsers', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${atok}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch unapproved users');
            const data = await response.json();
            setUnapprovedUsers(data.$values ?? []);
        } catch (error) {
            handleApiError(error, 'Failed to fetch unapproved users');
            setUnapprovedUsers([]);
        }
    };

    const addRole = async () => {
        try {
            const atok = localStorage.getItem('atok');
            if (!atok) throw new Error('Authentication token not found');

            if (!newRole.name.trim()) {
                throw new Error('Role name cannot be empty');
            }

            const response = await fetch('/api/roles/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${atok}`
                },
                body: JSON.stringify({
                    name: newRole.name,
                    scopes: newRole.scopes
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to add role');
            }

            await fetchRoles();
            setNewRole({ name: '', scopes: [] });
        } catch (error) {
            handleApiError(error, 'Failed to add role');
        }
    };

    const deleteRole = async (roleId: string) => {
        try {
            if (!roleId) throw new Error('Invalid role ID');

            const atok = localStorage.getItem('atok');
            if (!atok) throw new Error('Authentication token not found');

            const response = await fetch(`/api/roles/${roleId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${atok}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to delete role');
            }

            await fetchRoles();
        } catch (error) {
            handleApiError(error, 'Failed to delete role');
        }
    };

    const updateRole = async (role: Role) => {
        try {
            const atok = localStorage.getItem('atok');
            const response = await fetch(`/api/roles/${role.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${atok}`
                },
                body: JSON.stringify(role),
            });
            if (!response.ok) throw new Error('Failed to update role');
            await fetchRoles();
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    const deleteUser = async (userId: string) => {
        try {
            const atok = localStorage.getItem('atok');
            const response = await fetch(`/api/user/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${atok}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete user');
            await fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const updateUser = async (user: User) => {
        try {
            const atok = localStorage.getItem('atok');
            const response = await fetch(`/api/user/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${atok}`
                },
                body: JSON.stringify(user),
            });
            if (!response.ok) throw new Error('Failed to update user');
            await fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const approveUser = async (userId: string) => {
        try {
            const atok = localStorage.getItem('atok');
            const response = await fetch(`/api/user/${userId}/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${atok}`
                }
            });
            if (!response.ok) throw new Error('Failed to approve user');
            await fetchUnapprovedUsers();
            await fetchUsers(); // Refresh users list after approval
        } catch (error) {
            console.error('Error approving user:', error);
        }
    };

    const getUserRoles = async (userId: string): Promise<string[]> => {
        try {
            const atok = localStorage.getItem('atok');
            const response = await fetch(`/api/user/${userId}/roles`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${atok}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch user roles');
            const data = await response.json();
            return data.$values ?? [];
        } catch (error) {
            console.error('Error fetching user roles:', error);
            return [];
        }
    };

    const toggleUserRole = async (user: User, roleId: string) => {
        try {
            const atok = localStorage.getItem('atok');
            const currentRoles = userRoles.get(user.id) || [];
            const isRemoving = currentRoles.includes(roleId);

            const endpoint = isRemoving ?
                `/api/user/${user.id}/removeRoles` :
                `/api/user/${user.id}/assignRoles`;

            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${atok}`
                },
                body: JSON.stringify([roleId])
            });

            if (!response.ok) throw new Error(`Failed to ${isRemoving ? 'remove' : 'assign'} role`);

            const updatedRoles = isRemoving ?
                currentRoles.filter(id => id !== roleId) :
                [...currentRoles, roleId];

            setUserRoles(new Map(userRoles.set(user.id, updatedRoles)));
        } catch (error) {
            handleApiError(error, 'Failed to update user roles');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

            {/* Roles Management Section */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Roles Management</h2>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <div className="flex mb-4">
                    <input
                        type="text"
                        placeholder="Role Name"
                        value={newRole.name}
                        onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                        className="border border-gray-300 p-2 rounded mr-2"
                    />
                    <button
                        onClick={addRole}
                        disabled={!newRole.name.trim()}
                        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
                    >
                        Add Role
                    </button>
                </div>
                <div className="space-y-4">
                    {roles.map((role) => (
                        <div key={role.id} className="flex items-center">
                            <input
                                type="text"
                                value={role.name}
                                onChange={(e) => setRoles(
                                    roles.map(r => r.id === role.id ? {...r, name: e.target.value} : r)
                                )}
                                className="border border-gray-300 p-2 rounded mr-2 flex-grow"
                            />
                            <button
                                onClick={() => deleteRole(role.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* User Management Section */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">User Management</h2>
                <div className="space-y-6">
                    {users.map((user) => (
                        <div key={user.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="text"
                                        value={user.firstName}
                                        onChange={(e) => updateUser({...user, firstName: e.target.value})}
                                        className="border border-gray-300 p-2 rounded"
                                    />
                                    <span className="text-gray-500">{user.lastName}</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {roles.map((role) => {
                                    // Check if the user has the role using userRoles map
                                    const isRoleAssigned = userRoles.get(user.id)?.includes(role.id) ?? false;

                                    return (
                                        <label
                                            key={`${user.id}-${role.id}`}
                                            className="flex items-center gap-2 bg-gray-100 p-2 rounded hover:bg-gray-200 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isRoleAssigned}
                                                onChange={() => toggleUserRole(user, role.id)}
                                                className="form-checkbox h-4 w-4"
                                            />
                                            <span>{role.name}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* User Approval Section */}
            <div>
                <h2 className="text-xl font-semibold mb-4">User Approval</h2>
                <div className="space-y-4">
                    {unapprovedUsers.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center justify-between p-4 border rounded"
                        >
                            <span className="font-medium">{user.firstName} {user.lastName}</span>
                            <button
                                onClick={() => approveUser(user.id)}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Approve
                            </button>
                        </div>
                    ))}
                    {unapprovedUsers.length === 0 && (
                        <p className="text-gray-500 italic">No users pending approval</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;