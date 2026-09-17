import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { expect, test, type BrowserContext, type Page } from '@playwright/test';
import { importPKCS8, SignJWT } from 'jose';

import { demoUsers } from '../fixtures/demo-users';

/**
 * Authentication, authorization and access control.
 *
 * Sessions are Clerk-shaped RS256 JWTs signed with the test-only key in fixtures/, which the
 * web server verifies networklessly through CLERK_JWT_KEY (playwright.config.ts sets it). The
 * claims name a seeded Clerk user id, so what each persona may see is decided by the database:
 * membership rows for /org/[slug], landlord rows for /landlord, lease rows for /me.
 */
const privateKeyPem = readFileSync(
  resolve(import.meta.dirname, '../fixtures/clerk-jwt-test-key.pem'),
  'utf8',
);

async function signInAs(context: BrowserContext, clerkUserId: string, baseURL: string) {
  const key = await importPKCS8(privateKeyPem, 'RS256');
  const now = Math.floor(Date.now() / 1000);
  const token = await new SignJWT({ azp: baseURL, sid: `sess_${clerkUserId}`, v: 2 })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT', kid: 'ethanel-test' })
    .setIssuer('https://clerk.ethanel.test')
    .setSubject(clerkUserId)
    .setIssuedAt(now)
    .setNotBefore(now - 5)
    .setExpirationTime(now + 60 * 10)
    .sign(key);
  await context.addCookies([
    { name: '__session', value: token, url: baseURL, httpOnly: true, sameSite: 'Lax' },
    { name: '__client_uat', value: String(now - 1), url: baseURL, sameSite: 'Lax' },
  ]);
}

const byPersona = Object.fromEntries(demoUsers.map((u) => [u.persona, u]));
const ORG = '/org/riverside-lettings';
const OTHER_ORG = '/org/savannah-land';
const FORBIDDEN_TITLE = "You don't have access to this page.";

/**
 * A refusal renders app/forbidden.tsx and nothing of the target. With Cache Components the
 * response streams before a layout guard resolves, so the HTTP status is 200 and the page is the
 * contract (Next docs, `forbidden`: a real status would need the check in `proxy.ts`).
 */
async function expectForbidden(page: Page, path: string, label = path) {
  await page.goto(path);
  await expect(page.getByRole('heading', { level: 1, name: FORBIDDEN_TITLE }), label).toBeVisible();
  await expect(page.getByTestId('membership-role'), label).toHaveCount(0);
  await expect(page.getByTestId('members'), label).toHaveCount(0);
}

test.describe('authentication', () => {
  test('anonymous visitors are sent to sign-in from every protected surface', async ({ page }) => {
    for (const path of [ORG, `${ORG}/settings`, '/landlord', '/me', '/after-sign-in']) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/sign-in/);
    }
  });

  test('sign-in and sign-up pages render with their headings', async ({ page }) => {
    await page.goto('/sign-in');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Sign in to Ethanel.' }),
    ).toBeVisible();
    await page.goto('/sign-up');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Create your Ethanel account.' }),
    ).toBeVisible();
  });

  test('a forged session signed with another key is rejected', async ({
    page,
    context,
    baseURL,
  }) => {
    const now = Math.floor(Date.now() / 1000);
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(
      JSON.stringify({ sub: byPersona.admin?.clerkUserId, iat: now, exp: now + 600, nbf: now - 5 }),
    ).toString('base64url');
    await context.addCookies([
      {
        name: '__session',
        value: `${header}.${payload}.forged`,
        url: baseURL ?? '',
        sameSite: 'Lax',
      },
      { name: '__client_uat', value: String(now - 1), url: baseURL ?? '', sameSite: 'Lax' },
    ]);
    const response = await page.goto(ORG);
    expect(response?.url()).not.toContain('/org/');
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('a signed-in person Ethanel does not know is refused, not treated as staff', async ({
    page,
    context,
    baseURL,
  }) => {
    await signInAs(context, 'user_unknown_to_ethanel', baseURL ?? '');
    await expectForbidden(page, ORG);
    await expectForbidden(page, '/landlord');
    await expectForbidden(page, '/me');
  });
});

