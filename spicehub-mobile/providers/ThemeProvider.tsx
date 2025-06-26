// ThemeContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react"
import { useColorScheme } from "react-native"
import { UIColors, ThemeColors } from "@/Constants/UIColors"

type UserChoice = "system" | "light" | "dark"
type ThemeMode = "light" | "dark"

interface ThemeContextValue {
  choice: UserChoice
  mode: ThemeMode
  colors: ThemeColors
  setChoice: (ch: UserChoice) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme() ?? "light"
  const [choice, setChoice] = useState<UserChoice>("system")

  // actual mode follows system only when choice === "system"
  const mode = useMemo<ThemeMode>(
    () => (choice === "system" ? systemScheme : choice),
    [choice, systemScheme],
  )
  const colors = UIColors[mode]

  return (
    <ThemeContext.Provider value={{ choice, mode, colors, setChoice }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error("useTheme must be inside ThemeProvider")
  }
  return ctx
}