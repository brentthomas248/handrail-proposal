import { expect, test, type Page } from '@playwright/test';
import { waitForTourSettled } from '../helpers/tour-settled';

async function expectCompleteWindowHeading(page: Page) {
  const main = page.getByRole('main');
  await expect(
    main.getByRole('heading', {
      name: '90 days to begin.',
      exact: true,
      level: 2,
    }),
  ).toHaveCount(1);
  const snapshot = await main.ariaSnapshot();
  expect(snapshot).not.toContain('- strong: "90"');
}

for (const width of [390, 1440]) {
  test(`returning from the document bottom restores the closing chapter at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('./');
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    await page
      .getByRole('button', {
        name: width < 760 ? 'Client first' : 'The two paths',
        exact: true,
      })
      .click();
    await waitForTourSettled(page);
    await page
      .getByRole('button', { name: 'Read normally', exact: true })
      .click();
    await page.mouse.move(width / 2, 420);
    // Exercise a sustained native gesture after the mode's programmatic
    // positioning; the first WebKit wheel sample can only cancel that scroll.
    await page.mouse.wheel(0, 1150);
    await page.waitForTimeout(50);
    await page.mouse.wheel(0, 1150);
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollHeight - scrollY - innerHeight,
        ),
      )
      .toBeLessThanOrEqual(1);
    await expect(page.locator('#together')).toBeInViewport({ ratio: 1 });
    // Allow the reading-input idle handler to retain the settled reading place.
    await page.waitForTimeout(800);
    await testInfo.attach('closing-reading-position', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
    await page
      .getByRole('button', { name: 'Take the tour', exact: true })
      .click();
    await waitForTourSettled(page);
    await testInfo.attach('returned-tour-position', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
    await expect(
      page.getByRole('button', { name: 'Grow together', exact: true }),
    ).toHaveAttribute('aria-current', 'step');
  });
}

test('the complete window heading is announced once in tour and normal reading', async ({
  page,
}) => {
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  await expectCompleteWindowHeading(page);
  await page
    .getByRole('button', { name: 'Read normally', exact: true })
    .click();
  await expectCompleteWindowHeading(page);
});

test('reduced-motion reading retains the complete window heading', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expectCompleteWindowHeading(page);
});

test.describe('no JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('ordinary reading retains the complete window heading', async ({
    page,
  }) => {
    await page.goto('./');
    await expectCompleteWindowHeading(page);
  });
});
