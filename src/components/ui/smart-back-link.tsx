'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/**
 * Back control that returns the reader to where they actually came from.
 *
 * If RouteTracker recorded a previous in-app pathname that matches one of
 * `backWhenPrev`, this performs a real history back - the App Router
 * restores the exact prior scroll offset, so "back to portfolio" lands
 * mid-page where the reader left off instead of jumping to a section
 * anchor. Otherwise (deep link, or the previous page isn't a destination
 * this control claims to lead to) it falls through to a normal Link
 * navigation to `fallbackHref`.
 *
 * Note: router.back() cannot carry view-transition types, so smart backs
 * play the default page crossfade; only the fallback path plays 'nav-back'.
 */
export function SmartBackLink({
  fallbackHref,
  backWhenPrev = ['/'],
  children,
  ...rest
}: {
  fallbackHref: string;
  /** Previous pathnames for which a real history back is the right move. */
  backWhenPrev?: readonly string[];
} & Omit<React.ComponentProps<typeof Link>, 'href'>) {
  const router = useRouter();

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Respect modified clicks (new tab, etc.) - let the Link handle them.
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    let prev: string | null = null;
    try {
      prev = sessionStorage.getItem('nav:prev');
    } catch {
      /* storage unavailable - use the fallback href */
    }
    if (prev && backWhenPrev.includes(prev)) {
      e.preventDefault();
      try {
        // This Next version doesn't restore scroll on client-side history
        // back - flag the destination so RouteTracker re-applies the saved
        // offset once the route lands.
        sessionStorage.setItem('nav:restore', prev);
      } catch { /* ignore */ }
      router.back();
    }
  };

  return (
    <Link href={fallbackHref} transitionTypes={['nav-back']} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
