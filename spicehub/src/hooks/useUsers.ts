import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { UserInfo } from "@/models/User";

export function useUsers(refresh?: boolean) {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.getUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [refresh]);

  return { users, loading, error };
}