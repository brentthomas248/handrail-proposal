import { test, expect, type Locator, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  agreementSections,
  collectionComparison,
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

async function readingFrame(target: Locator) {
  return target.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const stage = document
      .querySelector('.flyer-stage')!
      .getBoundingClientRect();
    const header = document
      .querySelector('.site-header')!
      .getBoundingClientRect();
    const controls = document
      .querySelector('.tour-controls')!
      .getBoundingClientRect();
    const viewport = window.visualViewport;
    const safe = {
      left: Math.max(stage.left, viewport?.offsetLeft ?? 0) + 24,
      right:
        Math.min(
          stage.right,
          (viewport?.offsetLeft ?? 0) + (viewport?.width ?? innerWidth),
        ) - 24,
      top: Math.max(stage.top, header.bottom, viewport?.offsetTop ?? 0) + 24,
      bottom:
        Math.min(
          stage.bottom,
          controls.top,
          (viewport?.offsetTop ?? 0) + (viewport?.height ?? innerHeight),
        ) - 24,
    };
    const scale = box.width / (element as HTMLElement).offsetWidth;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const text: { content: string; fontPx: number; cut: boolean }[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (!node.textContent?.trim() || !node.parentElement) continue;
      const style = getComputedStyle(node.parentElement);
      if (style.display === 'none' || style.visibility === 'hidden') continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const lines = [...range.getClientRects()];
      if (!lines.length) continue;
      text.push({
        content: node.textContent.trim(),
        fontPx: Number.parseFloat(style.fontSize) * scale,
        cut: lines.some(
          (line) =>
            line.left < safe.left ||
            line.right > safe.right ||
            line.top < safe.top ||
            line.bottom > safe.bottom,
        ),
      });
    }
    return {
      safe,
      widthFraction: box.width / innerWidth,
      minimumTextPx: Math.min(...text.map((part) => part.fontPx)),
      textCount: text.length,
      clippedText: text.filter((part) => part.cut).map((part) => part.content),
      boxFits:
        box.left >= safe.left &&
        box.right <= safe.right &&
        box.top >= safe.top &&
        box.bottom <= safe.bottom,
    };
  });
}

async function expectReadingFrame(
  target: Locator,
  label: string | null,
  mobile = false,
) {
  await expect
    .poll(async () => (await readingFrame(target)).clippedText, {
      message: `${label}: every text line must clear the actual header and controls by 24px`,
    })
    .toEqual([]);
  await expect
    .poll(async () => (await readingFrame(target)).boxFits, {
      message: `${label}: the complete reading group needs space on all four sides`,
    })
    .toBeTruthy();
  const frame = await readingFrame(target);
  expect(frame.textCount, `${label} must contain real text`).toBeGreaterThan(0);
  await expect
    .poll(async () => (await readingFrame(target)).minimumTextPx, {
      message: `${label}: all text, including links and labels, must remain readable`,
    })
    .toBeGreaterThanOrEqual(12);
  if (mobile)
    expect(
      frame.widthFraction,
      `${label}: preserve peripheral context rather than a screen-filling crop`,
    ).toBeLessThanOrEqual(0.78);
}

async function expectMobileReadingGroup(target: Locator, label: string | null) {
  const required: Record<string, [string, number][]> = {
    'The beginning': [
      ['h1', 1],
      ['.cover-statement', 1],
      ['.cover-description', 1],
    ],
    'Cash flow': [
      ['h2', 1],
      ['.collection-comparison', 1],
    ],
    'Hire first': [
      ['h2.rate-context', 1],
      ['.deal-path', 1],
      ['.rate-scope', 1],
    ],
    'Client first': [
      ['h2.rate-context', 1],
      ['.deal-path', 1],
      ['.rate-reason', 1],
    ],
    'The window': [
      ['.window-title', 1],
      ['.window-steps li', 3],
    ],
    'Grow together': [
      ['.partnership-lead', 1],
      ['.partnership-details p', 2],
      ['.proposal-note', 1],
      ['.proposal-link', 1],
    ],
  };
  expect(
    required[label ?? ''],
    `${label} must be a complete editorial scene`,
  ).toBeDefined();
  for (const [selector, count] of required[label ?? ''])
    await expect(
      target.locator(selector),
      `${label} must include its related ${selector}`,
    ).toHaveCount(count);
  if (label === 'Hire first' || label === 'Client first') {
    await expect(target.locator('h2.rate-context')).toHaveText(
      'Two ways to begin',
    );
    await expect(target).toContainText(/both paths/i);
    await expect(target).toContainText(/no base salary/i);
    await expect(target).toContainText(
      /benefits.*requested|requested.*benefits/i,
    );
  }
}

