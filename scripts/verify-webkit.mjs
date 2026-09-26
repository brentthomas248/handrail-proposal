import { webkit, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const output = process.env.WEBKIT_OUTPUT || 'qa-artifacts/trifold-webkit';
const base =
  process.env.PROPOSAL_BASE_URL || 'http://127.0.0.1:4321/handrail-proposal/';
await mkdir(output, { recursive: true });
const browser = await webkit.launch();
const errors = [],
  warnings = [],
  failedRequests = [],
  views = [];
const angles = (page) =>
  page.locator('.fold-panel').evaluateAll((panels) =>
    panels.map((panel) => {
      const m = new DOMMatrixReadOnly(getComputedStyle(panel).transform);
      return {
        panel: panel.dataset.panel,
        degrees: (Math.atan2(-m.m13, m.m11) * 180) / Math.PI,
        freeEdgeDepth: new DOMPoint(
          panel.dataset.panel === 'left'
            ? -panel.offsetWidth
            : panel.offsetWidth,
          0,
          0,
          0,
        ).matrixTransform(m).z,
        width: panel.offsetWidth,
      };
    }),
  );
const distance = (a, b) =>
  Math.min(Math.abs(a - b) % 360, 360 - (Math.abs(a - b) % 360));
try {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
    { width: 320, height: 740 },
  ]) {
    const name = String(viewport.width);
    const page = await browser.newPage({
      viewport,
      deviceScaleFactor: viewport.width < 700 ? 3 : 1,
      isMobile: viewport.width < 700,
      hasTouch: viewport.width < 700,
    });
    page.on('pageerror', (e) => errors.push(`${name}: ${e.message}`));
    page.on('console', (e) => {
      if (e.type() === 'error') errors.push(`${name}: ${e.text()}`);
      if (e.type() === 'warning') warnings.push(`${name}: ${e.text()}`);
    });
    page.on('response', (r) => {
      if (r.status() >= 400) failedRequests.push(`${r.status()} ${r.url()}`);
    });
    await page.goto(base, { waitUntil: 'networkidle' });
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    const initial = await angles(page),
      samples = [];
    const travel = await page.evaluate(
      () => document.documentElement.scrollHeight - innerHeight,
    );
    const navigation = page.locator('.chapter-nav button[data-go-to]');
    await navigation.nth(1).click();
    await page.waitForTimeout(1400);
    const firstReadingProgress = (await page.evaluate(() => scrollY)) / travel;
    await navigation.nth(0).click();
    await page.waitForTimeout(1400);
    for (const fraction of [0, 0.18, 0.34, 0.5, 0.6]) {
      const progress = firstReadingProgress * fraction;
      if (progress) {
        const currentY = await page.evaluate(() => scrollY);
        const delta = Math.round(travel * progress - currentY);
        if (viewport.width < 700)
          await page.evaluate((delta) => window.scrollBy(0, delta), delta);
        else await page.mouse.wheel(0, delta);
      }
      await page.waitForTimeout(500);
      const bounds = await page.evaluate(() => ({
        header: document.querySelector('.site-header').getBoundingClientRect()
          .bottom,
        controls: document
          .querySelector('.tour-controls')
          .getBoundingClientRect().top,
        panels: [...document.querySelectorAll('.fold-panel')].map((p) => ({
          panel: p.dataset.panel,
          ...p.getBoundingClientRect().toJSON(),
        })),
      }));
      for (const panel of bounds.panels) {
        expect(panel.top).toBeGreaterThanOrEqual(bounds.header + 2);
        expect(panel.bottom).toBeLessThanOrEqual(bounds.controls - 2);
        expect(panel.left).toBeGreaterThanOrEqual(4);
        expect(panel.right).toBeLessThanOrEqual(viewport.width - 4);
      }
      samples.push({ progress, hinges: await angles(page), bounds });
      await page.screenshot({ path: `${output}/${name}-fold-${progress}.png` });
    }
    expect(
      samples.some(({ hinges }) => {
        const left = hinges.find((hinge) => hinge.panel === 'left');
        const right = hinges.find((hinge) => hinge.panel === 'right');
        return (
          left.freeEdgeDepth * right.freeEdgeDepth < 0 &&
          Math.abs(left.freeEdgeDepth) / left.width > 0.25 &&
          Math.abs(right.freeEdgeDepth) / right.width > 0.25
        );
      }),
    ).toBeTruthy();
    for (const wing of ['left', 'right'])
      expect(
        Math.max(
          ...samples.map((s) =>
            distance(
              s.hinges.find((a) => a.panel === wing).degrees,
              initial.find((a) => a.panel === wing).degrees,
            ),
          ),
        ),
      ).toBeGreaterThan(30);
    if (viewport.width < 700) await page.evaluate(() => window.scrollTo(0, 0));
    else await page.mouse.wheel(0, -travel * 2);
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    for (const wing of ['left', 'right'])
      await expect
        .poll(async () =>
          distance(
            (await angles(page)).find((a) => a.panel === wing).degrees,
            initial.find((a) => a.panel === wing).degrees,
          ),
        )
        .toBeLessThan(1);
    const chapters = page.locator('.chapter-nav button[data-go-to]');
    const holds = [];
    for (let index = 0; index < (await chapters.count()); index++) {
      const button = chapters.nth(index),
        label = await button.getAttribute('aria-label');
      const mobilePart = page.locator(
        `[data-camera-mobile=${JSON.stringify(label)}]`,
      );
      const target =
        viewport.width < 760 && (await mobilePart.count())
          ? mobilePart
          : page.locator(`[data-camera-stop=${JSON.stringify(label)}]`);
      if (!(await target.count())) continue;
      await button.click();
      await expect(button).toHaveAttribute('aria-current', 'step');
      await expect
        .poll(() =>
          target.evaluate((e) => {
            const camera = new DOMMatrixReadOnly(
              getComputedStyle(e.closest('.proposal-sheet')).transform,
            );
            const hinge = new DOMMatrixReadOnly(
              getComputedStyle(e.closest('.fold-panel')).transform,
            );
            const normal = new DOMPoint(0, 0, 1, 0).matrixTransform(
              camera.multiply(hinge),
            );
            return normal.z / Math.hypot(normal.x, normal.y, normal.z);
          }),
        )
        .toBeGreaterThan(0.995);
      await expect
        .poll(() =>
          target.evaluate((e) => {
            const b = e.getBoundingClientRect();
            const header = document
                .querySelector('.site-header')
                .getBoundingClientRect().bottom,
              controls = document
                .querySelector('.tour-controls')
                .getBoundingClientRect().top;
            return (
              b.left >= 8 &&
              b.right <= innerWidth - 8 &&
              b.top >= header + 2 &&
              b.bottom <= controls - 2
            );
          }),
        )
        .toBeTruthy();
      // WebKit's IntersectionObserver clips nested 3D descendants incorrectly.
      // Native-window review verifies paint; full bounds and face normals verify
      // framing without accepting the incorrect intersection ratio.
      const frontGrid = await target.evaluate((element) => {
        const box = element.getBoundingClientRect();
        const face = element.closest('.panel-face');
        const points = [];
        for (const x of [0.05, 0.25, 0.5, 0.75, 0.95])
          for (const y of [0.05, 0.25, 0.5, 0.75, 0.95])
            points.push(
              face.contains(
                document.elementFromPoint(
                  box.left + box.width * x,
                  box.top + box.height * y,
                ),
              ),
            );
        return points;
      });
      const minText = await target.evaluate((e) => {
        const scale = e.getBoundingClientRect().width / e.offsetWidth;
        return Math.min(
          ...[e, ...e.querySelectorAll('p,h1,h2,h3')]
            .filter((text) => text.matches('p,h1,h2,h3'))
            .map((t) => parseFloat(getComputedStyle(t).fontSize) * scale),
        );
      });
      expect(minText).toBeGreaterThanOrEqual(12);
      holds.push({
        label,
        minText,
        frontFaceHitPoints: frontGrid.filter(Boolean).length,
        sampledHitPoints: frontGrid.length,
      });
      await page.screenshot({ path: `${output}/${name}-hold-${index}.png` });
    }
    await page.locator('#reading-mode').click();
    await expect(page.locator('html')).toHaveAttribute(
      'data-presentation',
      'read',
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    views.push({
      viewport,
      deviceScaleFactor: viewport.width < 700 ? 3 : 1,
      inputMethod:
        viewport.width < 700
          ? 'window.scrollBy (mobile WebKit rejects wheel automation)'
          : 'mouse.wheel',
      initial,
      samples,
      holds,
      readingMode: 'passed',
    });
    await page.close();
  }
  expect(errors).toEqual([]);
  expect(failedRequests).toEqual([]);
  const receipt = {
    base,
    engine:
      'Playwright WebKit 26.6 (v2359), emulated viewports; not physical iOS',
    at: new Date().toISOString(),
    behaviorPassed: true,
    visualStatus:
      'Requires native-window confirmation: WebKit protocol screenshots ignore hidden backfaces',
    screenshotIssue: 'https://github.com/microsoft/playwright/issues/21620',
    intersectionLimitation:
      'Nested 3D IntersectionObserver reported 0.593 for a fully framed cover. Verified by matching Chromium/WebKit bounds and a native-window screenshot. This run uses full bounds and composed face normals; Chromium keeps IntersectionObserver assertions.',
    hitTestingLimitation:
      'Right-wing targets can return the transparent ARTICLE.proposal-sheet ancestor from elementFromPoint in both Chromium and WebKit. Grid counts are diagnostics, not an occlusion or clickability pass; native-window review is required for actual paint.',
    nativeMobileLimitation:
      'Headful WebKit retained desktop layout despite a reported 390px configured viewport. Headless mobile geometry is covered separately; native mobile and physical iOS remain unverified.',
    errors,
    warnings,
    failedRequests,
    views,
  };
  await writeFile(
    `${output}/verification.json`,
    JSON.stringify(receipt, null, 2) + '\n',
  );
  console.log(
    JSON.stringify(
      {
        behaviorPassed: true,
        visualStatus:
          'Requires native-window confirmation: WebKit protocol screenshots ignore hidden backfaces',
        screenshotIssue: 'https://github.com/microsoft/playwright/issues/21620',
        views: views.map((v) => ({
          width: v.viewport.width,
          readingHolds: v.holds.length,
          minText: Math.min(...v.holds.map((h) => h.minText)),
        })),
        errors,
        warnings,
        failedRequests,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
