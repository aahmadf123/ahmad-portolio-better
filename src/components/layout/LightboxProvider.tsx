'use client';

import React, { useCallback, useState } from 'react';
import { Lightbox } from '@/components/ui/image-lightbox';

const LightboxCtx = React.createContext<(src: string, alt?: string) => void>(() => {});

export function useLightboxOpen() {
  return React.useContext(LightboxCtx);
}

/**
 * Client boundary exposing the shared image lightbox. Server-rendered children
 * pass through untouched (RSC-as-children is fully supported).
 */
export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [lb, setLb] = useState<{ src: string; alt: string } | null>(null);
  const openLb = useCallback((src: string, alt = '') => setLb({ src, alt }), []);
  return (
    <LightboxCtx.Provider value={openLb}>
      {children}
      {lb && <Lightbox src={lb.src} alt={lb.alt} onClose={() => setLb(null)} />}
    </LightboxCtx.Provider>
  );
}
