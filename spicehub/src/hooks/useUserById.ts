import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { UserInfo } from "@/models/User";

export function useUserById(userId: string) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    api.getUserById(userId)
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading };
}