async function expectPrintedCashComparison(page: Page) {
  const comparison = page.locator('.collection-comparison');
  await expect(comparison).toHaveCount(1);
  await expect(comparison.locator('.collection-assumption')).toContainText(
    '$120,000',
  );
  await expect(comparison.locator('.collection-assumption')).toContainText(
    /12 equal monthly installments/i,
  );
  await expect(comparison.locator('.collection-collected')).toContainText(
    '$10,000',
  );
  await expect(comparison.locator('.collection-collected')).toContainText(
    /collected per installment/i,
  );
  const table = comparison.getByRole('table', {
    name: 'Build commission per collected installment',
  });
  await expect(table.getByRole('columnheader')).toHaveText([
    'Hire first · 15%',
    'Client first · 20%',
  ]);
  await expect(
    table.getByRole('row', { name: /Build commission \$1,500 \$2,000/ }),
  ).toHaveCount(1);
  await expect(
    table.getByRole('row', {
      name: /Handrail remaining before costs \$8,500 \$8,000/,
    }),
  ).toHaveCount(1);
  await expect(comparison.locator('.collection-difference')).toContainText(
    '$500',
  );
  await expect(comparison.locator('.collection-difference')).toContainText(
    /more commission per (?:\$10,000 collected|collected installment) under client first/i,
  );
  await expect(comparison.locator('.collection-rule')).toHaveText(
    collectionComparison.rule,
  );
  await expect(comparison.locator('.collection-rule')).toContainText(
    /customer payment.*before.*commission.*paid/i,
  );
  await expect(comparison.locator('.collection-qualifier')).toHaveText(
    collectionComparison.qualifier,
  );
  await expect(comparison.locator('.collection-qualifier')).toContainText(
    /before delivery, benefits and other (?:costs|expenses).*illustration only.*not a forecast or Handrail pricing/i,
  );
  for (const part of await comparison
    .locator('figcaption, p, th, td:not([aria-hidden])')
    .all())
    await expect(part).toBeVisible();
  const description = await table.getAttribute('aria-describedby');
  expect(description).toBeTruthy();
  for (const id of description!.split(/\s+/))
    await expect(
      comparison.locator(`[id=${JSON.stringify(id)}]`),
    ).toBeVisible();
  await expect(
    page.locator(
      '[data-payment-event], [data-payment-part], [data-payment-trace]',
    ),
  ).toHaveCount(0);
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

async function expectSubstantialUnfoldingPaper(page: Page) {
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const top = document
            .querySelector('.site-header')!
            .getBoundingClientRect().bottom;
          const bottom = document
            .querySelector('.tour-controls')!
            .getBoundingClientRect().top;
          return [
            ...document.querySelectorAll('.panel-face, .panel-back'),
          ].some((face) => {
            const style = getComputedStyle(face);
            if (style.display === 'none' || style.visibility === 'hidden')
              return false;
            const box = face.getBoundingClientRect();
            const visibleHeight = Math.max(
              0,
              Math.min(box.bottom, bottom) - Math.max(box.top, top),
            );
            const visibleWidth = Math.max(
              0,
              Math.min(box.right, innerWidth) - Math.max(box.left, 0),
            );
            return (
              visibleHeight >= (bottom - top) * 0.55 &&
              visibleWidth >= innerWidth * 0.25
            );
          });
        }),
      {
        message:
          'The unfolding paper must remain substantial rather than becoming a distant thumbnail',
      },
    )
    .toBe(true);
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
      .poll(async () => (await readingFrame(target)).minimumTextPx)
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

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
])
  test(`real scrolling unfolds both hinges, moves the camera and reverses to the folded packet at ${viewport.width}px`, async ({
    page,
  }, testInfo) => {
    const errors: string[] = [];
    const failedRequests: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('response', (response) => {
      if (response.status() >= 400)
        failedRequests.push(`${response.status()} ${response.url()}`);
    });
    await page.setViewportSize(viewport);
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
    const chapters = page.locator('.chapter-nav button[data-go-to]');
    await chapters.nth(1).click();
    await page.waitForTimeout(1400);
    const firstReadingProgress = (await page.evaluate(() => scrollY)) / travel;
    await chapters.nth(0).click();
    await page.waitForTimeout(1400);
    const openingSamples = [
      firstReadingProgress * 0.14,
      firstReadingProgress * 0.28,
    ];
    const samples: {
      progress: number;
      hinges: Awaited<ReturnType<typeof hingeAngles>>;
      camera: Awaited<ReturnType<typeof sheetTransform>>;
    }[] = [];
    for (const progress of [...openingSamples, 0.13, 0.2, 0.28, 0.5, 0.8]) {
      const currentY = await page.evaluate(() => scrollY);
      const nativeMovement = collectMotion(page, 450);
      await page.mouse.wheel(0, Math.round(travel * progress - currentY));
      const frames = await nativeMovement;
      expect(
        Math.max(...frames.map((frame) => frame.scroll)),
        'Native scrolling must reach the requested area before any idle settling',
      ).toBeGreaterThanOrEqual(travel * progress - 20);
      if (openingSamples.includes(progress))
        await expectSubstantialUnfoldingPaper(page);
      samples.push({
        progress,
        hinges: await hingeAngles(page),
        camera: await sheetTransform(page),
      });
      if (
        progress === openingSamples[1] ||
        progress === 0.2 ||
        progress === 0.5
      )
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
        ...samples.map((sample) =>
          Math.abs(sample.camera.scale - opening.scale),
        ),
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

test('fresh input immediately cancels an automatic settling move', async ({
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
  await page.mouse.wheel(0, -Math.round((pathsY - cashY) * 0.4));
  await page.waitForTimeout(100);
  const released = await page.evaluate(() => scrollY);
  await expect
    .poll(() => page.evaluate(() => scrollY), { timeout: 3000 })
    .toBeLessThan(released - 15);
  await page.mouse.wheel(0, 130);
  await page.waitForTimeout(60);
  const resumed = await page.evaluate(() => scrollY);
  await page.waitForTimeout(250);
  expect(
    Math.abs((await page.evaluate(() => scrollY)) - resumed),
  ).toBeLessThanOrEqual(3);
  await page.mouse.wheel(0, -130);
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeLessThan(resumed - 80);
});

test('phone browser-height changes retain the chapter and scroll while keeping its complete text clear of controls', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  const chapter = page.getByRole('button', {
    name: 'Cash flow',
    exact: true,
  });
  const target = await cameraTarget(page, 'Cash flow');
  await chapter.click();
  await page.waitForTimeout(1400);
  const chapterNode = await chapter.elementHandle();
  const originalScroll = await page.evaluate(() => scrollY);
  for (const height of [800, 760, 664, 810, 844, 770, 844]) {
    await page.setViewportSize({ width: 390, height });
    await expectReadingFrame(target, 'Cash flow');
    expect(
      await chapterNode!.evaluate((node) => node.isConnected),
    ).toBeTruthy();
    expect(
      Math.abs((await page.evaluate(() => scrollY)) - originalScroll),
    ).toBeLessThanOrEqual(2);
    await expect(chapter).toHaveAttribute('aria-current', 'step');
  }
  await expect(target).toBeInViewport({ ratio: 0.98 });
  await page.keyboard.press('End');
  const lastChapter = page.locator('.chapter-nav button[data-go-to]').last();
  await expect(lastChapter).toHaveAttribute('aria-current', 'step');
  await expectReadingFrame(
    await cameraTarget(page, await lastChapter.getAttribute('aria-label')),
    'Last chapter after viewport expansion',
    true,
  );
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

test('a cancelled touch preserves travel direction and releases viewport refitting', async ({
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
  await page.getByRole('button', { name: 'Cash flow', exact: true }).click();
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
  const released = await page.evaluate(() => scrollY);
  const frames = await collectMotion(page, 1800);
  expect(
    Math.min(...frames.map((frame) => frame.scroll)),
  ).toBeGreaterThanOrEqual(released - 3);
  await page.setViewportSize({ width: 390, height: 664 });
  await page.getByRole('button', { name: 'Cash flow', exact: true }).click();
  await expectReadingFrame(
    await cameraTarget(page, 'Cash flow'),
    'Cash flow after cancelled touch',
    true,
  );
  await page.mouse.wheel(0, 180);
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(startingY + 80);
  await context.close();
});

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
  { width: 320, height: 740 },
  { width: 430, height: 932 },
  { width: 390, height: 664 },
])
  test(`every camera chapter frames its complete reading group at ${viewport.width}x${viewport.height}`, async ({
    browser,
  }) => {
    const mobile = viewport.width < 760;
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: mobile ? 3 : 1,
      isMobile: mobile,
      hasTouch: mobile,
    });
    const page = await context.newPage();
    await page.goto(baseURL);
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    const chapters = page.locator('.chapter-nav button[data-go-to]');
    for (let index = 1; index < (await chapters.count()); index += 1) {
      const chapter = chapters.nth(index);
      const label = await chapter.getAttribute('aria-label');
      const target = await cameraTarget(page, label);
      await expect(target, `${label} needs a reading group`).toHaveCount(1);
      if (mobile) await expectMobileReadingGroup(target, label);
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
      await expectReadingFrame(target, label, mobile);
      if (mobile) {
        await expect.poll(() => target.getAttribute('aria-hidden')).toBeNull();
        expect(
          await target.evaluate((element) => (element as HTMLElement).inert),
        ).toBe(false);
        expect(
          await target.evaluate((element) =>
            element.closest('[aria-hidden="true"], [inert]'),
          ),
        ).toBeNull();
      }
    }
    const labels = await chapters.evaluateAll((buttons) =>
      buttons.map((button) => button.getAttribute('aria-label')),
    );
    expect(labels).toEqual(
      mobile
        ? [
            'Overview',
            'The beginning',
            'Cash flow',
            'Hire first',
            'Client first',
            'The window',
            'Grow together',
          ]
        : [
            'Overview',
            'The beginning',
            'Cash flow',
            'The two paths',
            'The window',
            'Grow together',
          ],
    );
    if (mobile) {
      await enterReadingMode(page);
      for (let index = 1; index < (await chapters.count()); index += 1) {
        const target = await cameraTarget(
          page,
          await chapters.nth(index).getAttribute('aria-label'),
        );
        expect(await target.getAttribute('aria-hidden')).toBeNull();
        expect(
          await target.evaluate((element) => (element as HTMLElement).inert),
        ).toBe(false);
        expect(
          await target.evaluate((element) =>
            element.closest('[aria-hidden="true"], [inert]'),
          ),
        ).toBeNull();
      }
    }
    await context.close();
  });

for (const mode of [
  'normal reading',
  'reduced motion',
  'no JavaScript',
] as const)
  test(`the complete two-path cash comparison remains readable with ${mode}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      javaScriptEnabled: mode !== 'no JavaScript',
      reducedMotion: mode === 'reduced motion' ? 'reduce' : 'no-preference',
    });
    const page = await context.newPage();
    await page.goto(baseURL);
    if (mode === 'normal reading') {
      await expect(page.locator('html')).toHaveClass(/camera-ready/);
      await enterReadingMode(page);
    }
    await expect(page.locator('html')).toHaveAttribute(
      'data-presentation',
      'read',
    );
    await expectPrintedCashComparison(page);
    await expectNoOverflow(page);
    await context.close();
  });

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
])
  test(`cash values and surrounding ink stay stable through forward and reverse travel at ${viewport.width}px`, async ({
    browser,
  }, testInfo) => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.goto(baseURL);
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    await page.getByRole('button', { name: 'Cash flow', exact: true }).click();
    await page.waitForTimeout(1400);
    const start = await page.evaluate(() => scrollY);
    await page
      .getByRole('button', { name: 'Grow together', exact: true })
      .click();
    await page.waitForTimeout(1400);
    const end = await page.evaluate(() => scrollY);
    const sample = () =>
      page.evaluate(() => ({
        scroll: scrollY,
        amounts: [
          ...document.querySelectorAll(
            '.collection-collected-amount, .collection-value',
          ),
        ].map((element) => element.textContent!.trim()),
        colors: [
          ...document.querySelectorAll(
            '.rate-group h2, .deal-path h3, .rate-reason, .rate-common, .window-title h2, .partnership-details p',
          ),
        ].map((element) => getComputedStyle(element).color),
      }));
    const initial = await sample();
    expect(initial.amounts).toEqual([
      '$10,000',
      '$1,500',
      '$2,000',
      '$8,500',
      '$8,000',
    ]);
    expect(initial.colors.length).toBeGreaterThan(5);
    const frames = [];
    for (const direction of [-1, 1])
      for (let index = 0; index < 60; index += 1) {
        await page.mouse.wheel(0, (direction * (end - start)) / 60);
        await page.waitForTimeout(25);
        frames.push(await sample());
      }
    await testInfo.attach('printed-values-and-ink', {
      body: Buffer.from(JSON.stringify({ viewport, initial, frames }, null, 2)),
      contentType: 'application/json',
    });
    for (const frame of frames) {
      expect(frame.amounts).toEqual(initial.amounts);
      expect(
        frame.colors,
        'Moving between scenes must not flash neighboring print between black and gray',
      ).toEqual(initial.colors);
    }
    await context.close();
  });

test('desktop beginning and cash retain readable print scale and a visible paper edge', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  for (const [label, selector] of [
    ['The beginning', '.cover-description'],
    ['Cash flow', '.collection-rule'],
  ]) {
    await page.getByRole('button', { name: label, exact: true }).click();
    await page.waitForTimeout(1400);
    const target = await cameraTarget(page, label);
    await expectReadingFrame(target, label);
    const composition = await target.evaluate((element, selector) => {
      const rect = element.getBoundingClientRect();
      const scale = rect.width / (element as HTMLElement).offsetWidth;
      const panel = element.closest('.fold-panel')!.getBoundingClientRect();
      const top =
        document.querySelector('.site-header')!.getBoundingClientRect().bottom +
        24;
      const bottom =
        document.querySelector('.tour-controls')!.getBoundingClientRect().top -
        24;
      const verticalEdge =
        ((panel.left >= 24 && panel.left <= innerWidth - 24) ||
          (panel.right >= 24 && panel.right <= innerWidth - 24)) &&
        Math.min(panel.bottom, bottom) - Math.max(panel.top, top) >= 160;
      const horizontalEdge =
        ((panel.top >= top && panel.top <= bottom) ||
          (panel.bottom >= top && panel.bottom <= bottom)) &&
        Math.min(panel.right, innerWidth - 24) - Math.max(panel.left, 24) >=
          160;
      return {
        fonts: [...element.querySelectorAll(selector)].map(
          (text) => parseFloat(getComputedStyle(text).fontSize) * scale,
        ),
        visiblePaperEdge: verticalEdge || horizontalEdge,
      };
    }, selector);
    expect(composition.fonts.length).toBeGreaterThan(0);
    for (const font of composition.fonts) {
      expect(
        font,
        `${label} body should read like print rather than a macro crop`,
      ).toBeGreaterThanOrEqual(20);
      expect(
        font,
        `${label} body should read like print rather than a macro crop`,
      ).toBeLessThanOrEqual(24);
    }
    expect(
      composition.visiblePaperEdge,
      `${label} must retain the paper's physical context`,
    ).toBe(true);
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
  await page.locator('.proposal-sheet a[href$="/agreement/"]').click();
  await expect(page).toHaveURL(/\/agreement\/$/);
  await expect(page.locator('h1')).toContainText(/proposal/i);
  for (const section of agreementSections) {
    await expect(page.locator(`#${section.id}`)).toBeAttached();
    expect(await page.locator(`#${section.id} > p`).allTextContents()).toEqual(
      section.paragraphs,
    );
    if (section.comparison) await expectPrintedCashComparison(page);
    if (section.items)
      await expect(
        page.locator(`#${section.id} .document-discussion-list li`),
      ).toHaveText(section.items);
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
  await page.locator('.proposal-sheet a[href$="/agreement/"]').click();
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

test('mobile related headings and terms stay accessible and normal reading restores the complete document', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  await page.getByRole('button', { name: 'Client first', exact: true }).click();
  const group = await cameraTarget(page, 'Client first');
  await expectReadingFrame(group, 'Client first', true);
  await expect(
    group.getByRole('heading', { name: 'Two ways to begin', exact: true }),
  ).toBeVisible();
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(result.violations).toEqual([]);
  await enterReadingMode(page);
  for (const section of await page.locator('[data-camera-stop]').all()) {
    expect(
      await section.evaluate((element) =>
        element.closest('[aria-hidden="true"], [inert]'),
      ),
    ).toBeNull();
  }
  await page.locator('.proposal-link').scrollIntoViewIfNeeded();
  await expect(page.locator('.proposal-link')).toBeInViewport({ ratio: 1 });
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

test('entering a paper link from the keyboard restores a readable focused link', async ({
  page,
}) => {
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  const lastChapter = page.locator('.chapter-nav button').last();
  for (let index = 0; index < 20; index += 1) {
    await page.keyboard.press('Tab');
    if (
      await lastChapter.evaluate(
        (element) => element === document.activeElement,
      )
    )
      break;
  }
  await expect(lastChapter).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(lastChapter).toHaveAttribute('aria-current', 'step');
  await page.waitForTimeout(1400);
  await page.keyboard.press('Tab');
  const notesLink = page.locator('.proposal-sheet a[href$="/agreement/"]');
  await expect(notesLink).toBeFocused();
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'read',
  );
  await expect(notesLink).toBeInViewport({ ratio: 1 });
});

test('tour and reading round trips preserve the selected path and the same content nodes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  const client = page.getByRole('button', {
    name: 'Client first',
    exact: true,
  });
  await client.click();
  await expectReadingFrame(
    await cameraTarget(page, 'Client first'),
    'Client first',
    true,
  );
  const sections = await page.locator('[data-camera-stop]').elementHandles();
  const text = await page.locator('.proposal-sheet').textContent();
  await enterReadingMode(page);
  await page
    .getByRole('button', { name: 'Take the tour', exact: true })
    .click();
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  await expect(client).toHaveAttribute('aria-current', 'step');
  await expectReadingFrame(
    await cameraTarget(page, 'Client first'),
    'Client first after mode round trip',
    true,
  );
  for (const section of sections)
    expect(await section.evaluate((element) => element.isConnected)).toBe(true);
  expect(await page.locator('.proposal-sheet').textContent()).toBe(text);
  expect(
    await page.locator('[id]').evaluateAll((elements) => {
      const ids = elements.map((element) => element.id);
      return ids.filter((id, index) => ids.indexOf(id) !== index);
    }),
  ).toEqual([]);
});

