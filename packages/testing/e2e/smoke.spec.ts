import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const routes = [
  '/',
  '/marketplace',
  '/marketplace?intent=land&where=kajiado-kitengela',
  '/products',
  '/solutions',
  '/company',
  '/about',
  '/pricing',
  '/demo',
  '/careers',
  '/press',
  '/trust',
  '/privacy',
  '/terms',
  '/design-partners',
  '/sign-in',
  '/landlord',
  '/me',
  '/org/riverside-lettings',
];

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => {
    errors.push(error.message);
  });
  return errors;
}

test.describe('routes', () => {
  for (const route of routes) {
    test(`${route} returns 200`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
    });
  }

  test('/api/health reports ok and a sha', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);
    const body = (await response.json()) as { ok: boolean; sha: string };
    expect(body.ok).toBe(true);
    expect(typeof body.sha).toBe('string');
  });
});

test.describe('landing', () => {
  test('has exactly one h1 with the hero title and no console errors', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(
      'Rent in. Landlords paid. Every shilling accounted for.',
    );
    await expect(page.locator('main#main')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('never uses the word tenant', async ({ page }) => {
    await page.goto('/');
    const text = (await page.locator('body').innerText()).toLowerCase();
    expect(text.includes('tenant')).toBe(false);
  });

  test('skip link is the first focusable element and targets #main', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const href = await page.evaluate(() => document.activeElement?.getAttribute('href'));
    expect(href).toBe('#main');
  });

  test('search bar navigates to /marketplace with the chosen intent', async ({ page }) => {
    await page.goto('/');
    const form = page.getByRole('form', { name: 'Search the marketplace' });
    await form.getByRole('radio', { name: 'For sale' }).click();
    await form.getByRole('button', { name: 'Search' }).click();
    await page.waitForURL(/\/marketplace\?.*intent=sale/);
    await expect(page.getByRole('heading', { level: 1, name: 'Homes for sale' })).toBeVisible();
  });

  test('demo form rejects an invalid email inline and accepts a valid one', async ({ page }) => {
    await page.goto('/#demo');
    const email = page.getByLabel('Work email');
    await email.fill('not-an-email');
    await page.getByRole('button', { name: 'Book a demo' }).last().click();
    await expect(page.getByText('Enter a valid email address')).toBeVisible();
    await email.fill('ops@example.co.ke');
    await page.getByRole('button', { name: 'Book a demo' }).last().click();
    await expect(page.getByRole('status')).toContainText('Thanks');
  });

  test('has no serious or critical accessibility violations', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });
});

test.describe('marketplace', () => {
  test('filters update the URL and the count without a reload', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto('/marketplace');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Homes and units to let' }),
    ).toBeVisible();
    await page.getByRole('radio', { name: 'Land', exact: true }).click();
    await page.waitForURL(/intent=land/);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Plots and land for sale' }),
    ).toBeVisible();
    await expect(page.getByText(/results · sample data/)).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('empty state offers to widen the budget', async ({ page }) => {
    await page.goto('/marketplace?intent=short-stay&where=nakuru');
    await expect(page.getByText(/Nothing listed for this search yet/)).toBeVisible();
    await page.getByRole('link', { name: 'Widen budget' }).click();
    await page.waitForURL(/marketplace/);
  });

  test('has no serious or critical accessibility violations', async ({ page }) => {
    await page.goto('/marketplace');
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });
});
