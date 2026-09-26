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

async function cameraTarget(page: Page, label: string | null) {
  const mobilePart = page.locator(
    `[data-camera-mobile=${JSON.stringify(label)}]`,
  );
  return (page.viewportSize()?.width ?? 1440) < 760 &&
    (await mobilePart.count())
    ? mobilePart
    : page.locator(`[data-camera-stop=${JSON.stringify(label)}]`);
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
        freeEdgeDepth: new DOMPoint(
          (panel as HTMLElement).dataset.panel === 'left'
            ? -(panel as HTMLElement).offsetWidth
            : (panel as HTMLElement).offsetWidth,
          0,
          0,
          0,
        ).matrixTransform(matrix).z,
        width: (panel as HTMLElement).offsetWidth,
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

interface MotionFrame {
  time: number;
  scroll: number;
  progress: number;
  camera: string;
  left: string;
  right: string;
}

interface CompositingLayer {
  layerId: string;
  backendNodeId?: number;
  width: number;
  height: number;
  drawsContent: boolean;
}

interface CompositingNode {
  backendNodeId: number;
  attributes?: string[];
  children?: CompositingNode[];
  pseudoElements?: CompositingNode[];
}

function collectMotion(page: Page, duration: number): Promise<MotionFrame[]> {
  return page.evaluate(
    (duration) =>
      new Promise((resolve) => {
        const sheet = document.querySelector<HTMLElement>('.proposal-sheet')!;
        const left = sheet.querySelector<HTMLElement>('[data-panel="left"]')!;
        const right = sheet.querySelector<HTMLElement>('[data-panel="right"]')!;
        const progress = document.querySelector<HTMLElement>('.scroll-line')!;
        const start = performance.now();
        const frames: MotionFrame[] = [];
        function sample(time: number) {
          frames.push({
            time,
            scroll: scrollY,
            progress: Number(
              progress.style.getPropertyValue('--tour-progress') ||
                document.documentElement.style.getPropertyValue(
                  '--tour-progress',
                ),
            ),
            camera: sheet.style.transform,
            left: left.style.transform,
            right: right.style.transform,
          });
          if (time - start < duration) requestAnimationFrame(sample);
          else resolve(frames);
        }
        sample(start);
      }),
    duration,
  );
}

function longestStationaryScroll(frames: MotionFrame[]) {
  let start = frames[0];
  let longest = 0;
  for (let i = 1; i < frames.length; i += 1) {
    const frame = frames[i];
    const previous = frames[i - 1];
    if (
      frame.camera !== previous.camera ||
      frame.left !== previous.left ||
      frame.right !== previous.right
    )
      start = frame;
    else if (Math.abs(frame.scroll - start.scroll) > 10)
      longest = Math.max(longest, frame.time - start.time);
  }
  return longest;
}

test('slow camera loading keeps the unpositioned flyer hidden until it is ready', async ({
  page,
}, testInfo) => {
  let delayed = false;
  await page.route('**/_astro/*.js', async (route) => {
    delayed = true;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await route.continue();
  });
  await page.goto('./', { waitUntil: 'commit' });
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'tour',
  );
  await expect(page.locator('.proposal-sheet')).toBeAttached();
  await expect(page.locator('html')).not.toHaveClass(/camera-ready/);
  await expect(page.locator('.proposal-sheet')).toBeHidden();
  await expect(page.locator('.tour-controls')).toBeHidden();
  await testInfo.attach('camera-pending', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  await expect(page.locator('.proposal-sheet')).toBeVisible();
  await expect(page.locator('.tour-controls')).toBeVisible();
  await expect(page.locator('.proposal-sheet')).not.toHaveCSS(
    'transform',
    'none',
  );
  expect(delayed).toBeTruthy();
});

test('a failed camera script reveals normal reading within five seconds', async ({
  page,
}) => {
  let aborted = false;
  await page.route('**/_astro/*.js', (route) => {
    aborted = true;
    return route.abort('failed');
  });
  await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'tour',
  );
  await expect(page.locator('.proposal-sheet')).toBeHidden();
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'read',
    {
      timeout: 5000,
    },
  );
  expect(await page.evaluate(() => performance.now())).toBeLessThan(5000);
  await expect(page.locator('.proposal-sheet h1')).toBeVisible();
  await expect(page.locator('.proposal-sheet')).toHaveCSS('transform', 'none');
  await expect(page.locator('.proposal-sheet')).toContainText('20%');
  await expectNoOverflow(page);
  expect(aborted).toBeTruthy();
});