test('intentional reading scroll owns the return chapter after keyboard focus moved to the notes link', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  await page.getByRole('button', { name: 'Client first', exact: true }).click();
  await expectReadingFrame(
    await cameraTarget(page, 'Client first'),
    'Client first',
    true,
  );
  await enterReadingMode(page);
  const notesLink = page.locator('.proposal-sheet a[href$="/agreement/"]');
  for (let step = 0; step < 8; step += 1) {
    await page.keyboard.press('Tab');
    if (await notesLink.evaluate((link) => link === document.activeElement))
      break;
  }
  await expect(notesLink).toBeFocused();
  await expect(notesLink).toBeInViewport({ ratio: 1 });
  const cash = page.locator('#cash-flow');
  const cashTop = await cash.evaluate(
    (element) => element.getBoundingClientRect().top,
  );
  const readingTop = await page
    .locator('.site-header')
    .evaluate(
      (header) => Math.max(0, header.getBoundingClientRect().bottom) + 24,
    );
  expect(cashTop).toBeLessThan(0);
  await page.mouse.wheel(0, cashTop - readingTop);
  await expect
    .poll(async () => Math.abs((await cash.boundingBox())!.y - readingTop))
    .toBeLessThanOrEqual(3);
  await expect(notesLink).toBeFocused();
  await testInfo.attach('reading-scroll-after-notes-focus', {
    body: Buffer.from(
      JSON.stringify(
        await page.evaluate(() => ({
          scroll: scrollY,
          focused: document.activeElement?.textContent?.trim(),
          cashTop: document.querySelector('#cash-flow')!.getBoundingClientRect()
            .top,
          sections: [...document.querySelectorAll('[data-camera-stop]')].map(
            (element) => ({
              id: element.id,
              top: element.getBoundingClientRect().top,
            }),
          ),
        })),
        null,
        2,
      ),
    ),
    contentType: 'application/json',
  });
  await page
    .getByRole('button', { name: 'Take the tour', exact: true })
    .click();
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  await expect(
    page.getByRole('button', { name: 'Cash flow', exact: true }),
  ).toHaveAttribute('aria-current', 'step');
  await expectReadingFrame(
    cash,
    'Cash flow after intentional reading scroll',
    true,
  );
});

