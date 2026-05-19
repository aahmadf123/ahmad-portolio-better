'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface LightboxProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

export function Lightbox({ src, alt = '', onClose }: LightboxProps) {
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
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'zoom-out',
        animation: 'lb-in 0.18s ease',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
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
        onClick={onClose}
        aria-label="Close lightbox"
        style={{
          position: 'absolute', top: 20, right: 24,
          background: 'rgba(242,237,216,0.08)',
          border: '1px solid rgba(242,237,216,0.18)',
          borderRadius: '50%', width: 40, height: 40,
          color: '#F2EDD8', fontSize: 18, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          lineHeight: 1, transition: 'background 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(242,237,216,0.18)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(242,237,216,0.08)'; }}
      >✕</button>
      <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', fontFamily: "var(--font-chakra), 'Chakra Petch', monospace", fontSize: 10, color: 'rgba(242,237,216,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', userSelect: 'none' }}>
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
