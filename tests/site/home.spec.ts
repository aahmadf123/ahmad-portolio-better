import { test, expect } from '@playwright/test';
import { caseStudySlugs } from '../../src/lib/data/projects';

// The "Uncertain Paths" homepage: a flight path that links three kinds of work, a
// two-line headline, then selected work, the work index, notes, a short intro, contact.

test('the hero: headline, supporting line, the path and three linked nodes', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/AI systems for\s*uncertain environments/);
  await expect(page.locator('#hero')).toContainText('reinforcement learning for UAV autonomy');
  await expect(page.locator('#hero .fp-path')).toHaveCount(1);
  for (const [label, anchor] of [['Agentic AI', 'path-agentic-ai'], ['UAV Research', 'path-uav-research'], ['Sports Analytics', 'path-sports-analytics']]) {
    const link = page.locator('#hero').getByRole('link', { name: label });
    await expect(link).toHaveAttribute('href', `#${anchor}`);
    await expect(page.locator(`#${anchor}`)).toHaveCount(1);
  }
  await expect(page.locator('#hero').getByRole('link', { name: /Explore the work/ })).toHaveAttribute('href', '#work');
});

test('nodes sit on the line and never cover the headline', async ({ page }, info) => {
  test.skip(info.project.name === 'phone', 'phones list the nodes under the words');
  await page.goto('/');
  await page.waitForTimeout(2200);
  const title = (await page.locator('#hero-title').boundingBox())!;
  for (const label of ['Agentic AI', 'UAV Research', 'Sports Analytics']) {
    const b = (await page.locator('#hero').getByRole('link', { name: label }).boundingBox())!;
    const overlaps = b.x < title.x + title.width && b.x + b.width > title.x && b.y < title.y + title.height && b.y + b.height > title.y;
    expect(overlaps, label).toBe(false);
  }
});

test('the travelling dot moves, and stands still under reduced motion', async ({ page }, info) => {
  test.skip(info.project.name === 'phone', 'no dot on phones');
  await page.goto('/');
  const pos = () => page.locator('.fp-dot').evaluate((el) => `${(el as HTMLElement).style.left},${(el as HTMLElement).style.top}`);
  await page.waitForTimeout(2000);
  const a = await pos();
  await page.waitForTimeout(1200);
  const b = await pos();
  if (info.project.name === 'reduced') expect(b).toBe(a);
  else expect(b).not.toBe(a);
});

test('the work index lists every project once, each linking to its case study', async ({ page }) => {
  await page.goto('/');
  const links = page.locator('#work .wi-link');
  await expect(links).toHaveCount(caseStudySlugs.length);
  const hrefs = await links.evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  expect(new Set(hrefs)).toEqual(new Set(caseStudySlugs.map((s) => `/case-study/${s}`)));
});

test('old anchors land on their section, and /about redirects to it', async ({ page }) => {
  await page.goto('/#timeline');
  await expect(page.locator('#timeline')).toBeInViewport();
  await page.goto('/about');
  await expect(page).toHaveURL(/\/#about$/);
});

test('the chat button stays off the first screen', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(600);
  await expect(page.locator('.chat-launcher')).toHaveClass(/at-hero/);
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
  await expect(page.locator('.chat-launcher')).not.toHaveClass(/at-hero/);
});