test('the explicit reading URL bypasses the tour even with a saved tour preference', async ({
  page,
}) => {
  await page.addInitScript(() => {
    if (localStorage.getItem('proposal-presentation') === null)
      localStorage.setItem('proposal-presentation', 'tour');
  });
  await page.goto('./?view=read');
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'read',
  );
  await expect(page.locator('html')).not.toHaveClass(/camera-ready/);
  await expect(page.locator('.proposal-sheet')).toHaveCSS('transform', 'none');
  await expect(page.locator('.proposal-sheet h1')).toBeVisible();
  await expect(page.locator('.proposal-sheet')).toContainText('20%');
  await expectNoOverflow(page);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'read',
  );
  await page.locator('.site-header a[href$="/agreement/"]').click();
  await page.getByRole('link', { name: 'Back to the flyer' }).click();
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'read',
  );
  await page.getByRole('button', { name: 'Take the tour' }).click();
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'tour',
  );
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
});

test('high-density mobile paper stays within its compositing budget through zooms and reversals', async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('crash', () => errors.push('page crash'));
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(baseURL);
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  const session = await context.newCDPSession(page);
  const paperIds = new Set<number>();
  const decorationIds = new Set<number>();
  const samples: {
    faces: number;
    decorations: number;
    paperMiB: number;
    largestDeviceEdge: number;
  }[] = [];
  const { root: documentNode }: { root: CompositingNode } = await session.send(
    'DOM.getDocument',
    { depth: -1, pierce: true },
  );
  function identifyPaper(node: CompositingNode) {
    const classIndex = node.attributes?.indexOf('class') ?? -1;
    const classes =
      classIndex >= 0 ? node.attributes![classIndex + 1].split(/\s+/) : [];
    if (classes.includes('panel-face') || classes.includes('panel-back')) {
      paperIds.add(node.backendNodeId);
      for (const pseudo of node.pseudoElements || [])
        decorationIds.add(pseudo.backendNodeId);
    }
    for (const child of node.children || []) identifyPaper(child);
  }
  identifyPaper(documentNode);
  expect(paperIds.size).toBe(6);
  const recordLayers = ({ layers = [] }: { layers?: CompositingLayer[] }) => {
    const drawn = layers.filter((layer) => layer.drawsContent);
    const paper = drawn.filter((layer) =>
      paperIds.has(layer.backendNodeId ?? -1),
    );
    const decorations = drawn.filter((layer) =>
      decorationIds.has(layer.backendNodeId ?? -1),
    );
    if (!paper.length) return;
    samples.push({
      faces: paper.length,
      decorations: decorations.length,
      paperMiB:
        paper.reduce(
          (total, layer) => total + layer.width * layer.height * 3 * 3 * 4,
          0,
        ) /
        1024 /
        1024,
      largestDeviceEdge: Math.max(
        ...paper.map((layer) => Math.max(layer.width, layer.height) * 3),
      ),
    });
  };
  session.on('LayerTree.layerTreeDidChange', recordLayers);
  await session.send('LayerTree.enable');
  await page.screenshot();
  await expect.poll(() => samples.length).toBeGreaterThan(0);
  const chapters = page.locator('.chapter-nav button[data-go-to]');
  for (let index = 1; index < (await chapters.count()); index += 1) {
    const chapter = chapters.nth(index);
    const label = await chapter.getAttribute('aria-label');
    await chapter.click();
    await expect(chapter).toHaveAttribute('aria-current', 'step');
    const target = await cameraTarget(page, label);
    await expect(target).toBeInViewport({ ratio: 0.98 });
    await expect
      .poll(() =>
        target.evaluate((element) => {
          const scale =
            element.getBoundingClientRect().width /
            (element as HTMLElement).offsetWidth;
          return Math.min(
            ...[element, ...element.querySelectorAll('p,h1,h2,h3')]
              .filter((text) => text.matches('p,h1,h2,h3'))
              .map(
                (text) =>
                  Number.parseFloat(getComputedStyle(text).fontSize) * scale,
              ),
          );
        }),
      )
      .toBeGreaterThanOrEqual(12);
  }
  const travel = await page.evaluate(
    () => document.documentElement.scrollHeight - innerHeight,
  );
  for (let cycle = 0; cycle < 3; cycle += 1)
    for (const direction of [-1, 1])
      for (let step = 0; step < 6; step += 1) {
        await page.mouse.wheel(0, (direction * travel * 0.85) / 6);
        await page.waitForTimeout(16);
      }
  await testInfo.attach('high-density-paper-budget', {
    body: Buffer.from(
      JSON.stringify(
        {
          note: 'Project surface-area budget, not measured GPU memory or physical iOS stability proof. Retained drawn layers are counted even if invisible.',
          viewport: { width: 390, height: 844, deviceScaleFactor: 3 },
          samples,
        },
        null,
        2,
      ),
    ),
    contentType: 'application/json',
  });
  expect(samples.length).toBeGreaterThan(20);
  expect(
    Math.max(...samples.map((sample) => sample.faces)),
  ).toBeLessThanOrEqual(4);
  expect(Math.max(...samples.map((sample) => sample.decorations))).toBe(0);
  expect(
    Math.max(...samples.map((sample) => sample.paperMiB)),
  ).toBeLessThanOrEqual(64);
  expect(
    Math.max(...samples.map((sample) => sample.largestDeviceEdge)),
  ).toBeLessThanOrEqual(4096);
  expect(errors).toEqual([]);
  session.removeListener('LayerTree.layerTreeDidChange', recordLayers);
  await session.send('LayerTree.disable');
  await session.detach();
  await context.close();
});

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
  for (const progress of [0.04, 0.08, 0.13, 0.2, 0.28, 0.5, 0.8]) {
    const currentY = await page.evaluate(() => scrollY);
    const nativeMovement = collectMotion(page, 450);
    await page.mouse.wheel(0, Math.round(travel * progress - currentY));
    const frames = await nativeMovement;
    expect(
      Math.max(...frames.map((frame) => frame.scroll)),
      'Native scrolling must reach the requested area before any idle settling',
    ).toBeGreaterThanOrEqual(travel * progress - 20);
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
    samples.some(({ hinges }) => {
      const left = hinges.find((hinge) => hinge.panel === 'left')!;
      const right = hinges.find((hinge) => hinge.panel === 'right')!;
      return (
        left.freeEdgeDepth * right.freeEdgeDepth < 0 &&
        Math.abs(left.freeEdgeDepth) / left.width > 0.25 &&
        Math.abs(right.freeEdgeDepth) / right.width > 0.25
      );
    }),
    'The free edges must unfold onto opposite sides of the center panel',
  ).toBeTruthy();
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

