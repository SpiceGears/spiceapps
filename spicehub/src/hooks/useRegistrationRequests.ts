import { useEffect, useState } from "react";
import { api, RegistrationRequest } from "@/services/api";

export function useRegistrationRequests(refresh?: boolean) {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .getRegistrationRequests()
      .then(setRequests)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [refresh]);

  return { requests, loading, error, setRequests };
}

export function usePendingRegistrationRequests(refresh?: boolean) {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .getPendingRegistrationRequests()
      .then(setRequests)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [refresh]);

  return { requests, loading, error, setRequests };
}
