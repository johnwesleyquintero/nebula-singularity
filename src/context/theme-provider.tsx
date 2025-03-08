import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { themeConfig } from '@/lib/theme';

type ThemeMode = 'light' | 'dark';

export const ThemeContext = createContext<{
  mode: ThemeMode;
  toggle: () => void;}>({ mode: 'light', toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const savedMode = localStorage.getItem('theme') as ThemeMode || 'light';
    setMode(savedMode);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const variables = themeConfig.cssVariables(mode);
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    localStorage.setItem('theme', mode);
  }, [mode]);

  const toggle = () => {
    setMode(prev => {
      const newMode = prev === 'light' ? 'dark' : 'light';
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);