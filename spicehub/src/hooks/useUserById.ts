import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { UserInfo } from "@/models/User";

export function useUserById(userId?: string | null) {
  const [data, setData] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    api
      .getUserById(userId)
      .then((u) => setData(u))
      .catch((err) => setError(err?.message ?? "Błąd podczas ładowania użytkownika"))
      .finally(() => setLoading(false));
  }, [userId]);

  return { data, loading, error };
} 