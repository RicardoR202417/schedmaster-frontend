'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

export default function ThemeToggle({ className = '' }: Readonly<{ className?: string }>) {
  const { darkMode, toggle } = useDarkMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      className={`gx-theme-toggle ${className}`.trim()}
      onClick={toggle}
      aria-label="Cambiar tema"
      title="Cambiar tema"
    >
      {mounted ? (darkMode ? <Moon size={17} /> : <Sun size={17} />) : <span className="gx-theme-toggle-placeholder" />}
    </button>
  );
}
