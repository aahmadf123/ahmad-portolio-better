import { test, expect } from '@playwright/test';
import { caseStudySlugs, projects } from '../../src/lib/data/projects';
import { worlds } from '../../src/lib/data/worlds';

// One page with every project, each opening its own case study.

test('/projects shows every project as a tile linking to its case study', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const tiles = page.locator('[data-testid="project-tile"]');
  await expect(tiles).toHaveCount(caseStudySlugs.length);
  for (const slug of caseStudySlugs) {
    const p = projects.find((x) => x.slug === slug)!;
    await expect(page.locator(`a[data-testid="project-tile"][href="/case-study/${slug}"]`), p.title).toContainText(p.title);
  }
  // one ordered collection, in journey order
  const order = await tiles.evaluateAll((els) => els.map((e) => e.getAttribute('href')!.split('/').pop()));
  expect(order).toEqual(worlds.flatMap((w) => w.projectSlugs));
  // one grid, every tile the same width
  const widths = await tiles.evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().width)));
  for (const wd of widths) expect(Math.abs(wd - widths[0])).toBeLessThanOrEqual(1);
});

test('the side filters show only that side’s projects', async ({ page }) => {
  await page.goto('/projects');
  for (const w of worlds) {
    await page.getByRole('button', { name: w.label, exact: true }).click();
    await expect(page.locator('[data-testid="project-tile"]')).toHaveCount(w.projectSlugs.length);
    await expect(page.getByRole('button', { name: w.label, exact: true })).toHaveAttribute('aria-pressed', 'true');
  }
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('[data-testid="project-tile"]')).toHaveCount(caseStudySlugs.length);
});

test('a project tile on /projects opens that project’s page', async ({ page }) => {
  await page.goto('/projects');
  await page.locator('a[data-testid="project-tile"][href="/case-study/deeptruth-ai-fact-checking"]').click();
  await expect(page).toHaveURL(/\/case-study\/deeptruth-ai-fact-checking$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/DeepTruth/i);
});

test('the work index, About and the footer go to the projects page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#work').getByRole('link', { name: /All projects with pictures/ })).toHaveAttribute('href', '/projects');
  await expect(page.locator('footer').getByRole('link', { name: 'Bodies of Work' })).toHaveAttribute('href', '/projects');
  await page.goto('/about');
  await expect(page.locator('#about').getByRole('link', { name: /View Projects/ })).toHaveAttribute('href', '/projects');
});

test('/projects and /about are in the sitemap', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml).toContain('/projects</loc>');
  expect(xml).toContain('/about</loc>');
});
