// One picture, one place. The homepage shows each photograph once: the first section
// (in page order) that shows it keeps it, later sections skip it. The press image is the
// article's own picture, so it stays with the press feature and earlier sections skip it.

import { projects } from './projects';
import { featuredProjectSlugs, worlds, journeyPhoto } from './worlds';
import { research } from './research';
import { press } from './press';

export const normImg = (src: string) => decodeURI(src).toLowerCase();

const featured: readonly string[] = featuredProjectSlugs;
const set = (xs: string[]) => new Set(xs.map(normImg));

/** Football IQ's real output and the featured projects' own pictures. */
const FEATURED = set([
  '/Images/Football_IQ_Clip_Review.png',
  ...projects.filter((p) => p.slug && featured.includes(p.slug) && !p.flagship).map((p) => p.image),
]);
/** Thumbnails in the work list (every project that is not featured). */
const WORK = set(projects.filter((p) => !(p.slug && featured.includes(p.slug))).map((p) => p.image));
/** Pictures the story chapters show on their own: Ahmad's own chapter photos and the research figure. */
const STORY_FIXED = set([
  ...worlds.map((w) => journeyPhoto(w.photo)).filter((m) => m.own && m.source).map((m) => m.source!),
  research.image,
]);
const PRESS = set(press.map((p) => p.image));

/** A story gallery photo is shown only if nothing earlier (or the press feature) shows it. */
export function showInStoryGallery(src: string): boolean {
  const n = normImg(src);
  return !FEATURED.has(n) && !WORK.has(n) && !STORY_FIXED.has(n) && !PRESS.has(n);
}

const STORY_GALLERY = set(worlds.flatMap((w) => w.gallery.map((g) => g.src)).filter(showInStoryGallery));

/** A credentials photo is shown only if no earlier section (or the press feature) shows it. */
export function showInCredentials(src: string): boolean {
  const n = normImg(src);
  return !FEATURED.has(n) && !WORK.has(n) && !STORY_FIXED.has(n) && !STORY_GALLERY.has(n) && !PRESS.has(n);
}
