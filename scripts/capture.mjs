import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const base = 'http://127.0.0.1:4321/handrail-proposal/';
await mkdir('qa-artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (e) => {
  if (e.type() === 'error') errors.push(e.text());
});
await page.goto(base, { waitUntil: 'networkidle' });
await page
  .locator('.scene-host[data-scene-state="ready"]')
  .waitFor({ timeout: 20000 });
await expect(page.locator('.scene-static')).toHaveCSS('opacity', '0');
const desktopScene = await page
  .locator('.scene-host')
  .getAttribute('data-scene-state');
await page.screenshot({ path: 'qa-artifacts/desktop-hero.png' });
await page.locator('#structure').scrollIntoViewIfNeeded();
await page.screenshot({ path: 'qa-artifacts/desktop-structure.png' });
await page.screenshot({
  path: 'qa-artifacts/desktop-full.png',
  fullPage: true,
});
await page.goto(base + 'agreement/', { waitUntil: 'networkidle' });
await page.screenshot({ path: 'qa-artifacts/contract.png' });
const phone = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
});
await phone.goto(base, { waitUntil: 'networkidle' });
await expect(phone.locator('.scene-static')).toHaveCSS('opacity', '0');
await phone.screenshot({ path: 'qa-artifacts/mobile-hero.png' });
await phone.screenshot({
  path: 'qa-artifacts/mobile-full.png',
  fullPage: true,
});
console.log(
  JSON.stringify(
    {
      errors,
      desktopScene,
      mobileOverflow: await phone.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    },
    null,
    2,
  ),
);
await browser.close();
