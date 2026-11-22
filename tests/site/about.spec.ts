import { test, expect } from '@playwright/test';
import { jobs } from '../../src/lib/data/jobs';
import { awards } from '../../src/lib/data/awards';
import { certs } from '../../src/lib/data/certs';
import { worlds } from '../../src/lib/data/worlds';
import { skillGroups } from '../../src/lib/data/skills';

test('/about holds the background, capabilities, timeline, credentials, signals and now', async ({ page }) => {
  await page.goto('/about');
  const ids = ['about', 'experience', 'prologue', ...worlds.map((w) => w.id), 'next-chapter', 'skills', 'timeline', 'credentials', 'signals', 'now'];
  const tops: number[] = [];
  for (const id of ids) {
    await expect(page.locator(`#${id}`), id).toHaveCount(1);
    tops.push(await page.locator(`#${id}`).evaluate((el) => el.getBoundingClientRect().top + scrollY));
  }
  expect([...tops].sort((a, b) => a - b)).toEqual(tops);
});

test('every job, award, cert and skill is on /about', async ({ page }) => {
  await page.goto('/about');
  const text = await page.locator('main').innerText();
  for (const j of jobs) expect(text, j.role).toContain(j.role);
  for (const a of awards) expect(text, a.title).toContain(a.title);
  for (const c of certs) expect(text, c.title).toContain(c.title);
  for (const g of skillGroups) for (const s of g.skills) expect(text, s).toContain(s);
});

test('the research paper and the anchors About links to exist', async ({ page }) => {
  await page.goto('/about');
  await expect(page.locator('#research')).toContainText('Taxonomy');
  await expect(page.locator('#insights')).toHaveCount(1);
});
