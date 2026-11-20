'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { journeyPhoto, type PhotoId } from '@/lib/data/worlds';
import { useJourneyTier, type JourneyTier } from '@/lib/journey/tier';
import { JourneyPhoto } from './JourneyPhoto';
import { publishScene } from '@/lib/journey/store';
import { sceneScrollTop, seenOpacity } from '@/lib/journey/anchors';
import { addScene, flushTick } from '@/lib/journey/ticker';
import { jumpTo } from '@/components/ui/smooth-scroll';

/**
 * The signature move: a sticky, full-screen real photo that the camera flies into as
 * you scroll, coming out the other side into the next photo.
 *
 * Progress p (0..1) across the scene's scroll length drives, compositor-only:
 *   from photo: scale 1 → maxZoom about its focal point over p 0..0.55, fades out 0.45..0.6
 *   to photo:   fades in 0.45..0.65, settles from 1.3× to 1× over 0.45..0.75
 *   copy:       switches on at 0.6 (never half-faded) and rises into place over 0.6..0.8
 *               (immediately visible when there is no `from`)
 * Panoramas (the Glass Bowl, 1366px) never zoom: they are never drawn larger than their real size.
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

/** Map p from [a, b] to [from, to], clamped, with smoothstep easing. */
export function span(p: number, a: number, b: number, from: number, to: number): number {
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
  // Smoothstep: every move eases in and out instead of starting and stopping dead.
  return from + (to - from) * t * t * (3 - 2 * t);
}

/** Opacity and transform, plus pointer-events so an invisible layer never swallows clicks. */
export function setLayer(el: HTMLElement | null, opacity: number, transform: string) {
  if (!el) return;
  // Write only what changed: every style write costs a style recalc (and a session
  // recorder event), and most frames leave most layers where they were.
  // (Compared with what we last wrote, not el.style, which the browser normalises.)
  const o = String(Math.round(opacity * 1000) / 1000);
  const pe = opacity > 0.5 ? 'auto' : 'none';
  const prev = written.get(el);
  if (prev?.o !== o) el.style.opacity = o;
  if (prev?.t !== transform) el.style.transform = transform;
  if (prev?.pe !== pe) el.style.pointerEvents = pe;
  // A faded-out layer stops its decorative loops (globals.css [data-idle]).
  const idle = opacity < 0.02;
  if (prev?.idle !== idle) el.toggleAttribute('data-idle', idle);
  written.set(el, { o, t: transform, pe, idle });
}
const written = new WeakMap<HTMLElement, { o: string; t: string; pe: string; idle: boolean }>();

const origin = (id: PhotoId) => {
  const f = journeyPhoto(id).focal;
  return `${f.x * 100}% ${f.y * 100}%`;
};
const zoomCap = (id: PhotoId, z: number) => (journeyPhoto(id).panorama ? 1 : z);

/** `depthable` photos are handed to the depth canvas once it has their textures; panoramas stay CSS. */
const photoClass = (id: PhotoId) => (journeyPhoto(id).panorama ? 'flyin-photo' : 'flyin-photo depthable');

const layer: React.CSSProperties = { position: 'absolute', inset: 0 };

