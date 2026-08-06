import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabels?: boolean;
  size?: 'sm' | 'md';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabels = false,
  size = 'md',
}) => {
  const { theme, setTheme } = useTheme();

  const buttonPadding = size === 'sm' ? 'p-1' : 'p-1.5';
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div
      className={`flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 ${className}`}
      role="group"
      aria-label="Theme switcher"
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`flex items-center gap-1.5 ${buttonPadding} rounded-lg transition-colors ${
          theme === 'light'
            ? 'bg-white dark:bg-slate-800 text-amber-500 shadow-sm font-bold'
            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
        title="Light Mode"
        aria-label="Light Mode"
        aria-pressed={theme === 'light'}
      >
        <Sun className={iconSize} />
        {showLabels && <span className="text-xs">Light</span>}
      </button>

      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`flex items-center gap-1.5 ${buttonPadding} rounded-lg transition-colors ${
          theme === 'dark'
            ? 'bg-white dark:bg-slate-800 text-brand-400 shadow-sm font-bold'
            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
        title="Dark Mode"
        aria-label="Dark Mode"
        aria-pressed={theme === 'dark'}
      >
        <Moon className={iconSize} />
        {showLabels && <span className="text-xs">Dark</span>}
      </button>

      <button
        type="button"
        onClick={() => setTheme('system')}
        className={`flex items-center gap-1.5 ${buttonPadding} rounded-lg transition-colors ${
          theme === 'system'
            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-bold'
            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
        title="System Theme"
        aria-label="System Theme"
        aria-pressed={theme === 'system'}
      >
        <Laptop className={iconSize} />
        {showLabels && <span className="text-xs">System</span>}
      </button>
    </div>
  );
};
