'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';

// The panel (and the ai/@ai-sdk chunks) load only on first open.
const ChatPanel = dynamic(() => import('./ChatPanel').then((m) => ({ default: m.ChatPanel })), { ssr: false });

/**
 * Floating "Ask Ahmad" bubble - bottom-right, above everything, zero chat JS
 * in the initial bundle. Opens the streaming panel on click.
 */
export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [atFooter, setAtFooter] = useState(false);
  const pathname = usePathname();
  const [atHero, setAtHero] = useState(pathname === '/');

  // On phones the bubble sat on top of the footer links; step aside while the
  // footer is on screen (CSS below only applies the hide at <=640px).
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setAtFooter(e.isIntersecting));
    io.observe(footer);
    return () => { io.disconnect(); setAtFooter(false); };
  }, [pathname]);

  // The homepage's first screen belongs to the flight path: show the button once the
  // reader has moved past it.
  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setAtHero(e.intersectionRatio > 0.35), { threshold: [0, 0.35, 1] });
    io.observe(hero);
    return () => { io.disconnect(); setAtHero(false); };
  }, [pathname]);

  return (
    <>
      {!open && (
        <button
          onClick={() => { setOpen(true); setLoaded(true); }}
          aria-label="Open Ask Ahmad - AI assistant"
          className={['chat-launcher', atFooter && 'at-footer', atHero && 'at-hero'].filter(Boolean).join(' ')}
          style={{
            position: 'fixed',
            bottom: 'calc(22px + env(safe-area-inset-bottom))',
            right: 20,
            zIndex: 9500,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 16px 10px 14px',
            borderRadius: 3,
            border: '1px solid var(--bd2)',
            background: 'var(--background)',
            color: 'var(--foreground)',
            cursor: 'pointer',
            font: 'inherit',
          }}
        >
          <span aria-hidden style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary-fill)' }} />
          <span style={{ fontSize: 15 }}>Ask Ahmad</span>
        </button>
      )}

      {loaded && (
        <AnimatePresence>
          {open && <ChatPanel key="panel" onClose={() => setOpen(false)} />}
        </AnimatePresence>
      )}

      <style>{`
        @media print { .chat-launcher { display: none; } }
        .chat-launcher.at-hero { opacity: 0; transform: translateY(12px); pointer-events: none; }
        .chat-launcher:hover { border-color: var(--foreground) !important; }
        @media (max-width: 420px) {
          .chat-launcher { right: 12px !important; bottom: calc(12px + env(safe-area-inset-bottom)) !important; padding: 10px 14px 10px 12px !important; }
        }
      `}</style>
    </>
  );
}
