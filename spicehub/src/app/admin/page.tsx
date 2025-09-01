"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Shield, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RolePicker } from "@/components/admin/RolePicker";
import { Department, UserInfo } from "@/models/User";
import { getBackendUrl } from "../serveractions/backend-url";
import { getCookie } from "typescript-cookie";
import { Switch } from "@/components/ui/switch";
import { Role } from "@/models/User";
import { toast, ToastClassnames } from "sonner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminSidebar from "@/components/admin/AdminSidebar";
import MembersTab from "@/components/admin/MembersTab";
import { api } from "@/services/api";
import Loading from "@/components/Loading";
import RolesTab from "@/components/admin/RolesTab";
import ApprovalsTab from "@/components/admin/ApprovalsTab";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<"members" | "roles" | "approvals">("members");
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [unapproved, setUnapproved] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [usersData, rolesData, unapprovedData] = await Promise.all([
          api.getUsers(),
          api.getRoles(),
          api.getUnapprovedUsers(),
        ]);
        setUsers(usersData);
        setRoles(rolesData);
        setUnapproved(unapprovedData);
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
      </div>
    </div>
  );
}
