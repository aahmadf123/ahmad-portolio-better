import type { Page } from '@playwright/test';
import * as about from '../../src/lib/data/about';
import * as affiliations from '../../src/lib/data/affiliations';
import * as awards from '../../src/lib/data/awards';
import * as certs from '../../src/lib/data/certs';
import * as education from '../../src/lib/data/education';
import * as insights from '../../src/lib/data/insights';
import * as jobs from '../../src/lib/data/jobs';
import * as now from '../../src/lib/data/now';
import * as press from '../../src/lib/data/press';
import * as projects from '../../src/lib/data/projects';
import * as research from '../../src/lib/data/research';
import * as sections from '../../src/lib/data/sections';
import * as site from '../../src/lib/data/site';
import * as skills from '../../src/lib/data/skills';
import * as story from '../../src/lib/data/story';
import * as testimonials from '../../src/lib/data/testimonials';
import * as fieldNotesLib from '../../src/lib/field-notes';
import { caseStudySlugs } from '../../src/lib/data/projects';

/** Every content module whose strings must survive the redesign. */
export const DATA_MODULES: Record<string, Record<string, unknown>> = {
  about, affiliations, awards, certs, education, insights, jobs, now, press,
  projects, research, sections, site, skills, story, testimonials, 'field-notes': fieldNotesLib,
};

/** Whitespace-insensitive form used on both sides of every comparison. */
export function normalize(s: string): string {
  return s
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?)])/g, '$1')
    .replace(/\(\s+/g, '(')
    .trim();
}

function isPathLike(s: string): boolean {
  return /^(https?:|mailto:|tel:|\/|#|data:)/.test(s);
}

/** All string leaves (len >= 2, not URLs/paths) of every exported value in the data modules. */
export async function collectDataStrings(): Promise<string[]> {
  const out = new Set<string>();
  const seen = new WeakSet<object>();
  const walk = (v: unknown) => {
    if (typeof v === 'string') {
      const n = normalize(v);
      if (n.length >= 2 && !isPathLike(n)) out.add(n);
      return;
    }
    if (v && typeof v === 'object') {
      if (seen.has(v as object)) return;
      seen.add(v as object);
      for (const x of Array.isArray(v) ? v : Object.values(v as object)) walk(x);
    }
  };
  for (const mod of Object.values(DATA_MODULES)) for (const v of Object.values(mod)) walk(v);
  return [...out].sort();
}

export const ROUTES: string[] = [
  '/',
  '/field-notes',
  '/docs',
  ...fieldNotesLib.fieldNotes.filter((n) => n.published).map((n) => `/field-notes/${n.slug}`),
  ...caseStudySlugs.map((s) => `/case-study/${s}`),
];

export function routeSlug(route: string): string {
  return route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '__');
}

const SKIP = 'script,style,noscript,canvas,[aria-hidden="true"],[data-content-volatile]';

/** Load a route, scroll it fully so lazy content mounts, and return all text-node strings under main + footer. */
export async function loadAndCollectText(page: Page, route: string): Promise<string[]> {
  // Reduced motion: count-ups show final values, and content must exist in the still tier too.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  await page.evaluate(async () => {
    const step = 600;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 150));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 600));
  });
  return page.evaluate((skip) => {
    const roots = [...document.querySelectorAll('main, footer')];
    const texts: string[] = [];
    for (const root of roots) {
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        const el = n.parentElement;
        if (!el || el.closest(skip)) continue;
        const t = (n.textContent || '').trim();
        if (t) texts.push(t);
      }
    }
    return texts;
  }, SKIP);
}

/** Baseline "units": text nodes with >= 3 words or containing a digit. */
export function toUnits(texts: string[]): string[] {
  const out = new Set<string>();
  for (const t of texts) {
    const n = normalize(t);
    if (n.split(' ').length >= 3 || /\d/.test(n)) out.add(n);
  }
  return [...out];
}

export async function collectRenderedUnits(page: Page, route: string): Promise<string[]> {
  return toUnits(await loadAndCollectText(page, route));
}

export interface AllowedRemoval { text: string; reason: string; preservedAs?: string;
  /** Page that now shows preservedAs (default: the homepage). */
  preservedOn?: string; kind?: 'ui-label' }

/**
 * Every picture a page shows, after scrolling it fully: <img> (src + srcset),
 * <picture><source>, SVG <image>, and CSS background images. Normalised to a stem so
 * size variants of one photo count once: /Images/optimized/headshot-800.webp → "headshot".
 */
export async function collectImages(page: Page, route: string, base = ''): Promise<string[]> {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base + route, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
  });
  const urls = await page.evaluate(() => {
    const out: string[] = [];
    const add = (u: string | null | undefined) => { if (u) out.push(u); };
    document.querySelectorAll('img').forEach((i) => { add(i.getAttribute('src')); (i.getAttribute('srcset') ?? '').split(',').forEach((s) => add(s.trim().split(/\s+/)[0])); });
    document.querySelectorAll('picture source').forEach((s) => (s.getAttribute('srcset') ?? '').split(',').forEach((x) => add(x.trim().split(/\s+/)[0])));
    document.querySelectorAll('image').forEach((i) => add(i.getAttribute('href') ?? i.getAttribute('xlink:href')));
    document.querySelectorAll<HTMLElement>('body *').forEach((e) => {
      const bg = getComputedStyle(e).backgroundImage;
      for (const m of bg.matchAll(/url\(["']?([^"')]+)["']?\)/g)) add(m[1]);
    });
    return out;
  });
  return [...new Set(urls.map(imageStem).filter(Boolean) as string[])].sort();
}

export function imageStem(raw: string): string | null {
  if (!raw || raw.startsWith('data:')) return null;
  let u: URL;
  try { u = new URL(raw, 'http://x'); } catch { return null; }
  let path = u.pathname;
  if (path.startsWith('/_next/image')) path = decodeURIComponent(u.searchParams.get('url') ?? '');
  const file = decodeURIComponent(path.split('/').pop() ?? '');
  if (!/\.(png|jpe?g|webp|avif|gif|svg)$/i.test(file)) return null;
  return file.replace(/\.[a-z0-9]+$/i, '').replace(/-(\d{2,4})w?$/, '').toLowerCase();
}
