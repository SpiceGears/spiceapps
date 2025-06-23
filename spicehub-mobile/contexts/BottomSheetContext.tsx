// BottomSheetContext.tsx
import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";

interface SheetContextValue {
  present: () => void;
  close: () => void;
}

const SheetContext = createContext<SheetContextValue | null>(null);

export function BottomSheetProvider({ children }: { children: ReactNode }) {
  const sheetRef = useRef<BottomSheetModal>(null);

  const present = useCallback(() => {
    sheetRef.current?.present();
  }, []);

  const close = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  return (
    <SheetContext.Provider value={{ present, close }}>
      {children}

      <BottomSheetModal
        ref={sheetRef}
        index={0}
        snapPoints={["50%"]}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            pressBehavior="close"
          />
        )}
      >
        <BottomSheetView className="p-4">
          <Text className="text-lg mb-4">Awesome options 🎉</Text>
          <Button onPress={close}>Dismiss</Button>
        </BottomSheetView>
      </BottomSheetModal>
    </SheetContext.Provider>
  );
}

export function useBottomSheet() {
  const ctx = useContext(SheetContext);
  if (!ctx) {
    throw new Error("useBottomSheet must be inside BottomSheetProvider");
  }
  return ctx;
}