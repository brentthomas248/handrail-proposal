import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { agreementSections, proposal } from '../../src/content/proposal';

const baseURL =
  process.env.PROPOSAL_BASE_URL || 'http://127.0.0.1:4321/handrail-proposal/';

async function sheetTransform(page: Page) {
  return page.locator('.proposal-sheet').evaluate((sheet) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(sheet).transform);
    return { scale: matrix.a, x: matrix.e, y: matrix.f };
  });
}

async function enterReadingMode(page: Page) {
  if ((await page.locator('html').getAttribute('data-presentation')) !== 'read')
    await page.locator('#reading-mode').click();
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'read',
  );
}

async function expectNoOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
}

test('real scrolling zooms and pans the flyer, then reverses to the opening', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  const failedRequests: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400)
      failedRequests.push(`${response.status()} ${response.url()}`);
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'tour',
  );
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  await expect(page.locator('.proposal-sheet h1')).toContainText(
    /No base\s*salary/,
  );
  await expect(page.locator('.proposal-sheet')).toContainText('collected');
  const opening = await sheetTransform(page);
  await testInfo.attach('opening-flyer', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
  const travel = await page.evaluate(
    () => document.documentElement.scrollHeight - innerHeight,
  );
  expect(travel).toBeGreaterThan(2000);
  await page.mouse.wheel(0, Math.round(travel * 0.28));
  await expect
    .poll(async () =>
      Math.abs((await sheetTransform(page)).scale - opening.scale),
    )
    .toBeGreaterThan(0.1);
  const zoomed = await sheetTransform(page);
  expect(
    Math.hypot(zoomed.x - opening.x, zoomed.y - opening.y),
  ).toBeGreaterThan(100);
  await testInfo.attach('scroll-zoom', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
  await page.mouse.wheel(0, Math.round(travel * 0.35));
  await expect
    .poll(async () => {
      const current = await sheetTransform(page);
      return Math.hypot(current.x - zoomed.x, current.y - zoomed.y);
    })
    .toBeGreaterThan(100);
  await testInfo.attach('scroll-pan', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
  await page.mouse.wheel(0, -travel * 2);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await expect
    .poll(async () =>
      Math.abs((await sheetTransform(page)).scale - opening.scale),
    )
    .toBeLessThan(0.02);
  await expect
    .poll(async () => {
      const current = await sheetTransform(page);
      return Math.hypot(current.x - opening.x, current.y - opening.y);
    })
    .toBeLessThan(10);
  expect(errors).toEqual([]);
  expect(failedRequests).toEqual([]);
});

test('keyboard chapter navigation moves the camera to a chosen section', async ({
  page,
}) => {
  await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'tour',
  );
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  const chapters = page.locator('.chapter-nav button[data-go-to]');
  expect(await chapters.count()).toBeGreaterThanOrEqual(4);
  const opening = await sheetTransform(page);
  const chapter = chapters.nth(2);
  await chapter.focus();
  await page.keyboard.press('Enter');
  await expect(chapter).toBeFocused();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  await expect
    .poll(async () => {
      const current = await sheetTransform(page);
      return Math.hypot(current.x - opening.x, current.y - opening.y);
    })
    .toBeGreaterThan(100);
});

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
  { width: 320, height: 740 },
])
  test(`every camera chapter frames its content at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('./');
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    const chapters = page.locator('.chapter-nav button[data-go-to]');
    for (let index = 1; index < (await chapters.count()); index += 1) {
      const chapter = chapters.nth(index);
      const label = await chapter.getAttribute('aria-label');
      const target = page.locator(
        `[data-camera-stop=${JSON.stringify(label)}], [data-camera-mobile=${JSON.stringify(label)}]`,
      );
      await chapter.click();
      await expect(chapter).toHaveAttribute('aria-current', 'step');
      await expect(target).toBeInViewport({ ratio: 0.98 });
      await expect
        .poll(
          async () => {
            const box = await target.boundingBox();
            return (
              !!box &&
              box.x >= 8 &&
              box.x + box.width <= viewport.width - 8 &&
              box.y >= 80 &&
              box.y + box.height <= viewport.height - 75
            );
          },
          {
            message: `${label} should fit between the header and tour controls`,
          },
        )
        .toBeTruthy();
      await expect
        .poll(
          () =>
            target.evaluate((element) => {
              const scale =
                element.getBoundingClientRect().width /
                (element as HTMLElement).offsetWidth;
              return Math.min(
                ...[...element.querySelectorAll('p, h1, h2, h3')].map(
                  (text) =>
                    Number.parseFloat(getComputedStyle(text).fontSize) * scale,
                ),
              );
            }),
          {
            message: `${label} text should remain at least 12 rendered pixels`,
          },
        )
        .toBeGreaterThanOrEqual(12);
    }
  });

test('reading mode exposes both rates, cash-flow explanation and proposal notes', async ({
  page,
}) => {
  await page.goto('./');
  await enterReadingMode(page);
  const flyer = page.locator('.proposal-sheet');
  for (const text of ['15%', '20%', '5%'])
    await expect(flyer).toContainText(text);
  await expect(flyer).toContainText(/collect|receiv/i);
  await expect(flyer).toContainText(/future/i);
  await expect(page.locator('[data-camera-stop]')).not.toHaveCount(0);
  await expectNoOverflow(page);
  await page.locator('a[href$="/agreement/"]').first().click();
  await expect(page).toHaveURL(/\/agreement\/$/);
  await expect(page.locator('h1')).toContainText(/proposal/i);
  for (const section of agreementSections) {
    await expect(page.locator(`#${section.id}`)).toBeAttached();
    expect(await page.locator(`#${section.id} p`).allTextContents()).toEqual(
      section.paragraphs,
    );
  }
  const response = await page.request.get(
    new URL(proposal.paths.pdf, page.url().replace(/agreement\/$/, '')).href,
  );
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['content-type']).toContain('application/pdf');
});

