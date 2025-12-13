"use client";

import { useEffect, useState } from "react";
import { UserInfo } from "@/models/User";
import { Role } from "@/models/User";
import AdminSidebar from "@/components/admin/AdminSidebar";
import MembersTab from "@/components/admin/MembersTab";
import { api, RegistrationRequest } from "@/services/api";
import Loading from "@/components/Loading";
import RolesTab from "@/components/admin/RolesTab";
import ApprovalsTab from "@/components/admin/ApprovalsTab";
import RegistrationRequestsTab from "@/components/admin/RegistrationRequestsTab";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<
    "members" | "roles" | "approvals" | "requests"
  >("members");
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [unapproved, setUnapproved] = useState<UserInfo[]>([]);
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [usersData, rolesData, unapprovedData, requestsData] =
          await Promise.all([
            api.getUsers(),
            api.getRoles(),
            api.getUnapprovedUsers(),
            api.getRegistrationRequests(),
          ]);
        setUsers(usersData);
        setRoles(rolesData);
        setUnapproved(unapprovedData);
        setRequests(requestsData);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [refresh]);

  if (loading) return <Loading />;

  return (
    <div className="flex h-full w-full justify-center">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main content */}
      <div className="w-[48rem] p-6 overflow-auto">
        {activeTab === "members" && (
          <MembersTab
            users={users}
            roles={roles}
            onRefresh={() => setRefresh(!refresh)}
          />
        )}
        {activeTab === "roles" && (
          <RolesTab roles={roles} onRefresh={() => setRefresh(!refresh)} />
        )}
        {activeTab === "approvals" && (
          <ApprovalsTab
            unapproved={unapproved}
            onRefresh={() => setRefresh(!refresh)}
          />
        )}
        {activeTab === "requests" && (
          <RegistrationRequestsTab
            requests={requests}
            onRefresh={() => setRefresh(!refresh)}
          />
        )}
      </div>
    </div>
  );
}
