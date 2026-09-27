import { chromium } from '@playwright/test';
import { resolve } from 'node:path';
import { mkdir, copyFile } from 'node:fs/promises';
import { startPreview } from './serve.mjs';
import { resume } from '../src/content/resume.ts';

const preview = process.env.PROPOSAL_BASE_URL ? null : await startPreview();
const base = process.env.PROPOSAL_BASE_URL || preview.url;
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const response = await page.goto(new URL('resume/', base).href, {
    waitUntil: 'networkidle',
  });
  if (!response?.ok())
    throw new Error(`Resume route failed: ${response?.status()}`);
  await page.evaluate(() => document.fonts.ready);
  if ((await page.locator('.resume-sheet').count()) !== 2)
    throw new Error('Resume must contain two complete intentional sheets.');
  await page.emulateMedia({ media: 'print' });
  await mkdir('public', { recursive: true });
  await page.pdf({
    path: resolve('public', resume.pdf),
    format: 'Letter',
    tagged: true,
    outline: true,
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
  });
  await copyFile(resolve('public', resume.pdf), resolve('dist', resume.pdf));
  console.log(`Generated public/${resume.pdf} from the canonical resume page.`);
} finally {
  await browser.close();
  await preview?.close();
}
