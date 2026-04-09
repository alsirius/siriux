'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { appConfig } from '../../config/app-config';

interface ThemeContextType {
  theme: typeof appConfig.theme;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: appConfig.theme,
  isDarkMode: appConfig.theme.darkMode,
  toggleDarkMode: () => {}
});

// SSR-safe hook that returns default values during SSR
export const useTheme = () => {
  if (typeof window === 'undefined') {
    // Return default values during SSR
    return {
      theme: appConfig.theme,
      isDarkMode: appConfig.theme.darkMode,
      toggleDarkMode: () => {}
    };
  }
  return useContext(ThemeContext);
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(appConfig.theme.darkMode);

  useEffect(() => {
    // Apply theme to document (client-side only)
    if (typeof window !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const value: ThemeContextType = {
    theme: appConfig.theme,
    isDarkMode,
    toggleDarkMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