test('continuous wheel input keeps the camera moving through reading windows', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  const travel = await page.evaluate(
    () => document.documentElement.scrollHeight - innerHeight,
  );
  const recording = collectMotion(page, 7500);
  for (let i = 0; i < 140; i += 1) {
    await page.mouse.wheel(0, Math.round((travel * 0.9) / 140));
    await page.waitForTimeout(16);
  }
  const inputEnded = await page.evaluate(() => performance.now());
  const frames = (await recording).filter((frame) => frame.time <= inputEnded);
  await testInfo.attach('continuous-scroll-frames', {
    body: Buffer.from(JSON.stringify(frames)),
    contentType: 'application/json',
  });
  expect(frames.at(-1)!.progress).toBeGreaterThan(0.75);
  expect(
    longestStationaryScroll(frames),
    'Scrolling through a reading window must not leave the flyer motionless',
  ).toBeLessThan(150);
});

test('an immediate fast flick is smoothed and reversing input takes control', async ({
  page,
}, testInfo) => {
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  const travel = await page.evaluate(
    () => document.documentElement.scrollHeight - innerHeight,
  );
  const recording = collectMotion(page, 700);
  await page.mouse.wheel(0, Math.round(travel * 0.8));
  await page.waitForTimeout(90);
  const reversedAt = await page.evaluate(() => performance.now());
  await page.mouse.wheel(0, -Math.round(travel * 0.7));
  const frames = await recording;
  await testInfo.attach('fast-flick-and-reverse-frames', {
    body: Buffer.from(JSON.stringify({ reversedAt, frames })),
    contentType: 'application/json',
  });
  const speeds = frames.slice(1).map((frame, index) => {
    const previous = frames[index];
    return (
      Math.abs(frame.progress - previous.progress) /
      ((frame.time - previous.time) / 1000)
    );
  });
  expect(Math.max(...speeds)).toBeLessThan(12);
  const reverseFrames = frames.filter(
    (frame) => frame.time > reversedAt + 50 && frame.time < reversedAt + 300,
  );
  expect(reverseFrames.length).toBeGreaterThan(4);
  for (let i = 1; i < reverseFrames.length; i += 1)
    expect(reverseFrames[i].progress).toBeLessThanOrEqual(
      reverseFrames[i - 1].progress + 0.0005,
    );
  expect(reverseFrames.at(-1)!.progress).toBeLessThan(
    reverseFrames[0].progress - 0.02,
  );
});

test('pausing between chapters settles into readable content and fresh input cancels the move', async ({
  page,
}) => {
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  const cash = page.getByRole('button', { name: 'Cash flow', exact: true });
  const paths = page.getByRole('button', {
    name: 'The two paths',
    exact: true,
  });
  await cash.click();
  await page.waitForTimeout(1400);
  const cashY = await page.evaluate(() => scrollY);
  await paths.click();
  await page.waitForTimeout(1400);
  const pathsY = await page.evaluate(() => scrollY);
  const delta = Math.round((pathsY - cashY) * 0.56);
  await page.mouse.wheel(0, -delta);
  await page.waitForTimeout(100);
  const midpoint = await page.evaluate(() => scrollY);
  await expect
    .poll(() => page.evaluate(() => scrollY), { timeout: 3000 })
    .toBeLessThan(midpoint - 30);
  await page.mouse.wheel(0, 130);
  await page.waitForTimeout(60);
  const resumed = await page.evaluate(() => scrollY);
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => scrollY)).toBe(resumed);
  await expect(page.locator('#cash-flow')).toBeInViewport({ ratio: 0.98 });
  await expect(cash).toHaveAttribute('aria-current', 'step');
});

