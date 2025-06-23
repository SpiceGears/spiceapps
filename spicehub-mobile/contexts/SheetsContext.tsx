import React, {
  createContext,
  ReactNode,
  useContext,
  useRef,
} from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

type SheetKey = string;

interface SheetsContextValue {
  /** call as ref={register('myKey')} on each BottomSheetModal */
  register: (key: SheetKey) => (ref: BottomSheetModal | null) => void;
  open: (key: SheetKey) => void;
  close: (key: SheetKey) => void;
}

const SheetsContext = createContext<SheetsContextValue>({
  register: () => () => {},
  open: () => {},
  close: () => {},
});

export function SheetsProvider({ children }: { children: ReactNode }) {
  // holds mounted sheet instances
  const sheetsRef = useRef<Record<SheetKey, BottomSheetModal | null>>({});

  const register = (key: SheetKey) => (ref: BottomSheetModal | null) => {
    sheetsRef.current[key] = ref;
  };

  const open = (key: SheetKey) => {
    sheetsRef.current[key]?.present();
  };

  const close = (key: SheetKey) => {
    sheetsRef.current[key]?.dismiss();
  };

  return (
    <SheetsContext.Provider value={{ register, open, close }}>
      {children}
    </SheetsContext.Provider>
  );
}

export function useSheets() {
  return useContext(SheetsContext);
}