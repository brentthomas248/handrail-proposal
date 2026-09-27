import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { resume } from '../../src/content/resume';

for (const width of [390, 1440]) {
  test(`browser Back preserves the proposal chapter and reading position at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('./');
    const chapter = width < 760 ? 'Client first' : 'The two paths';
    const button = page.getByRole('button', { name: chapter, exact: true });
    await button.click();
    await expect(button).toHaveAttribute('aria-current', 'step');
    await page.waitForTimeout(1000);
    const tourY = await page.evaluate(() => scrollY);
    await page
      .getByRole('navigation', { name: 'More about Brent' })
      .getByRole('link', { name: 'My Handrail resume' })
      .click();
    await expect(page.locator('.resume-document')).toBeVisible();
    await page.goBack();
    await expect(button).toHaveAttribute('aria-current', 'step');
    await expect
      .poll(async () => Math.abs((await page.evaluate(() => scrollY)) - tourY))
      .toBeLessThan(3);
    await page
      .getByRole('button', { name: 'Read normally', exact: true })
      .click();
    await page.locator('#cash-flow').scrollIntoViewIfNeeded();
    const readingY = await page.evaluate(() => scrollY);
    await page
      .getByRole('navigation', { name: 'More about Brent' })
      .getByRole('link', { name: 'My Handrail resume' })
      .click();
    await page.goBack();
    await expect(page.locator('html')).toHaveAttribute(
      'data-presentation',
      'read',
    );
    await expect
      .poll(async () =>
        Math.abs((await page.evaluate(() => scrollY)) - readingY),
      )
      .toBeLessThan(3);
    await page.goto('./?view=read');
    await expect(page.locator('html')).toHaveAttribute(
      'data-presentation',
      'read',
    );
  });
}

for (const width of [320, 390, 760, 768, 1440]) {
  test(`prominent portfolio navigation opens a readable resume at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('./');
    const navigation = page.getByRole('navigation', {
      name: 'More about Brent',
    });
    const resumeLink = navigation.getByRole('link', {
      name: 'My Handrail resume',
    });
    const githubLink = navigation.getByRole('link', {
      name: 'Explore my GitHub',
    });
    await expect(resumeLink).toBeInViewport({ ratio: 1 });
    await expect(githubLink).toBeInViewport({ ratio: 1 });
    await expect(githubLink).toHaveAttribute('href', resume.github);
    for (const link of [resumeLink, githubLink]) {
      const bounds = await link.boundingBox();
      expect(bounds!.height).toBeGreaterThanOrEqual(24);
    }
    await resumeLink.click();
    await expect(page).toHaveURL(/\/resume\/$/);
    await expect(
      page.getByRole('heading', { name: resume.name, exact: true }),
    ).toBeInViewport({ ratio: 1 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(
      page.getByText(resume.education.degree, { exact: true }),
    ).toBeVisible();
    for (const contribution of resume.contributions)
      await expect(
        page.getByRole('heading', { name: contribution.title, exact: true }),
      ).toBeVisible();
    const pdf = page.getByRole('link', { name: resume.labels.download });
    const response = await page.request.get((await pdf.getAttribute('href'))!);
    expect(response.ok()).toBe(true);
    expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations).toEqual([]);
    await page
      .getByRole('link', { name: 'Back to the proposal', exact: true })
      .click();
    await expect(page.locator('.proposal-sheet')).toBeVisible();
  });
}

for (const mode of ['no JavaScript', 'reduced motion'] as const) {
  test(`resume retains every experience and contribution with ${mode}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: mode !== 'no JavaScript',
      reducedMotion: mode === 'reduced motion' ? 'reduce' : 'no-preference',
      viewport: { width: 320, height: 740 },
    });
    const page = await context.newPage();
    const base =
      process.env.PROPOSAL_BASE_URL ||
      'http://127.0.0.1:4321/handrail-proposal/';
    await page.goto(new URL('resume/', base).href);
    for (const experience of resume.experience)
      for (const bullet of experience.bullets)
        await expect(page.getByText(bullet, { exact: true })).toBeVisible();
    for (const contribution of resume.contributions)
      await expect(
        page.getByText(contribution.body, { exact: true }),
      ).toBeVisible();
    await expect(page.locator('.resume-watermark')).toHaveCount(2);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await context.close();
  });
}