test('a held native touch in normal reading updates the chapter used to resume the tour', async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto(baseURL);
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  await page.getByRole('button', { name: 'Client first', exact: true }).click();
  await page.waitForTimeout(1400);
  await enterReadingMode(page);
  const session = await context.newCDPSession(page);
  for (let gesture = 0; gesture < 2; gesture += 1) {
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: 200, y: 150 }],
    });
    await page.waitForTimeout(450);
    for (let y = 200; y <= 650; y += 50) {
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: 200, y }],
      });
      await page.waitForTimeout(60);
    }
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
    await page.waitForTimeout(800);
  }
  const cash = page.locator('#cash-flow');
  const readingPosition = await cash.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const readingTop =
      Math.max(
        0,
        document.querySelector('.site-header')!.getBoundingClientRect().bottom,
      ) + 24;
    return { scroll: scrollY, top: rect.top, bottom: rect.bottom, readingTop };
  });
  expect(readingPosition.top).toBeLessThanOrEqual(readingPosition.readingTop);
  expect(readingPosition.bottom).toBeGreaterThan(readingPosition.readingTop);
  await testInfo.attach('held-touch-reading-position', {
    body: Buffer.from(JSON.stringify(readingPosition, null, 2)),
    contentType: 'application/json',
  });
  await page
    .getByRole('button', { name: 'Take the tour', exact: true })
    .click();
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  await expect(
    page.getByRole('button', { name: 'Cash flow', exact: true }),
  ).toHaveAttribute('aria-current', 'step');
  await expectReadingFrame(cash, 'Cash flow after held reading gesture', true);
  await session.detach();
  await context.close();
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

