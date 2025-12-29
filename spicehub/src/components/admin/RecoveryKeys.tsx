import { RecoveryKey, UserInfo } from '@/models/User';
import React from 'react'
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { api } from '@/services/api';
import { Button } from '../ui/button';
import { toast } from 'sonner';

type Props = {
  users: UserInfo[];
  recoveryKeys: RecoveryKey[];
  onRefresh: () => void;
};

const RecoveryKeysTab = ({ users, recoveryKeys, onRefresh }: Props) => {
    const handleDeleteKey = async (key: RecoveryKey) => 
        {
            api.deleteRecoveryKey(key.id).then(() => {
                onRefresh();
                toast.success("Klucz odzyskiwania usunięty");
            }).catch((err) => {
                console.error("Failed to delete recovery key", err);
                toast.error("Nie udało się usunąć klucza odzyskiwania: " + err.message);
            }); 
        };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Klucze odzyskiwania</h2>
        <Input placeholder="Wyszukaj oczekujących..." className="w-64" />
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          {recoveryKeys.length === 0 && (
            <p className="text-gray-500">Brak kluczy odzyskiwania.</p>
          )}

          {recoveryKeys.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
            >
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-medium">
                    {key.code} 
                  </p>
                  <p className="text-sm text-gray-500">
                    {"Należacy do "}
                    {
                    users.find(u => u.id === key.userId)?.firstName + " " + users.find(u => u.id === key.userId)?.lastName + "(" + users.find(u => u.id === key.userId)?.email + ")"
                    }
                    </p>
                </div>
              </div>

              <div className="flex gap-2">
                {/* <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleApprove(user)}
                >
                  Zatwierdź
                </Button>*/}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteKey(key)}
                >
                  Usuń klucz
                </Button> 
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default RecoveryKeysTab