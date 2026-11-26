import { useThemeState, useThemeDispatch } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function ThemeSwitch() {
  const theme = useThemeState();
  const toggleTheme = useThemeDispatch();
  return (
    <div
      role="group"
      aria-label="Перемикач теми"
      className="flex items-center bg-blue-950/60 p-1 rounded-xl border border-blue-700/60 shadow-inner"
    >
      <button
        type="button"
        onClick={() => theme !== 'light' && toggleTheme()}
        title="Світла тема"
        aria-label="Світла тема"
        className={`group p-2 rounded-lg transition-all duration-200 cursor-pointer active:scale-95 ${
          theme === 'light'
            ? 'bg-blue-700 text-amber-300 shadow-sm'
            : 'text-blue-300/60 hover:text-amber-200 hover:bg-blue-800/50'
        }`}
      >
        <Sun className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
      </button>

      <span className="w-px h-4 bg-blue-700/70 mx-0.5" aria-hidden="true" />

      <button
        type="button"
        onClick={() => theme !== 'dark' && toggleTheme()}
        title="Темна тема"
        aria-label="Темна тема"
        className={`group p-2 rounded-lg transition-all duration-200 cursor-pointer active:scale-95 ${
          theme === 'dark'
            ? 'bg-blue-700 text-white shadow-sm'
            : 'text-blue-300/60 hover:text-white hover:bg-blue-800/50'
        }`}
      >
        <Moon className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-12" />
      </button>
    </div>
  );
}