for (const viewport of [
  { width: 390, height: 844 },
  { width: 320, height: 740 },
  { width: 390, height: 664 },
])
  test(`round 2: each mobile rate owns and frames its associated heading at ${viewport.width}x${viewport.height}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto('./');
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    const observations = [];
    for (const name of [/^Hire (?:me )?first$/, /^Client first$/]) {
      const chapter = page.getByRole('button', { name });
      const label = await chapter.getAttribute('aria-label');
      const group = await cameraTarget(page, label);
      await chapter.click();
      await page.waitForTimeout(1400);
      observations.push({
        label,
        ownedHeadings: await group.locator('h2').allTextContents(),
        frame: await readingFrame(group),
      });
      await testInfo.attach(`rate-${label}`, {
        body: await page.screenshot(),
        contentType: 'image/png',
      });
      await expect.soft(group.locator('h2')).toHaveText('Two ways to begin');
      const headingInk = await group.locator('h2').evaluate((heading) => {
        const style = getComputedStyle(heading);
        const channels = style.color.match(/[\d.]+/g)!.map(Number);
        const linear = channels.slice(0, 3).map((channel) => {
          const value = channel / 255;
          return value <= 0.04045
            ? value / 12.92
            : ((value + 0.055) / 1.055) ** 2.4;
        });
        return {
          luminance:
            linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722,
          alpha: channels[3] ?? 1,
          opacity: Number(style.opacity),
        };
      });
      expect(
        headingInk.luminance,
        'A related heading must retain strong printed ink',
      ).toBeLessThan(0.25);
      expect(headingInk.alpha).toBe(1);
      expect(headingInk.opacity).toBe(1);
      await expectReadingFrame(group, label, true);
    }
    await testInfo.attach('rate-heading-groups', {
      body: Buffer.from(JSON.stringify(observations, null, 2)),
      contentType: 'application/json',
    });
  });

for (const width of [1440, 390])
  test(`round 2: native Tab and Shift+Tab reach every chapter without changing mode at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto('./');
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    const chapters = page.locator('.chapter-nav button');
    const expected = await chapters.evaluateAll((buttons) =>
      buttons.map((button) => button.getAttribute('aria-label')),
    );
    const visited: (string | null)[] = [];
    const sequence = [];
    for (let index = 0; index < expected.length + 8; index += 1) {
      await page.keyboard.press('Tab');
      const focus = await page.evaluate(() => ({
        name:
          document.activeElement?.getAttribute('aria-label') ||
          document.activeElement?.textContent?.trim(),
        chapter: document.activeElement?.matches('.chapter-nav button')
          ? document.activeElement.getAttribute('aria-label')
          : null,
        mode: document.documentElement.dataset.presentation,
      }));
      sequence.push(focus);
      if (focus.chapter) visited.push(focus.chapter);
      if (visited.length === expected.length || focus.mode !== 'tour') break;
    }
    await testInfo.attach('native-tab-sequence', {
      body: Buffer.from(JSON.stringify(sequence, null, 2)),
      contentType: 'application/json',
    });
    expect(visited).toEqual(expected);
    await expect(page.locator('html')).toHaveAttribute(
      'data-presentation',
      'tour',
    );
    for (let index = expected.length - 2; index >= 0; index -= 1) {
      await page.keyboard.press('Shift+Tab');
      await expect(chapters.nth(index)).toBeFocused();
    }
    await page.keyboard.press('Tab');
    await expect(chapters.nth(1)).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(chapters.nth(1)).toHaveAttribute('aria-current', 'step');
    await page.keyboard.press('Tab');
    await expect(chapters.nth(2)).toBeFocused();
    await page.keyboard.press('Space');
    await expect(chapters.nth(2)).toHaveAttribute('aria-current', 'step');
    await expect(page.locator('html')).toHaveAttribute(
      'data-presentation',
      'tour',
    );
    expect(
      await page
        .locator('[tabindex]')
        .evaluateAll((elements) =>
          elements.some(
            (element) => Number(element.getAttribute('tabindex')) > 0,
          ),
        ),
    ).toBe(false);
  });

