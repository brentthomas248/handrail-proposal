import { chromium } from '@playwright/test';
import { resolve } from 'node:path';
import { mkdir, copyFile } from 'node:fs/promises';
import { startPreview } from './serve.mjs';
const preview = process.env.PROPOSAL_BASE_URL ? null : await startPreview();
const base = process.env.PROPOSAL_BASE_URL || preview.url;
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const response = await page.goto(new URL('agreement/', base).href, {
    waitUntil: 'networkidle',
  });
  if (!response?.ok())
    throw new Error(`Contract route failed: ${response?.status()}`);
  await page.evaluate(() => document.fonts.ready);
  const clauses = await page.locator('.contract-clause').count();
  if (clauses !== 18) throw new Error(`Expected 18 clauses, found ${clauses}`);
  await mkdir('public', { recursive: true });
  await page.pdf({
    path: resolve('public/handrail-proposed-agreement.pdf'),
    format: 'A4',
    tagged: true,
    outline: true,
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate:
      '<div style="font-family:Arial,sans-serif;font-size:8px;color:#62717d;width:100%;margin:0 18mm;display:flex;justify-content:space-between"><span>Handrail / Brent Showalter — Unsigned proposal</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
  });
  await copyFile(
    'public/handrail-proposed-agreement.pdf',
    'dist/handrail-proposed-agreement.pdf',
  );
  console.log(
    'Generated public/handrail-proposed-agreement.pdf from 18 canonical HTML clauses.',
  );
} finally {
  await browser.close();
  await preview?.close();
}
