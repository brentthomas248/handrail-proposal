import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const base =
  process.env.CAPTURE_URL || 'http://127.0.0.1:4321/handrail-proposal/';
const output = process.env.CAPTURE_OUTPUT || 'qa-artifacts/flyer-camera';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];
const warnings = [];
const failedRequests = [];
const captures = [];
const foldSamples = [];

async function hinges(page) {
  return page.locator('.fold-panel').evaluateAll((panels) =>
    panels.map((panel) => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(panel).transform);
      return {
        panel: panel.dataset.panel,
        degrees: (Math.atan2(-matrix.m13, matrix.m11) * 180) / Math.PI,
      };
    }),
  );
}

async function captureViewport(name, viewport, mobile = false) {
  const page = await browser.newPage({
    viewport,
    deviceScaleFactor: 1,
    isMobile: mobile,
    hasTouch: mobile,
  });
  page.on('pageerror', (error) => errors.push(`${name}: ${error.message}`));
  page.on('console', (event) => {
    if (event.type() === 'error') errors.push(`${name}: ${event.text()}`);
    if (event.type() === 'warning') warnings.push(`${name}: ${event.text()}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400)
      failedRequests.push(`${response.status()} ${response.url()}`);
  });
  await page.goto(base, { waitUntil: 'networkidle' });
  await expect(page.locator('html')).toHaveAttribute(
    'data-presentation',
    'tour',
  );
  await expect(page.locator('html')).toHaveClass(/camera-ready/);
  const travel = await page.evaluate(
    () => document.documentElement.scrollHeight - innerHeight,
  );
  let previous = 0;
  for (const progress of [0, 0.04, 0.08, 0.13, 0.2]) {
    if (progress)
      await page.mouse.wheel(0, Math.round(travel * (progress - previous)));
    await page.waitForTimeout(450);
    const path = `${output}/${name}-fold-${String(Math.round(progress * 100)).padStart(2, '0')}.png`;
    await page.screenshot({ path });
    foldSamples.push({
      viewport: name,
      progress,
      scrollY: await page.evaluate(() => scrollY),
      hinges: await hinges(page),
      panelBounds: await page.locator('.fold-panel').evaluateAll((panels) =>
        panels.map((panel) => {
          const box = panel.getBoundingClientRect();
          return {
            panel: panel.dataset.panel,
            left: box.left,
            top: box.top,
            right: box.right,
            bottom: box.bottom,
          };
        }),
      ),
      path,
    });
    previous = progress;
  }
  const stops = page.locator('.chapter-nav button[data-go-to]');
  const count = await stops.count();
  if (count < 4)
    throw new Error(
      `Expected at least four camera chapters; received ${count}`,
    );
  for (let index = 0; index < count; index += 1) {
    await stops.nth(index).click();
    // Capture after the scroll scrub settles, not its preceding frame.
    await page.waitForTimeout(1100);
    const transform = await page
      .locator('.proposal-sheet')
      .evaluate((sheet) => {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(sheet).transform);
        return {
          scale: Math.hypot(matrix.m11, matrix.m12, matrix.m13),
          x: matrix.e,
          y: matrix.f,
        };
      });
    const label = await stops.nth(index).getAttribute('aria-label');
    let framing = null;
    const target = page.locator(
      `[data-camera-stop=${JSON.stringify(label)}], [data-camera-mobile=${JSON.stringify(label)}]`,
    );
    if (await target.count()) {
      await expect(target).toBeInViewport({ ratio: 0.98 });
      framing = await target.evaluate((element) => {
        const box = element.getBoundingClientRect();
        const scale = box.width / element.offsetWidth;
        return {
          left: box.left,
          top: box.top,
          right: box.right,
          bottom: box.bottom,
          text: [...element.querySelectorAll('p, h1, h2, h3')].map((text) => ({
            text: text.textContent.slice(0, 90),
            renderedFontPx:
              Number.parseFloat(getComputedStyle(text).fontSize) * scale,
          })),
        };
      });
    }
    const path = `${output}/${name}-${String(index).padStart(2, '0')}.png`;
    await page.screenshot({ path });
    captures.push({
      viewport: name,
      chapter: index,
      label,
      transform,
      hinges: await hinges(page),
      framing,
      path,
    });
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
  await page.screenshot({
    path: `${output}/${name}-reading.png`,
    fullPage: true,
  });
  await page.goto(new URL('agreement/', base).href, {
    waitUntil: 'networkidle',
  });
  await page.screenshot({
    path: `${output}/${name}-notes.png`,
    fullPage: true,
  });
  await page.close();
}

try {
  await captureViewport('desktop', { width: 1440, height: 1000 });
  await captureViewport('mobile', { width: 390, height: 844 }, true);
  await captureViewport('small-mobile', { width: 320, height: 740 }, true);
  const result = {
    base,
    capturedAt: new Date().toISOString(),
    errors,
    warnings,
    failedRequests,
    captures,
    foldSamples,
  };
  await writeFile(
    `${output}/capture.json`,
    JSON.stringify(result, null, 2) + '\n',
  );
  console.log(JSON.stringify(result, null, 2));
  expect(errors).toEqual([]);
  expect(failedRequests).toEqual([]);
} finally {
  await browser.close();
}
