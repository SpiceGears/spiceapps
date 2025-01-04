'use client'

import React, { useState, useEffect } from 'react';

interface Role {
    id: string;
    roleId?: string;
    name: string;
    scope: string[];
    department?: number;
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    roles: string[] | null; // Make roles nullable in the type
    department: string;
    birthDate: string;
    isApproved: boolean;
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
    const [newScope, setNewScope] = useState<Map<string, string>>(new Map()); // State for new scope input for each role
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        fetchRoles();
        fetchUsers();
        fetchUnapprovedUsers();
        checkAdminAccess();
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

    const checkAdminAccess = async () => {
        try {
            const atok = localStorage.getItem('atok');
            if (!atok) throw new Error('Authentication token not found');

            const response = await fetch('/api/user/current/roles', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${atok}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch user roles');
            const data = await response.json();
            const userRoles = data.$values ?? [];

            // Check if user has admin role
            const hasAdminRole = userRoles.some((role: any) =>
                role.name?.toLowerCase() === 'admin' ||
                role.scopes?.$values?.includes('admin')
            );

            setIsAdmin(hasAdminRole);

            if (hasAdminRole) {
                // Only fetch admin data if user is admin
                fetchRoles();
                fetchUsers();
                fetchUnapprovedUsers();
            }
        } catch (error) {
            console.error('Error checking admin access:', error);
            setIsAdmin(false);
        }
    };


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
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${atok}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch roles');
            const data = await response.json();

            // Handle the nested structure of the response
            const processedRoles = data.$values?.map((role: any) => ({
                id: role.roleId, // Use roleId as the main identifier
                roleId: role.roleId,
                name: role.name,
                scope: role.scopes?.$values || [], // Extract the nested scopes array
                department: role.department
            })) ?? [];

            setRoles(processedRoles);
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
                method: 'GET',
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
                method: 'GET',
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
                body: JSON.stringify({
                    name: role.name,
                    scopes: role.scope
                }),
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
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${atok}`
                },
                body: JSON.stringify({
                    isApproved: true
                })
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

    const addScope = async (roleId: string) => {
        const scope = newScope.get(roleId);
        if (!scope || !scope.trim()) return;

        setIsLoading(true);
        try {
            const atok = localStorage.getItem('atok');
            if (!atok) throw new Error('Authentication token not found');

            const role = roles.find(r => r.id === roleId);
            if (!role) throw new Error('Role not found');

            console.log('Current role:', role);
            console.log('Adding scope:', scope.trim());

            // Check if scope already exists
            if (role.scope.includes(scope.trim())) {
                throw new Error('Scope already exists');
            }

            const updatedScopes = [...role.scope, scope.trim()];
            console.log('Updated scopes:', updatedScopes);

            const payload = {
                name: role.name,
                scopes: updatedScopes
            };
            console.log('Sending payload:', payload);

            const response = await fetch(`/api/roles/${roleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${atok}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('API Error:', errorData);
                throw new Error(errorData?.message || 'Failed to add scope');
            }

            const updatedRole = await response.json();
            console.log('API Response:', updatedRole);

            // Update the local state with the new role data
            setRoles(prevRoles => prevRoles.map(r =>
                r.id === roleId ? { ...r, scope: updatedScopes } : r
            ));

            // Clear the input
            setNewScope(prev => new Map(prev).set(roleId, ''));
            setError('');
        } catch (error) {
            console.error('Error in addScope:', error);
            handleApiError(error, 'Failed to add scope');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteScope = async (roleId: string, scopeToDelete: string) => {
        setIsLoading(true);
        try {
            const atok = localStorage.getItem('atok');
            if (!atok) throw new Error('Authentication token not found');

            const role = roles.find(r => r.id === roleId);
            if (!role) throw new Error('Role not found');

            console.log('Current role:', role);
            console.log('Deleting scope:', scopeToDelete);

            const updatedScopes = role.scope.filter(scope => scope !== scopeToDelete);
            console.log('Updated scopes:', updatedScopes);

            const payload = {
                name: role.name,
                scopes: updatedScopes
            };
            console.log('Sending payload:', payload);

            const response = await fetch(`/api/roles/${roleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${atok}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('API Error:', errorData);
                throw new Error(errorData?.message || 'Failed to delete scope');
            }

            const updatedRole = await response.json();
            console.log('API Response:', updatedRole);

            // Update the local state with the new role data
            setRoles(prevRoles => prevRoles.map(r =>
                r.id === roleId ? { ...r, scope: updatedScopes } : r
            ));
            setError('');
        } catch (error) {
            console.error('Error in deleteScope:', error);
            handleApiError(error, 'Failed to delete scope');
        } finally {
            setIsLoading(false);
        }
    };

    // if (!isAdmin) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center bg-gray-100">
    //             <div className="bg-white p-8 rounded-lg shadow-lg text-center">
    //                 <h1 className="text-4xl font-bold text-gray-800 mb-4">418</h1>
    //                 <h2 className="text-2xl font-semibold text-gray-700 mb-4">I'm a teapot</h2>
    //                 <p className="text-gray-600">You are not the administrator of this site</p>
    //                 <img
    //                     src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcliparts.co%2Fcliparts%2FriL%2Fg4q%2FriLg4qj4T.png&f=1&nofb=1&ipt=719a3c33ded252d00e97836b1640de7ac2002ee4ca40c091b9a9ae4581db8e55&ipo=images"
    //                     alt="Teapot"
    //                     className="mx-auto my-6 w-32 h-32"
    //                 />
    //                 <p className="text-gray-600 text-[10px]">Maybe try "programmers" coffee instead. </p>
    //             </div>
    //         </div>
    //     );
    // }

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
                        console.log("role: ", role),
                        <div key={role.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                                <input
                                    type="text"
                                    value={role.name}
                                    onChange={(e) => setRoles(prevRoles => prevRoles.map(r => r.id === role.id ? {
                                        ...r,
                                        name: e.target.value
                                    } : r))}
                                    onBlur={() => updateRole(role)}
                                    className="border border-gray-300 p-2 rounded mr-2"
                                />
                                <button
                                    onClick={() => deleteRole(role.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Delete Role
                                </button>
                            </div>
                            <div className="flex mb-4">
                                <input
                                    type="text"
                                    placeholder="New Scope"
                                    value={newScope.get(role.id) || ''}
                                    onChange={(e) => setNewScope(prev => new Map(prev).set(role.id, e.target.value))}
                                    className="border border-gray-300 p-2 rounded mr-2"
                                />
                                <button
                                    onClick={() => addScope(role.id)}
                                    disabled={isLoading || !newScope.get(role.id)?.trim()}
                                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
                                >
                                    {isLoading ? 'Adding...' : 'Add Scope'}
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {role.scope.map((scope, index) => (
                                    <div key={index} className="flex items-center bg-gray-200 px-2 py-1 rounded">
                                        <span>{scope}</span>
                                        <button
                                            onClick={() => deleteScope(role.id, scope)}
                                            disabled={isLoading}
                                            className="ml-2 text-red-500 hover:text-red-700 disabled:text-gray-400"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
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
                                    <span className="font-medium">{user.firstName} {user.lastName}</span>
                                    <button
                                        onClick={() => deleteUser(user.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Delete User
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {roles.map((role) => {
                                    const isAssigned = userRoles.get(user.id)?.includes(role.id);
                                    return (
                                        <button
                                            key={role.id}
                                            onClick={() => toggleUserRole(user, role.id)}
                                            className={`px-4 py-2 rounded ${isAssigned ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                        >
                                            {role.name}
                                        </button>
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