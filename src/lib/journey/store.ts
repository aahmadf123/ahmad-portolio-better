import type { PhotoId } from '@/lib/data/worlds';

/**
 * What a FlyInScene is showing right now, published every frame it changes (full tier
 * only) so the single depth canvas can draw the same thing with real parallax.
 * The scales and mix are the exact values the CSS layers use, so canvas and CSS agree.
 */
export interface SceneFrame {
  from?: PhotoId;
  to: PhotoId;
  fromScale: number;
  toScale: number;
  /** 0 = only `from` visible, 1 = only `to` visible. */
  mix: number;
  /** Visible area of the scene's stage in px², to pick the scene that owns the screen. */
  area: number;
}

const scenes = new Map<string, SceneFrame>();
const listeners = new Set<() => void>();

export function publishScene(id: string, frame: SceneFrame | null) {
  if (frame && frame.area > 0) scenes.set(id, frame);
  else scenes.delete(id);
  listeners.forEach((fn) => fn());
}

/** The scene with the most of its stage on screen, or null when none is visible. */
export function activeScene(): SceneFrame | null {
  let best: SceneFrame | null = null;
  scenes.forEach((s) => { if (!best || s.area > best.area) best = s; });
  return best;
}

export function subscribeScenes(fn: () => void): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}
