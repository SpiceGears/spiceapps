import { getBackendUrl } from "../app/serveractions/backend-url";
import { UserInfo } from "../models/User"
import { useState, useEffect } from "react";
import { getCookie } from "typescript-cookie";

export const useUserById = (id: string) => {
  const [data, setData] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const backend = await getBackendUrl();
        if (!backend) throw new Error('Backend is not set up.');
        const response = await fetch(backend+"/api/user/"+id, 
          {
            method: 'GET',
          });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: UserInfo = await response.json();
        console.log(result) // Expect a single UserData object
        setData(result);
      } catch (e: any) {
        console.error("useUserById thrown error:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    
    fetchData();
  }, []);

  return {
    data,
    loading,
    error
  };
};
