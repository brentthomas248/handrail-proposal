import { expect, test, type Page } from '@playwright/test';
import { waitForTourSettled } from '../helpers/tour-settled';

async function chapter(page: Page, name: string) {
  await page.getByRole('button', { name, exact: true }).click();
  await waitForTourSettled(page);
  return page.evaluate(() => scrollY);
}

async function recordGesture(page: Page) {
  return page.evaluateHandle(() => {
    const wing = document.querySelector<HTMLElement>('[data-panel="left"]')!;
    const progress = document.querySelector<HTMLElement>('.scroll-line')!;
    const initial = {
      angle: Number(wing.style.transform.match(/rotateY\(([^d]+)/)?.[1]),
      progress: Number(progress.style.getPropertyValue('--tour-progress')),
    };
    const frames: {
      elapsed: number;
      angle: number;
      progress: number;
      scroll: number;
    }[] = [];
    let started: number | undefined;
    let running = true;
    const begin = () => {
      started = performance.now();
    };
    addEventListener('wheel', begin, { capture: true, once: true });
    function sample() {
      if (!running) return;
      if (started !== undefined)
        frames.push({
          elapsed: performance.now() - started,
          angle: Number(wing.style.transform.match(/rotateY\(([^d]+)/)?.[1]),
          progress: Number(progress.style.getPropertyValue('--tour-progress')),
          scroll: scrollY,
        });
      requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
    return {
      stop() {
        running = false;
        removeEventListener('wheel', begin, { capture: true });
        return { initial, frames };
      },
    };
  });
}

for (const width of [390, 1440]) {
  test(`the cold reveal responds promptly but unfolds deliberately at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('./');
    await expect(page.locator('html')).toHaveClass(/camera-ready/);
    await page.mouse.move(width / 2, 400);
    const recording = await recordGesture(page);
    await page.mouse.wheel(0, 1);
    await waitForTourSettled(page);
    const result = await recording.evaluate((recorder) => recorder.stop());
    await recording.dispose();
    await testInfo.attach('cold-reveal-timing', {
      body: JSON.stringify(result),
      contentType: 'application/json',
    });
    const final = result.frames.at(-1)!;
    const angleTravel = result.initial.angle - final.angle;
    const firstMovement = result.frames.find(
      (frame) => result.initial.angle - frame.angle >= 0.2,
    );
    const arrival = result.frames.find(
      (frame) => Math.abs(frame.progress - final.progress) < 0.000001,
    );
    expect(result.initial.angle).toBeGreaterThanOrEqual(140);
    expect(final.angle).toBeCloseTo(38, 1);
    expect(
      firstMovement,
      'The first gesture must start the reveal',
    ).toBeDefined();
    expect(firstMovement!.elapsed).toBeLessThanOrEqual(200);
    const launch = result.frames.filter((frame) => frame.elapsed <= 120);
    expect(launch.length).toBeGreaterThan(0);
    expect(
      Math.max(
        ...launch.map(
          (frame) => (result.initial.angle - frame.angle) / angleTravel,
        ),
      ),
      'The opening should accelerate gently instead of throwing half the fold into its first 120ms',
    ).toBeLessThanOrEqual(0.15);
    expect(arrival).toBeDefined();
    expect(arrival!.elapsed).toBeGreaterThanOrEqual(1300);
    expect(arrival!.elapsed).toBeLessThanOrEqual(2300);
    await expect(page.locator('#tour-caption')).toHaveText('The full proposal');
    await page.waitForTimeout(350);
    expect(await page.evaluate(() => scrollY)).toBe(final.scroll);
  });
}

for (const journey of [
  { kind: 'same-panel', from: 'Hire first', to: 'Client first', minimum: 900 },
  { kind: 'one-crease', from: 'Cash flow', to: 'Hire first', minimum: 1000 },
  {
    kind: 'two-crease',
    from: 'The window',
    to: 'Grow together',
    minimum: 1500,
  },
]) {
  test(`a ${journey.kind} gesture starts promptly and gives the camera time to travel`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./');
    const destination = await chapter(page, journey.to);
    const origin = await chapter(page, journey.from);
    await page.mouse.move(195, 400);
    const recording = await recordGesture(page);
    await page.mouse.wheel(0, 1);
    await waitForTourSettled(page);
    const result = await recording.evaluate((recorder) => recorder.stop());
    await recording.dispose();
    await testInfo.attach('chapter-travel-timing', {
      body: JSON.stringify(result),
      contentType: 'application/json',
    });
    const final = result.frames.at(-1)!;
    const progressTravel = final.progress - result.initial.progress;
    const firstMovement = result.frames.find(
      (frame) =>
        (frame.progress - result.initial.progress) / progressTravel >= 0.005,
    );
    const arrival = result.frames.find(
      (frame) => Math.abs(frame.progress - final.progress) < 0.000001,
    );
    expect(destination).toBeGreaterThan(origin);
    expect(firstMovement).toBeDefined();
    expect(firstMovement!.elapsed).toBeLessThanOrEqual(200);
    expect(arrival).toBeDefined();
    expect(arrival!.elapsed).toBeGreaterThanOrEqual(journey.minimum);
    expect(arrival!.elapsed).toBeLessThanOrEqual(2500);
    expect(final.scroll).toBe(destination);
    await expect(
      page.getByRole('button', { name: journey.to, exact: true }),
    ).toHaveAttribute('aria-current', 'step');
    await page.waitForTimeout(350);
    expect(await page.evaluate(() => scrollY)).toBe(destination);
  });
}
