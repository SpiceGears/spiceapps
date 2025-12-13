"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";

export function usePendingRequestsCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await api.getPendingRegistrationRequestsCount();
        setCount(count);
      } catch (err) {
        console.error("Nie udało się pobrać liczby oczekujących zgłoszeń", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 30000);

    return () => clearInterval(interval);
  }, []);

  return { count, loading };
}