export function FlyInScene({
  id,
  from,
  to,
  length = 2.5,
  maxZoom = 3.2,
  priority = false,
  joinPrevious = false,
  children,
}: {
  id: string;
  from?: PhotoId;
  to: PhotoId;
  /** Scroll length in viewport heights. */
  length?: number;
  maxZoom?: number;
  priority?: boolean;
  /**
   * Start one screen early, tucked under the previous scene (which must stack above,
   * e.g. a higher z-index), so this stage is already pinned when the previous one lets
   * go. With the previous scene's photo as `from`, the handover is seamless instead of
   * two copies of the photo sliding past a seam.
   */
  joinPrevious?: boolean;
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
    const full = tier === 'full';
    const paint = (p: number) => {
      const fromScale = span(p, 0, 0.55, 1, fromZoom);
      const toScale = from ? span(p, 0.45, 0.75, toStart, 1) : 1;
      const mix = from ? span(p, 0.45, 0.65, 0, 1) : 1;
      if (from) {
        setLayer(fromRef.current, span(p, 0.45, 0.6, 1, 0), `scale(${fromScale.toFixed(4)})`);
        setLayer(toRef.current, mix, `scale(${toScale.toFixed(4)})`);
        // The words are either fully shown or not at all: no half-faded copy mid-transition.
        setLayer(copyRef.current, p >= 0.6 ? 1 : 0, `translateY(${span(p, 0.6, 0.8, 40, 0).toFixed(1)}px)`);
      }
      if (full) publish(fromScale, toScale, mix);
      subs.current.forEach((fn) => fn(p));
    };
    // Full tier: tell the depth canvas what this scene shows and how much of the
    // screen its stage covers (the canvas draws whichever scene owns the screen).
    let last = { fromScale: 1, toScale: 1, mix: from ? 0 : 1 };
    let stageTop = 0;
    const publish = (fromScale: number, toScale: number, mix: number) => {
      last = { fromScale, toScale, mix };
      const vh = window.innerHeight;
      const h = Math.max(0, Math.min(stageTop + vh, vh) - Math.max(stageTop, 0));
      publishScene(id, { from, to, fromScale, toScale, mix, area: h * window.innerWidth });
    };
    let painted = false;
    const rootEl = root.current;
    if (!rootEl) return;
    // One shared loop (ticker.ts) drives every scene; this one only runs near the viewport.
    const remove = addScene({
      root: rootEl,
      join: joinPrevious,
      update: (p, top) => {
        stageTop = top;
        if (painted && p === progress.current) {
          // Same progress but the stage moved on screen (entering/leaving).
          if (full) publish(last.fromScale, last.toScale, last.mix);
          return;
        }
        painted = true;
        progress.current = p;
        paint(p);
      },
      leave: () => { if (full) publishScene(id, null); },
    });
    // Keyboard focus that lands on a faded-out layer (e.g. Shift+Tab back into the
    // opening's buttons) scrolls the scene to where that layer is fully shown.
    const onFocus = (e: FocusEvent) => {
      const el = e.target as HTMLElement;
      const layer = el.closest<HTMLElement>('[data-show-at]');
      if (!layer || !rootEl.contains(layer)) return;
      flushTick(); // a focus jump may not have been painted yet: judge the real state
      if (seenOpacity(el) > 0.99) return;
      jumpTo(sceneScrollTop(rootEl, Number(layer.dataset.showAt)));
    };
    rootEl.addEventListener('focusin', onFocus);
    return () => {
      rootEl.removeEventListener('focusin', onFocus);
      remove();
      publishScene(id, null);
    };
  }, [still, from, to, maxZoom, joinPrevious, tier, id]);

  const state = useMemo(() => ({ tier, still, subscribe }), [tier, still, subscribe]);

  if (still) {
    return (
      <SceneContext.Provider value={state}>
        <div data-scene={id} style={{ position: 'relative', minHeight: '100svh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
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
      <div
        ref={root}
        data-scene={id}
        data-pinned=""
        data-copy-at={from ? 0.85 : 0}
        data-join={joinPrevious ? '' : undefined}
        style={{ position: 'relative', height: `${(length + (joinPrevious ? 1 : 0)) * 100}svh`, marginTop: joinPrevious ? '-100svh' : undefined }}
      >
        <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden' }}>
          <div ref={toRef} className={photoClass(to)} data-photo={to} style={{ ...layer, transformOrigin: origin(to), opacity: from ? 0 : 1 }}>
            <JourneyPhoto id={to} priority={priority} />
          </div>
          {from && (
            <div ref={fromRef} className={photoClass(from)} data-photo={from} style={{ ...layer, transformOrigin: origin(from) }}>
              <JourneyPhoto id={from} />
            </div>
          )}
          {/* keeps the transparent site header readable over bright skies */}
          <div aria-hidden style={{ ...layer, background: 'linear-gradient(to bottom, rgba(13,14,18,0.55), rgba(13,14,18,0) 22%)' }} />
          <div ref={copyRef} data-show-at={from ? 0.85 : 0} style={{ ...layer, opacity: from ? 0 : 1, pointerEvents: from ? 'none' : 'auto', display: 'flex', flexDirection: 'column' }}>
            {children}
          </div>
        </div>
      </div>
    </SceneContext.Provider>
  );
}

/**
 * A block of copy over a photo, placed on the side of the frame away from the photo's
 * focal point, over a photographic shade that darkens that side of the frame (on phones,
 * where the copy spans the width, the shade runs down the middle instead). An `aside`
 * (StageArt) fills the other side so the frame is never words plus empty photo.
 */
export function SceneCopy({ photo, children, aside, center = false, style, maxWidth = 620 }: { photo: PhotoId; children: React.ReactNode; aside?: React.ReactNode; center?: boolean; style?: React.CSSProperties; maxWidth?: number }) {
  const right = journeyPhoto(photo).focal.x < 0.45;
  return (
    <div className={`scene-shade ${center ? 'centred' : right ? 'from-right' : 'from-left'}`} style={{ flex: 1, display: 'flex', width: '100%' }}>
      <div
        className="scene-row"
        style={{
          flex: 1, display: 'flex', width: '100%', maxWidth: aside ? 1360 : 1280, margin: '0 auto', padding: '0 clamp(20px, 4vw, 52px)',
          flexDirection: right ? 'row-reverse' : 'row',
          justifyContent: center ? 'center' : aside ? 'space-between' : right ? 'flex-end' : 'flex-start',
          alignItems: 'center', gap: 'clamp(28px, 4vw, 64px)', ...style,
        }}
      >
        <div className="scene-copy" style={{ position: 'relative', maxWidth, flex: aside ? '0 1 560px' : undefined, padding: 'clamp(18px, 3vw, 36px)', textAlign: center ? 'center' : undefined }}>{children}</div>
        {aside && <div className="scene-aside">{aside}</div>}
      </div>
    </div>
  );
}
