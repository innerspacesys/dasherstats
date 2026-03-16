'use client';

import { useEffect, useState } from 'react';
import type { ThemeMode } from '@/lib/types';

const STORAGE_KEY = 'shiftledger-theme';

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  const resolved = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stored = (window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null) || 'system';
    applyTheme(stored);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const current = (window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null) || 'system';
      if (current === 'system') applyTheme('system');
    };

    media.addEventListener?.('change', handleChange);
    return () => media.removeEventListener?.('change', handleChange);
  }, []);

  return <>{children}</>;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(() => (typeof window !== 'undefined' ? (window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null) || 'system' : 'system'));

  function handleChange(next: ThemeMode) {
    setTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  return (
    <div className="flex gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-1">
      {(['light', 'dark', 'system'] as ThemeMode[]).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => handleChange(item)}
          className={`rounded-xl px-3 py-2 text-sm capitalize transition ${
            theme === item
              ? 'bg-[var(--foreground)] text-[var(--background)]'
              : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
