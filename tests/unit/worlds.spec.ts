import { test, expect } from '@playwright/test';
import { worlds, opening, closing, worldForProject, worldForInsight, photoForFieldNote, journeyPhoto, type PhotoId } from '../../src/lib/data/worlds';
import { storyChapters, sentences } from '../../src/lib/data/story';
import { caseStudySlugs } from '../../src/lib/data/projects';
import { insights } from '../../src/lib/data/insights';
import { fieldNotes } from '../../src/lib/field-notes';
import { textureWidth } from '../../src/lib/journey/texture';

// Pure data tests: no browser needed, run once.
test.beforeEach(({}, info) => test.skip(info.project.name !== 'desktop', 'desktop only'));

const chapter = (id: string) => storyChapters.find((c) => c.id === id)!;

test('every project maps to exactly one world', () => {
  const all = worlds.flatMap((w) => w.projectSlugs);
  expect(new Set(all).size).toBe(all.length);
  expect([...all].sort()).toEqual([...caseStudySlugs].sort());
  for (const slug of caseStudySlugs) expect(worlds.find((w) => w.id === worldForProject(slug))!.projectSlugs).toContain(slug);
  expect(() => worldForProject('not-a-project')).toThrow();
});

test('confirmed mapping and order', () => {
  expect(worlds.map((w) => [w.id, w.n, w.label])).toEqual([
    ['chem-e-car', '01', 'Chem-E Car (AIChE)'],
    ['data-science', '02', 'Data Science'],
    ['sports-analytics', '03', 'Sports Analytics'],
    ['research', '04', 'Research'],
    ['ai-engineering', '05', 'AI Engineering'],
  ]);
  const map = Object.fromEntries(worlds.map((w) => [w.id, [...w.projectSlugs].sort()]));
  expect(map).toEqual({
    'chem-e-car': ['camel-car-cheme-car-control-system'],
    'data-science': ['homeowner-loss-prediction'],
    'sports-analytics': ['champions-complex-digital-campaign', 'toledo-athletics-onboarding-portal', 'toledo-football-iq-computer-vision-analytics'],
    research: ['deepflyer-drone-reinforcement-learning', 'graph-based-rl-uav-autonomy'],
    'ai-engineering': ['batting-cleanup-smart-city-waste-reporting', 'deeptruth-ai-fact-checking', 'security-discovery-tool'],
  });
  for (const w of worlds) expect(w.accent).toMatch(/^#[0-9a-f]{6}$/i);
});

test('sports is neither first nor last', () => {
  const i = worlds.findIndex((w) => w.id === 'sports-analytics');
  expect(i).toBeGreaterThan(0);
  expect(i).toBeLessThan(worlds.length - 1);
});

test('engineering-foundation splits into exactly three sentences', () => {
  expect(sentences(chapter('engineering-foundation').body)).toHaveLength(3);
});

test('every story sentence lands exactly once', () => {
  const placed = [...sentences(opening.body), ...sentences(closing.body), ...worlds.flatMap((w) => w.paragraphs.flatMap(sentences))];
  for (const c of storyChapters) {
    for (const s of sentences(c.body)) {
      expect(placed.filter((p) => p === s), `"${s.slice(0, 60)}…" from ${c.id}`).toHaveLength(1);
    }
  }
});

test('every story title and stat is shown', () => {
  const titles = [opening.title, closing.title, ...worlds.map((w) => w.title)];
  const stats = [opening.stat, closing.stat, ...worlds.map((w) => w.stat)].map((s) => `${s.value}|${s.label}`);
  for (const c of storyChapters) {
    if (c.stat) expect(stats, c.id).toContain(`${c.stat.value}|${c.stat.label}`);
  }
  // Only the football-iq chapter title is retired (replaced by "The game, measured.").
  for (const c of storyChapters.filter((c) => c.id !== 'football-iq')) expect(titles, c.id).toContain(c.title);
});

test('every stock photo has a credit and licence; every photo has a depth map', () => {
  const ids: PhotoId[] = ['opening', ...worlds.map((w) => w.photo)];
  for (const id of ids) {
    const p = journeyPhoto(id);
    if (!p.own) {
      expect(p.credit?.photographer, id).toBeTruthy();
      expect(p.credit?.licenceUrl, id).toMatch(/^https:/);
    }
    expect(p.depth, id).toMatch(/-depth\.webp$/);
  }
});

test("the Chem-E Car world is Ahmad's own competition photo, not stock", () => {
  const p = journeyPhoto('chem-e-car');
  expect(p.own).toBe(true);
  expect(p.source).toBe('/Images/AIChE_Regional_Pics.jpg');
  expect(p.credit).toBeUndefined();
  // and it is not repeated in the panel beside the words
  expect(worlds.find((w) => w.id === 'chem-e-car')!.gallery.map((g) => g.src)).not.toContain('/Images/AIChE_Regional_Pics.jpg');
});

test('insights map to the world of their source project', () => {
  for (const i of insights) {
    const slug = i.source.href.split('/').pop()!;
    expect(worldForInsight(i), i.id).toBe(worldForProject(slug));
  }
});

test('field notes pick a photo by category', () => {
  const byslug = Object.fromEntries(fieldNotes.map((n) => [n.slug, photoForFieldNote(n)]));
  expect(byslug['battle-of-i75-coin-toss']).toBe('sports-analytics');
  expect(byslug['agentic-ai-in-production']).toBe('ai-engineering');
});

test('the opening is downtown Toledo over the Maumee at dusk, not the ballpark', () => {
  const o = journeyPhoto('opening');
  expect(o.credit?.page).toContain('lmqBIlLUKpU');
  expect(o.credit?.photographer).toBe('Leo Escala');
  expect(o.alt).not.toMatch(/Fifth Third|baseball|ballpark/i);
});

test('every full-bleed photo ships at least 3840px wide (sharp on big and retina screens)', () => {
  for (const id of ['opening', ...worlds.map((w) => w.id)] as PhotoId[]) {
    const p = journeyPhoto(id);
    if (p.panorama || p.own) continue; // Ahmad's own photos ship at their real size
    expect(Math.max(...p.widths), id).toBeGreaterThanOrEqual(3840);
  }
});

test('depth canvas picks a texture big enough for the screen at the 1.3x settle zoom', () => {
  const widths = [640, 1280, 1920, 2560, 3840];
  expect(textureWidth(widths, 1440, 1)).toBe(1920); // 1872 needed
  expect(textureWidth(widths, 1440, 2)).toBe(3840); // 3744 needed
  expect(textureWidth(widths, 1920, 2)).toBe(3840); // more than we have: the largest
  expect(textureWidth(widths, 1440, 2, 2048)).toBe(1920); // GPU limit wins
  expect(textureWidth([1366], 1440, 1)).toBe(1366);
});
