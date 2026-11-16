import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import manifest from '../../src/lib/journey-manifest.json';
import type { ManifestEntry } from '../../src/lib/data/worlds';
import { worlds, worldForProject } from '../../src/lib/data/worlds';
import { caseStudySlugs } from '../../src/lib/data/projects';

const backdrop = (page: import('@playwright/test').Page) => page.locator('[data-photo-backdrop] img').last();

test('case study opens on its world photo', async ({ page }) => {
  await page.goto('/case-study/camel-car-cheme-car-control-system');
  await expect.poll(() => backdrop(page).evaluate((i: HTMLImageElement) => i.currentSrc)).toContain('chem-e-car');
});

test('field notes pick their photo by category', async ({ page }) => {
  await page.goto('/field-notes/battle-of-i75-coin-toss');
  await expect.poll(() => backdrop(page).evaluate((i: HTMLImageElement) => i.currentSrc)).toContain('sports-analytics');
  await page.goto('/field-notes/agentic-ai-in-production');
  await expect.poll(() => backdrop(page).evaluate((i: HTMLImageElement) => i.currentSrc)).toContain('ai-engineering');
  await page.goto('/field-notes');
  await expect.poll(() => backdrop(page).evaluate((i: HTMLImageElement) => i.currentSrc)).toContain('opening');
  await page.goto('/docs');
  await expect.poll(() => backdrop(page).evaluate((i: HTMLImageElement) => i.currentSrc)).toContain('opening');
});

test('every case study links back to its world', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'desktop only');
  for (const slug of caseStudySlugs) {
    await page.goto(`/case-study/${slug}`);
    const world = worlds.find((w) => w.id === worldForProject(slug))!;
    const back = page.locator('header').getByRole('link', { name: world.label, exact: true }).first();
    await expect(back, slug).toHaveAttribute('href', `/#${world.id}`);
  }
});

test('back from a case study restores the world', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'desktop only');
  await page.goto('/');
  const card = page.locator('#research').getByRole('button', { name: 'DeepFlyer - open project details' });
  await expect(async () => {
    await card.scrollIntoViewIfNeeded({ timeout: 2000 });
    await card.click({ timeout: 2000 });
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 2000 });
  }).toPass();
  await page.getByRole('dialog').getByRole('link', { name: /case study/i }).first().click();
  await expect(page).toHaveURL(/deepflyer/);
  await page.locator('header').getByRole('link', { name: 'Research' }).click();
  await expect(page).toHaveURL(/\/(#research)?$/);
  await expect.poll(async () => page.locator('#research').evaluate((el) => {
    const r = el.getBoundingClientRect();
    return r.top < innerHeight && r.bottom > 0;
  }), { timeout: 6000 }).toBe(true);
});

test('reading text over the photo has contrast', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'desktop only');
  for (const url of ['/case-study/graph-based-rl-uav-autonomy', '/field-notes/battle-of-i75-coin-toss', '/docs']) {
    await page.goto(url);
    await page.waitForTimeout(600);
    const res = await new AxeBuilder({ page: page as never }).withRules(['color-contrast']).include('main').analyze();
    const serious = res.violations.flatMap((v) => v.nodes).filter((n) => !n.html.includes('aria-hidden'));
    expect(serious.map((n) => `${n.html.slice(0, 80)} ${n.failureSummary?.slice(0, 120)}`), url).toEqual([]);
  }
});

test('the footer credits every photo', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  for (const p of Object.values(manifest as Record<string, ManifestEntry>)) {
    if (!p.credit) continue; // Ahmad's own photos
    await expect(footer.getByRole('link', { name: p.credit.photographer })).toHaveAttribute('href', p.credit.page);
  }
});
