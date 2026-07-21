'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import { MONO } from '@/components/shared/section-helpers';

// The panel (and the ai/@ai-sdk chunks) load only on first open.
const ChatPanel = dynamic(() => import('./ChatPanel').then((m) => ({ default: m.ChatPanel })), { ssr: false });

/**
 * Floating "Ask Ahmad" bubble — bottom-right, above everything, zero chat JS
 * in the initial bundle. Opens the streaming panel on click.
 */
export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!open && (
        <button
          onClick={() => { setOpen(true); setLoaded(true); }}
          aria-label="Open Ask Ahmad — AI assistant"
          data-magnetic=""
          className="chat-launcher"
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
            border: '1px solid rgba(45,212,191,0.4)',
            background: 'rgba(15,17,23,0.92)',
            color: 'var(--primary)',
            cursor: 'pointer',
            boxShadow: '0 12px 34px -12px rgba(0,0,0,0.7), 0 0 24px -10px rgba(45,212,191,0.5)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <span aria-hidden style={{ position: 'relative', width: 9, height: 9 }}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--primary)' }} />
            <span className="chat-launcher-ping" style={{ position: 'absolute', inset: -3, borderRadius: '50%', border: '1.5px solid var(--primary)' }} />
          </span>
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.09em', textTransform: 'uppercase' }}>Ask Ahmad</span>
        </button>
      )}

      {loaded && (
        <AnimatePresence>
          {open && <ChatPanel key="panel" onClose={() => setOpen(false)} />}
        </AnimatePresence>
      )}

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .chat-launcher-ping { animation: chat-ping 2.6s cubic-bezier(0, 0, 0.2, 1) infinite; }
        }
        @keyframes chat-ping { 0% { transform: scale(0.8); opacity: 0.8; } 70%, 100% { transform: scale(2.1); opacity: 0; } }
        @media print { .chat-launcher { display: none; } }
        @media (max-width: 420px) {
          .chat-launcher { right: 12px !important; bottom: calc(12px + env(safe-area-inset-bottom)) !important; padding: 10px 14px 10px 12px !important; }
        }
      `}</style>
    </>
  );
}
