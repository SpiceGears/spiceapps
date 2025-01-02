'use client'

import React, { useState, useEffect } from 'react';

interface Role {
    id: string;
    name: string;
    permissions: string[];
}

interface User {
    id: string;
    name: string;
    roles: string[];
}

const AdminPanel = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [unapprovedUsers, setUnapprovedUsers] = useState<User[]>([]);
    const [newRole, setNewRole] = useState({ name: '', permissions: [] });

    useEffect(() => {
        fetchRoles();
        fetchUsers();
        fetchUnapprovedUsers();
    }, []);

    const fetchRoles = async () => {
        const response = await fetch('/api/roles');
        const data = await response.json();
        setRoles(data);
    };

    const fetchUsers = async () => {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
    };

    const fetchUnapprovedUsers = async () => {
        const atok = localStorage.getItem('atok');
        const response = await fetch('/api/users/unapproved',
            { headers: { 'Authorization': `${atok}` } });
        const data = await response.json();
        setUnapprovedUsers(data);
    };

    const addRole = async () => {
        await fetch('/api/roles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRole),
        });
        fetchRoles();
    };

    const deleteRole = async (roleId: string) => {
        await fetch(`/api/roles/${roleId}`, { method: 'DELETE' });
        fetchRoles();
    };

    const updateRole = async (role: Role) => {
        await fetch(`/api/roles/${role.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(role),
        });
        fetchRoles();
    };

    const deleteUser = async (userId: string) => {
        await fetch(`/api/users/${userId}`, { method: 'DELETE' });
        fetchUsers();
    };

    const updateUser = async (user: User) => {
        await fetch(`/api/users/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        fetchUsers();
    };

    const approveUser = async (userId: string) => {
        await fetch(`/api/users/${userId}/approve`, { method: 'POST' });
        fetchUnapprovedUsers();
    };

    return (
        <div>
            <h1>Admin Panel</h1>

            <div>
                <h2>Roles Management</h2>
                <input
                    type="text"
                    placeholder="Role Name"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                />
                <button onClick={addRole}>Add Role</button>
                <ul>
                    {roles.map((role) => (
                        <li key={role.id}>
                            <input
                                type="text"
                                value={role.name}
                                onChange={(e) => updateRole({ ...role, name: e.target.value })}
                            />
                            <button onClick={() => deleteRole(role.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h2>User Management</h2>
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>
                            <input
                                type="text"
                                value={user.name}
                                onChange={(e) => updateUser({ ...user, name: e.target.value })}
                            />
                            <select
                                multiple
                                value={user.roles}
                                onChange={(e) =>
                                    updateUser({
                                        ...user,
                                        roles: Array.from(e.target.selectedOptions, (option) => option.value),
                                    })
                                }
                            >
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                            <button onClick={() => deleteUser(user.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h2>User Approval</h2>
                <ul>
                    {unapprovedUsers.map((user) => (
                        <li key={user.id}>
                            {user.name}
                            <button onClick={() => approveUser(user.id)}>Approve</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminPanel;