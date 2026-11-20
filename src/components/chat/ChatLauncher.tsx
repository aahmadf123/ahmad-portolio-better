'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import { MONO } from '@/components/shared/section-helpers';

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

  // On phones the bubble sat on top of the footer links; step aside while the
  // footer is on screen (CSS below only applies the hide at <=640px).
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setAtFooter(e.isIntersecting));
    io.observe(footer);
    return () => { io.disconnect(); setAtFooter(false); };
  }, [pathname]);

  return (
    <>
      {!open && (
        <button
          onClick={() => { setOpen(true); setLoaded(true); }}
          aria-label="Open Ask Ahmad - AI assistant"
          data-magnetic=""
          className={atFooter ? 'chat-launcher at-footer' : 'chat-launcher'}
          style={{
            position: 'fixed',
            bottom: 'calc(22px + env(safe-area-inset-bottom))',
            right: 20,
            zIndex: 9500,
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '12px 18px 12px 14px',
            borderRadius: 99,
            border: '1px solid var(--primary)',
            background: 'var(--background)',
            color: 'var(--primary)',
            cursor: 'pointer',
          }}
        >
          <span aria-hidden style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--primary)' }} />
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.09em', textTransform: 'uppercase' }}>Ask Ahmad</span>
        </button>
      )}

      {loaded && (
        <AnimatePresence>
          {open && <ChatPanel key="panel" onClose={() => setOpen(false)} />}
        </AnimatePresence>
      )}

      <style>{`
        @media print { .chat-launcher { display: none; } }
        @media (max-width: 420px) {
          .chat-launcher { right: 12px !important; bottom: calc(12px + env(safe-area-inset-bottom)) !important; padding: 10px 14px 10px 12px !important; }
        }
      `}</style>
    </>
  );
}
