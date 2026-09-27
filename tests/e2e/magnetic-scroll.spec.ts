import { expect, test, type Page } from '@playwright/test';
import { waitForTourSettled } from '../helpers/tour-settled';

async function chapter(page: Page, name: string) {
  await page.getByRole('button', { name, exact: true }).click();
  await waitForTourSettled(page);
  return page.evaluate(() => scrollY);
}

async function landed(page: Page, position: number) {
  await expect
    .poll(() => page.evaluate(() => scrollY), { timeout: 3500 })
    .toBeCloseTo(position, 0);
  await waitForTourSettled(page);
  expect(await page.evaluate(() => scrollY)).toBeCloseTo(position, 0);
}

async function angle(page: Page) {
  return page.locator('[data-panel="left"]').evaluate((wing) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(wing).transform);
    return (Math.atan2(-matrix.m13, matrix.m11) * 180) / Math.PI;
  });
}

for (const width of [390, 1440]) {
  test(`one-pixel gestures magnetize the cold opening and cover both ways at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('./');
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    await page.mouse.move(width / 2, 400);
    await page.mouse.wheel(0, 1);
    await expect.poll(() => angle(page), { timeout: 3500 }).toBeCloseTo(38, 1);
    await waitForTourSettled(page);
    const unfolded = await page.evaluate(() => scrollY);
    expect(unfolded).toBeGreaterThan(100);
    await expect(page.locator('#tour-caption')).toHaveText('The full proposal');
    await expect(
      page.getByRole('button', { name: 'Overview', exact: true }),
    ).toHaveAttribute('aria-current', 'step');

    await page.mouse.wheel(0, 1);
    await expect(
      page.getByRole('button', { name: 'The beginning', exact: true }),
    ).toHaveAttribute('aria-current', 'step');
    await waitForTourSettled(page);
    const cover = await page.evaluate(() => scrollY);
    expect(cover).toBeGreaterThan(unfolded + 100);
    await page.waitForTimeout(1500);
    expect(await page.evaluate(() => scrollY)).toBe(cover);

    await page.mouse.wheel(0, -1);
    await landed(page, unfolded);
    await page.mouse.wheel(0, -1);
    await landed(page, 0);
    expect(await angle(page)).toBeCloseTo(146, 1);
  });

  test(`reversing a magnetic pull selects the previous concrete stop at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('./');
    const cash = await chapter(page, 'Cash flow');
    await page.mouse.move(width / 2, 400);
    await page.mouse.wheel(0, 2);
    await expect
      .poll(() => page.evaluate(() => scrollY), { timeout: 2000 })
      .toBeGreaterThan(cash + 30);
    await page.mouse.wheel(0, -2);
    await landed(page, cash);
  });
}

test('mobile refitting completes a pending pull instead of stranding the camera', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  const next = await chapter(page, 'Hire first');
  const cash = await chapter(page, 'Cash flow');
  await page.mouse.move(195, 400);
  await page.mouse.wheel(0, 1);
  await expect
    .poll(() => page.evaluate(() => scrollY), { intervals: [10] })
    .toBeGreaterThan(cash + 5);
  await page.setViewportSize({ width: 390, height: 720 });
  await landed(page, next);
  await expect(
    page.getByRole('button', { name: 'Hire first', exact: true }),
  ).toHaveAttribute('aria-current', 'step');
});

test('a short native touch commits while held and cannot advance again before release', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto('./');
  const next = await chapter(page, 'Hire first');
  const cash = await chapter(page, 'Cash flow');
  const client = await context.newCDPSession(page);
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: 195, y: 580 }],
  });
  const response = page.evaluate(
    (cash) =>
      new Promise<number>((resolve, reject) => {
        const timeout = setTimeout(
          () => reject(new Error('Short touch did not move the flyer')),
          1000,
        );
        addEventListener(
          'touchmove',
          () => {
            const started = performance.now();
            const sample = () => {
              if (scrollY > cash + 5) {
                clearTimeout(timeout);
                resolve(performance.now() - started);
              } else requestAnimationFrame(sample);
            };
            requestAnimationFrame(sample);
          },
          { once: true, capture: true },
        );
      }),
    cash,
  );
  // Chromium's mobile touch slop suppresses DOM touchmove at 12px; 18px is
  // the first delivered gesture in the native input probe. Time the handler.
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: 195, y: 562 }],
  });
  expect(await response).toBeLessThanOrEqual(300);
  await landed(page, next);
  for (const y of [540, 510, 480]) {
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: 195, y }],
    });
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(350);
  expect(await page.evaluate(() => scrollY)).toBe(next);
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  });
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => scrollY)).toBe(next);
  await context.close();
});

test('horizontal input and a no-movement tap do not advance the tour', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  const cash = await chapter(page, 'Cash flow');
  await page.mouse.move(195, 400);
  await page.mouse.wheel(120, 0);
  await page.evaluate(() => {
    dispatchEvent(new Event('touchstart'));
    dispatchEvent(new Event('touchend'));
  });
  await page.waitForTimeout(1000);
  expect(await page.evaluate(() => scrollY)).toBe(cash);
});

test('horizontal input cannot cancel a vertical magnetic completion', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  const next = await chapter(page, 'Hire first');
  const cash = await chapter(page, 'Cash flow');
  await page.mouse.move(195, 400);
  await page.mouse.wheel(0, 2);
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(cash + 30);
  await page.mouse.wheel(100, 0);
  await landed(page, next);
});

test('the terminal camera tail returns to the exact final reading stop', async ({
  page,
}) => {
  await page.goto('./');
  const lastName = await page
    .locator('.chapter-nav button')
    .last()
    .getAttribute('aria-label');
  const last = await chapter(page, lastName!);
  await page.keyboard.press('End');
  await landed(page, last);
  await page.mouse.move(500, 400);
  await page.mouse.wheel(0, 1);
  await landed(page, last);
});

test('ordinary reading keeps small native scrolls without magnetic movement', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./?view=read');
  await page.mouse.move(195, 400);
  await page.mouse.wheel(0, 60);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(60);
  await page.waitForTimeout(1200);
  expect(await page.evaluate(() => scrollY)).toBe(60);
});
