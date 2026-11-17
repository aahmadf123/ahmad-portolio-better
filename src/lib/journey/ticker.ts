/**
 * One scroll loop for every FlyInScene. Each scene used to listen to scroll itself and
 * read its own position every frame; seven of them did that on every frame of every
 * scroll. Now one rAF loop reads scrollY once, works out each scene's progress from
 * cached geometry (no layout reads while scrolling), and only updates scenes within a
 * screen of the viewport. Geometry is re-measured when the page changes size.
 */

export interface TickScene {
  root: HTMLElement;
  /** Starts one screen early under the previous scene (FlyInScene joinPrevious). */
  join: boolean;
  /** Progress 0..1, called only while the scene is near the viewport and p changed. */
  update: (p: number, stageTop: number) => void;
  /** Called when the scene moves out of range (and back in, via update). */
  leave: () => void;
}

interface Entry extends TickScene { top: number; height: number; near: boolean; last: number; lastTop: number }

const entries = new Set<Entry>();
let frame = 0;
let stale = true;
let listening = false;
let ro: ResizeObserver | null = null;

function measure() {
  const y = window.scrollY;
  entries.forEach((e) => {
    e.top = e.root.getBoundingClientRect().top + y;
    e.height = e.root.offsetHeight;
  });
  stale = false;
}

/** Scene progress for a scroll offset: the same maths the scenes used before. */
export function progressAt(y: number, top: number, height: number, vh: number, join: boolean): number {
  const lead = join ? vh : 0;
  const range = height - vh - lead;
  return range > 0 ? Math.min(1, Math.max(0, (y - top - lead) / range)) : 0;
}

/** Where the sticky stage's top edge is on screen (0 while pinned). */
export function stageTopAt(y: number, top: number, height: number, vh: number): number {
  if (y < top) return top - y;
  const unpin = top + height - vh;
  return y > unpin ? unpin - y : 0;
}

function tick() {
  frame = 0;
  if (stale) measure();
  const y = window.scrollY;
  const vh = window.innerHeight;
  entries.forEach((e) => {
    const near = y + vh * 2 > e.top && y - vh < e.top + e.height;
    if (!near) {
      if (e.near || e.last === -1) {
        // Leaving range (possibly in one big jump): settle on the end state first, so
        // nothing is left half-faded off screen (e.g. buttons keyboard focus could reach).
        const p = progressAt(y, e.top, e.height, vh, e.join);
        if (p !== e.last) e.update(p, stageTopAt(y, e.top, e.height, vh));
        e.near = false; e.last = p; e.leave();
      }
      return;
    }
    e.near = true;
    const p = progressAt(y, e.top, e.height, vh, e.join);
    const stageTop = stageTopAt(y, e.top, e.height, vh);
    if (p === e.last && stageTop === e.lastTop) return;
    e.last = p;
    e.lastTop = stageTop;
    e.update(p, stageTop);
  });
}

/** Bring every scene up to date with the current scroll right now (not next frame). */
export function flushTick() {
  if (frame) { cancelAnimationFrame(frame); frame = 0; }
  tick();
}

export function scheduleTick() {
  if (!frame) frame = requestAnimationFrame(tick);
}

function invalidate() {
  stale = true;
  scheduleTick();
}

export function addScene(scene: TickScene): () => void {
  const e: Entry = { ...scene, top: 0, height: 0, near: false, last: -1, lastTop: NaN };
  entries.add(e);
  if (!listening) {
    listening = true;
    window.addEventListener('scroll', scheduleTick, { passive: true });
    window.addEventListener('resize', invalidate);
    // Content above a scene changing height (images, fonts, expanding cards) moves it.
    ro = new ResizeObserver(invalidate);
    ro.observe(document.body);
  }
  invalidate();
  return () => {
    entries.delete(e);
    if (entries.size === 0 && listening) {
      listening = false;
      window.removeEventListener('scroll', scheduleTick);
      window.removeEventListener('resize', invalidate);
      ro?.disconnect();
      ro = null;
      if (frame) { cancelAnimationFrame(frame); frame = 0; }
    }
  };
}
