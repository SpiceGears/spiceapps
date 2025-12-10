"use client";

import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Role, UserInfo } from "@/models/User";
import { getBackendUrl } from "@/app/serveractions/backend-url";
import Loading from "../Loading";
import EditUserDialog from "./EditUserDialog";

type Props = {
  users: UserInfo[];
  roles: Role[];
  onRefresh: () => void;
};

export default function MembersTab({ users, roles, onRefresh }: Props) {
  const [backendUrl, setBackendUrl] = useState<string>("");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Członkowie</h2>
        <Input placeholder="Wyszukaj członków..." className="w-64" />
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  {user.avatarSet ? (
                    <AvatarImage
                      src={`${backendUrl}/api/user/${user.id}/avatar`}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                  ) : (
                    <AvatarFallback className="bg-gray-300 text-gray-700 font-medium rounded-full flex items-center justify-center">
                      {user.firstName[0]}
                      {user.lastName ? user.lastName[0] : ""}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <Button>Edytuj</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}