// contexts/theme-context.tsx
import publicTheme from "@/theme/public-theme";
import React, { createContext, ReactNode, useContext, useState } from "react";

import { MD3Theme } from "react-native-paper"; // type for theme

type ThemeContextType = {
  toggleTheme: () => void;
  isDark: boolean;
  theme: MD3Theme;
};

const ThemeContext = createContext<ThemeContextType>({
  toggleTheme: () => {},
  isDark: false,
  theme: publicTheme.lightTheme,
});

type Props = {
  children: ReactNode;
};

export const ThemeProviderContext = ({ children }: Props) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const theme = isDark ? publicTheme.darkTheme : publicTheme.lightTheme;

  return (
    <ThemeContext.Provider value={{ toggleTheme, isDark, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
