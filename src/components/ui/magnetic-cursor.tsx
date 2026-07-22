'use client';
import { useEffect } from 'react';

/**
 * Morphing-diamond cursor: 3.5px dot (exact) + a diamond outline that lags on
 * a spring, stretches along its direction of travel, rotates into a crisp
 * square over [data-magnetic] targets, and compresses on click. Magnetic
 * attraction uses distance to the element's rect EDGE (uniform 36px skin,
 * displacement hard-capped in px) so large/expanded cards never yank the
 * shape toward their centers, plus an elementFromPoint occlusion guard so
 * posters hidden behind a modal scrim exert no pull.
 * Renders only on pointer-fine devices; hidden on touch.
 * Respects prefers-reduced-motion by removing spring lag and morph easing.
 *
 * Perf: magnetic zone rects are cached in document-space coordinates (or
 * viewport coordinates for zones anchored to a `position:fixed` element in
 * their ancestor chain) so that scrolling never forces a layout read; the
 * cache is only rebuilt on mount, debounced resize, and debounced DOM
 * mutations. The rAF loop pauses when the tab is hidden, or when the pointer
 * has been idle >2s AND the dot/ring/opacity physics have fully settled -
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
    // Diamond – spring follower
    let rx = -400, ry = -400, rvx = 0, rvy = 0;
    // Diamond spring target (includes magnetic pull)
    let rtx = -400, rty = -400;
    // Diamond half-extent (center to corner), rotation, opacity. The path's
    // vertices sit on the axes, so rot = 0 reads as a diamond and rot = PI/4
    // squares it up over magnetic targets.
    let size = 11, sizeT = 11;
    let rot = 0, rotT = 0;
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
        idle = true; // does NOT touch opacity/opTarget - the native cursor
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
    // space - their center is stored in viewport coordinates instead, or it
    // would visibly drift from the element while the page is scrolled.
    type MagneticZone = { el: HTMLElement; cx: number; cy: number; rx: number; ry: number; fixed: boolean };
    let zones: MagneticZone[] = [];

    // True if `node` or any ancestor up to (and including) document.body is
    // position:fixed - such a chain anchors the element to the viewport
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
        // Skip mid-morph / modal-sized rects (a poster mid-expansion can be
        // captured at panel size by the debounced rebuild) - a field this
        // large is never a useful magnet.
        if (r.width * r.height > 350_000) continue;
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
      // transparent per the Canvas spec, wiping any frozen paused frame -
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

    // All visual form lives here - swapping the cursor design later means
    // replacing this closure (and its spring states) only.
    const drawCursor = () => {
      ctx.save();
      ctx.globalAlpha = opacity;

      // Diamond - lags on the spring, stretches along its direction of
      // travel, squares up (rot -> 0) and goes amber over magnetic targets.
      const speed = Math.hypot(rvx, rvy);
      const stretch = reduced ? 0 : Math.min(0.35, speed * 0.03);
      ctx.save();
      ctx.translate(rx, ry);
      if (stretch > 0.005) {
        const ang = Math.atan2(rvy, rvx);
        ctx.rotate(ang);
        ctx.scale(1 + stretch, 1 - stretch * 0.6);
        ctx.rotate(rot - ang);
      } else {
        ctx.rotate(rot);
      }
      const s = Math.max(1, size);
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s, 0);
      ctx.lineTo(0, s);
      ctx.lineTo(-s, 0);
      ctx.closePath();
      ctx.strokeStyle = isMagnetic
        ? 'rgba(245,158,11,0.92)'
        : 'rgba(45,212,191,0.58)';
      ctx.lineWidth = isMagnetic ? 1.6 : 1.2;
      ctx.stroke();
      ctx.restore();

      // Dot – always at exact mouse position
      ctx.beginPath();
      ctx.arc(mx, my, isDown ? 2.5 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#2dd4bf';
      ctx.fill();

      ctx.restore();
    };

    const tick = () => {
      ctx.clearRect(0, 0, W, H);

      // Spring physics for the diamond
      if (reduced) {
        rx = rtx; ry = rty;
        size = sizeT; rot = rotT;
      } else {
        rvx = (rvx + (rtx - rx) * 0.17) * 0.73;
        rvy = (rvy + (rty - ry) * 0.17) * 0.73;
        rx += rvx;
        ry += rvy;
        size += (sizeT - size) * 0.11;
        rot  += (rotT - rot)  * 0.15;
      }

      opacity += (opTarget - opacity) * 0.09;

      if (opacity > 0.01) drawCursor();

      // Pause: tab hidden, or pointer idle >2s AND the physics have fully
      // settled (position/size/rotation/opacity all within epsilon of
      // target). Nothing would visibly change on the next frame either, so
      // the canvas simply keeps its last painted frame - cursor stays
      // visible and static at zero cost. Resumes on mousemove (onMove),
      // mouseleave (onLeave), or visibility regain (onVisibility).
      const settled =
        Math.abs(rx - rtx) < 0.1 &&
        Math.abs(ry - rty) < 0.1 &&
        Math.abs(size - sizeT) < 0.1 &&
        Math.abs(rot - rotT) < 0.01 &&
        Math.abs(opacity - opTarget) < 0.005;
      if (document.hidden || (idle && settled)) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    // Resume the loop if it had paused (idle+settled) and something just
    // changed a spring target (opacity, ring radius, pull target) - called
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
      sizeT = 11;
      rotT = 0;
      isMagnetic = false;

      // Magnetic zones – compare against the cache (no layout reads here;
      // scrolling never rebuilds it). Static zones are compared in document
      // space; fixed zones are already viewport-stable and compared as-is.
      // The field is a uniform skin around the element's RECT EDGE (not a
      // circle around its center), the displacement is hard-capped in px,
      // and occluded elements (e.g. posters behind a modal scrim) are
      // skipped - so large or expanded cards never blow the cursor up.
      const FIELD = 36;      // px of influence beyond the rect edge
      const MAX_SHIFT = 22;  // hard cap on diamond displacement
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const dx0 = mx + scrollX;
      const dy0 = my + scrollY;
      for (const z of zones) {
        const px = z.fixed ? mx : dx0;
        const py = z.fixed ? my : dy0;
        const ex = Math.max(Math.abs(px - z.cx) - z.rx, 0);
        const ey = Math.max(Math.abs(py - z.cy) - z.ry, 0);
        const edgeDist = Math.hypot(ex, ey);
        if (edgeDist < FIELD) {
          // Occlusion guard: only react if the element is actually under
          // the pointer's hit stack. Runs at most once per mousemove and
          // only when a zone candidate matched.
          const hit = document.elementFromPoint(mx, my);
          if (!hit || !(z.el === hit || z.el.contains(hit) || hit.contains(z.el))) continue;
          const pull = 1 - edgeDist / FIELD; // 1 inside the rect -> 0 at +FIELD px
          const cxViewport = z.fixed ? z.cx : z.cx - scrollX;
          const cyViewport = z.fixed ? z.cy : z.cy - scrollY;
          const dC = Math.hypot(cxViewport - mx, cyViewport - my) || 1;
          const shift = Math.min(dC * 0.4 * pull, MAX_SHIFT);
          rtx = mx + ((cxViewport - mx) / dC) * shift;
          rty = my + ((cyViewport - my) / dC) * shift;
          // Square up and grow toward the target's smaller half-extent,
          // capped so posters/modals never explode the shape.
          sizeT = Math.min(Math.max(z.rx, z.ry) * 0.5 + 8, 34);
          rotT = Math.PI / 4;
          isMagnetic = true;
          break;
        }
      }
    };

    const onLeave = () => { opTarget = 0; pointerInside = false; wake(); };
    const onDown  = () => { isDown = true; sizeT = 6; wake(); };
    const onUp    = () => { isDown = false; sizeT = isMagnetic ? 24 : 11; wake(); };

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
