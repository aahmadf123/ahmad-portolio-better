import { test, expect } from '@playwright/test';

const bg = (page: import('@playwright/test').Page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);

test.describe('light and dark', () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== 'desktop', 'one viewport is enough'));

  test('follows the system preference before any script hydrates', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(await bg(page)).toBe('rgb(18, 19, 20)');
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    expect(await bg(page)).toBe('rgb(243, 242, 238)');
  });

  test('the toggle switches and the choice survives a reload and other pages', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.locator('.site-nav .theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.goto('/about');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('.site-nav .theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});
