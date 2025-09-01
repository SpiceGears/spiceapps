import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Role } from "@/models/User";

export function useRoles(refresh?: boolean) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getRoles()
      .then(setRoles)
      .finally(() => setLoading(false));
  }, [refresh]);

  return { roles, loading };
}