test.describe('authorization by persona', () => {
  test('after sign-in each persona lands on their own surface', async ({ browser, baseURL }) => {
    for (const persona of [
      'admin',
      'staff',
      'caretaker',
      'landlord',
      'resident',
      'savannahOwner',
    ] as const) {
      const user = byPersona[persona];
      if (!user) throw new Error(`missing fixture ${persona}`);
      const context = await browser.newContext();
      await signInAs(context, user.clerkUserId, baseURL ?? '');
      const page = await context.newPage();
      await page.goto('/after-sign-in');
      await expect(page, persona).toHaveURL(new RegExp(`${user.home.replace(/\//g, '\\/')}$`));
      await context.close();
    }
  });

  test('owner sees the dashboard and settings with live figures', async ({
    page,
    context,
    baseURL,
  }) => {
    await signInAs(context, byPersona.admin?.clerkUserId ?? '', baseURL ?? '');
    await page.goto(ORG);
    await expect(page.getByRole('heading', { level: 1, name: 'Riverside Lettings' })).toBeVisible();
    await expect(page.getByTestId('membership-role')).toHaveText('owner');
    await expect(page.getByText('KES 474,000').first()).toBeVisible();
    await expect(page.getByText('Riverside Court').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();

    const response = await page.goto(`${ORG}/settings`);
    expect(response?.status()).toBe(200);
    await expect(page.getByTestId('members')).toContainText('demo.caretaker@ethanel.co.ke');
  });

  test('staff and caretakers see the dashboard but settings is forbidden', async ({
    browser,
    baseURL,
  }) => {
    for (const persona of ['staff', 'caretaker'] as const) {
      const context = await browser.newContext();
      await signInAs(context, byPersona[persona]?.clerkUserId ?? '', baseURL ?? '');
      const page = await context.newPage();
      const ok = await page.goto(ORG);
      expect(ok?.status(), persona).toBe(200);
      await expect(page.getByTestId('membership-role')).toHaveText(persona);
      await expect(page.getByRole('link', { name: 'Settings' })).toHaveCount(0);
      await expectForbidden(page, `${ORG}/settings`, persona);
      await context.close();
    }
  });

  test('a landlord sees their statement and nothing staff-only', async ({
    page,
    context,
    baseURL,
  }) => {
    await signInAs(context, byPersona.landlord?.clerkUserId ?? '', baseURL ?? '');
    const ok = await page.goto('/landlord');
    expect(ok?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1, name: 'Grace Wanjiru' })).toBeVisible();
    await expect(page.getByText('KES 238,280').first()).toBeVisible();
    await expect(page.getByText('Ridgeways Villas')).toHaveCount(0);
    for (const path of [ORG, `${ORG}/settings`, '/me']) {
      await expectForbidden(page, path);
    }
  });

  test('a resident sees only their own lease', async ({ page, context, baseURL }) => {
    await signInAs(context, byPersona.resident?.clerkUserId ?? '', baseURL ?? '');
    const ok = await page.goto('/me');
    expect(ok?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1, name: 'Amina Wambui' })).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: /Riverside Court · B4/ }),
    ).toBeVisible();
    await expect(page.getByText('Kitchen tap leaking under the sink').first()).toBeVisible();
    await expect(page.getByText('Villa 1')).toHaveCount(0);
    for (const path of [ORG, '/landlord']) {
      await expectForbidden(page, path);
    }
  });
});

test.describe('tenancy isolation', () => {
  test('staff of one organization cannot open another organization', async ({
    page,
    context,
    baseURL,
  }) => {
    await signInAs(context, byPersona.admin?.clerkUserId ?? '', baseURL ?? '');
    await expectForbidden(page, OTHER_ORG);
    await expect(page.getByText('Savannah Land Co.')).toHaveCount(0);
    await expect(page.getByText('Kitengela')).toHaveCount(0);
  });

  test('the second organization only ever sees its own rows', async ({
    page,
    context,
    baseURL,
  }) => {
    await signInAs(context, byPersona.savannahOwner?.clerkUserId ?? '', baseURL ?? '');
    const ok = await page.goto(OTHER_ORG);
    expect(ok?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1, name: 'Savannah Land Co.' })).toBeVisible();
    await expect(page.getByText('Kitengela Gardens Phase 2').first()).toBeVisible();
    await expect(page.getByText('Riverside Court')).toHaveCount(0);
    await expect(page.getByText('KES 474,000')).toHaveCount(0);
    await expectForbidden(page, ORG);
  });

  test('an unknown organization slug is refused without revealing whether it exists', async ({
    page,
    context,
    baseURL,
  }) => {
    await signInAs(context, byPersona.admin?.clerkUserId ?? '', baseURL ?? '');
    await expectForbidden(page, '/org/does-not-exist');
  });
});
