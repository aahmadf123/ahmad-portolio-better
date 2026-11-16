import { test, expect } from '@playwright/test';
import { jobs } from '../../src/lib/data/jobs';
import { awards } from '../../src/lib/data/awards';
import { certs } from '../../src/lib/data/certs';
import { testimonials } from '../../src/lib/data/testimonials';

const ORDER = ['next-chapter', 'field-notes', 'about', 'skills', 'timeline', 'credentials', 'signals', 'now', 'contact'];

test('after the journey: notes, then About and its parts, then now and contact', async ({ page }) => {
  await page.goto('/');
  const tops = await page.evaluate((ids) => ids.map((id) => {
    const el = document.getElementById(id);
    return el ? el.getBoundingClientRect().top + scrollY : null;
  }), ORDER);
  expect(tops.every((t) => t !== null), JSON.stringify(tops)).toBe(true);
  for (let i = 1; i < tops.length; i++) expect(tops[i]!, `${ORDER[i]} after ${ORDER[i - 1]}`).toBeGreaterThan(tops[i - 1]!);
});

test('capabilities, timeline, credentials and signals are parts of About', async ({ page }) => {
  await page.goto('/');
  for (const [id, label] of [['skills', 'Capabilities'], ['timeline', 'Timeline'], ['credentials', 'Credentials'], ['signals', 'Signals']]) {
    await expect(page.locator(`#${id} h3`).filter({ hasText: label }).first(), id).toBeAttached();
    await expect(page.locator(`#${id} .ghost-num`), `${id} has no chapter numeral`).toHaveCount(0);
  }
});

test('constellation survives', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'canvas on desktop; phones get the list');
  await page.goto('/');
  // The constellation (three.js) loads only when Capabilities comes near: scroll there first.
  await page.locator('#skills').scrollIntoViewIfNeeded();
  await expect(page.locator('#skills canvas').first()).toBeVisible({ timeout: 10000 });
});

test('every job, award, cert and testimonial is on the page', async ({ page }) => {
  await page.goto('/');
  const text = await page.locator('main').evaluate((m) => m.textContent ?? '');
  for (const j of jobs) expect(text, j.role).toContain(j.role);
  for (const a of awards) expect(text, a.title).toContain(a.title);
  for (const c of certs) expect(text, c.title).toContain(c.title);
  for (const t of testimonials) expect(text, t.name).toContain(t.name);
});

test("About's work link goes to the journey", async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#about a[href="#chem-e-car"]')).toHaveCount(1);
  // Links stored in about.ts may still say #projects: that anchor is kept (it lands on
  // the first world), and data files are append-only.
});
