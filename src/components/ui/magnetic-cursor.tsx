'use client';
import { useEffect } from 'react';

/**
 * Amber spring-physics cursor: 4px dot (exact) + trailing ring (spring damped).
 * Interactive elements with [data-magnetic] pull the ring toward their center.
 * Renders only on pointer-fine devices; hidden on touch.
 * Respects prefers-reduced-motion by removing spring lag.
 *
 * Perf: magnetic zone rects are cached in document-space coordinates (or
 * viewport coordinates for zones anchored to a `position:fixed` element in
 * their ancestor chain) so that scrolling never forces a layout read; the
 * cache is only rebuilt on mount, debounced resize, and debounced DOM
 * mutations. The rAF loop pauses when the tab is hidden, or when the pointer
 * has been idle >2s AND the dot/ring/opacity physics have fully settled —
 * the canvas simply keeps its last painted frame, so the cursor stays
 * visible and static at zero cost (idle never fades the cursor: the site
 * hides the native cursor via `cursor:none`, so this canvas cursor is the
 * only pointer indicator). Resumes on the next mousemove or on visibility
 * regain.
 */
export function MagneticCursor() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const canvas = document.createElement('canvas');
    canvas.style.cssText =
      'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:999999;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d')!;

    let W = 0, H = 0;
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * devicePixelRatio;
      canvas.height = H * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();

    // Mouse
    let mx = -400, my = -400;
    // Ring – spring follower
    let rx = -400, ry = -400, rvx = 0, rvy = 0;
    // Ring spring target (includes magnetic pull)
    let rtx = -400, rty = -400;
    // Radius & opacity
    let ringR = 13, ringRTarget = 13;
    let opacity = 0, opTarget = 0;
    let isDown = false;
    let isMagnetic = false;
    let raf: number;

    // rAF pause state – the loop stops rescheduling itself when hidden or
    // idle+settled, and is resumed explicitly (mousemove / visibility regain).
    let running = false;
    let idle = false;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    const armIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        idle = true; // does NOT touch opacity/opTarget — the native cursor
        // is hidden (cursor:none), so this canvas cursor must stay visible
        // while idle. The loop only pauses once physics separately settle.
      }, 2000);
    };

    // Whether the pointer is currently within the document (set on
    // mousemove, cleared on mouseleave) – used to decide whether visibility
    // regain should resume the loop.
    let pointerInside = false;

    // Document-space magnetic zone cache. Centers are stored in document
    // coordinates (rect + scroll offset) so scrolling never invalidates the
    // cache; rx/ry are viewport-stable half-extents (width/2, height/2).
    // `fixed` zones (e.g. the floating chat launcher) don't move in document
    // space — their center is stored in viewport coordinates instead, or it
    // would visibly drift from the element while the page is scrolled.
    type MagneticZone = { el: HTMLElement; cx: number; cy: number; rx: number; ry: number; fixed: boolean };
    let zones: MagneticZone[] = [];

    // True if `node` or any ancestor up to (and including) document.body is
    // position:fixed — such a chain anchors the element to the viewport
    // regardless of scroll, even when `node` itself isn't the fixed one
    // (e.g. a future magnetic button inside a fixed panel/toolbar). Only
    // called from rebuildZones, never from the mousemove hot path.
    const isViewportAnchored = (node: HTMLElement): boolean => {
      let cur: HTMLElement | null = node;
      while (cur) {
        if (getComputedStyle(cur).position === 'fixed') return true;
        if (cur === document.body) return false;
        cur = cur.parentElement;
      }
      return false;
    };

    const rebuildZones = () => {
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const found = document.querySelectorAll<HTMLElement>('[data-magnetic]');
      const next: MagneticZone[] = [];
      for (const el of found) {
        const r = el.getBoundingClientRect();
        const fixed = isViewportAnchored(el);
        next.push({
          el,
          cx: r.left + (fixed ? 0 : scrollX) + r.width / 2,
          cy: r.top + (fixed ? 0 : scrollY) + r.height / 2,
          rx: r.width / 2,
          ry: r.height / 2,
          fixed,
        });
      }
      zones = next;
    };
    rebuildZones(); // initial mount

    // Rebuild trigger: resize (debounced 150ms). Canvas resize itself stays
    // immediate so the viewport never looks stretched mid-drag.
    let resizeRebuildTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      resize(); // reassigning canvas.width/height resets the bitmap to
      // transparent per the Canvas spec, wiping any frozen paused frame —
      // wake() below repaints it immediately even with no mouse movement
      // (DevTools toggle, window snap, browser zoom all fire `resize`).
      wake();
      if (resizeRebuildTimer) clearTimeout(resizeRebuildTimer);
      resizeRebuildTimer = setTimeout(rebuildZones, 150);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // Rebuild trigger: DOM mutations (debounced 250ms) – catches
    // projects-filter reflow and modal mount/unmount changing which
    // elements carry [data-magnetic].
    let mutationRebuildTimer: ReturnType<typeof setTimeout> | undefined;
    const zoneObserver = new MutationObserver(() => {
      if (mutationRebuildTimer) clearTimeout(mutationRebuildTimer);
      mutationRebuildTimer = setTimeout(rebuildZones, 250);
    });
    zoneObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-magnetic'],
    });

    const tick = () => {
      ctx.clearRect(0, 0, W, H);

      // Spring physics for ring
      if (reduced) {
        rx = rtx; ry = rty;
      } else {
        rvx = (rvx + (rtx - rx) * 0.17) * 0.73;
        rvy = (rvy + (rty - ry) * 0.17) * 0.73;
        rx += rvx;
        ry += rvy;
      }

      ringR  += (ringRTarget - ringR)  * 0.11;
      opacity += (opTarget - opacity)  * 0.09;

      if (opacity > 0.01) {
        ctx.save();
        ctx.globalAlpha = opacity;

        // Ring
        ctx.beginPath();
        ctx.arc(rx, ry, Math.max(1, ringR), 0, Math.PI * 2);
        ctx.strokeStyle = isMagnetic
          ? 'rgba(245,158,11,0.92)'
          : 'rgba(45,212,191,0.58)';
        ctx.lineWidth = isMagnetic ? 1.6 : 1.2;
        ctx.stroke();

        // Dot – always at exact mouse position
        ctx.beginPath();
        ctx.arc(mx, my, isDown ? 2.5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#2dd4bf';
        ctx.fill();

        ctx.restore();
      }

      // Pause: tab hidden, or pointer idle >2s AND the physics have fully
      // settled (position/radius/opacity all within epsilon of target).
      // Nothing would visibly change on the next frame either, so the
      // canvas simply keeps its last painted frame — cursor stays visible
      // and static at zero cost. Resumes on mousemove (onMove), mouseleave
      // (onLeave), or visibility regain (onVisibility).
      const settled =
        Math.abs(rx - rtx) < 0.1 &&
        Math.abs(ry - rty) < 0.1 &&
        Math.abs(ringR - ringRTarget) < 0.1 &&
        Math.abs(opacity - opTarget) < 0.005;
      if (document.hidden || (idle && settled)) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    // Resume the loop if it had paused (idle+settled) and something just
    // changed a spring target (opacity, ring radius, pull target) — called
    // from every handler that mutates one of those, so a frozen frame is
    // never left stale. No-op if already running or the tab is hidden.
    const wake = () => {
      if (!running && !document.hidden) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      opTarget = 1;
      pointerInside = true;
      idle = false;
      armIdleTimer();
      wake();

      // Reset to plain follow
      rtx = mx; rty = my;
      ringRTarget = 13;
      isMagnetic = false;

      // Magnetic zones – compare against the cache (no layout reads here;
      // scrolling never rebuilds it). Static zones are compared in document
      // space; fixed zones are already viewport-stable and compared as-is.
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const dx0 = mx + scrollX;
      const dy0 = my + scrollY;
      for (const z of zones) {
        const px = z.fixed ? mx : dx0;
        const py = z.fixed ? my : dy0;
        const dist = Math.hypot(px - z.cx, py - z.cy);
        const zone = Math.max(z.rx, z.ry) * 1.2 + 36;
        if (dist < zone) {
          const pull = 1 - dist / zone;
          const cxViewport = z.fixed ? z.cx : z.cx - scrollX;
          const cyViewport = z.fixed ? z.cy : z.cy - scrollY;
          rtx = mx + (cxViewport - mx) * pull * 0.4;
          rty = my + (cyViewport - my) * pull * 0.4;
          ringRTarget = 16 + pull * 16;
          isMagnetic = true;
          break;
        }
      }
    };

    const onLeave = () => { opTarget = 0; pointerInside = false; wake(); };
    const onDown  = () => { isDown = true; ringRTarget = 5; wake(); };
    const onUp    = () => { isDown = false; ringRTarget = isMagnetic ? 30 : 13; wake(); };

    const onVisibility = () => {
      if (document.hidden) {
        if (running) {
          cancelAnimationFrame(raf);
          running = false;
        }
      } else if (pointerInside) {
        wake();
      }
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('visibilitychange', onVisibility);

    running = true;
    raf = requestAnimationFrame(tick);
    armIdleTimer();

    return () => {
      if (running) cancelAnimationFrame(raf);
      if (idleTimer) clearTimeout(idleTimer);
      if (resizeRebuildTimer) clearTimeout(resizeRebuildTimer);
      if (mutationRebuildTimer) clearTimeout(mutationRebuildTimer);
      zoneObserver.disconnect();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return null;
}