test('phone browser-height changes preserve the camera and navigation nodes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  const chapter = page.getByRole('button', {
    name: 'As money arrives',
    exact: true,
  });
  await chapter.click();
  await page.waitForTimeout(1400);
  const chapterNode = await chapter.elementHandle();
  const before = await page.evaluate(() => ({
    y: scrollY,
    camera:
      document.querySelector<HTMLElement>('.proposal-sheet')!.style.transform,
    height: document
      .querySelector<HTMLElement>('.flyer-stage')!
      .style.getPropertyValue('--stage-height'),
  }));
  for (const height of [800, 760, 810, 844, 770, 844]) {
    await page.setViewportSize({ width: 390, height });
    await page.waitForTimeout(230);
    expect(
      await chapterNode!.evaluate((node) => node.isConnected),
    ).toBeTruthy();
    expect(await page.evaluate(() => scrollY)).toBe(before.y);
    expect(
      await page
        .locator('.proposal-sheet')
        .evaluate((sheet) => (sheet as HTMLElement).style.transform),
    ).toBe(before.camera);
    expect(
      await page
        .locator('.flyer-stage')
        .evaluate((stage) =>
          (stage as HTMLElement).style.getPropertyValue('--stage-height'),
        ),
    ).toBe(before.height);
    await expect(chapter).toHaveAttribute('aria-current', 'step');
  }
  await expect(
    page.locator('[data-camera-mobile="As money arrives"]'),
  ).toBeInViewport({ ratio: 0.98 });
});

test('a phone chapter remains its parent chapter after changing to a wide viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  await page.getByRole('button', { name: 'Client first', exact: true }).click();
  await page.waitForTimeout(1400);
  await page.setViewportSize({ width: 1000, height: 720 });
  await expect(
    page.getByRole('button', { name: 'The two paths', exact: true }),
  ).toHaveAttribute('aria-current', 'step');
  await expect(page.locator('#paths')).toBeInViewport({ ratio: 0.98 });
  const reframed = await sheetTransform(page);
  await page.mouse.wheel(0, 120);
  await expect.poll(() => sheetTransform(page)).not.toEqual(reframed);
});

test('a cancelled touch still allows a paused transition to settle', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto(baseURL);
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  await page
    .getByRole('button', { name: 'As money arrives', exact: true })
    .click();
  await page.waitForTimeout(1400);
  const startingY = await page.evaluate(() => scrollY);
  const session = await context.newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: 195, y: 650 }],
  });
  for (const y of [600, 550, 500, 450]) {
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: 195, y }],
    });
    await page.waitForTimeout(30);
  }
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(startingY + 80);
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchCancel',
    touchPoints: [],
  });
  await expect
    .poll(
      async () => Math.abs((await page.evaluate(() => scrollY)) - startingY),
      { timeout: 4000 },
    )
    .toBeLessThan(3);
  await expect(
    page.locator('[data-camera-mobile="As money arrives"]'),
  ).toBeInViewport({ ratio: 0.98 });
  await context.close();
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
      const target = await cameraTarget(page, label);
      if (!(await target.count())) continue;
      readingHolds += 1;
      await chapter.click();
      await expect(chapter).toHaveAttribute('aria-current', 'step');
      await expect
        .poll(
          () =>
            target.evaluate((element) => {
              const panel = element.closest('.fold-panel');
              const sheet = element.closest('.proposal-sheet');
              if (!panel || !sheet) return -1;
              const camera = new DOMMatrixReadOnly(
                getComputedStyle(sheet).transform,
              );
              const hinge = new DOMMatrixReadOnly(
                getComputedStyle(panel).transform,
              );
              const normal = new DOMPoint(0, 0, 1, 0).matrixTransform(
                camera.multiply(hinge),
              );
              return normal.z / Math.hypot(normal.x, normal.y, normal.z);
            }),
          { message: `${label} front face must point toward the reader` },
        )
        .toBeGreaterThan(0.995);
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
                ...[element, ...element.querySelectorAll('p, h1, h2, h3')]
                  .filter((text) => text.matches('p, h1, h2, h3'))
                  .map(
                    (text) =>
                      Number.parseFloat(getComputedStyle(text).fontSize) *
                      scale,
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
