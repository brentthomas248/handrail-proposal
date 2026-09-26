import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { agreementSections, proposal } from '../../src/content/proposal';

test('both paths, full contract and PDF are reachable', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('./');
  await expect(
    page.getByRole('heading', { name: 'A commitment built around results.' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Explore the proposal' }).click();
  await expect(page.locator('#structure')).toBeInViewport();
  await expect(page.locator('.employment-path .path-rate')).toHaveText('15%');
  await expect(page.locator('.client-path .path-rate')).toHaveText('20%');
  await page.getByText('What about a deal still in progress?').click();
  await expect(page.locator('.timeline-detail')).toHaveAttribute('open', '');
  await page
    .getByRole('link', { name: 'Read the commission protections' })
    .click();
  await expect(
    page.locator('#recurring-and-deferred-rights-after-employment'),
  ).toBeInViewport();
  for (const section of agreementSections)
    await expect(page.locator(`#${section.id}`)).toBeAttached();
  await expect(page.locator('.contract-clause')).toHaveCount(18);
  const response = await page.request.get(
    proposal.paths.pdf.startsWith('/')
      ? proposal.paths.pdf
      : `/handrail-proposal/${proposal.paths.pdf}`,
  );
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['content-type']).toContain('application/pdf');
  expect(errors).toEqual([]);
});

test('contract paragraphs match the canonical source exactly', async ({
  page,
}) => {
  await page.goto('agreement/');
  for (const section of agreementSections)
    expect(await page.locator(`#${section.id} p`).allTextContents()).toEqual(
      section.paragraphs,
    );
});

for (const width of [320, 390, 768, 1440])
  test(`readable without overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await expect(page.locator('.hero h1')).toBeVisible();
    await page.goto('agreement/');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await expect(
      page.getByRole('heading', { name: /18\. Completion/ }),
    ).toBeAttached();
  });

test('reduced motion starts static and preserves the reading path', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(page.getByRole('button', { name: /^Motion / })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  await expect(page.locator('.scene-host')).toHaveAttribute(
    'data-scene-state',
    'static',
  );
  await expect(page.getByRole('button', { name: /^Motion / })).toBeDisabled();
  await page.getByRole('link', { name: 'Explore the proposal' }).click();
  await expect(page.locator('#structure')).toBeInViewport();
});

test('motion preference persists and keyboard toggle works', async ({
  page,
}) => {
  await page.goto('./');
  const toggle = page.getByRole('button', { name: /^Motion / });
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await page.reload();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
});

test('JavaScript-free page retains proposal and complete agreement', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/handrail-proposal/');
  await expect(page.locator('.paper-fallback')).toBeVisible();
  await expect(page.getByRole('button', { name: /^Motion / })).toBeDisabled();
  await page.getByRole('link', { name: 'Read the full agreement' }).click();
  await expect(page.locator('.contract-clause')).toHaveCount(18);
  await context.close();
});

test('WebGL unavailable leaves a visible paper fallback and working content', async ({
  browser,
}) => {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (
        type === 'webgl' ||
        type === 'webgl2' ||
        type === 'experimental-webgl'
      )
        return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/handrail-proposal/');
  await expect(page.locator('.scene-host')).toHaveAttribute(
    'data-scene-state',
    'fallback',
    { timeout: 15000 },
  );
  await expect(page.locator('.scene-static')).toHaveCSS('opacity', '1');
  await page.getByRole('link', { name: 'Read the full agreement' }).click();
  await expect(page.locator('.contract-clause')).toHaveCount(18);
  await context.close();
});

for (const route of ['./', 'agreement/'])
  test(`accessibility scan ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  });

test('skip link sends keyboard users to main content', async ({ page }) => {
  await page.goto('./');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});
