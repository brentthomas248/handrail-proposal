import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base = new URL(process.env.STORYBOOK_BASE_URL || 'http://127.0.0.1:6006');
if (!['127.0.0.1', 'localhost'].includes(base.hostname)) {
  throw new Error(
    'Component verification is limited to the approved local Storybook service.',
  );
}
const output = new URL('../qa-artifacts/storybook/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results = [];
const errors = [];
const context = await browser.newContext({
  viewport: { width: 1000, height: 800 },
});
const page = await context.newPage();
page.on('pageerror', (error) => errors.push(error.message));
async function openStory(id) {
  await page.goto(new URL(`/iframe.html?id=${id}&viewMode=story`, base).href);
  await page.locator('#storybook-root').waitFor();
}
async function check(name, run) {
  await run();
  const audit = await new AxeBuilder({ page })
    .include('#storybook-root')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(audit.violations, `${name}: accessibility violations`).toEqual([]);
  results.push({
    name,
    passed: true,
    accessibilityViolations: audit.violations.length,
  });
}
try {
  await check('employment path reads 15/5 and all 90 days', async () => {
    await openStory('proposal-deal-path--employment-first');
    await expect(page.getByText('15', { exact: true })).toBeVisible();
    await expect(page.getByText('+ 5%', { exact: true })).toBeVisible();
    await expect(page.getByText(/any time in the 90-day window/)).toBeVisible();
    await page.screenshot({ path: new URL('employment.png', output).pathname });
  });
  await check(
    'client path retains future-sales terms at mobile width',
    async () => {
      await page.setViewportSize({ width: 375, height: 900 });
      await openStory('proposal-deal-path--client-first');
      await expect(page.getByText('20', { exact: true })).toBeVisible();
      await expect(page.getByText(/all future credited sales/)).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: new URL('client-mobile.png', output).pathname,
      });
    },
  );
  await check(
    'motion toggle supports keyboard and persistent preference',
    async () => {
      await page.setViewportSize({ width: 1000, height: 800 });
      await openStory('proposal-motion-preference--saved-motion-off');
      const toggle = page.getByRole('button', { name: /^Motion / });
      await expect(toggle).toHaveAttribute('aria-pressed', 'false');
      await page.keyboard.press('Tab');
      await expect(toggle).toBeFocused();
      await page.keyboard.press('Space');
      await expect(toggle).toHaveAttribute('aria-pressed', 'true');
      expect(
        await page.evaluate(() => localStorage.getItem('proposal-motion')),
      ).toBe('on');
      await page.keyboard.press('Enter');
      await expect(toggle).toHaveAttribute('aria-pressed', 'false');
      expect(
        await page.evaluate(() => localStorage.getItem('proposal-motion')),
      ).toBe('off');
      await page.screenshot({
        path: new URL('motion-keyboard.png', output).pathname,
      });
    },
  );
  await check('static fallback renders without an active canvas', async () => {
    await openStory('proposal-scene-host--motion-disabled');
    await expect(page.locator('[data-scene-state]')).toHaveAttribute(
      'data-scene-state',
      'static',
    );
    await expect(page.locator('svg.paper-fallback')).toBeVisible();
    await expect(page.locator('canvas')).toHaveCount(0);
    await page.screenshot({
      path: new URL('static-fallback.png', output).pathname,
    });
  });
  await check(
    'folded and unfolded scene render in the local browser',
    async () => {
      for (const [state, name] of [
        ['folded', 'folded-scene'],
        ['unfolded', 'unfolded-scene'],
      ]) {
        await openStory(`proposal-folding-paper-scene--${state}`);
        await expect(page.locator('[data-paper-scene]')).toHaveAttribute(
          'data-paper-scene',
          'ready',
        );
        await expect(page.locator('canvas')).toBeVisible();
        await page.waitForFunction(() => {
          const canvas = document.querySelector('canvas');
          return canvas !== null && canvas.width > 0 && canvas.height > 0;
        });
        await page.screenshot({
          path: new URL(`${name}.png`, output).pathname,
        });
      }
    },
  );
  await check(
    'scene host promotes the static fallback after renderer readiness',
    async () => {
      await openStory('proposal-scene-host--motion-enabled');
      await expect(page.locator('[data-scene-state]')).toHaveAttribute(
        'data-scene-state',
        'ready',
      );
      await expect(page.locator('canvas')).toBeVisible();
    },
  );
  await check(
    'system reduced-motion overrides an enabled saved preference',
    async () => {
      await openStory('proposal-motion-preference--system-reduced-motion');
      const toggle = page.getByRole('button', { name: /^Motion / });
      await expect(toggle).toBeDisabled();
      await expect(toggle).toHaveAttribute('aria-pressed', 'false');
      await expect(toggle).toHaveAttribute(
        'title',
        'Motion is disabled by your system preference',
      );
    },
  );
  expect(errors, 'Uncaught story errors').toEqual([]);
  await writeFile(
    new URL('verification.json', output),
    JSON.stringify({ passed: true, results, errors }, null, 2),
  );
  console.log(
    JSON.stringify({
      passed: true,
      checks: results.length,
      accessibilityViolations: 0,
      errors,
    }),
  );
} catch (error) {
  await writeFile(
    new URL('verification.json', output),
    JSON.stringify(
      { passed: false, results, errors, failure: String(error) },
      null,
      2,
    ),
  );
  throw error;
} finally {
  await browser.close();
}