for (const width of [320, 390, 768, 1440])
  test(`normal reading and proposal notes reflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');
    await enterReadingMode(page);
    await expectNoOverflow(page);
    for (const stop of await page.locator('[data-camera-stop]').all()) {
      await stop.scrollIntoViewIfNeeded();
      await expect(stop).toBeVisible();
      const box = await stop.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(-1);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
    }
    await page.goto('agreement/');
    await expectNoOverflow(page);
    await expect(
      page.locator(`#${agreementSections.at(-1)!.id}`),
    ).toBeAttached();
  });

test('mobile touch scroll moves the same flyer', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto(baseURL);
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'tour',
  );
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  const opening = await sheetTransform(page);
  const session = await context.newCDPSession(page);
  await session.send('Input.synthesizeScrollGesture', {
    x: 195,
    y: 650,
    yDistance: -1600,
    speed: 1800,
    gestureSourceType: 'touch',
  });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
  await expect
    .poll(async () => {
      const current = await sheetTransform(page);
      return Math.hypot(current.x - opening.x, current.y - opening.y);
    })
    .toBeGreaterThan(20);
  await enterReadingMode(page);
  await expectNoOverflow(page);
  await context.close();
});

test('reading preference persists and its toggle works from the keyboard', async ({
  page,
}) => {
  await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'tour',
  );
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  const toggle = page.locator('#reading-mode');
  await expect(toggle).toHaveAccessibleName('Read normally');
  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'read',
  );
  await expect(toggle).toHaveAccessibleName('Take the tour');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'read',
  );
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'read',
  );
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'read',
  );
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'tour',
  );
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
});

test('system reduced motion uses normal reading without a moving camera', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'read',
  );
  await expect(page.locator('.proposal-sheet')).toHaveCSS('transform', 'none');
  await expectNoOverflow(page);
  await page.mouse.wheel(0, 900);
  await expect(page.locator('.proposal-sheet')).toHaveCSS('transform', 'none');
  await expect(page.locator('.proposal-sheet')).toContainText('20%');
});

test('without JavaScript the complete proposal remains readable and linked', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto(baseURL);
  await expect(page.locator('.proposal-sheet')).toHaveCSS('transform', 'none');
  await expect(page.locator('.proposal-sheet h1')).toBeVisible();
  await expect(page.locator('.proposal-sheet')).toContainText('20%');
  await expectNoOverflow(page);
  await page.locator('a[href$="/agreement/"]').first().click();
  for (const section of agreementSections)
    await expect(page.locator(`#${section.id}`)).toBeAttached();
  await context.close();
});

for (const route of ['./', 'agreement/'])
  test(`accessibility scan ${route}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(route);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  });

test('skip link sends keyboard users to the proposal content', async ({
  page,
}) => {
  await page.goto('./');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});

test('keyboard navigation into the flyer reveals the focused link in reading mode', async ({
  page,
}) => {
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  await page.locator('#reading-mode').focus();
  await page.keyboard.press('Tab');
  const notesLink = page.locator('.proposal-sheet a[href$="/agreement/"]');
  await expect(notesLink).toBeFocused();
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'read',
  );
  await expect(notesLink).toBeInViewport({ ratio: 1 });
});

test('the tour remains usable after visiting notes and browser Back', async ({
  page,
}) => {
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  await page.locator('.chapter-nav button[data-go-to="2"]').click();
  await expect(page.locator('#cash-flow')).toBeInViewport({ ratio: 0.98 });
  await page.locator('.site-header a[href$="/agreement/"]').click();
  await expect(page.locator('h1')).toHaveText('Proposal notes');
  await page.goBack();
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'tour',
  );
  await page.locator('.chapter-nav button[data-go-to="3"]').click();
  await expect(page.locator('#paths')).toBeInViewport({ ratio: 0.98 });
  await expect(page.locator('.proposal-sheet')).not.toHaveCSS(
    'transform',
    'none',
  );
});
