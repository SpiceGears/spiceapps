import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { BackendUrl } from "@/Constants/backend";
import * as Keychain from "react-native-keychain";

// Define the shape of the context value
type AuthContextType = {
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (
    email: string,
    password: string,
    name: string,
    surname: string,
    birthday: Date,
    department: string,
  ) => Promise<string | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A unique service ID for Keychain
const KEYCHAIN_SERVICE_ID = "com.yourapp.auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // 1. ADD STATE MANAGEMENT
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. ADD APP INITIALIZATION LOGIC
  // Check for a stored refresh token when the app starts
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const credentials = await Keychain.getGenericPassword({
          service: KEYCHAIN_SERVICE_ID,
        });
        if (credentials) {
          // We found a refresh token. Let's try to get a new access token.
          // For simplicity, we'll just set a placeholder here.
          // In a real app, you'd call a 'refreshToken' endpoint.
          // const newAccessToken = await api.refreshToken(credentials.password);
          // setAccessToken(newAccessToken);
          console.log("User session restored.");
          // For this example, we'll assume the access token was stored as the password.
          setAccessToken(credentials.password);
        }
      } catch (e) {
        console.error("Could not restore session", e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (email: string, password: string) => {
    const payload = {
      login: email.trim(),
      password: password.trim(),
    };
    try {
      const response = await fetch(`${BackendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // 3. CORRECT FETCH ERROR HANDLING
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const { refresh_Token, access_Token } = data;
      if (!refresh_Token || !access_Token) {
        throw new Error("Invalid token data received from server.");
      }

      // 4. USE KEYCHAIN CORRECTLY
      // Store the long-lived refresh token securely.
      await Keychain.setGenericPassword("refreshToken", refresh_Token, {
        service: KEYCHAIN_SERVICE_ID,
      });

      // Set the short-lived access token in state for immediate use
      setAccessToken(access_Token);

      return null; // Success
    } catch (e) {
      if (e instanceof Error) {
        return e.message;
      }
      return "An unknown error occurred during login.";
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    surname: string,
    birthday: Date,
    department: string,
  ) => {
    const payload = { email, password, name, surname, birthday, department };
    try {
      const response = await fetch(`${BackendUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Optional: Automatically log the user in after registration
      // await login(email, password);

      return null; // Success
    } catch (e) {
      if (e instanceof Error) {
        return e.message;
      }
      return "An unknown error occurred during registration.";
    }
  };

  // 5. ADD A LOGOUT FUNCTION
  const logout = async () => {
    setAccessToken(null);
    await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE_ID });
  };

  const value = {
    accessToken,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// The hook remains the same, but now it's much more powerful!
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}