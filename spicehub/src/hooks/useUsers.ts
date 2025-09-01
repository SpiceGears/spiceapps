import { UserInfo } from "@/models/User";
import { api } from "@/services/api";
import { useEffect, useState } from "react";

export default function useUsers(refresh: boolean) {
    const [users, setUsers] = useState<UserInfo[]>([]);

    useEffect(() => {
        api.getUsers().then(setUsers).catch(console.error);
    }, [refresh]);
} 