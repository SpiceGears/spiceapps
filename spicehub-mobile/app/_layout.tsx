import { Stack, useRouter } from "expo-router";
import { Children, useEffect } from "react";

export default function RootLayout() {
  return (
      <Stack
      screenOptions={{
        headerShown: false,
      }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
  )
}
