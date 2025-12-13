import { getBackendUrl } from "@/app/serveractions/backend-url";
import { Project } from "@/models/Project";
import { Task } from "@/models/Task";
import { Role, UserInfo } from "@/models/User";
import { get } from "http";
import { getCookie } from "typescript-cookie";

async function apiFetch<T>(path: string, options: RequestInit = {}) {
    const backend = await getBackendUrl();
    if (!backend) throw new Error("Backend URL not found");
    const token = getCookie("accessToken");
    if (!token) throw new Error("Access token not found");

    const res = await fetch(`${backend}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
            ...options.headers,
        },
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }
    return res.json() as Promise<T>;
}

export const api = {
  getUsers: () => apiFetch<UserInfo[]>("/api/user/getAll"),
  getUserById: (id: string) => apiFetch<UserInfo>(`/api/user/${id}`),
  getUser: () => apiFetch<UserInfo>("/api/user/getInfo"),
  getRoles: () => apiFetch<Role[]>("/api/roles"),
  getProjects: () => apiFetch<Project[]>("/api/project"),
  getTasks: (id: string) => apiFetch<Task[]>(`/api/project/${id}/getTasks`),
  getUnapprovedUsers: () => apiFetch<UserInfo[]>("/api/admin/getUnapprovedUsers"),
  getAssignedTasks: (userId: string) => apiFetch<Task[]>(`/api/user/${userId}/getAssignedTasks`),

  approveUser: (id: string) =>
    apiFetch(`/api/user/${id}/approve`, { method: "PUT" }),

  updateUserRoles: (id: string, roles: string[]) =>
    apiFetch(`/api/user/${id}/assignRoles`, {
      method: "PUT",
      body: JSON.stringify(roles),
    }),

  removeUserRoles: (id: string, roles: string[]) =>
    apiFetch(`/api/user/${id}/removeRoles`, {
      method: "PUT",
      body: JSON.stringify(roles),
    }),

  createRole: (role: any) =>
    apiFetch("/api/roles/create", {
      method: "POST",
      body: JSON.stringify(role),
    }),

  updateRole: (id: string, role: any) =>
    apiFetch(`/api/roles/${id}`, {
      method: "PUT",
      body: JSON.stringify(role),
    }),

  deleteRole: (id: string) =>
    apiFetch(`/api/roles/${id}`, { method: "DELETE" }),
}