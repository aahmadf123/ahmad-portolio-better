'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { largestVariant } from '@/components/ui/pic';

interface LightboxProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

export function Lightbox({ src, alt = '', onClose }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Dialog focus: move focus to Close on open, hand it back to whatever opened
  // the lightbox on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => { opener?.focus?.(); };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', h);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt ? `Image: ${alt}` : 'Image preview'}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'color-mix(in srgb, var(--background) 92%, transparent)',
        backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'zoom-out',
        animation: 'lb-in 0.18s ease',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={largestVariant(src)}
        alt={alt}
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '92vw',
          maxHeight: '92vh',
          objectFit: 'contain',
          borderRadius: 8,
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
          cursor: 'default',
          animation: 'lb-img-in 0.22s cubic-bezier(0.16,1,0.3,1)',
        }}
      />
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Close image preview"
        style={{
          position: 'absolute', top: 20, right: 24,
          background: 'color-mix(in srgb, var(--foreground) 8%, transparent)',
          border: '1px solid color-mix(in srgb, var(--foreground) 18%, transparent)',
          borderRadius: '50%', width: 40, height: 40,
          color: 'var(--foreground)', fontSize: 18, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          lineHeight: 1, transition: 'background 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'color-mix(in srgb, var(--foreground) 18%, transparent)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'color-mix(in srgb, var(--foreground) 8%, transparent)'; }}
      >✕</button>
      <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', fontFamily: "var(--font-body), system-ui, sans-serif", fontSize: 13, color: 'color-mix(in srgb, var(--foreground) 35%, transparent)', letterSpacing: 0, userSelect: 'none' }}>
        Click anywhere or press Esc to close
      </div>
      <style>{`
        @keyframes lb-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes lb-img-in { from { opacity: 0; transform: scale(0.94) } to { opacity: 1; transform: scale(1) } }
      `}</style>
    </div>,
    document.body
  );
}

