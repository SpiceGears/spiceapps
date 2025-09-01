"use client"


import { UserInfo } from "@/models/User";
import { api } from "@/services/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Props = {
    unapproved: UserInfo[];
    onRefresh: () => void;
}

export default function ApprovalsTab({ unapproved, onRefresh }: Props) {
    async function handleApprove(user: UserInfo) {
        try {
            await api.approveUser(user.id);
            toast.success("Zatwierdzono!", {
                description: `${user.firstName} ${user.lastName} może rozpocząć pracę!`,
            });
            onRefresh();
        } catch (err: any) {
            toast.error("Błąd podczas zatwierdzania użytkownika", { description: err.message });
        }
    }

    async function handleReject(user: UserInfo) {
            toast.success("Odrzucono!", {
                description: `${user.firstName} ${user.lastName} nie może rozpocząć pracy!`,
            });
        }
        return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Zatwierdzenie użytkowników</h2>
        <Input placeholder="Wyszukaj oczekujących..." className="w-64" />
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          {unapproved.length === 0 && (
            <p className="text-gray-500">Brak oczekujących użytkowników.</p>
          )}

          {unapproved.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{user.firstName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleApprove(user)}
                >
                  Zatwierdź
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleReject(user)}
                >
                  Odrzuć
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
        )
    }