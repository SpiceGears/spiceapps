import { getBackendUrl } from "@/app/serveractions/backend-url";
import { UserInfo } from "@/models/User";
import { useState, useEffect } from "react";
import { getCookie } from "typescript-cookie";

export const useUserData = () => {
  const [data, setData] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let at = getCookie("accessToken");
    
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const backend = await getBackendUrl();
        if (!backend) throw new Error('Backend is not set up.');
        if (!at) {console.error("Cookie error, no Access Token found"); throw new Error("No cookie")}
        const response = await fetch(backend+"api/user/getInfo", 
          {
            method: 'GET',
            headers: 
            {
              Authorization: at,
            }
          });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: UserInfo = await response.json(); // Expect a single UserData object
        setData(result);
      } catch (e: any) {
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
