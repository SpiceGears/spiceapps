import { Stack } from "expo-router"

export default function RootLayout() {
  return (
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="NewProject" options={{ headerShown: false }} />
      </Stack>
  )
}