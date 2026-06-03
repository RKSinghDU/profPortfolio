import { useEffect, useState } from 'react';
import { themeManager } from '../services';
import type { Theme } from '../services';

export interface UseThemeResult {
  theme: Theme;
  isDark: boolean;
  toggle: () => void;
}

export function useTheme(): UseThemeResult {
  const [theme, setTheme] = useState<Theme>(() => themeManager.getInitial());

  useEffect(() => {
    themeManager.save(theme);
  }, [theme]);

  return {
    theme,
    isDark: theme === 'dark',
    toggle: () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark')),
  };
}
