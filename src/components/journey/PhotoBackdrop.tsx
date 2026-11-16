'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { journeyPhoto, worldForProject, type PhotoId } from '@/lib/data/worlds';
import { useJourneyTier } from '@/lib/journey/tier';
import { JourneyPhoto } from './JourneyPhoto';

/**
 * The journey's photo behind an inside page (case study, field note, docs). It sits
 * fixed behind the page (z-index -1: the page wrapper must isolate its stacking
 * context) and, over the first screen of scroll, the camera pushes in toward the focal
 * point while the photo fades out, so the reading part below sits on the plain dark
 * background. CSS only on every device; still (35%) for reduced motion.
 */
export function PhotoBackdrop({ id }: { id: PhotoId }) {
  const still = useJourneyTier() === 'still';
  const wrap = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const f = journeyPhoto(id).focal;

  useEffect(() => {
    if (still) return;
    let frame = 0;
    const paint = () => {
      frame = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
      if (wrap.current) wrap.current.style.opacity = String(1 - p);
      if (photo.current) photo.current.style.transform = `scale(${1 + 0.8 * p})`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    paint();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [still]);

  return (
    <div ref={wrap} data-photo-backdrop={id} aria-hidden style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', opacity: still ? 0.35 : 1 }}>
      <div ref={photo} style={{ position: 'absolute', inset: 0, transformOrigin: `${f.x * 100}% ${f.y * 100}%`, willChange: 'transform' }}>
        <JourneyPhoto id={id} priority />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(13,14,18,0.72), rgba(13,14,18,0.86) 55%, #0d0e12 100%)' }} />
    </div>
  );
}

/** For the case-study layout: the photo of the world this case study belongs to. */
export function CaseStudyBackdrop() {
  const slug = usePathname().split('/').filter(Boolean)[1];
  let id: PhotoId = 'opening';
  try {
    id = worldForProject(slug);
  } catch {
    /* not a known case study: neutral photo */
  }
  return <PhotoBackdrop id={id} />;
}
