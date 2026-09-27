import { expect, test, type Page } from '@playwright/test';
import { waitForTourSettled } from '../helpers/tour-settled';

async function stop(page: Page, name: string) {
  await page.getByRole('button', { name, exact: true }).click();
  await waitForTourSettled(page);
  return page.evaluate(() => scrollY);
}

for (const width of [390, 1440]) {
  test(`a sustained tiny wheel gesture commits early and cannot cascade at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('./');
    const next = await stop(page, width < 760 ? 'Hire first' : 'The two paths');
    const cash = await stop(page, 'Cash flow');
    await page.mouse.move(width / 2, 400);
    for (let i = 0; i < 26; i += 1) {
      await page.mouse.wheel(0, 1);
      await page.waitForTimeout(40);
      if (i === 3) {
        expect(await page.evaluate(() => scrollY)).toBeGreaterThan(
          cash + (next - cash) * 0.25,
        );
      }
    }
    await waitForTourSettled(page);
    expect(await page.evaluate(() => scrollY)).toBe(next);
    await page.waitForTimeout(250);
    await page.mouse.wheel(0, -1);
    await expect
      .poll(() => page.evaluate(() => scrollY), { timeout: 1200 })
      .toBe(cash);
    await waitForTourSettled(page);
  });
}

test('a short held swipe arrives before release and only a new swipe advances again', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto('./');
  const next = await stop(page, 'Hire first');
  const following = await stop(page, 'Client first');
  const cash = await stop(page, 'Cash flow');
  const client = await context.newCDPSession(page);
  const touch = (type: 'touchStart' | 'touchMove' | 'touchEnd', y?: number) =>
    client.send('Input.dispatchTouchEvent', {
      type,
      touchPoints: y === undefined ? [] : [{ x: 195, y }],
    });
  await touch('touchStart', 500);
  for (const y of [494, 488, 482]) {
    await touch('touchMove', y);
    await page.waitForTimeout(20);
  }
  await expect
    .poll(() => page.evaluate(() => scrollY), { timeout: 250 })
    .toBeGreaterThan(cash + 100);
  await expect
    .poll(() => page.evaluate(() => scrollY), { timeout: 1000 })
    .toBe(next);
  for (const y of [460, 440, 420]) await touch('touchMove', y);
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => scrollY)).toBe(next);
  await touch('touchEnd');
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => scrollY)).toBe(next);
  await touch('touchStart', 500);
  await touch('touchMove', 480);
  await touch('touchEnd');
  await expect
    .poll(() => page.evaluate(() => scrollY), { timeout: 1200 })
    .toBe(following);
  await context.close();
});

test('browser zoom and horizontal gestures do not commit a chapter', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  const cash = await stop(page, 'Cash flow');
  await page.mouse.move(195, 400);
  await page.keyboard.down('Control');
  await page.mouse.wheel(0, 10);
  await page.keyboard.up('Control');
  await page.mouse.wheel(100, 0);
  await page.waitForTimeout(350);
  expect(await page.evaluate(() => scrollY)).toBe(cash);
});

test('a touch tap does not interrupt a committed flight', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  const next = await stop(page, 'Hire first');
  const cash = await stop(page, 'Cash flow');
  await page.mouse.move(195, 400);
  await page.mouse.wheel(0, 1);
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(cash + 60);
  await page.evaluate(() => {
    const target = document.querySelector('.flyer-stage')!;
    const touch = new Touch({
      identifier: 1,
      target,
      clientX: 195,
      clientY: 400,
    });
    target.dispatchEvent(
      new TouchEvent('touchstart', {
        bubbles: true,
        touches: [touch],
        targetTouches: [touch],
        changedTouches: [touch],
      }),
    );
    target.dispatchEvent(
      new TouchEvent('touchend', {
        bubbles: true,
        touches: [],
        targetTouches: [],
        changedTouches: [touch],
      }),
    );
  });
  await expect
    .poll(() => page.evaluate(() => scrollY), { timeout: 1000 })
    .toBe(next);
});

test('refitting during a continuing wheel gesture cannot unlock another chapter', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  const next = await stop(page, 'Hire first');
  await stop(page, 'Cash flow');
  await page.mouse.move(195, 400);
  for (let i = 0; i < 34; i += 1) {
    await page.mouse.wheel(0, 1);
    if (i === 17) await page.setViewportSize({ width: 390, height: 720 });
    await page.waitForTimeout(45);
  }
  await waitForTourSettled(page);
  expect(await page.evaluate(() => scrollY)).toBe(next);
});

test('fresh wheel intent interrupts chapter navigation after an earlier wheel gesture', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  const next = await stop(page, 'Hire first');
  await stop(page, 'Cash flow');
  await page.mouse.move(195, 400);
  await page.mouse.wheel(0, 1);
  await waitForTourSettled(page);
  expect(await page.evaluate(() => scrollY)).toBe(next);
  await page
    .getByRole('button', { name: 'The beginning', exact: true })
    .click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(next - 60);
  await page.mouse.move(195, 400);
  await page.mouse.wheel(0, 1);
  await expect
    .poll(() => page.evaluate(() => scrollY), { timeout: 1200 })
    .toBe(next);
  await waitForTourSettled(page);
});
