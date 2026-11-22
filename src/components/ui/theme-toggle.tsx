'use client';

import React from 'react';

type Theme = 'light' | 'dark';

/** Runs in <head> before paint: stored choice, else the system preference. */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}})();`;

const readTheme = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => mo.disconnect();
};

/** A quiet text switch: names the theme you would switch to. */
export function ThemeToggle({ className }: { className?: string }) {
  // The <html data-theme> attribute is the source of truth (set before paint by
  // THEME_SCRIPT); every toggle on the page follows it.
  const theme = React.useSyncExternalStore<Theme | null>(subscribe, readTheme, () => null);

  const next: Theme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className={['theme-toggle', className].filter(Boolean).join(' ')}
      aria-label={`Switch to ${next} theme`}
      aria-pressed={theme === 'dark'}
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try { localStorage.setItem('theme', next); } catch { /* private mode: still switches */ }
      }}
    >
      <span aria-hidden className="theme-toggle-dot" />
      <span>{theme === null ? 'Theme' : next === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  );
}
