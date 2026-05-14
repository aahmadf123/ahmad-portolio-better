'use client';
import { useEffect } from 'react';

/**
 * Amber spring-physics cursor: 4px dot (exact) + trailing ring (spring damped).
 * Interactive elements with [data-magnetic] pull the ring toward their center.
 * Renders only on pointer-fine devices; hidden on touch.
 * Respects prefers-reduced-motion by removing spring lag.
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
    window.addEventListener('resize', resize, { passive: true });

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

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      opTarget = 1;

      // Reset to plain follow
      rtx = mx; rty = my;
      ringRTarget = 13;
      isMagnetic = false;

      // Magnetic zones
      const targets = document.querySelectorAll<HTMLElement>('[data-magnetic]');
      for (const el of targets) {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(mx - cx, my - cy);
        const zone = Math.max(r.width, r.height) * 0.6 + 36;
        if (dist < zone) {
          const pull = 1 - dist / zone;
          rtx = mx + (cx - mx) * pull * 0.4;
          rty = my + (cy - my) * pull * 0.4;
          ringRTarget = 16 + pull * 16;
          isMagnetic = true;
          break;
        }
      }
    };

    const onLeave = () => { opTarget = 0; };
    const onDown  = () => { isDown = true; ringRTarget = 5; };
    const onUp    = () => { isDown = false; ringRTarget = isMagnetic ? 30 : 13; };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);

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
          ? 'rgba(240,180,41,0.92)'
          : 'rgba(240,180,41,0.58)';
        ctx.lineWidth = isMagnetic ? 1.6 : 1.2;
        ctx.stroke();

        // Dot – always at exact mouse position
        ctx.beginPath();
        ctx.arc(mx, my, isDown ? 2.5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#F0B429';
        ctx.fill();

        ctx.restore();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      window.removeEventListener('resize', resize);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return null;
}
