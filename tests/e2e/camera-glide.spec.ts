import { expect, test, type Page } from '@playwright/test';
import { waitForTourSettled } from '../helpers/tour-settled';

async function chapter(page: Page, name: string) {
  await page.getByRole('button', { name, exact: true }).click();
  await waitForTourSettled(page);
  return page.evaluate(() => scrollY);
}

async function recordCamera(page: Page) {
  return page.evaluateHandle(() => {
    const sheet = document.querySelector<HTMLElement>('.proposal-sheet')!;
    const left = document.querySelector<HTMLElement>('[data-panel="left"]')!;
    const right = document.querySelector<HTMLElement>('[data-panel="right"]')!;
    const lights = [...sheet.querySelectorAll<HTMLElement>('.paper-light')];
    const number = (transform: string, name: string) =>
      Number(transform.match(new RegExp(`${name}\\(([-.\\d]+)`))?.[1]);
    const read = () => ({
      time: performance.now(),
      scroll: scrollY,
      left: number(left.style.transform, 'rotateY'),
      right: number(right.style.transform, 'rotateY'),
      roll: number(sheet.style.transform, 'rotateZ'),
      scale: number(sheet.style.transform, 'scale3d'),
      light: lights.map((element) => Number(element.style.opacity)),
      transform: sheet.style.transform,
    });
    const initial = read();
    const frames: ReturnType<typeof read>[] = [];
    let running = true;
    const sample = () => {
      if (!running) return;
      frames.push(read());
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
    return {
      stop() {
        running = false;
        return { initial, frames, final: read() };
      },
    };
  });
}

async function transfer(page: Page, direction: number) {
  const recorder = await recordCamera(page);
  await page.mouse.wheel(0, direction);
  await waitForTourSettled(page);
  const result = await recorder.evaluate((recording) => recording.stop());
  await recorder.dispose();
  return result;
}

function expectGlide(result: Awaited<ReturnType<typeof transfer>>) {
  expect(result.frames.length).toBeGreaterThan(10);
  for (const frame of [result.initial, ...result.frames, result.final]) {
    expect(
      frame.left,
      'The left fold remains stationary during reading',
    ).toBeCloseTo(38, 5);
    expect(
      frame.right,
      'The right fold remains stationary during reading',
    ).toBeCloseTo(38, 5);
    expect(
      frame.roll,
      'The camera does not roll the paper during reading',
    ).toBeCloseTo(0, 5);
    expect(
      frame.light,
      'A stationary paper face keeps its world-fixed diffuse illumination as the camera moves',
    ).toEqual(result.initial.light);
  }
  const scales = result.frames.map((frame) => frame.scale);
  expect(
    Math.min(...scales),
    'Each transfer pulls back beyond both reading compositions before returning',
  ).toBeLessThan(Math.min(result.initial.scale, result.final.scale) * 0.95);
  expect(Math.max(...scales)).toBeLessThanOrEqual(
    Math.max(result.initial.scale, result.final.scale) * 1.01,
  );
}

for (const journey of [
  { kind: 'same panel', from: 'Hire first', to: 'Client first' },
  { kind: 'across a fold', from: 'Cash flow', to: 'Hire first' },
]) {
  test(`the camera glides ${journey.kind} over stationary folds and reverses exactly`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./');
    const destination = await chapter(page, journey.to);
    const origin = await chapter(page, journey.from);
    await page.mouse.move(195, 400);
    const forward = await transfer(page, 1);
    await page.waitForTimeout(250);
    const reverse = await transfer(page, -1);
    await testInfo.attach('camera-glide-frames', {
      body: JSON.stringify({ journey, forward, reverse }),
      contentType: 'application/json',
    });
    expect(forward.final.scroll).toBe(destination);
    expect(reverse.final.scroll).toBe(origin);
    expect(reverse.final.transform).toBe(forward.initial.transform);
    expectGlide(forward);
    expectGlide(reverse);
    await expect(
      page.getByRole('button', { name: journey.from, exact: true }),
    ).toHaveAttribute('aria-current', 'step');
  });
}
