import { AuthProvider } from "@/lib/auth-context";
import { Stack, useRouter } from "expo-router";
import { Children, useEffect } from "react";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const isAuth = false;
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      setTimeout(() => {
        router.replace("/auth")
      }, 1);
    }
  }, []);

  return <>{children}</>
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteGuard>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </RouteGuard>
    </AuthProvider>
  )
}
