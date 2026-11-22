'use client';

import React from 'react';
import Link from 'next/link';
import { Brand } from './Brand';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export const NAV = [
  { href: '/#work', label: 'Work' },
  { href: '/field-notes', label: 'Notes' },
  { href: '/about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
] as const;

/**
 * The one header: mark and name on the left, four plain links and the theme switch on
 * the right. It sits in the page (not fixed) on the homepage so the flight path owns the
 * first screen; `sticky` pins it on inside pages.
 */
export function SiteHeader({ sticky = false, children }: { sticky?: boolean; children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const menuId = React.useId();

  return (
    <header className={`site-header${sticky ? ' is-sticky' : ''}`}>
      <div className="site-header-row">
        <div className="site-header-left">
          <Brand />
          {children}
        </div>
        <nav aria-label="Main" className="site-nav">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">{l.label}</Link>
          ))}
          <ThemeToggle />
        </nav>
        <button
          type="button"
          className="menu-button"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      <nav id={menuId} aria-label="Main" className="site-menu" hidden={!open}>
        {NAV.map((l) => (
          <Link key={l.href} href={l.href} className="site-menu-link" onClick={() => setOpen(false)}>{l.label}</Link>
        ))}
        <ThemeToggle className="site-menu-link" />
      </nav>
    </header>
  );
}
