import { chromium } from '@playwright/test';
import { resolve } from 'node:path';
import { mkdir, copyFile } from 'node:fs/promises';
import { startPreview } from './serve.mjs';
import { agreementSections, proposal } from '../src/content/proposal.ts';
const preview = process.env.PROPOSAL_BASE_URL ? null : await startPreview();
const base = process.env.PROPOSAL_BASE_URL || preview.url;
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const response = await page.goto(new URL('agreement/', base).href, {
    waitUntil: 'networkidle',
  });
  if (!response?.ok())
    throw new Error(`Proposal notes route failed: ${response?.status()}`);
  await page.evaluate(() => document.fonts.ready);
  const sections = await page.locator('.document-section').count();
  if (sections !== agreementSections.length)
    throw new Error(
      `Expected ${agreementSections.length} proposal sections, found ${sections}`,
    );
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
      '<div style="font-family:Arial,sans-serif;font-size:8px;color:#62717d;width:100%;margin:0 18mm;display:flex;justify-content:space-between"><span>Handrail / Brent Showalter — For discussion</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
  });
  await copyFile(
    'public/handrail-proposed-agreement.pdf',
    'dist/handrail-proposed-agreement.pdf',
  );
  console.log(
    `Generated public/${proposal.paths.pdf} from ${agreementSections.length} canonical proposal sections.`,
  );
} finally {
  await browser.close();
  await preview?.close();
}
