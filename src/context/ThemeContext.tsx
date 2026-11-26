import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';

type Theme = 'light' | 'dark';

const ThemeStateContext = createContext<Theme | null>(null);
const ThemeDispatchContext = createContext<(() => void) | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeStateContext value={theme}>
      <ThemeDispatchContext value={toggleTheme}>
        {children}
      </ThemeDispatchContext>
    </ThemeStateContext>
  );
}

export function useThemeState() {
  const context = useContext(ThemeStateContext);
  if (context === null) {
    throw new Error(
      'useThemeState має використовуватись всередині ThemeProvider',
    );
  }
  return context;
}

export function useThemeDispatch() {
  const context = useContext(ThemeDispatchContext);
  if (context === null) {
    throw new Error(
      'useThemeDispatch має використовуватись всередині ThemeProvider',
    );
  }
  return context;
}
