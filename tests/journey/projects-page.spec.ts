import { test, expect } from '@playwright/test';
import { caseStudySlugs, projects } from '../../src/lib/data/projects';
import { worlds } from '../../src/lib/data/worlds';

// Ahmad: the projects are spread across the journey's worlds, and "View Work" only
// jumped to the first one. It should open one page with every project, and each
// project should open its own page.

test('/projects shows every project as an equal tile linking to its case study', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const tiles = page.locator('[data-testid="project-tile"]');
  await expect(tiles).toHaveCount(caseStudySlugs.length);
  for (const slug of caseStudySlugs) {
    const p = projects.find((x) => x.slug === slug)!;
    await expect(page.locator(`a[data-testid="project-tile"][href="/case-study/${slug}"]`), p.title).toContainText(p.title);
  }
  // grouped by the journey's five sides
  for (const w of worlds) await expect(page.getByRole('heading', { name: w.label })).toBeVisible();
  const sizes = await tiles.evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }));
  for (const [wd, ht] of sizes) {
    expect(Math.abs(wd - sizes[0][0])).toBeLessThanOrEqual(1);
    expect(Math.abs(ht - sizes[0][1])).toBeLessThanOrEqual(1);
  }
});

test('a project tile on /projects opens that project’s page', async ({ page }) => {
  await page.goto('/projects');
  await page.locator('a[data-testid="project-tile"][href="/case-study/deeptruth-ai-fact-checking"]').click();
  await expect(page).toHaveURL(/\/case-study\/deeptruth-ai-fact-checking$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/DeepTruth/i);
});

test('"View Work", "View Projects" and the footer go to the projects page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#hero').getByRole('link', { name: 'View Work' })).toHaveAttribute('href', '/projects');
  await expect(page.locator('#about').getByRole('link', { name: /View Projects/ })).toHaveAttribute('href', '/projects');
  await expect(page.locator('footer').getByRole('link', { name: 'Bodies of Work' })).toHaveAttribute('href', '/projects');
  await page.locator('#hero').getByRole('link', { name: 'View Work' }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.locator('[data-testid="project-tile"]')).toHaveCount(caseStudySlugs.length);
});

test('/projects is in the sitemap', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml).toContain('/projects</loc>');
});
