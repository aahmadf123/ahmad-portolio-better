'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { journeyPhoto, type PhotoId } from '@/lib/data/worlds';
import { useJourneyTier, type JourneyTier } from '@/lib/journey/tier';
import { JourneyPhoto } from './JourneyPhoto';

/**
 * The signature move: a sticky, full-screen real photo that the camera flies into as
 * you scroll, coming out the other side into the next photo.
 *
 * Progress p (0..1) across the scene's scroll length drives, compositor-only:
 *   from photo: scale 1 → maxZoom about its focal point over p 0..0.55, fades out 0.45..0.6
 *   to photo:   fades in 0.45..0.65, settles from 1.3× to 1× over 0.45..0.75
 *   copy:       fades and rises in over 0.6..0.8 (immediately visible when there is no `from`)
 * Panoramas (the Glass Bowl) cap the zoom at 1.6× so their low resolution never shows.
 * In the `still` tier (reduced motion) none of this runs: the `to` photo sits behind
 * the copy at full size and the page just scrolls.
 *
 * Styles are written straight to the layers from one rAF-throttled scroll handler.
 * (framer-motion's m.div missed values set before it finished mounting, which froze a
 * scene that loaded mid-scroll: refresh, back navigation, deep links.)
 */

type Frame = (p: number) => void;
interface SceneState {
  tier: JourneyTier;
  still: boolean;
  /** Run `fn` with the current progress now and on every change; returns an unsubscribe. */
  subscribe: (fn: Frame) => () => void;
}
const SceneContext = createContext<SceneState | null>(null);

export function useScene(): SceneState {
  const s = useContext(SceneContext);
  if (!s) throw new Error('useScene must be used inside FlyInScene');
  return s;
}

/** Call `fn(p)` now and on every progress change of the enclosing scene (not in the still tier). */
export function useSceneFrame(fn: Frame) {
  const { subscribe, still } = useScene();
  const ref = useRef(fn);
  useEffect(() => { ref.current = fn; });
  useEffect(() => (still ? undefined : subscribe((p) => ref.current(p))), [subscribe, still]);
}

/** Linear map of p from [a, b] to [from, to], clamped. */
export function span(p: number, a: number, b: number, from: number, to: number): number {
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return from + (to - from) * t;
}

/** Opacity and transform, plus pointer-events so an invisible layer never swallows clicks. */
export function setLayer(el: HTMLElement | null, opacity: number, transform: string) {
  if (!el) return;
  el.style.opacity = String(opacity);
  el.style.transform = transform;
  el.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
}

const origin = (id: PhotoId) => {
  const f = journeyPhoto(id).focal;
  return `${f.x * 100}% ${f.y * 100}%`;
};
const zoomCap = (id: PhotoId, z: number) => (journeyPhoto(id).panorama ? Math.min(z, 1.6) : z);

const layer: React.CSSProperties = { position: 'absolute', inset: 0, willChange: 'transform, opacity' };

export function FlyInScene({
  id,
  from,
  to,
  length = 2.5,
  maxZoom = 3.2,
  priority = false,
  labelledBy,
  children,
}: {
  id: string;
  from?: PhotoId;
  to: PhotoId;
  /** Scroll length in viewport heights. */
  length?: number;
  maxZoom?: number;
  priority?: boolean;
  labelledBy?: string;
  children: React.ReactNode;
}) {
  const tier = useJourneyTier();
  const still = tier === 'still';
  const root = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const subs = useRef(new Set<Frame>());
  const progress = useRef(0);

  const subscribe = useCallback((fn: Frame) => {
    subs.current.add(fn);
    fn(progress.current);
    return () => { subs.current.delete(fn); };
  }, []);

  useEffect(() => {
    if (still) return;
    const fromZoom = from ? zoomCap(from, maxZoom) : 1;
    const toStart = from ? zoomCap(to, 1.3) : 1;
    const paint = (p: number) => {
      if (from) {
        setLayer(fromRef.current, span(p, 0.45, 0.6, 1, 0), `scale(${span(p, 0, 0.55, 1, fromZoom)})`);
        setLayer(toRef.current, span(p, 0.45, 0.65, 0, 1), `scale(${span(p, 0.45, 0.75, toStart, 1)})`);
        setLayer(copyRef.current, span(p, 0.6, 0.8, 0, 1), `translateY(${span(p, 0.6, 0.8, 40, 0)}px)`);
      }
      subs.current.forEach((fn) => fn(p));
    };
    let frame = 0;
    let painted = false;
    const measure = () => {
      frame = 0;
      const el = root.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const range = r.height - window.innerHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 0;
      if (painted && p === progress.current) return;
      painted = true;
      progress.current = p;
      paint(p);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [still, from, to, maxZoom]);

  const state = useMemo(() => ({ tier, still, subscribe }), [tier, still, subscribe]);

  if (still) {
    return (
      <SceneContext.Provider value={state}>
        <div data-scene={id} aria-labelledby={labelledBy} style={{ position: 'relative', minHeight: '100svh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="flyin-photo" style={{ position: 'absolute', inset: 0 }}><JourneyPhoto id={to} priority={priority} /></div>
          <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</div>
        </div>
      </SceneContext.Provider>
    );
  }

  // Server-rendered start state (p = 0): with a `from`, the old photo is showing and the
  // new photo and copy are hidden; without one, the `to` photo and copy show at once.
  return (
    <SceneContext.Provider value={state}>
      <div ref={root} data-scene={id} aria-labelledby={labelledBy} style={{ position: 'relative', height: `${length * 100}svh` }}>
        <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden' }}>
          <div ref={toRef} className="flyin-photo" style={{ ...layer, transformOrigin: origin(to), opacity: from ? 0 : 1 }}>
            <JourneyPhoto id={to} priority={priority} />
          </div>
          {from && (
            <div ref={fromRef} className="flyin-photo" style={{ ...layer, transformOrigin: origin(from) }}>
              <JourneyPhoto id={from} />
            </div>
          )}
          {/* keeps the transparent site header readable over bright skies */}
          <div aria-hidden style={{ ...layer, background: 'linear-gradient(to bottom, rgba(13,14,18,0.55), rgba(13,14,18,0) 22%)' }} />
          <div ref={copyRef} style={{ ...layer, opacity: from ? 0 : 1, pointerEvents: from ? 'none' : 'auto', display: 'flex', flexDirection: 'column' }}>
            {children}
          </div>
        </div>
      </div>
    </SceneContext.Provider>
  );
}

/**
 * A block of copy over a photo, with a local scrim (not a full-screen darkening) and
 * placed on the side of the frame away from the photo's focal point.
 */
export function SceneCopy({ photo, children, style, maxWidth = 620 }: { photo: PhotoId; children: React.ReactNode; style?: React.CSSProperties; maxWidth?: number }) {
  const right = journeyPhoto(photo).focal.x < 0.45;
  return (
    <div style={{ flex: 1, display: 'flex', width: '100%', maxWidth: 1280, margin: '0 auto', padding: '0 clamp(20px, 4vw, 52px)', justifyContent: right ? 'flex-end' : 'flex-start', alignItems: 'center', ...style }}>
      <div className="scene-copy" style={{ position: 'relative', maxWidth, padding: 'clamp(12px, 3vw, 36px)' }}>
        {/* soft local scrim: fades to nothing well outside the text, so no box edge shows */}
        <div aria-hidden style={{ position: 'absolute', inset: '-14% -12%', background: 'radial-gradient(closest-side, rgba(13,14,18,0.82), rgba(13,14,18,0.62) 55%, rgba(13,14,18,0))', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>{children}</div>
      </div>
    </div>
  );
}
