import { Stack, useRouter } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Children, useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import "@/global.css"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SheetsProvider } from "@/contexts/SheetsContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SheetsProvider>
          <GluestackUIProvider mode="light">
            <PaperProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="auth" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              </Stack>
            </PaperProvider>
          </GluestackUIProvider>
        </SheetsProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
