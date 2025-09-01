"use client";

import { useUsers } from "@/hooks/useUsers";
import Loading from "../Loading";
import { AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Role, UserInfo } from "@/models/User";

type Props = {
    users: UserInfo[];
    roles: Role[];
    onRefresh: () => void;
}

export default function MembersTab({ users, roles, onRefresh }: Props) {
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
                                    <AvatarImage
                                        src={`/api/user/${user.id}/avatar`}
                                    />
                                    <AvatarFallback>
                                        {user.firstName[0]}
                                        {user.lastName ? user.lastName[0] : ""}
                                    </AvatarFallback>
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
    )
}