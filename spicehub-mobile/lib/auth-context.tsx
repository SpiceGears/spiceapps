import { createContext, useContext } from "react";
import { UserInfo } from "@/models/User"
import { BackendUrl } from "@/Constants/backend";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
    // user: UserInfo | null;
    login: (email: string, password: string) => Promise<string | null>;
    register: (email: string, password: string, name: string, surname: string, birthday: Date, department: string) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const login = async (email: string, password: string) => {
        const backend = BackendUrl;
        const payload = {
            email: email,
            password: password
        }
        try {
            const response = await fetch(`${BackendUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if(response.ok){
                const data = await response.json();
                await AsyncStorage.setItem('refreshToken', data.refresh_Token);
                await AsyncStorage.setItem('accessToken', data.access_Token);
            }
            return null;
        } catch (e) {
            if (e instanceof Error) {
                return e.message
            }
            return "Wystąpił błąd podczas logowania"
        }
    };

        const register = async (email: string, password: string, name: string, surname: string, birthday: Date, department: string) => {
        const backend = BackendUrl;
        const payload = {
            email: email,
            password: password,
            name: name, 
            surname: surname, 
            birthday: birthday, 
            department: department
        }
        try {
            const response = await fetch(`${BackendUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            return null;
        } catch (e) {
            if (e instanceof Error) {
                return e.message
            }
            return "Wystąpił błąd podczas rejestracji"
        }
    };



    return (
        <AuthContext.Provider value={{ login, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext)
    if(context === undefined) {
        throw new Error("useAuth must be inside of the AuthProvider")
    }

    return context;
}