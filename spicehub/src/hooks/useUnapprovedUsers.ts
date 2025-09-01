import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { UserInfo } from "@/models/User";

export function useUnapprovedUsers(refresh?: boolean) {
  const [unapproved, setUnapproved] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getUnapprovedUsers()
      .then(setUnapproved)
      .finally(() => setLoading(false));
  }, [refresh]);

  return { unapproved, loading, setUnapproved };
}