'use client';

import React from 'react';
import { Pic, largestVariant } from './pic';
import { useLightboxOpen } from '@/components/layout/LightboxProvider';

/** A photo at its own shape (never cropped) that opens large in the lightbox. */
export function ZoomPic({ src, alt, sizes }: { src: string; alt: string; sizes?: string }) {
  const open = useLightboxOpen();
  return (
    <button type="button" className="zoom-pic lift-img" onClick={() => open(largestVariant(src), alt)} aria-label={`Enlarge photo: ${alt}`}>
      <Pic src={src} alt={alt} sizes={sizes} style={{ display: 'block', width: '100%', height: 'auto' }} />
    </button>
  );
}
