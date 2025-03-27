import { useState, useEffect } from "react";

export interface IRole {
  name: string;
  roleId: string;
  scopes: string[];
  department: Department;
}

export enum Department {
  NaDr = 0,
  Programmers,
  Mechanics,
  SocialMedia,
  Marketing,
  Executive,
  Mentor
}

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: IRole[];
  department: Department;
  birthDay: string;
  coins: number;
  createdAt: string;
  lastLogin: string;
  isApproved: boolean;
}

export const useUserData = () => {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/user");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: UserData = await response.json(); // Expect a single UserData object
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
