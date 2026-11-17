/**
 * Where an anchor on the photo-journey homepage should land. A world's section starts
 * with a long sticky fly-in, so landing on its top shows the *previous* photo with no
 * words; a world link must land where that world's own photo and copy are fully in.
 * Used by HashLanding (deep links, old shared links) and the in-page link handler.
 */

/** Scroll offset that puts a FlyInScene root at progress `p`. */
export function sceneScrollTop(root: HTMLElement, p: number): number {
  const top = root.getBoundingClientRect().top + window.scrollY;
  const lead = root.hasAttribute('data-join') ? window.innerHeight : 0;
  const range = root.offsetHeight - window.innerHeight - lead;
  return top + lead + Math.max(0, range) * p;
}

/** Scroll offset for `#id`, or null if there is no such element. */
export function anchorScrollTop(id: string): number | null {
  const el = document.getElementById(id);
  if (!el) return null;
  // Alias anchors (e.g. the old #story) point at another element.
  const target = (el.dataset.anchorFor && document.getElementById(el.dataset.anchorFor)) || el;
  const scene = target.querySelector<HTMLElement>(':scope > [data-scene][data-pinned]');
  if (scene) return sceneScrollTop(scene, Number(scene.dataset.copyAt ?? 0));
  return target.getBoundingClientRect().top + window.scrollY;
}

/** Opacity as the viewer sees it: the element's times all its ancestors'. */
export function seenOpacity(el: Element): number {
  let o = 1;
  for (let e: Element | null = el; e; e = e.parentElement) o *= Number(getComputedStyle(e).opacity);
  return o;
}