for (const direction of [-1, 1])
  for (const fraction of [0.15, 0.4, 0.6])
    test(`round 2: ${direction < 0 ? 'reverse' : 'forward'} ${fraction * 100}% scroll survives a 1.8-second pause`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('./');
      await expect(page.locator('html')).toHaveClass(/camera-ready/);
      const earlier = page.getByRole('button', {
        name: /^Hire (?:me )?first$/,
      });
      const later = page.getByRole('button', {
        name: 'Client first',
        exact: true,
      });
      await earlier.click();
      await page.waitForTimeout(1400);
      const earlierY = await page.evaluate(() => scrollY);
      await later.click();
      await page.waitForTimeout(1400);
      const laterY = await page.evaluate(() => scrollY);
      if (direction > 0) {
        await earlier.click();
        await page.waitForTimeout(1400);
      }
      const startingY = await page.evaluate(() => scrollY);
      await page.mouse.wheel(
        0,
        direction * Math.round((laterY - earlierY) * fraction),
      );
      await page.waitForTimeout(120);
      const releasedY = await page.evaluate(() => scrollY);
      expect(direction * (releasedY - startingY)).toBeGreaterThan(40);
      const frames = await collectMotion(page, 1800);
      await testInfo.attach('partial-scroll-pause', {
        body: Buffer.from(
          JSON.stringify(
            { direction, fraction, startingY, releasedY, frames },
            null,
            2,
          ),
        ),
        contentType: 'application/json',
      });
      expect(
        Math.min(
          ...frames.map((frame) => direction * (frame.scroll - releasedY)),
        ),
        'Idle settling must never undo the most recent deliberate scroll direction',
      ).toBeGreaterThanOrEqual(-3);
      for (let index = 1; index < frames.length; index += 1)
        expect(
          direction * (frames[index].progress - frames[index - 1].progress),
        ).toBeGreaterThanOrEqual(-0.0005);
    });

