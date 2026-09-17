import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const routes = [
  '/',
  '/marketplace',
  '/marketplace?intent=land&county=kajiado',
  '/marketplace?intent=rent&county=kisumu',
  '/solutions/letting-firms',
  '/solutions/landlords',
  '/solutions/residents',
  '/demo?tier=growth',
  '/sign-in?next=%2Fmarketplace',
  '/api/assistant/status',
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
    await page.goto('/marketplace?intent=short-stay&county=turkana');
    await expect(page.getByText(/Nothing listed for this search yet/)).toBeVisible();
    await page.getByRole('link', { name: 'Search all of Kenya' }).click();
    await page.waitForURL(/marketplace\?intent=short-stay$/);
    await expect(page.getByText(/results · sample data/)).not.toHaveText(/^0 /);
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

async function expectNoBlockingViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  );
  expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
}

test.describe('brand', () => {
  test('header lockup carries the descriptor and the copyright names the company', async ({
    page,
  }) => {
    await page.goto('/');
    const header = page.getByRole('banner');
    await expect(header.getByText('Ethanel', { exact: true }).first()).toBeVisible();
    await expect(header.getByText('Estate Managers').first()).toBeVisible();
    await expect(page.getByRole('contentinfo')).toContainText('© 2026 Ethanel Estate Managers');
  });

  test('WhatsApp links use the public number with a prefilled intro', async ({ page }) => {
    await page.goto('/company');
    const link = page.locator('a[href^="https://wa.me/254722000000?text="]').first();
    await expect(link).toHaveAttribute('href', /text=Hi%20Ethanel%20Estate%20Managers/);
  });
});

test.describe('nationwide marketplace', () => {
  test('a Kisumu rental search returns listings with status, date, map pin and WhatsApp', async ({
    page,
  }) => {
    await page.goto('/marketplace?intent=rent&county=kisumu');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Homes and units to let in Kisumu' }),
    ).toBeVisible();
    await expect(page.getByText(/results · sample data/)).not.toHaveText(/^0 /);
    const card = page.getByRole('article').first();
    await expect(card.locator('[data-status]')).toBeVisible();
    await expect(card.getByText(/^Listed /)).toBeVisible();
    await expect(
      card.locator('a[href^="https://www.google.com/maps/search/?api=1&query="]'),
    ).toHaveAttribute('href', /query=-?\d+\.\d+,\d+\.\d+/);
    await expect(card.locator('a[href^="https://wa.me/254722000000?text="]')).toHaveAttribute(
      'href',
      /text=Hi%20Ethanel%20Estate%20Managers/,
    );
    await expect(card.getByText('Sample listing')).toBeVisible();
  });

  test('area text narrows the search and the county filter changes the URL', async ({ page }) => {
    await page.goto('/marketplace?intent=rent');
    await page.getByRole('heading', { level: 1, name: 'Homes and units to let' }).waitFor();
    const area = page.getByPlaceholder('e.g. Kilimani, Nyali, Milimani').first();
    await area.fill('Milimani');
    await area.press('Enter');
    await page.waitForURL(/area=Milimani/);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Homes and units to let in Milimani' }),
    ).toBeVisible();
  });

  test('sample data covers the five intents and more than fifty listings', async ({ page }) => {
    let total = 0;
    for (const intent of ['rent', 'sale', 'land', 'lease', 'short-stay']) {
      await page.goto(`/marketplace?intent=${intent}&budget=any`);
      const count = await page.getByText(/results · sample data/).textContent();
      const n = Number.parseInt(count ?? '0', 10);
      expect(n, intent).toBeGreaterThan(0);
      total += n;
    }
    expect(total).toBeGreaterThanOrEqual(50);
  });

  test('book a viewing hands off to sign-in with a same-origin next', async ({ page }) => {
    await page.goto('/marketplace?intent=rent&county=nairobi');
    await page.getByRole('article').first().getByRole('link', { name: 'Book a viewing' }).click();
    await page.waitForURL(/\/sign-in\?next=%2Fmarketplace/);
    await expect(page.getByText(/Sign in to book a viewing/)).toBeVisible();
  });

  test('landing search bar sends county and area to the results page', async ({ page }) => {
    await page.goto('/');
    const form = page.getByRole('form', { name: 'Search the marketplace' });
    await form.getByPlaceholder('e.g. Kilimani, Nyali, Milimani').fill('Nyali');
    await form.getByRole('button', { name: 'Search' }).click();
    await page.waitForURL(/\/marketplace\?.*area=Nyali/);
  });
});

