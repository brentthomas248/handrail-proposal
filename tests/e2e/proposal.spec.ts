import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  agreementSections,
  flyerCopy,
  proposal,
} from '../../src/content/proposal';

const baseURL =
  process.env.PROPOSAL_BASE_URL || 'http://127.0.0.1:4321/handrail-proposal/';

async function sheetTransform(page: Page) {
  return page.locator('.proposal-sheet').evaluate((sheet) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(sheet).transform);
    return {
      scale: Math.hypot(matrix.m11, matrix.m12, matrix.m13),
      x: matrix.e,
      y: matrix.f,
    };
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

async function hingeAngles(page: Page) {
  return page.locator('.fold-panel').evaluateAll((panels) =>
    panels.map((panel) => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(panel).transform);
      return {
        panel: (panel as HTMLElement).dataset.panel,
        degrees: (Math.atan2(-matrix.m13, matrix.m11) * 180) / Math.PI,
      };
    }),
  );
}

async function expectFoldFitsStage(page: Page) {
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const panels = [...document.querySelectorAll('.fold-panel')].map(
            (panel) => panel.getBoundingClientRect(),
          );
          const top = document
            .querySelector('.site-header')!
            .getBoundingClientRect().bottom;
          const bottom = document
            .querySelector('.tour-controls')!
            .getBoundingClientRect().top;
          return panels.every(
            (box) =>
              box.left >= 4 &&
              box.right <= innerWidth - 4 &&
              box.top >= top + 2 &&
              box.bottom <= bottom - 2,
          );
        }),
      {
        message:
          'The physical flyer should fit between the header and controls while unfolding',
      },
    )
    .toBeTruthy();
}

function angularDistance(first: number, second: number) {
  const difference = Math.abs(first - second) % 360;
  return Math.min(difference, 360 - difference);
}

test('real scrolling unfolds both hinges, moves the camera and reverses to the folded packet', async ({
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
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  await expect(page.locator('.fold-panel')).toHaveCount(3);
  for (const line of flyerCopy.cover.headlineLines)
    await expect(page.locator('.proposal-sheet h1')).toContainText(line);
  await expect(page.locator('.cover-statement')).toHaveText(
    flyerCopy.cover.statement,
  );
  const opening = await sheetTransform(page);
  const folded = await hingeAngles(page);
  await expectFoldFitsStage(page);
  await testInfo.attach('folded-packet', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
  const travel = await page.evaluate(
    () => document.documentElement.scrollHeight - innerHeight,
  );
  expect(travel).toBeGreaterThan(2000);
  const samples: {
    progress: number;
    hinges: Awaited<ReturnType<typeof hingeAngles>>;
    camera: Awaited<ReturnType<typeof sheetTransform>>;
  }[] = [];
  let previous = 0;
  for (const progress of [0.04, 0.08, 0.13, 0.2, 0.28, 0.5, 0.8]) {
    await page.mouse.wheel(0, Math.round(travel * (progress - previous)));
    await expect
      .poll(() => page.evaluate(() => scrollY))
      .toBeGreaterThan(travel * progress - 20);
    await page.waitForTimeout(400);
    if (progress <= 0.2) await expectFoldFitsStage(page);
    samples.push({
      progress,
      hinges: await hingeAngles(page),
      camera: await sheetTransform(page),
    });
    if (progress === 0.08 || progress === 0.2 || progress === 0.5)
      await testInfo.attach(`scroll-${progress}`, {
        body: await page.screenshot(),
        contentType: 'image/png',
      });
    previous = progress;
  }
  for (const wing of ['left', 'right']) {
    const initial = folded.find((hinge) => hinge.panel === wing)!;
    expect(
      Math.max(
        ...samples.map((sample) =>
          angularDistance(
            sample.hinges.find((hinge) => hinge.panel === wing)!.degrees,
            initial.degrees,
          ),
        ),
      ),
      `${wing} must physically unfold when the user scrolls`,
    ).toBeGreaterThan(30);
  }
  expect(
    Math.max(
      ...samples.map((sample) => Math.abs(sample.camera.scale - opening.scale)),
    ),
  ).toBeGreaterThan(0.1);
  expect(
    Math.max(
      ...samples.map((sample) =>
        Math.hypot(sample.camera.x - opening.x, sample.camera.y - opening.y),
      ),
    ),
  ).toBeGreaterThan(100);
  await testInfo.attach('hinge-and-camera-samples', {
    body: Buffer.from(JSON.stringify({ folded, samples }, null, 2)),
    contentType: 'application/json',
  });
  await page.mouse.wheel(0, -travel * 2);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  for (const wing of ['left', 'right'])
    await expect
      .poll(async () =>
        angularDistance(
          (await hingeAngles(page)).find((hinge) => hinge.panel === wing)!
            .degrees,
          folded.find((hinge) => hinge.panel === wing)!.degrees,
        ),
      )
      .toBeLessThan(1);
  await expect
    .poll(async () =>
      Math.abs((await sheetTransform(page)).scale - opening.scale),
    )
    .toBeLessThan(0.02);
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
  const chapter = page.getByRole('button', { name: 'Cash flow', exact: true });
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
    let readingHolds = 0;
    for (let index = 0; index < (await chapters.count()); index += 1) {
      const chapter = chapters.nth(index);
      const label = await chapter.getAttribute('aria-label');
      const target = page.locator(
        `[data-camera-stop=${JSON.stringify(label)}], [data-camera-mobile=${JSON.stringify(label)}]`,
      );
      if (!(await target.count())) continue;
      readingHolds += 1;
      await chapter.click();
      await expect(chapter).toHaveAttribute('aria-current', 'step');
      await expect
        .poll(
          () =>
            target.evaluate((element) => {
              const panel = element.closest('.fold-panel');
              if (!panel) return 180;
              const matrix = new DOMMatrixReadOnly(
                getComputedStyle(panel).transform,
              );
              return Math.abs(
                (Math.atan2(-matrix.m13, matrix.m11) * 180) / Math.PI,
              );
            }),
          { message: `${label} panel must be flat while reading` },
        )
        .toBeLessThan(0.5);
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
    expect(readingHolds).toBeGreaterThanOrEqual(5);
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
  await page.getByRole('button', { name: 'Cash flow', exact: true }).click();
  await expect(page.locator('#cash-flow')).toBeInViewport({ ratio: 0.98 });
  await page.locator('.site-header a[href$="/agreement/"]').click();
  await expect(page.locator('h1')).toHaveText('Proposal notes');
  await page.goBack();
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'tour',
  );
  await page
    .getByRole('button', { name: 'The two paths', exact: true })
    .click();
  await expect(page.locator('#paths')).toBeInViewport({ ratio: 0.98 });
  await expect(page.locator('.proposal-sheet')).not.toHaveCSS(
    'transform',
    'none',
  );
});
