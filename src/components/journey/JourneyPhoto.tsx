import React from 'react';
import { preload } from 'react-dom';
import { journeyPhoto, type PhotoId } from '@/lib/data/worlds';

const srcSet = (sizes: Record<string, string>) =>
  Object.entries(sizes).map(([w, src]) => `${src} ${w}w`).join(', ');

/**
 * A full-bleed journey photo: AVIF/WebP srcsets from the manifest, cropped around
 * the photo's focal point. Panoramas (the Glass Bowl) are shown whole, full width,
 * over a blurred copy of themselves instead of being cropped and blown up.
 */
export function JourneyPhoto({ id, priority = false }: { id: PhotoId; priority?: boolean }) {
  const p = journeyPhoto(id);
  const fallback = p.webp[String(p.widths.includes(1280) ? 1280 : Math.max(...p.widths))];
  if (priority) {
    // Preload what <picture> will actually pick (AVIF); browsers without AVIF skip it by type.
    const avif = p.avif[String(p.widths.includes(1280) ? 1280 : Math.max(...p.widths))];
    preload(avif, { as: 'image', type: 'image/avif', imageSrcSet: srcSet(p.avif), imageSizes: '100vw', fetchPriority: 'high' });
  }
  const position = `${p.focal.x * 100}% ${p.focal.y * 100}%`;
  const img = (
    <picture>
      <source type="image/avif" srcSet={srcSet(p.avif)} sizes="100vw" />
      <img
        src={fallback}
        srcSet={srcSet(p.webp)}
        sizes="100vw"
        alt={p.alt}
        width={p.width}
        height={p.height}
        fetchPriority={priority ? 'high' : undefined}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: p.panorama ? 'contain' : 'cover', objectPosition: position,
        }}
      />
    </picture>
  );
  if (!p.panorama || !p.fill) return img;
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.fill} alt="" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      {img}
    </>
  );
}