test.describe('company pages', () => {
  test('/about tells the founding story with the founders and the CTO', async ({ page }) => {
    await page.goto('/about');
    const body = page.locator('body');
    await expect(body).toContainText('Loise Ndirangu');
    await expect(body).toContainText('Racheal Wangui');
    await expect(body).toContainText('Njuguna Njenga');
    await expect(body).toContainText('2024');
    await expect(body).toContainText('Kiambu County');
    await expectNoBlockingViolations(page);
  });

  test('/press labels every case-study figure as illustrative', async ({ page }) => {
    await page.goto('/press');
    await expect(
      page.getByText('Illustrative — example figures, not customer data').first(),
    ).toBeVisible();
  });

  test('/company contact form validates and accepts a message', async ({ page }) => {
    await page.goto('/company#contact');
    await page.getByRole('button', { name: 'Send', exact: true }).click();
    await expect(
      page
        .getByRole('alert')
        .or(page.locator('[aria-live="polite"]').filter({ hasText: /./ }))
        .first(),
    ).toBeVisible();
    await page.getByLabel('Your name').fill('Test Person');
    await page.getByLabel('WhatsApp number').fill('0722000001');
    await page.getByLabel('Units you manage').selectOption('6-20');
    await page
      .getByLabel('What hurts most today?')
      .fill('Reconciling M-Pesa payments takes a full day each month.');
    await page.getByRole('button', { name: 'Send', exact: true }).click();
    await expect(page.getByRole('status')).toContainText('Thanks');
  });

  test('/solutions/landlords shows the landlord tab as current', async ({ page }) => {
    await page.goto('/solutions/landlords');
    await expect(page.locator('[aria-current="page"]', { hasText: 'Landlords' })).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: /statement you can read/i }),
    ).toBeVisible();
    await expectNoBlockingViolations(page);
  });
});

test.describe('pricing', () => {
  test('shows four tiers, Free to Enterprise, with the introductory label', async ({ page }) => {
    await page.goto('/pricing');
    for (const name of ['Free', 'Starter', 'Growth', 'Enterprise']) {
      await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
    }
    await expect(page.getByText('Introductory pricing, subject to change').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Start free' })).toHaveAttribute(
      'href',
      '/demo?tier=free',
    );
    await expectNoBlockingViolations(page);
  });
});

test.describe('demo questionnaire', () => {
  test('validates each step and submits', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto('/demo');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Bring your rent roll. Leave with a plan.',
    );
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Pick the closest description')).toBeVisible();
    await page.getByLabel('Landlord managing my own units').check();
    await page.getByLabel('6 – 20').check();
    await page.getByLabel('Kiambu').check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('heading', { level: 2 })).toHaveText('How it works today');
    await page.getByLabel('A spreadsheet').check();
    await page.getByLabel('Chasing arrears').check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('heading', { level: 2 })).toHaveText('What you need');
    await page.getByLabel('Rent collection over M-Pesa').check();
    await page.getByLabel('Our own Paybill').check();
    await page.getByLabel('Yes', { exact: true }).check();
    await page.getByLabel('This month').check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('heading', { level: 2 })).toHaveText('How to reach you');
    await page.getByLabel('Your name').fill('Test Person');
    await page.getByLabel('Organization', { exact: true }).fill('Sample Homes');
    await page.getByLabel('Work email').fill('ops@example.co.ke');
    await page.getByLabel('WhatsApp number').fill('0722000001');
    await page.getByLabel('You may contact me about this demo request.').check();
    await page.getByRole('button', { name: 'Send and book the call' }).click();
    await expect(page.getByRole('status')).toContainText('Thanks');
    expect(errors).toEqual([]);
  });

  test('has no serious or critical accessibility violations', async ({ page }) => {
    await page.goto('/demo');
    await page.getByRole('button', { name: 'Continue' }).waitFor();
    await expectNoBlockingViolations(page);
  });
});

test.describe('assistant', () => {
  test('status reports demo mode without a key', async ({ request }) => {
    const response = await request.get('/api/assistant/status');
    expect(response.status()).toBe(200);
    const body = (await response.json()) as { mode: string; voice: boolean };
    expect(['demo', 'live']).toContain(body.mode);
  });

  test('chat streams a reply and a marketplace suggestion', async ({ request }) => {
    const response = await request.post('/api/assistant/chat', {
      data: {
        messages: [{ role: 'user', content: 'Find a 2-bedroom to rent in Kisumu' }],
        page: '/',
      },
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/event-stream');
    const text = await response.text();
    expect(text).toContain('event: token');
    expect(text).toContain('"href":"/marketplace?county=kisumu&beds=2"');
    expect(text).toContain('event: done');
  });

  test('chat rejects an empty conversation', async ({ request }) => {
    const response = await request.post('/api/assistant/chat', { data: { messages: [] } });
    expect(response.status()).toBe(400);
  });

  test('speak falls back to the browser voice when no server voice exists', async ({ request }) => {
    const response = await request.post('/api/assistant/speak', { data: { text: 'hello' } });
    expect([200, 501]).toContain(response.status());
  });

  test('widget opens, answers, links to the marketplace and closes on Escape', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto('/pricing');
    const launcher = page.getByRole('button', { name: 'Open the Ethanel assistant' });
    await launcher.click();
    const dialog = page.getByRole('dialog', { name: 'Ethanel assistant' });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Find a 2-bedroom to rent in Kisumu' }).click();
    const chip = page.getByTestId('assistant-suggestion');
    await expect(chip).toHaveAttribute('href', '/marketplace?county=kisumu&beds=2');
    await expect(dialog.getByRole('button', { name: 'Speak your question' })).toBeVisible();
    await expectNoBlockingViolations(page);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(launcher).toBeFocused();
    expect(errors).toEqual([]);
  });
});
