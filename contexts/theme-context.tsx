import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type ThemePreference = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  preference: ThemePreference;
  theme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'theme-preference';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useSystemColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setPreferenceState(stored);
        }
      })
      .catch(() => {
        // Fallback to system preference on storage error
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  const setPreference = useCallback((newPreference: ThemePreference) => {
    setPreferenceState(newPreference);
    AsyncStorage.setItem(STORAGE_KEY, newPreference).catch(() => {
      // Storage error - preference still applied for current session
    });
  }, []);

  const theme: ResolvedTheme = useMemo(() => {
    if (preference === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return preference;
  }, [preference, systemColorScheme]);

  const value = useMemo(
    () => ({
      preference,
      theme,
      setPreference,
      isDark: theme === 'dark',
    }),
    [preference, theme, setPreference]
  );

  if (!isLoaded) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