for (const mode of [
  'normal reading',
  'reduced motion',
  'no JavaScript',
] as const)
  test(`round 2: ${mode} preserves visual, DOM and ARIA narrative order`, async ({
    browser,
  }, testInfo) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      javaScriptEnabled: mode !== 'no JavaScript',
      reducedMotion: mode === 'reduced motion' ? 'reduce' : 'no-preference',
    });
    const page = await context.newPage();
    await page.goto(baseURL);
    if (mode === 'normal reading') await enterReadingMode(page);
    await expect(page.locator('html')).toHaveAttribute(
      'data-presentation',
      'read',
    );
    const expected = ['idea', 'cash-flow', 'paths', 'window', 'together'];
    const sections = page.locator('.proposal-sheet [data-camera-stop]');
    const dom = await sections.evaluateAll((elements) =>
      elements.map((element) => element.id),
    );
    const visual = await sections.evaluateAll((elements) =>
      elements
        .map((element) => ({
          id: element.id,
          top: element.getBoundingClientRect().top,
        }))
        .sort((first, second) => first.top - second.top)
        .map(({ id }) => id),
    );
    const aria = await page.locator('.proposal-sheet').ariaSnapshot();
    const headings = await Promise.all(
      expected.map(async (id) => ({
        id,
        text: (await page.locator(`#${id} h1, #${id} h2`).first().innerText())
          .replace(/\s+/g, ' ')
          .trim(),
      })),
    );
    const ariaPositions = headings.map(({ id, text }) => ({
      id,
      position: aria.indexOf(text),
    }));
    await testInfo.attach('reading-order', {
      body: Buffer.from(
        JSON.stringify({ dom, visual, headings, ariaPositions, aria }, null, 2),
      ),
      contentType: 'application/json',
    });
    expect.soft(dom).toEqual(expected);
    expect.soft(visual).toEqual(expected);
    for (const heading of ariaPositions)
      expect
        .soft(heading.position, `${heading.id} heading must be exposed`)
        .toBeGreaterThanOrEqual(0);
    expect
      .soft(
        [...ariaPositions]
          .sort((first, second) => first.position - second.position)
          .map(({ id }) => id),
      )
      .toEqual(expected);
    expect(aria.indexOf('Read the proposal notes')).toBeGreaterThan(
      ariaPositions.at(-1)!.position,
    );
    await expectNoOverflow(page);
    await context.close();
  });
