import { test, expect } from '@playwright/test';
import { worlds, journeyPhoto } from '../../src/lib/data/worlds';
import { caseStudySlugs } from '../../src/lib/data/projects';

// Ahmad's review of the first preview: each world was words on one side and a big
// photo, the projects were dim, uneven tiles (only Football IQ read as a project),
// and the photos looked soft. These pin the fixes.

const seenOpacity = (el: Element) => {
  let o = 1;
  for (let e: Element | null = el; e; e = e.parentElement) o *= Number(getComputedStyle(e).opacity);
  return o;
};
const desktopOnly = (name: string) => test.skip(name !== 'desktop', 'desktop stage layout');

for (const w of worlds) {
  test(`${w.id}: the side next to the words holds its drawing and Ahmad's own photos`, async ({ page }, info) => {
    desktopOnly(info.project.name);
    await page.goto(`/#${w.id}`);
    const copy = page.getByTestId(`world-copy-${w.id}`);
    await expect.poll(() => copy.evaluate(seenOpacity), { timeout: 6000 }).toBeGreaterThan(0.95);
    const art = page.getByTestId(`stage-art-${w.id}`);
    await expect.poll(() => art.evaluate(seenOpacity)).toBeGreaterThan(0.95);
    expect(await art.locator('svg').count()).toBeGreaterThan(0);
    const imgs = art.locator('img');
    expect(await imgs.count()).toBeGreaterThan(0);
    for (const img of await imgs.all()) {
      await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0), { timeout: 8000 }).toBe(true);
      expect(await img.getAttribute('src')).toMatch(/^\/Images\/(?!journey\/)/);
    }
    const c = (await copy.boundingBox())!;
    const a = (await art.boundingBox())!;
    const vw = page.viewportSize()!.width;
    expect(a.width, 'the art fills real space').toBeGreaterThan(vw * 0.3);
    expect(a.x >= c.x + c.width - 1 || a.x + a.width <= c.x + 1, 'art sits beside the words, not on them').toBe(true);
  });
}

test('every project is an equal-size tile with its picture at full brightness', async ({ page }) => {
  await page.goto('/');
  const all = page.locator('[data-testid="project-tile"]');
  await expect(all).toHaveCount(caseStudySlugs.length);
  for (const w of worlds) {
    await expect(page.locator(`#${w.id}-work [data-testid="project-tile"]`)).toHaveCount(w.projectSlugs.length);
  }
  const sizes = await all.evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }));
  for (const [wd, ht] of sizes) {
    expect(Math.abs(wd - sizes[0][0]), 'same width').toBeLessThanOrEqual(1);
    expect(Math.abs(ht - sizes[0][1]), 'same height').toBeLessThanOrEqual(1);
  }
  const opacities = await all.locator('img').evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
  expect(opacities.length).toBe(caseStudySlugs.length);
  for (const o of opacities) expect(o).toBe('1');
});

for (const width of [1440, 1920]) {
  test(`the Glass Bowl is never shown larger than its real size (${width}px wide)`, async ({ page }, info) => {
    desktopOnly(info.project.name);
    await page.setViewportSize({ width, height: 900 });
    const natural = journeyPhoto('sports-analytics').width;
    await page.goto('/#sports-analytics');
    await expect.poll(() => page.getByTestId('world-copy-sports-analytics').evaluate(seenOpacity), { timeout: 6000 }).toBeGreaterThan(0.95);
    // Through its own fly-in and the fly-out into Research.
    const top = await page.evaluate(() => document.getElementById('sports-analytics')!.getBoundingClientRect().top + scrollY);
    const end = await page.evaluate(() => document.getElementById('research')!.getBoundingClientRect().bottom + scrollY - innerHeight);
    for (let y = top; y < end; y += 450) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(60);
      const widest = await page.evaluate((fn) => {
        const so = new Function(`return (${fn})`)() as (e: Element) => number;
        return Math.max(0, ...[...document.querySelectorAll('.flyin-photo[data-photo="sports-analytics"] picture img')]
          .filter((e) => so(e) > 0.01).map((e) => e.getBoundingClientRect().width));
      }, seenOpacity.toString());
      expect(widest, `at scroll ${y}`).toBeLessThanOrEqual(natural + 1);
    }
  });
}
