import { test, expect } from '@playwright/test';
import { caseStudySlugs } from '../../src/lib/data/projects';
import { featuredProjectSlugs } from '../../src/lib/data/worlds';

// The "Uncertain Paths" homepage: a flight path that links three kinds of work, a
// two-line headline, then selected work, the work index, notes, a short intro, contact.

test('the hero: headline, supporting line, the path and three linked nodes', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/AI systems for\s*uncertain environments/);
  await expect(page.locator('#hero .fp-path')).toHaveCount(1);
  for (const [label, anchor] of [['Agentic AI', 'path-agentic-ai'], ['UAV Research', 'path-uav-research'], ['Sports Analytics', 'path-sports-analytics']]) {
    const link = page.locator('#hero').getByRole('link', { name: label });
    await expect(link).toHaveAttribute('href', `#${anchor}`);
    await expect(page.locator(`#${anchor}`)).toHaveCount(1);
  }
  await expect(page.locator('#hero').getByRole('link', { name: /Explore the work/ })).toHaveAttribute('href', '#projects');
});

test('the whole path is drawn, on normal and very wide screens', async ({ page }, info) => {
  test.skip(info.project.name === 'phone', 'desktop widths');
  for (const width of [1440, 2000, 2560]) {
    await page.setViewportSize({ width, height: 975 });
    await page.goto('/');
    await page.waitForTimeout(2400);
    expect(await page.locator('.fp-path').evaluate((el) => getComputedStyle(el).strokeDasharray), `${width}px`).toBe('none');
    expect(await page.locator('.fp-reveal').evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset)), `${width}px`).toBe(0);
  }
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

test('every project appears once: featured above, the rest inside their story chapters', async ({ page }) => {
  await page.goto('/');
  const featured: readonly string[] = featuredProjectSlugs;
  const rest = caseStudySlugs.filter((s) => !featured.includes(s));
  const cards = page.locator('#experience a.pc');
  await expect(cards).toHaveCount(rest.length);
  const hrefs = await cards.evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  expect(new Set(hrefs)).toEqual(new Set(rest.map((s) => `/case-study/${s}`)));
  for (const s of featured) await expect(page.locator(`#experience a.pc[href="/case-study/${s}"]`)).toHaveCount(0);
});

test('no picture is shown twice on the homepage', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 900) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } });
  const stems = await page.locator('main img').evaluateAll((imgs) => imgs.map((i) => ((i as HTMLImageElement).currentSrc || (i as HTMLImageElement).src).split('/').pop()!.replace(/-\d+\.(webp|avif)$/, '')));
  const seen = new Set<string>(); const dups: string[] = [];
  for (const s of stems) { if (seen.has(s)) dups.push(s); seen.add(s); }
  expect(dups).toEqual([]);
});

test('the nav bar appears after the hero and follows the reader', async ({ page }, info) => {
  await page.goto('/');
  await expect(page.locator('.home-nav')).not.toHaveClass(/is-shown/);
  await page.evaluate(() => document.getElementById('timeline')!.scrollIntoView());
  await expect(page.locator('.home-nav')).toHaveClass(/is-shown/);
  if (info.project.name === 'phone') {
    await page.locator('.home-nav-menu').click();
    await page.locator('.home-nav-sheet').getByRole('link', { name: 'Contact' }).click();
  } else {
    await expect(page.locator('.home-nav-link[aria-current]')).toHaveText('Timeline');
    await page.locator('.home-nav-links').getByRole('link', { name: 'Contact' }).click();
  }
  await expect(page.locator('#contact-title')).toBeInViewport();
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
